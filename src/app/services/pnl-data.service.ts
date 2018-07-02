import { Injectable } from '@angular/core';
import { PnLBarData } from "../models/pnl-bar-data";
import { ProfitAndLoss } from '../models/ProfitAndLoss';
import { Http } from '@angular/http';
import { Observable, EMPTY } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';


@Injectable()
export class PnLDataService {

  pnLBarData: Array<PnLBarData>;
  profitAndLoss: Array<ProfitAndLoss>;

  constructor(private http: Http) { }

  InitializeData(): Observable<boolean> {
    return this.http.get('http://localhost:28560/api/profitandloss')
      .pipe(
        map(res => {
          this.profitAndLoss = res.json();
          return true;
        })
      );     
  }

  ProcessData() {
    this.pnLBarData = [];

    let currPnL: number = 0;
    let m2dPnL: number = 0;
    let y2dPnL: number = 0;
    let day2Day: number = 0;
    let firstOfMonthValue: number = 0;
    let firstOfYearValue: number = 0;

    this.profitAndLoss.forEach(pnl => {
      let curr: ProfitAndLoss = pnl;
      let prev: ProfitAndLoss = this.getPreviousPnL(curr);
      let currPnL: number = curr.totalValue;
      let id: number = curr.id;

      if (prev !== undefined) {
        let prevDate: Date = new Date(prev.endOfDay);
        let currDate: Date = new Date(pnl.endOfDay);

        day2Day = curr.totalValue - prev.totalValue;

        if (prevDate.getMonth() === currDate.getMonth() - 1) {
          // firstOfMonthValue = curr.totalValue;
          firstOfMonthValue = prev.totalValue;
        }

        if (prevDate.getFullYear() === currDate.getFullYear() - 1) {
          // firstOfYearValue = curr.totalValue;
          // firstOfMonthValue = curr.totalValue;

          firstOfYearValue = prev.totalValue;
          firstOfMonthValue = prev.totalValue;
        }
      }
      else {
        firstOfYearValue = curr.totalValue;
        firstOfMonthValue = curr.totalValue;
        day2Day = 0;
      }

      m2dPnL = curr.totalValue === firstOfMonthValue ? 0 : curr.totalValue - firstOfMonthValue;
      y2dPnL = curr.totalValue === firstOfYearValue ? 0 : curr.totalValue - firstOfYearValue;
     
      let data: PnLBarData = this.createBarData(id, new Date(curr.endOfDay), currPnL, m2dPnL, y2dPnL, day2Day);

      this.pnLBarData.push(data);
    });

    this.pnLBarData.sort(this.compareDatesForPnlData);
  }

  getPnLData(): Array<PnLBarData> {
    let data: Array<PnLBarData> = JSON.parse(JSON.stringify(this.pnLBarData));
    let currentYear: number = new Date().getFullYear();
    let filter: Array<PnLBarData> = data.filter(function (element: PnLBarData) {
      let dateToCheck: Date = new Date(element.Description);
      let yearToCheck: number = dateToCheck.getFullYear();
      let isInYear: boolean = yearToCheck === currentYear;

      return isInYear;
    });

    return filter;
  }

  getDataByYear(chartable: PnLBarData): Array<PnLBarData> {
    let data: Array<PnLBarData> = JSON.parse(JSON.stringify(this.pnLBarData));
    let chartableDate: Date = new Date(chartable.Description);
    let filter: Array<PnLBarData> = data.filter(element => {

      let dateToCheck: Date = new Date(element.Description);
      let isInYear: boolean = dateToCheck.getFullYear() === chartableDate.getFullYear();

      return isInYear;
    });

    let selected: PnLBarData = filter.filter((obj) => {
      return obj.PnlData.Id === chartable.PnlData.Id
    })[0] as PnLBarData;

    selected.Selected = true;

    if (selected === undefined){
      return undefined;
    }

    return filter;
  }

  getDataForNextYear(chartable: PnLBarData): Array<PnLBarData> {
    let data: Array<PnLBarData> = JSON.parse(JSON.stringify(this.pnLBarData));
    let chartableDate: Date = new Date(chartable.Description);
    let filter: Array<PnLBarData> = data.filter(element => {

      let dateToCheck: Date = new Date(element.Description);
      let isInYear: boolean = dateToCheck.getFullYear() === chartableDate.getFullYear() + 1;

      return isInYear;
    });

    let selected: PnLBarData = filter[0] as PnLBarData;

    if (selected === undefined){
      return undefined;
    }

    selected.Selected = true;

    return filter;
  }

