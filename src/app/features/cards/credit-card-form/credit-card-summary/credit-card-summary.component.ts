import { CreditCardSummary } from './../interfaces';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

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
    CurrencyPipe,
    CommonModule,
  ],
  templateUrl: './credit-card-summary.component.html',
  styleUrl: './credit-card-summary.component.scss',
})
export class CreditCardSummaryComponent implements OnInit{
  @Input() expensesSummary!: CreditCardSummary;
  allExpenses: CardExpense[] = [];
  total: number = 0;

  constructor() {}

  ngOnInit(): void {   
    this.loadExpensesData(); // Cargar datos por defecto para el año actual
  }

  loadExpensesData() {
    const months = Object.keys(this.expensesSummary.Months);
    this.total = this.expensesSummary.Total;
    this.allExpenses = months.map(month => ({
      month,
      amount: this.expensesSummary.Months[month], 
    }));
  }
}


