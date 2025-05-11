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
export class CreditCardSummaryComponent implements OnInit, OnChanges {
  @Input() generalSummary?: CreditCardAnnualGeneralSummary;

  allExpenses: GastoTarjeta[] = [];
  total: number = 0;

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
      this.allExpenses = this.generalSummary.resumenMensual.map((row) => ({
        month: row.mes,
        amount: row.totalGasto,
      }));
      this.total = this.generalSummary.totalAnual;
    }
  }
}
