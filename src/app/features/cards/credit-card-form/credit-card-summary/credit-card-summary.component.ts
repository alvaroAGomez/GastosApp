import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CreditCardAnnualGeneralSummary } from '../../../../models/card.model';
import { CreditCardSummary, GastoTarjeta } from '../interfaces';
import { CustomCurrencyPipe } from '../../../../shared/pipes/custom-currency.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-credit-card-summary',
  standalone: true,
  imports: [
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    CommonModule,
    CustomCurrencyPipe,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './credit-card-summary.component.html',
  styleUrl: './credit-card-summary.component.scss',
})
export class CreditCardSummaryComponent implements OnInit, OnChanges {
  @Input() generalSummary?: CreditCardAnnualGeneralSummary;

  allExpenses: GastoTarjeta[] = [];
  total: number = 0;
  emptyMonths: any[] = [];

  readonly MONTHS = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ];

  ngOnInit(): void {
    this.loadExpensesData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['generalSummary']) {
      this.loadExpensesData();
    }
  }

  loadExpensesData() {
    if (this.generalSummary) {
      // Mapear meses a su posición para ordenar y rellenar vacíos
      const monthMap: { [key: string]: number } = {
        ENERO: 0,
        FEBRERO: 1,
        MARZO: 2,
        ABRIL: 3,
        MAYO: 4,
        JUNIO: 5,
        JULIO: 6,
        AGOSTO: 7,
        SEPTIEMBRE: 8,
        OCTUBRE: 9,
        NOVIEMBRE: 10,
        DICIEMBRE: 11,
      };
      const expensesByMonth: { [key: string]: number } = {};
      this.generalSummary.resumenMensual.forEach((row) => {
        expensesByMonth[row.mes.toUpperCase()] = row.totalGasto;
      });
      this.allExpenses = this.MONTHS.map((mes) => ({
        month: mes,
        amount: expensesByMonth[mes] ?? 0,
      }));
      this.total = this.generalSummary.totalAnual;
      // Calcular tarjetas vacías si hay menos de 12 meses
      this.emptyMonths = Array(12 - this.allExpenses.length).fill(0);
    } else {
      this.allExpenses = [];
      this.emptyMonths = Array(12).fill(0);
      this.total = 0;
    }
  }

  isHigh(amount: number): boolean {
    // Puedes ajustar el umbral según tu lógica de "alto"
    return amount > 0;
  }
  isLow(amount: number): boolean {
    return amount <= 0;
  }

  // Devuelve true si la pantalla es mobile (igual que en el HTML)
  isMobileView(): boolean {
    return window.innerWidth < 700;
  }

  // Promedio de gastos para el color del ícono en mobile
  getMobilePromedio(): number {
    if (!this.allExpenses.length) return 0;
    const sum = this.allExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    return sum / this.allExpenses.length;
  }
}
