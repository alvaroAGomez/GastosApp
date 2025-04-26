import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-bar-monthly-evolution-chart',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div class="chart-container">
      <canvas
        baseChart
        [data]="chartData"
        [type]="chartType"
        [options]="chartOptions"
        style="max-height: 340px;"
      ></canvas>
      <div *ngIf="!hasData" class="no-data">
        No hay datos suficientes para mostrar este gráfico.
      </div>
    </div>
  `,
  styleUrls: ['./bar-monthly-evolution-chart.component.scss'],
})
export class BarMonthlyEvolutionChartComponent {
  @Input() chartData!: ChartData<'bar'>;
  @Input() chartOptions: ChartOptions = {};

  chartType: ChartType = 'bar';

  get hasData() {
    return (
      this.chartData &&
      this.chartData.datasets &&
      this.chartData.datasets[0]?.data?.some((v: any) => v > 0)
    );
  }
}
