import { Component, OnInit, Input } from '@angular/core';
import { TileData } from "../models/tile-data";
import { BarChart } from "../models/ibarchart";
import { PnLDataService } from "../services/pnl-data.service";
import { IChartable } from "../models/ichartable";
import { PnLBarData } from "../models/pnl-bar-data";
import { ProfitAndLoss } from '../models/ProfitAndLoss';

@Component({
  selector: 'bc-profit-and-loss-chart',
  templateUrl: './profit-and-loss-chart.component.html',
  styleUrls: ['./profit-and-loss-chart.component.scss']
})
export class ProfitAndLossChartComponent implements OnInit {

  constructor(private pnLDataService: PnLDataService) {
  }

  ngOnInit() {
    this.init();

    document.onkeydown = (e) =>{
      const left: number = 37;
      const right: number = 39;
  
      if (e.keyCode !== left && e.keyCode !== right) return;  
  
      this.navigateRange(e.keyCode);    
    };
  }

  OutputTiles: Array<TileData> = new Array<TileData>();
  CurrentPL: TileData;
  MonthToDatePL: TileData;
  YearTodDatePL: TileData;
  DayToDay: TileData;
  Date: TileData;
  isNextLeftDisabled: boolean = false;
  isNextRightDisabled: boolean = false;
  isZoomIn: boolean = false;

  BarChart: BarChart = {
    Data: [],
    ChartGutter: 1,
    SvgHeight: 500,
    SvgWidth: 1652,
    LeftOffset: 5,
    TopOffset: 30,
    ShowLines: true
  };

  private tileWidth: number = 110;

  init() {
    this.pnLDataService.InitializeData().subscribe(success => {
      if (success) {
        this.pnLDataService.ProcessData();
        this.setOutputTiles();
      }
    })
  }

  setOutputTiles(): void {
    this.BarChart.Data = this.getData();
    let currentlySelectedBar: PnLBarData = this.BarChart.Data[this.BarChart.Data.length - 1] as PnLBarData;
    let previouslySelectedBar: PnLBarData = this.BarChart.Data[this.BarChart.Data.length - 2] as PnLBarData;

    currentlySelectedBar.Selected = true;

    this.Date = {
      Title: '',
      Value: currentlySelectedBar.Description,
      Gutter: 3,
      Height: 30,
      Width: this.tileWidth
    };

    this.CurrentPL = {
      Title: 'Current',
      Value: `$${currentlySelectedBar.PnlData.CurrentPnL.toLocaleString()}`,
      Gutter: 3,
      Height: 44,
      Width: this.tileWidth
    };

    this.DayToDay = {
      Title: 'Day to Day',
      // Value: `$${(currentlySelectedBar.PnlData.CurrentPnL - previouslySelectedBar.PnlData.CurrentPnL).toLocaleString()}`,
      Value: `$${currentlySelectedBar.PnlData.DayToDay.toLocaleString()}`,
      Gutter: 5,
      Height: 44,
      Width: this.tileWidth
    }

    this.MonthToDatePL = {
      Title: 'Month to Date',
      Value: `$${currentlySelectedBar.PnlData.MonthlyPnL.toLocaleString()}`,
      Gutter: 3,
      Height: 44,
      Width: this.tileWidth
    };

    this.YearTodDatePL = {
      Title: 'Year to Date',
      Value: `$${currentlySelectedBar.PnlData.YearlyPnL.toLocaleString()}`,
      Gutter: 3,
      Height: 44,
      Width: this.tileWidth
    };

    this.OutputTiles.push(this.Date);
    this.OutputTiles.push(this.CurrentPL);
    this.OutputTiles.push(this.DayToDay);
    this.OutputTiles.push(this.MonthToDatePL);
    this.OutputTiles.push(this.YearTodDatePL);
  }

  getData(): Array<IChartable> {
    let data: Array<IChartable> = this.pnLDataService.getPnLData();

    return data;
  }

  onNextLeftClicked(): void {
    if (this.isNextLeftDisabled) return;

    if (this.isZoomIn) {
      let currDate = this.Date;

      let pnlData: PnLBarData = this.BarChart.Data.filter(function (obj) {
        return obj.Description === currDate.Value;
      })[0] as PnLBarData;

      this.BarChart.Data = this.pnLDataService.getDataForPreviousMonth(pnlData);
      pnlData = this.BarChart.Data[0] as PnLBarData;
      this.updateOutputTiles(pnlData);

      this.isZoomIn = true;
    }
    else {
      let currDate = this.Date;

      let pnlData: PnLBarData = this.BarChart.Data.filter(function (obj) {
        return obj.Description === currDate.Value;
      })[0] as PnLBarData;

      this.BarChart.Data = this.pnLDataService.getDataForPreviousYear(pnlData);
      pnlData = this.BarChart.Data[0] as PnLBarData;
      this.updateOutputTiles(pnlData);

      this.isZoomIn = false;
    }
  }

  shouldDisableLeft(): boolean {
    if (this.Date === undefined) {
      return this.isNextLeftDisabled = true;
    }

    let selectedDate = new Date(this.Date.Value);
    let firstDate = this.pnLDataService.getFirstDate();

    if (this.isZoomIn) {
      return this.isNextLeftDisabled = selectedDate.getMonth() === firstDate.getMonth() && selectedDate.getFullYear() === firstDate.getFullYear();
    }
    else {
      return this.isNextLeftDisabled = selectedDate.getFullYear() === firstDate.getFullYear();
    }
  }

