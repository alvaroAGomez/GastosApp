export interface ExpenseChartFilters {
  fechaDesde?: string;
  fechaHasta?: string;
  categoria?: string | number;
  tarjeta?: string | number;
  anio?: number;
}

export interface ExpenseChartData {
  chartData: any;
  chartOptions: any;
}
