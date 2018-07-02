import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TextTileComponent } from './text-tile/text-tile.component';
import { ChartOutputComponent } from './chart-output/chart-output.component';

import { ProfitAndLossChartComponent } from './profit-and-loss-chart/profit-and-loss-chart.component';
import { PnLDataService } from './services/pnl-data.service';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    TextTileComponent,
    ChartOutputComponent,
    ProfitAndLossChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [PnLDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
