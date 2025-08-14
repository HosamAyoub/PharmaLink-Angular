import 'chart.js';

declare module 'chart.js' {
  interface TooltipLabelColor {
    backgroundColor: string;
    borderColor: string;
  }
  interface ChartDatasetProperties<TType extends ChartType, TData> {
    percentages?: string[] | number[];
  }

  interface TooltipItem<TType extends ChartType> {
    dataset: {
      percentages?: number[] | string[];
    };
  }
}