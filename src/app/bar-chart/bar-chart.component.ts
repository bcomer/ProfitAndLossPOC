import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { IChartable } from "../models/ichartable";
import { BarChart } from "../models/ibarchart";

@Component({
  selector: 'bc-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent {

  constructor() {     
  } 

  @Input() BarChart: BarChart;
  @Output() barClicked: EventEmitter<IChartable> = new EventEmitter<IChartable>();
  @Output() timeLineClicked: EventEmitter<IChartable> = new EventEmitter<IChartable>();

  onBarClick(chartable: IChartable): void {
     this.barClicked.emit(chartable);

     this.BarChart.Data.forEach(function(element){
        element.Selected = false;
     });

    chartable.Selected = true;
  }

  onTimeLineClick(chartable: IChartable): void {
    this.timeLineClicked.emit(chartable);

    this.BarChart.Data.forEach(function(element){
      element.Selected = false;
    });

    this.BarChart.Data[0].Selected = true;
 }

  getBarHeight(value: number): number {

    let availableArea: number = this.getMinDataValue() < 0
          ? this.getMaxDataValue() + Math.abs(this.getMinDataValue())
          : this.getMaxDataValue();

    return Math.abs(value) / availableArea * (this.BarChart.SvgHeight - this.BarChart.TopOffset );
  }

  getBarWidth(): number {
    // added 15 px for a right offset to allow space for the time lines.
    return (this.BarChart.SvgWidth - 15 - (this.BarChart.ChartGutter * this.BarChart.Data.length)) / this.BarChart.Data.length;
  }

  getXOffset(chartable: IChartable): number {
    return this.BarChart.Data.indexOf(chartable) * (this.getBarWidth() + this.BarChart.ChartGutter) + this.BarChart.LeftOffset;
  }

  getYOffset(value: number): number {

    let retVal: number = 0;

    if (this.getMinDataValue() < 0) {
      retVal = value < 0
          ? (this.BarChart.SvgHeight - this.BarChart.TopOffset ) - this.getBarHeight(this.getMinDataValue()) + this.BarChart.TopOffset
          : (this.BarChart.SvgHeight - this.BarChart.TopOffset ) - this.getBarHeight(value) - this.getBarHeight(this.getMinDataValue()) + this.BarChart.TopOffset;
    }
    else {
      retVal = (this.BarChart.SvgHeight - this.BarChart.TopOffset ) - this.getBarHeight(value) + this.BarChart.TopOffset;
    }

    return  retVal;
  }

  showTimeLines(chartable: IChartable): boolean {
    let previous = this.BarChart.Data[this.BarChart.Data.indexOf(chartable) - 1];

    if (previous !== undefined){
      let dt = new Date(chartable.Description);
      let pdt = new Date(previous.Description);
  
      
      return pdt.getMonth() === dt.getMonth() - 1 || pdt.getFullYear() === dt.getFullYear() - 1;
    }
    
    return true;
  }

  getLineHeight(): number {
    return this.BarChart.SvgHeight;
  }

  getLineOffset(chartable: IChartable): number {
    return this.getXOffset(chartable) + 1;
  }

  getLineText(chartable: IChartable): string {
    let monthNames: string[] = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let month: number = new Date(chartable.Description).getMonth();
    return monthNames[month];
  }

  getTextOffset(chartable: IChartable): number {
    return this.getXOffset(chartable) + 5;
  }

  onMouseEnter(chartable: IChartable): void {
    let elem = document.getElementById(chartable.Description);

    elem.style.visibility = "visible";
  }

  onMouseLeave(chartable: IChartable): void {
    let elem = document.getElementById(chartable.Description);
    
    elem.style.visibility = "hidden";
  }

  getTooltipXOffset(chartable: IChartable): number {
    let tooltipWidth: number = 100;
    let normalOffset: number = this.getXOffset(chartable) + this.getBarWidth() + this.BarChart.ChartGutter;    
    let offsetWithTooltipWidth: number = this.getXOffset(chartable) + this.getBarWidth() + this.BarChart.ChartGutter + tooltipWidth;    
    let mirroredOffset: number = this.getXOffset(chartable) - this.BarChart.ChartGutter - tooltipWidth;

    return offsetWithTooltipWidth > this.BarChart.SvgWidth 
      ? mirroredOffset  
      : normalOffset;
  }

  getTooltipYOffset(chartable: IChartable): number {
    let tooltipWidth: number = 45;
    let normalOffset: number = this.getYOffset(chartable.Value);    
    let offsetWithTooltipWidth: number = normalOffset + tooltipWidth;    
    let mirroredOffset: number = normalOffset - tooltipWidth;

    return offsetWithTooltipWidth > this.BarChart.SvgHeight 
      ? mirroredOffset  
      : normalOffset;
  }

  getTooltipDescriptionXOffset(chartable: IChartable): number {
    let tooltipWidth: number = 100;
    let normalOffset: number = this.getXOffset(chartable) + this.getBarWidth() + this.BarChart.ChartGutter;    
    let offsetWithTooltipWidth: number = this.getXOffset(chartable) + this.getBarWidth() + this.BarChart.ChartGutter + tooltipWidth;    
    let mirroredOffset: number = this.getXOffset(chartable) - this.BarChart.ChartGutter - tooltipWidth;
    let textOffset: number = 8;

    return offsetWithTooltipWidth > this.BarChart.SvgWidth 
    ? mirroredOffset + textOffset 
    : normalOffset + textOffset;
  }

  getTooltipDescriptionYOffset(chartable: IChartable): number {
    let valueOffset: number = 20;
    let tooltipOffset: number = this.getTooltipYOffset(chartable);

    return tooltipOffset + valueOffset;
  }

  getTooltipValueXOffset(chartable: IChartable): number {
    let tooltipWidth: number = 100;
    let normalOffset: number = this.getXOffset(chartable) + this.getBarWidth() + this.BarChart.ChartGutter;    
    let offsetWithTooltipWidth: number = this.getXOffset(chartable) + this.getBarWidth() + this.BarChart.ChartGutter + tooltipWidth;    
    let mirroredOffset: number = this.getXOffset(chartable) - this.BarChart.ChartGutter - tooltipWidth;
    let textOffset: number = 8;
    

    return offsetWithTooltipWidth > this.BarChart.SvgWidth 
      ? mirroredOffset + textOffset 
      : normalOffset + textOffset;
  }

  getTooltipValueYOffset(chartable: IChartable): number {
    let valueOffset: number = 38;
    let tooltipOffset: number = this.getTooltipYOffset(chartable);

    return tooltipOffset + valueOffset;
  }

  getBarId(chartable: IChartable): string {
    return chartable.Description + "bar";
  }

  getBarMouseOver(chartable: IChartable): string {
    return chartable.Description + "bar.mouseover";
  }

  getBarMouseOut(chartable: IChartable): string {
    return chartable.Description + "bar.mouseout";
  }

  private isFirstOfMonth(dt: Date) {
    return dt.getDate() === 1;
  }

  private getMaxDataValue(): number {

    if (this.BarChart.Data === null) return;

    let values: Array<number> = new Array<number>();

    this.BarChart.Data.forEach(function (item, index) {
      values.push(item.Value);
    });

    return Math.max.apply(null, values);
  }

  private getMinDataValue(): number {

    if (this.BarChart.Data === null) return;

    let values: Array<number> = new Array<number>();

    this.BarChart.Data.forEach(function (item, index) {
      values.push(item.Value);
    });

    return Math.min.apply(null, values);
  }
}