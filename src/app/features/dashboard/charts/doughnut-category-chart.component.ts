import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
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
        #chart
        [data]="chartData"
        [type]="chartType"
        [options]="chartOptions"
        [plugins]="chartPlugins"
        style="max-height: 340px;"
      ></canvas>
      <div *ngIf="!chartData?.datasets?.[0]?.data?.length" class="no-data">
        No hay datos suficientes para mostrar este gráfico.
      </div>
    </div>
  `,
  styleUrls: ['./doughnut-category-chart.component.scss'],
})
export class DoughnutCategoryChartComponent implements OnInit, AfterViewInit {
  @Input() chartData!: ChartData<'doughnut'>;
  @Input() chartOptions: ChartOptions = {};

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartType: ChartType = 'doughnut';
  chartPlugins: any[] = [];

  ngOnInit() {
    const customCurrency = new CustomCurrencyPipe();

    const centerTextPlugin = {
      id: 'centerText',

      afterInit: (chart: any) => {
        chart.$doughnutCenterTextInstance = this;
      },

      afterDraw: (chart: any) => {
        if (chart.config.type !== 'doughnut') return;

        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();

        const fontSize = window.innerWidth < 700 ? '0.7rem' : '0.9rem';
        ctx.font = `bold ${fontSize} Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#0d47a1';

        const componentInstance = chart.$doughnutCenterTextInstance;
        const total = componentInstance?.getVisibleTotal() ?? 0;

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chart?.update();
    }, 100);
  }

  getVisibleTotal(): number {
    const chartInstance = this.chart?.chart;
    if (!chartInstance) return 0;

    const meta = chartInstance.getDatasetMeta(0);

    const dataset = chartInstance.data.datasets[0];

    return meta.data.reduce((sum: number, arc: any, idx: number) => {
      const val = dataset.data[idx];

      const visible = chartInstance.getDataVisibility(idx);

      if (!visible) return sum;

      if (typeof val === 'number') {
        return sum + val;
      }

      return sum;
    }, 0);
  }
}
