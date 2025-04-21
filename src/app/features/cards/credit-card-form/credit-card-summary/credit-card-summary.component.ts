import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { CreditCardAnnualGeneralSummary } from '../../../../models/card.model';
import { CreditCardSummary } from '../interfaces';
import { CustomCurrencyPipe } from '../../../../shared/pipes/custom-currency.pipe';

export interface CardExpense {
  month: string;
  amount: number;
}

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
  ],
  templateUrl: './credit-card-summary.component.html',
  styleUrl: './credit-card-summary.component.scss',
})
export class CreditCardSummaryComponent implements OnInit {
  @Input() expensesSummary?: CreditCardSummary;
  @Input() generalSummary?: CreditCardAnnualGeneralSummary;

  allExpenses: CardExpense[] = [];
  total: number = 0;

  ngOnInit(): void {
    this.loadExpensesData();
  }

  loadExpensesData() {
    if (this.generalSummary) {
      // Adaptar para resumen general anual
      this.allExpenses = this.generalSummary.resumenMensual.map((row) => ({
        month: row.mes,
        amount: row.totalGasto,
      }));
      this.total = this.generalSummary.totalAnual;
    } else if (this.expensesSummary) {
      // Resumen por tarjeta (formato anterior)
      const months = Object.keys(this.expensesSummary.Months);
      this.total = this.expensesSummary.Total;
      this.allExpenses = months.map((month) => ({
        month,
        amount: this.expensesSummary?.Months?.[month] ?? 0,
      }));
    }
  }
}