  onNextRightClicked(): void {
    if (this.isNextRightDisabled) return;

    if (this.isZoomIn) {
      let currDate = this.Date;

      let pnlData: PnLBarData = this.BarChart.Data.filter(function (obj) {
        return obj.Description === currDate.Value;
      })[0] as PnLBarData;

      this.BarChart.Data = this.pnLDataService.getDataForNextMonth(pnlData);
      pnlData = this.BarChart.Data[0] as PnLBarData;
      this.updateOutputTiles(pnlData);

      this.isZoomIn = true;
    }
    else {
      let currDate = this.Date;

      let pnlData: PnLBarData = this.BarChart.Data.filter(function (obj) {
        return obj.Description === currDate.Value;
      })[0] as PnLBarData;

      this.BarChart.Data = this.pnLDataService.getDataForNextYear(pnlData);
      pnlData = this.BarChart.Data[0] as PnLBarData;
      this.updateOutputTiles(pnlData);

      this.isZoomIn = false;
    }
  }  

  shouldDisableRight(): boolean {

    if (this.Date === undefined) {
      return this.isNextRightDisabled = true;
    }

    let selectedDate = new Date(this.Date.Value);
    let lastDate = this.pnLDataService.getLastDate();

    if (this.isZoomIn) {
      return this.isNextRightDisabled = selectedDate.getMonth() === lastDate.getMonth() && selectedDate.getFullYear() === lastDate.getFullYear();
    }
    else {
      return this.isNextRightDisabled = selectedDate.getFullYear() === lastDate.getFullYear();
    }
  }

  onZoomInClicked(): void {
    if (this.isZoomIn) {
      let currDate = this.Date;

      let pnlData: PnLBarData = this.BarChart.Data.filter(function (obj) {
        return obj.Description === currDate.Value;
      })[0] as PnLBarData;

      this.BarChart.Data = this.pnLDataService.getDataByYear(pnlData);

      this.updateOutputTiles(pnlData);

      this.isZoomIn = false;
    }
    else {
      let currDate = this.Date;

      let pnlData: PnLBarData = this.BarChart.Data.filter(function (obj) {
        return obj.Description === currDate.Value;
      })[0] as PnLBarData;

      this.BarChart.Data = this.pnLDataService.getDataByMonth(pnlData);

      this.updateOutputTiles(pnlData);

      this.isZoomIn = true;
    }
  }

  toggleZoomText(): string {
    if (this.isZoomIn) {
      this.isZoomIn = true;

      return "Zoom Out";
    }
    else {
      this.isZoomIn = false;

      return "Zoom In"
    }
  }

  onBarChartClicked(bar: IChartable): void {
    let pnlData: PnLBarData = bar as PnLBarData;

    this.updateOutputTiles(pnlData);
  }

  onTimeLineClicked(bar: IChartable): void {
    let pnlData: PnLBarData = bar as PnLBarData;
    this.BarChart.Data = this.pnLDataService.getDataByMonth(pnlData);

    pnlData = this.BarChart.Data[0] as PnLBarData;

    this.updateOutputTiles(pnlData);

    this.isZoomIn = true;
  }

  getMonthlyDateOutputText(): Date {
    if (this.Date === undefined) return new Date();

    return new Date(this.Date.Value);
  }

  getYearlyDateOutputText(): Date {
    if (this.Date === undefined) return new Date();

    return new Date(this.Date.Value);
  }

  private updateOutputTiles(pnlBarData: PnLBarData) {
    this.CurrentPL.Value = `$${pnlBarData.PnlData.CurrentPnL.toLocaleString()}`;
    this.MonthToDatePL.Value = `$${pnlBarData.PnlData.MonthlyPnL.toLocaleString()}`;
    this.YearTodDatePL.Value = `$${pnlBarData.PnlData.YearlyPnL.toLocaleString()}`;
    this.Date.Value = pnlBarData.Description;
    this.DayToDay.Value = `$${pnlBarData.PnlData.DayToDay.toLocaleString()}`;
  }

  private getDayToDayValue(bar: IChartable): string {
    let currentIndex = this.BarChart.Data.indexOf(bar);
    let previousIndex = currentIndex - 1 <= 0 ? 0 : currentIndex - 1;
    let currentPnlData: PnLBarData = bar as PnLBarData;
    let previousPnlData: PnLBarData = this.BarChart.Data[previousIndex] as PnLBarData;

    return `$${(currentPnlData.PnlData.CurrentPnL - previousPnlData.PnlData.CurrentPnL).toLocaleString()}`;
  }

  private navigateRange(keyCode: number): void {
    const left: number = 37;
    const right: number = 39;
    let currDateObject = this.Date;
    let currentDate = new Date(currDateObject.Value);
    let firstDateInRange: Date = new Date(this.BarChart.Data[0].Description);
    let lastDateInRange: Date = new Date(this.BarChart.Data[this.BarChart.Data.length - 1].Description);
    let pnlData: PnLBarData = this.BarChart.Data.filter(function (obj) {return obj.Description === currDateObject.Value;})[0] as PnLBarData;    
    let index: number = this.BarChart.Data.indexOf(pnlData);

    if (keyCode == left && currentDate.getTime() !== firstDateInRange.getTime()) {      
      pnlData.Selected = false;
      this.updateOutputTiles(this.BarChart.Data[index - 1] as PnLBarData)
      this.BarChart.Data[index - 1].Selected = true;
      return;
    }
    if (keyCode == right && currentDate.getTime() !== lastDateInRange.getTime()) {
      pnlData.Selected = false;
      this.updateOutputTiles(this.BarChart.Data[index + 1] as PnLBarData)
      this.BarChart.Data[index + 1].Selected = true;
      return;
    }
  }
}
