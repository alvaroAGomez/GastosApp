import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartData, ChartConfiguration } from 'chart.js';
import { ExpenseChartsService } from './expense-charts.service';
import { ExpenseChartFilters, ExpenseChartData } from './expense-charts.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgChartsModule } from 'ng2-charts';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  ChartType,
} from 'chart.js';

// Extiende la interfaz para los filtros locales del componente
interface LocalExpenseChartFilters extends ExpenseChartFilters {
  anioTotal?: boolean;
  mes?: number;
}

@Component({
  selector: 'app-expense-charts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    NgChartsModule, // <-- asegúrate de que sea exactamente así
    MatCheckboxModule,
  ],
  templateUrl: './expense-charts.component.html',
  providers: [ExpenseChartsService],
})
export class ExpenseChartsComponent implements OnInit {
  @Input() initialFilters?: Partial<ExpenseChartFilters>;
  @Input() allowedCharts: string[] = ['doughnut'];
  @Input() categorias: { id: number; nombre: string }[] = [];
  @Input() tarjetas: { id: number; nombre: string }[] = [];

  filterForm: FormGroup;
  chartType: ChartType = 'doughnut';
  chartData: ChartData = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            // Asegura que ctx.dataset.data es un array de números
            const dataArr = Array.isArray(ctx.dataset.data)
              ? ctx.dataset.data
              : [];
            const total = dataArr.reduce((a: number, b: number) => a + b, 0);
            const value = ctx.dataset.data[ctx.dataIndex];
            const pct = total ? ((value / total) * 100).toFixed(1) : 0;
            // Muestra el nombre de la categoría, el monto y el porcentaje
            return `${ctx.label}: $${value} (${pct}%)`;
          },
        },
      },
    },
  };

  // Opciones y datos para gráfico de barras
  barChartType: ChartType = 'bar';
  barChartData: ChartData = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            return `$${ctx.parsed.y ?? ctx.parsed.x}`;
          },
        },
      },
    },
  };

  months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' },
    { value: 0, name: 'Año Completo' },
  ];

  totalGasto: number = 0;

  constructor(
    private fb: FormBuilder,
    private chartsService: ExpenseChartsService
  ) {
    const now = new Date();
    this.filterForm = this.fb.group({
      anio: [now.getFullYear()],
      mes: [now.getMonth() + 1],
      categoria: [[]],
      anioTotal: [false],
    });
  }

  ngOnInit(): void {
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
    (Chart.defaults as any).cutout = '70%';
    Chart.register({
      id: 'doughnutCenterText',
      afterDraw: (chart: any) => {
        if (chart.config.type !== 'doughnut') return;
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        ctx.font = 'bold 1.2rem Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        const total = this.totalGasto;
        ctx.fillText(`$${total.toLocaleString()}`, centerX, centerY);
        ctx.restore();
      },
    });

    if (this.allowedCharts.length === 1) {
      this.chartType = this.allowedCharts[0] as ChartType;
    }

    if (this.initialFilters) {
      this.filterForm.patchValue(this.initialFilters, { emitEvent: false });
    }
    this.filterForm.valueChanges.subscribe(() => {
      this.loadChart();
    });
    this.loadChart();
  }

  loadChart() {
    const filters: LocalExpenseChartFilters = { ...this.filterForm.value };

    if (!Array.isArray(filters.categoria) || filters.categoria.length === 0) {
      delete filters.categoria;
    }

    if (this.initialFilters && this.initialFilters.tarjeta) {
      filters.tarjeta = this.initialFilters.tarjeta;
    }

    if (filters.anioTotal || filters.mes === 0) {
      delete filters.mes;
    }
    delete filters.anioTotal;

    // Decide el tipo de gráfico según allowedCharts
    const chartTypeToRequest = this.allowedCharts[0] as ChartType;

    this.chartsService
      .getChartData(filters, chartTypeToRequest)
      .subscribe((data: ExpenseChartData) => {
        if (chartTypeToRequest === 'bar') {
          this.barChartData = data.chartData;
          this.barChartOptions = {
            ...this.barChartOptions,
            ...data.chartOptions,
            responsive: true,
            maintainAspectRatio: false,
          };
        } else {
          this.chartData = data.chartData;
          // Asegúrate de usar SIEMPRE chartOptions definido arriba (el que tiene el label correcto)
          this.chartOptions = {
            ...this.chartOptions,
            ...data.chartOptions,
            plugins: {
              ...this.chartOptions?.plugins,
              ...((data.chartOptions && data.chartOptions.plugins) || {}),
              tooltip: {
                ...((this.chartOptions?.plugins &&
                  this.chartOptions.plugins.tooltip) ||
                  {}),
                ...((data.chartOptions.plugins &&
                  data.chartOptions.plugins.tooltip) ||
                  {}),
                callbacks: {
                  label: (ctx: any) => {
                    const dataArr = Array.isArray(ctx.dataset.data)
                      ? ctx.dataset.data
                      : [];
                    const total = dataArr.reduce(
                      (a: number, b: number) => a + b,
                      0
                    );
                    const value = ctx.dataset.data[ctx.dataIndex];
                    const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                    return `${ctx.label}: $${value} (${pct}%)`;
                  },
                },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          };
          if (
            data.chartData &&
            data.chartData.datasets &&
            data.chartData.datasets[0]
          ) {
            this.totalGasto = (
              data.chartData.datasets[0].data as number[]
            ).reduce((a, b) => a + b, 0);
          } else {
            this.totalGasto = 0;
          }
        }
      });
  }
}
