import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartData, ChartConfiguration } from 'chart.js';
import { GraficoDeGastosService } from './grafico-de-gastos.service';
import {
  FiltrosGraficoGastos,
  DatosGraficoGastos,
} from './grafico-de-gastos.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
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
import { CustomCurrencyPipe } from '../../pipes/custom-currency.pipe';

// Extiende la interfaz para los filtros locales del componente
interface FiltrosLocalesGraficoGastos extends FiltrosGraficoGastos {
  anioTotal?: boolean;
  mes?: number;
}

@Component({
  selector: 'app-grafico-de-gastos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    NgChartsModule,
    MatCheckboxModule,
  ],
  templateUrl: './grafico-de-gastos.component.html',
  providers: [GraficoDeGastosService],
  styleUrl: './grafico-de-gastos.component.scss',
})
export class GraficoDeGastosComponent implements OnInit {
  @Input() filtrosIniciales?: Partial<FiltrosGraficoGastos>;
  @Input() graficosPermitidos: string[] = ['doughnut'];
  @Input() categorias: { id: number; nombre: string }[] = [];
  @Input() tarjetas: { id: number; nombre: string }[] = [];

  formularioFiltros: FormGroup;
  tipoGrafico: ChartType = 'doughnut';
  datosGrafico: ChartData = { labels: [], datasets: [] };
  private customCurrency = new CustomCurrencyPipe();
  opcionesGrafico: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const dataArr = Array.isArray(ctx.dataset.data)
              ? ctx.dataset.data
              : [];
            const total = dataArr.reduce((a: number, b: number) => a + b, 0);
            const value = ctx.dataset.data[ctx.dataIndex];
            const pct = total ? ((value / total) * 100).toFixed(1) : 0;
            const formatted = this.customCurrency.transform(value, 0);
            return `${ctx.label}: ${formatted} (${pct}%)`;
          },
        },
      },
    },
  };

  // Opciones y datos para gráfico de barras
  tipoGraficoBarra: ChartType = 'bar';
  datosGraficoBarra: ChartData = { labels: [], datasets: [] };
  opcionesGraficoBarra: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.parsed.y ?? ctx.parsed.x;
            return this.customCurrency.transform(value, 0);
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 13 } } },
      y: {
        grid: { display: false },
        beginAtZero: true,
        min: 0,
        ticks: { font: { size: 13 } },
      },
    },
  };

  // Opciones y datos para gráfico de línea
  tipoGraficoLinea: ChartType = 'line';
  datosGraficoLinea: ChartData = { labels: [], datasets: [] };
  opcionesGraficoLinea: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.parsed.y ?? ctx.parsed.x;
            return this.customCurrency.transform(value, 0);
          },
        },
      },
    },
  };

  meses = [
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
    private servicioGraficos: GraficoDeGastosService,
    private cdr: ChangeDetectorRef
  ) {
    const now = new Date();
    this.formularioFiltros = this.fb.group({
      anio: [now.getFullYear()],
      mes: [now.getMonth() + 1],
      categoria: [[]],
      anioTotal: [false],
    });
  }

  ngOnInit(): void {
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

    if (!(Chart as any)._doughnutCenterTextRegistered) {
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
          ctx.fillText(`$${total.toLocaleString()}`, centerX, centerY);
          ctx.restore();
        },
      });
      (Chart as any)._doughnutCenterTextRegistered = true;
    }

    if (this.graficosPermitidos.length === 1) {
      this.tipoGrafico = this.graficosPermitidos[0] as ChartType;
    }

    if (this.filtrosIniciales) {
      this.formularioFiltros.patchValue(this.filtrosIniciales, {
        emitEvent: false,
      });
    }
    this.formularioFiltros.valueChanges.subscribe(() => {
      this.cargarGrafico();
    });
    this.cargarGrafico();
  }

  cargarGrafico() {
    const filtros: FiltrosLocalesGraficoGastos = {
      ...this.formularioFiltros.value,
    };

    if (!Array.isArray(filtros.categoria) || filtros.categoria.length === 0) {
      delete filtros.categoria;
    }

    if (this.filtrosIniciales && this.filtrosIniciales.tarjeta) {
      filtros.tarjeta = this.filtrosIniciales.tarjeta;
    }

    if (filtros.anioTotal || filtros.mes === 0) {
      delete filtros.mes;
    }
    delete filtros.anioTotal;

    const tipoGraficoPeticion = this.graficosPermitidos[0] as ChartType;

    this.servicioGraficos
      .obtenerDatosGrafico(filtros, tipoGraficoPeticion)
      .subscribe((data: DatosGraficoGastos) => {
        if (tipoGraficoPeticion === 'bar') {
          this.datosGraficoBarra = { ...data.chartData };
          this.opcionesGraficoBarra = {
            ...this.opcionesGraficoBarra,
            ...data.chartOptions,
            responsive: true,
            maintainAspectRatio: false,
          };
        } else if (tipoGraficoPeticion === 'line') {
          this.datosGraficoLinea = { ...data.chartData };
          this.opcionesGraficoLinea = {
            ...this.opcionesGraficoLinea,
            ...data.chartOptions,
            responsive: true,
            maintainAspectRatio: false,
          };
        } else {
          this.datosGrafico = { ...data.chartData };
          this.opcionesGrafico = {
            ...this.opcionesGrafico,
            ...data.chartOptions,
            plugins: {
              ...this.opcionesGrafico?.plugins,
              ...((data.chartOptions && data.chartOptions.plugins) || {}),
              tooltip: {
                ...((this.opcionesGrafico?.plugins &&
                  this.opcionesGrafico.plugins.tooltip) ||
                  {}),
                ...((data.chartData.plugins &&
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
                    const formatted = this.customCurrency.transform(value, 0);
                    return ` ${formatted} (${pct}%)`;
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
          this.cdr.detectChanges();
        }
      });
  }
}
