export interface FiltrosGraficoGastos {
  fechaDesde?: string;
  fechaHasta?: string;
  categoria?: string | number;
  tarjeta?: string | number;
  anio?: number;
}

export interface DatosGraficoGastos {
  chartData: any;
  chartOptions: any;
}
