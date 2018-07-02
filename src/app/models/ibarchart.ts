import { IChartable } from "../models/ichartable";

export class BarChart {
    Data: Array<IChartable>;
    SvgHeight: number;
    SvgWidth: number;
    ChartGutter: number;
    ShowLines: boolean;
    LeftOffset: number;
    TopOffset: number;
}
