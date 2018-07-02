import { IChartable } from "../models/ichartable";
import { ProfitAndLossData } from "../models/profit-and-loss-data";

export class PnLBarData implements IChartable {
    Selected: boolean;
    public Description: string = '';  
    public Value: number = 0;
    public PnlData: ProfitAndLossData = new ProfitAndLossData();    
}
