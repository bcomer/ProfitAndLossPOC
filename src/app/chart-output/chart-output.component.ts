import { Component, Input } from '@angular/core';
import { BarChart } from "../models/ibarchart";
import { TileData } from "../models/tile-data";

@Component({
  selector: 'bc-chart-output',
  templateUrl: './chart-output.component.html',
  styleUrls: ['./chart-output.component.scss']
})
export class ChartOutputComponent {

  @Input() Tiles: Array<TileData>;

  constructor() { } 
}
