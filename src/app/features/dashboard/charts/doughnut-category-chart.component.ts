import { Component, Input, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doughnut-category-chart',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div class="chart-container">
      <canvas
        baseChart
        [data]="chartData"
        [type]="chartType"
        [options]="chartOptions"
        [plugins]="chartPlugins"
        style="max-height: 340px;"
      ></canvas>
      <div *ngIf="!total" class="no-data">
        No hay datos suficientes para mostrar este gráfico.
      </div>
    </div>
  `,
  styleUrls: ['./doughnut-category-chart.component.scss'],
})
export class DoughnutCategoryChartComponent implements OnInit {
  @Input() chartData!: ChartData<'doughnut'>;
  @Input() total: number = 0;
  @Input() chartOptions: ChartOptions = {};

  chartType: ChartType = 'doughnut';
  chartPlugins: any[] = [];

  ngOnInit() {
    const customCurrency = new CustomCurrencyPipe();
    const centerTextPlugin = {
      id: 'centerText',
      afterDraw: (chart: any) => {
        if (chart.config.type !== 'doughnut') return;
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        // Ajusta el tamaño según el ancho del canvas
        const fontSize = window.innerWidth < 700 ? '1rem' : '1.3rem';
        ctx.font = `bold ${fontSize} Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1976d2';
        let total = 0;
        if (
          chart.data &&
          chart.data.datasets &&
          chart.data.datasets[0] &&
          Array.isArray(chart.data.datasets[0].data)
        ) {
          total = chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0
          );
        }
        ctx.fillText(customCurrency.transform(total), centerX, centerY - 8);
        ctx.font =
          window.innerWidth < 700
            ? 'normal 0.8rem Arial'
            : 'normal 0.95rem Arial';
        ctx.fillStyle = '#888';
        ctx.fillText('Total mes', centerX, centerY + 16);
        ctx.restore();
      },
    };
    this.chartPlugins = [centerTextPlugin];
  }
}
