import { Component, HostListener, ViewChild } from '@angular/core';
import { CardService } from '../../services/card.service';
import { DashboardExpenseService } from '../../services/dashboard-expense.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CardsComponent } from './cards/cards.component';
import { GridComponent } from './grid/grid.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DoughnutCategoryChartComponent } from './charts/doughnut-category-chart.component';
import { BarMonthlyEvolutionChartComponent } from './charts/bar-monthly-evolution-chart.component';
import { PieCardDistributionChartComponent } from './charts/pie-card-distribution-chart.component';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CustomCurrencyPipe } from '../../shared/pipes/custom-currency.pipe';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatCardModule,
    CommonModule,
    CardsComponent,
    GridComponent,
    MatButtonToggleModule,
    DoughnutCategoryChartComponent,
    BarMonthlyEvolutionChartComponent,
    PieCardDistributionChartComponent,
    NgChartsModule,
    MatExpansionModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  showCharts = false;
  isMobile = false;
  cardsExpanded = false;

  @ViewChild('grid') gridComponent: any;

  // Datos para los gráficos (puedes obtenerlos de tus servicios)
  doughnutData: any = {
    chartData: { labels: [], datasets: [{ data: [] }] },
    total: 0,
    chartOptions: {},
  };
  barData: any = {
    chartData: { labels: [], datasets: [{ data: [] }] },
    chartOptions: {},
  };
  pieData: any = {
    chartData: { labels: [], datasets: [{ data: [] }] },
    chartOptions: {},
  };

  private customCurrency = new CustomCurrencyPipe();

  constructor(
    private cardService: CardService,
    private dashboardExpenseService: DashboardExpenseService
  ) {}

  ngOnInit() {
    this.checkMobile();
    this.loadCharts();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 700;
    if (!this.isMobile) this.cardsExpanded = false;
  }

  loadCharts() {
    this.dashboardExpenseService.getDoughnutCategoryChart().subscribe((res) => {
      const total =
        res.chartData.datasets[0]?.data?.reduce(
          (a: number, b: number) => a + b,
          0
        ) || 0;
      this.doughnutData = {
        chartData: res.chartData,
        total,
        chartOptions: {
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
                  const total = dataArr.reduce(
                    (a: number, b: number) => a + b,
                    0
                  );
                  const value = ctx.dataset.data[ctx.dataIndex];
                  const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                  return `${ctx.label}: ${this.customCurrency.transform(
                    value
                  )} (${pct}%)`;
                },
              },
            },
          },
        } as ChartConfiguration['options'],
      };
    });

    this.dashboardExpenseService
      .getBarMonthlyEvolutionChart()
      .subscribe((res) => {
        this.barData = {
          chartData: res.chartData,
          chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx: any) =>
                    this.customCurrency.transform(ctx.parsed.y ?? ctx.parsed.x),
                },
              },
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 13 } } },
              y: {
                grid: { display: false },
                beginAtZero: true,
                ticks: { font: { size: 13 } },
              },
            },
          } as ChartConfiguration['options'],
        };
      });

    this.dashboardExpenseService
      .getPieCardDistributionChart()
      .subscribe((res) => {
        this.pieData = {
          chartData: res.chartData,
          chartOptions: {
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
                    const total = dataArr.reduce(
                      (a: number, b: number) => a + b,
                      0
                    );
                    const value = ctx.dataset.data[ctx.dataIndex];
                    const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                    return `${this.customCurrency.transform(value)} (${pct}%)`;
                  },
                },
              },
            },
          } as ChartConfiguration['options'],
        };
      });
  }

  toggleView(event: any) {
    this.showCharts = event.value === 'charts';
  }

  onNewExpense() {
    if (this.gridComponent && this.gridComponent.NewExpense) {
      this.gridComponent.NewExpense();
    }
  }

  onExpenseAdded() {
    if (this.gridComponent && this.gridComponent.reloadData) {
      this.gridComponent.reloadData();
    }
  }
}
