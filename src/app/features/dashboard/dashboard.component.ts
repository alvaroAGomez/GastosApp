import { Component, HostListener, ViewChild } from '@angular/core';
import { DashboardExpenseService } from '../../services/dashboard-expense.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CardsComponent } from './cards/cards.component';
import { DoughnutCategoryChartComponent } from './charts/doughnut-category-chart.component';
import { BarMonthlyEvolutionChartComponent } from './charts/bar-monthly-evolution-chart.component';
import { PieCardDistributionChartComponent } from './charts/pie-card-distribution-chart.component';
import { NuevoGastoComponent } from '../expenses/nuevo-gasto/nuevo-gasto.component';
import {
  getBarChartOptions,
  getDoughnutChartOptions,
  getPieChartOptions,
} from './charts/chart-config';
import { ChartConfiguration } from 'chart.js';

interface ChartDataWrapper {
  chartData: { labels: string[]; datasets: { data: number[] }[] };
  total?: number;
  chartOptions: ChartConfiguration['options'];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    NgChartsModule,
    NgApexchartsModule,
    CardsComponent,
    DoughnutCategoryChartComponent,
    BarMonthlyEvolutionChartComponent,
    PieCardDistributionChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isMobile = false;
  cardsExpanded = false;

  @ViewChild('cards') cardsComponent?: CardsComponent;

  doughnutData: ChartDataWrapper = this.getEmptyChartData();
  barData: ChartDataWrapper = this.getEmptyChartData();
  pieData: ChartDataWrapper = this.getEmptyChartData();

  constructor(
    private dashboardExpenseService: DashboardExpenseService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCharts();
    this.updateIsMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateIsMobile();
  }

  private updateIsMobile() {
    this.isMobile = window.innerWidth < 700;
    if (!this.isMobile) this.cardsExpanded = false;
  }

  onNewExpense() {
    const dialogRef = this.dialog.open(NuevoGastoComponent, {
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.reloadDashboard();
    });
  }

  onExpenseAdded() {
    this.reloadDashboard();
  }

  private reloadDashboard() {
    this.cardsComponent?.reload();
    this.loadCharts();
  }

  // ============================
  // 📊 CARGA DE GRÁFICOS
  // ============================

  private loadCharts() {
    this.loadDoughnutChartData();
    this.loadBarChartData();
    this.loadPieChartData();
  }

  private loadDoughnutChartData() {
    this.dashboardExpenseService.getDoughnutCategoryChart().subscribe((res) => {
      const total = this.sumArray(res.chartData.datasets[0]?.data ?? []);
      this.doughnutData = {
        chartData: res.chartData,
        total,
        chartOptions: getDoughnutChartOptions(total),
      };
    });
  }

  private loadBarChartData() {
    this.dashboardExpenseService
      .getBarMonthlyEvolutionChart()
      .subscribe((res) => {
        this.barData = {
          chartData: res.chartData,
          chartOptions: getBarChartOptions(),
        };
      });
  }

  private loadPieChartData() {
    this.dashboardExpenseService
      .getPieCardDistributionChart()
      .subscribe((res) => {
        const total = this.sumArray(res.chartData.datasets[0]?.data ?? []);
        this.pieData = {
          chartData: res.chartData,
          total,
          chartOptions: getPieChartOptions(),
        };
      });
  }

  // ============================
  // 🧰 HELPERS
  // ============================

  private sumArray(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
  }

  private getEmptyChartData(): ChartDataWrapper {
    return {
      chartData: { labels: [], datasets: [{ data: [] }] },
      chartOptions: {} as ChartConfiguration['options'],
    };
  }
}
