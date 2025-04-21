import { Component, Input } from '@angular/core';
import { ChartType, ChartData, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule, // <-- usa NgChartsModule, no BaseChartDirective
  ],
  template: `
    <canvas
      *ngIf="chartType"
      baseChart
      [data]="chartData"
      [type]="chartType"
      [options]="chartOptions"
    >
    </canvas>
  `,
})
export class DynamicChartComponent {
  @Input() chartType: ChartType = 'line';
  @Input() chartData: ChartData = { labels: [], datasets: [] };
  @Input() chartOptions: ChartConfiguration['options'] = { responsive: true };
}
