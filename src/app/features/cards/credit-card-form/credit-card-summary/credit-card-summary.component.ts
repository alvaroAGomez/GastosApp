import { CreditCardSummary } from './../interfaces';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
  imports: [MatTableModule,
    MatSelectModule, // Importamos MatSelectModule
    MatOptionModule, // Importamos MatOptionModule
    MatFormFieldModule, // Importamos MatFormFieldModule para el uso de mat-label
    CurrencyPipe,
    CommonModule,],
  templateUrl: './credit-card-summary.component.html',
  styleUrl: './credit-card-summary.component.scss',
})
export class CreditCardSummaryComponent implements OnInit{
  @Input() expensesSummary!: CreditCardSummary;
  allExpenses: CardExpense[] = [];
  total: number = 0;
  selectedYear: number = new Date().getFullYear(); // Año por defecto
  availableYears: number[] = [];

  constructor() {}

  ngOnInit(): void {
    // Configurar los años disponibles. Aquí simulamos un rango de 5 años.
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, index) => currentYear - index);

    this.loadExpensesData(); // Cargar datos por defecto para el año actual
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.loadExpensesData();
  }

  loadExpensesData() {
    // Aquí deberías cargar los gastos correspondientes al año seleccionado.
    // Para simularlo, estamos usando el mismo conjunto de datos para todos los años.

    const months = Object.keys(this.expensesSummary.Months);
    this.total = this.expensesSummary.Total;
    this.allExpenses = months.map(month => ({
      month,
      amount: this.expensesSummary.Months[month], // Asegúrate de que estos valores cambien según el año
    }));
    console.log('Datos cargados para el año: ', this.selectedYear, this.allExpenses);
  }
}

