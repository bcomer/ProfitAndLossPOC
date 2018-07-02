import { Component, Input } from '@angular/core';
import { TileData } from "../models/tile-data";

@Component({
  selector: 'bc-text-tile',
  host: {
    '[style.height.px]':'TileData.Height',
    '[style.width.px]':'TileData.Width'
  }, 
  templateUrl: './text-tile.component.html',
  styleUrls: ['./text-tile.component.scss']
})
export class TextTileComponent {

  @Input() TileData: TileData;

  constructor() { }  
}