  getDataForPreviousYear(chartable: PnLBarData): Array<PnLBarData> {
    let data: Array<PnLBarData> = JSON.parse(JSON.stringify(this.pnLBarData));
    let chartableDate: Date = new Date(chartable.Description);
    let filter: Array<PnLBarData> = data.filter(element => {

      let dateToCheck: Date = new Date(element.Description);
      let isInYear: boolean = dateToCheck.getFullYear() === chartableDate.getFullYear() - 1;

      return isInYear;
    });

    let selected: PnLBarData = filter[0] as PnLBarData;

    if (selected === undefined){
      return undefined;
    }

    selected.Selected = true;

    return filter;
  }

  getDataByMonth(chartable: PnLBarData): Array<PnLBarData> {
    let data: Array<PnLBarData> = JSON.parse(JSON.stringify(this.pnLBarData));
    let firstOfMonth: Date = new Date(chartable.Description);
    let filter: Array<PnLBarData> = data.filter(element => {

      let dateToCheck: Date = new Date(element.Description);
      let isInMonth: boolean = dateToCheck.getMonth() === firstOfMonth.getMonth() && dateToCheck.getFullYear() === firstOfMonth.getFullYear();

      return isInMonth;
    });

    let selected: PnLBarData = filter.filter((obj) => {
      return obj.PnlData.Id === chartable.PnlData.Id
    })[0] as PnLBarData;

    if (selected === undefined){
      return undefined;
    }

    selected.Selected = true;

    return filter;
  }

  getDataForNextMonth(chartable: PnLBarData): Array<PnLBarData> {
    let data: Array<PnLBarData> = JSON.parse(JSON.stringify(this.pnLBarData));
    let chartableDate: Date = new Date(chartable.Description);
    let filter: Array<PnLBarData> = data.filter(element => {

      let dateToCheck: Date = new Date(element.Description);
      let isInMonth: boolean;

      if (chartableDate.getMonth() === 11) {
        isInMonth = dateToCheck.getMonth() === 0 && dateToCheck.getFullYear() === chartableDate.getFullYear() + 1;
      }
      else {
        isInMonth = dateToCheck.getMonth() === chartableDate.getMonth() + 1 && dateToCheck.getFullYear() === chartableDate.getFullYear();
      }

      return isInMonth;
    });

    let selected: PnLBarData = filter[0] as PnLBarData;

    if (selected === undefined){
      return undefined;
    }

    selected.Selected = true;

    return filter;
  }

  getDataForPreviousMonth(chartable: PnLBarData): Array<PnLBarData> {
    let data: Array<PnLBarData> = JSON.parse(JSON.stringify(this.pnLBarData));
    let chartableDate: Date = new Date(chartable.Description);
    let filter: Array<PnLBarData> = data.filter(element => {

      let dateToCheck: Date = new Date(element.Description);
      let isInMonth: boolean;

      if (chartableDate.getMonth() === 0) {
        isInMonth = dateToCheck.getMonth() === 11 && dateToCheck.getFullYear() === chartableDate.getFullYear() - 1;
      }
      else {
        isInMonth = dateToCheck.getMonth() === chartableDate.getMonth() - 1 && dateToCheck.getFullYear() === chartableDate.getFullYear();
      }

      return isInMonth;
    });

    let selected: PnLBarData = filter[0] as PnLBarData;

    if (selected === undefined){
      return undefined;
    }

    selected.Selected = true;

    return filter;
  }

  getLastDate(): Date {
    return new Date(this.pnLBarData[this.pnLBarData.length - 1].Description);
  }

  getFirstDate(): Date {
    return new Date(this.pnLBarData[0].Description);
  }

  private compareDatesForPnlData(first: PnLBarData, second: PnLBarData): number {
    let a: number = new Date(first.PnlData.AsOfDate).getTime();
    let b: number = new Date(second.PnlData.AsOfDate).getTime();
    return a < b ? -1 : a > b ? 1 : 0;
  }

  private getPreviousPnL(current: ProfitAndLoss): ProfitAndLoss {
    return this.profitAndLoss[this.profitAndLoss.indexOf(current) - 1];
  }

  private createBarData(id: number, dt: Date, currPnL: number, m2dPnL: number, y2dPnL: number, d2d: number): PnLBarData {

    let data: PnLBarData = new PnLBarData();
    data.PnlData = {
      Id: id,
      AsOfDate: dt,
      CurrentPnL: currPnL,
      MonthlyPnL: m2dPnL,
      YearlyPnL: y2dPnL,
      DayToDay: d2d
    };

    data.Description = dt.toLocaleDateString();
    data.Value = currPnL;
    return data;
  }
}
