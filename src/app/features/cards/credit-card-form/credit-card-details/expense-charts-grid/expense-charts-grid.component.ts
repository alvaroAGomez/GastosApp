import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseChartsComponent } from '../../../../../shared/components/expense-charts/expense-charts.component';

export interface Categoria {
  id: number;
  nombre: string;
}
export interface CardOption {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-expense-charts-grid',
  standalone: true,
  imports: [CommonModule, ExpenseChartsComponent],
  templateUrl: './expense-charts-grid.component.html',
  styleUrls: ['./expense-charts-grid.component.scss'],
})
export class ExpenseChartsGridComponent {
  @Input() categorias: Categoria[] = [];
  @Input() tarjetaId!: number;
  @Input() tarjetaNombre?: string;

  @Input() initialPieChartFilters: any;
  @Input() initialBarChartFilters: any;
  @Input() initialLineChartFilters: any;

  // genera array de CardOption para el componente de gráficos
  get tarjetas(): CardOption[] {
    return this.tarjetaId
      ? [{ id: this.tarjetaId, nombre: this.tarjetaNombre ?? '' }]
      : [];
  }

  pieCharts = ['doughnut'];
  barCharts = ['bar'];
  lineCharts = ['line'];
}
