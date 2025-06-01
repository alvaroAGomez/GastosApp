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
import { UpcomingExpensesComponent } from '../expenses/upcoming-expenses/upcoming-expenses.component';
import {
  getBarChartOptions,
  getDoughnutChartOptions,
  getPieChartOptions,
} from './charts/chart-config';
import { ChartConfiguration } from 'chart.js';
import { CreditCardFormModalComponent } from '../cards/credit-card-form/credit-card-form-modal/credit-card-form-modal.component';
import { SpinnerService } from '../../shared/services/spinner.service';
import { finalize, forkJoin } from 'rxjs';

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
  hasCards = false;

  @ViewChild('cards') cardsComponent?: CardsComponent;

  doughnutData: ChartDataWrapper = this.getEmptyChartData();
  barData: ChartDataWrapper = this.getEmptyChartData();
  pieData: ChartDataWrapper = this.getEmptyChartData();

  constructor(
    private dashboardExpenseService: DashboardExpenseService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
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
    const dialogRef = this.dialog.open(UpcomingExpensesComponent, {
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

  onCardsCountChange(count: number) {
    this.hasCards = count > 0;
  }

  private reloadDashboard() {
    this.cardsComponent?.reload();

    this.loadCharts();
  }

  // ============================
  // 📊 CARGA DE GRÁFICOS
  // ============================

  private loadCharts() {
    //  ForkJoin con claves
    forkJoin({
      doughnut: this.dashboardExpenseService.getDoughnutCategoryChart(),
      bar: this.dashboardExpenseService.getBarMonthlyEvolutionChart(),
      pie: this.dashboardExpenseService.getPieCardDistributionChart(),
    })
      .pipe(
        //  Ocultar spinner al terminar (éxito o error)
        finalize(() => this.spinnerService.hide())
      )
      .subscribe({
        next: ({ doughnut, bar, pie }) => {
          //  Asignar todo usando un helper
          this.doughnutData = this.toChartData(
            doughnut,
            getDoughnutChartOptions
          );
          this.barData = this.toChartData(bar, getBarChartOptions);
          this.pieData = this.toChartData(pie, getPieChartOptions);
        },
        error: (err) => {
          // aquí ya se ocultó el spinner por finalize()
          console.error('Error cargando charts', err);
        },
      });
  }

  /** Helper genérico para transformar la respuesta */
  private toChartData(
    res: { chartData: any },
    optionsFactory: (total: number) => any
  ) {
    // Saco los datos del primer dataset
    const data = (res.chartData.datasets[0]?.data as number[]) ?? [];
    // Sumo el array
    const total = data.reduce((sum, v) => sum + (v ?? 0), 0);
    // Genero options (aquí pasamos total aunque el factory lo ignore si no lo usa)
    const options = optionsFactory(total);
    return { chartData: res.chartData, total, chartOptions: options };
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

  openCardDialog(mode: 'create') {
    let component: any;
    let data: any = {};

    if (mode === 'create') {
      component = CreditCardFormModalComponent;
    }

    const dialogRef = this.dialog.open(component, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: false,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reloadDashboard();
      }
    });
  }
}
