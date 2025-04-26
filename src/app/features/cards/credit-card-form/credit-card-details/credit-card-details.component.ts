import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CreditCardSummary } from '../interfaces';
import { Router, RouterModule } from '@angular/router';
import { CreditCardMonthlyDetailSummary } from '../../../../models/card.model';
import { CustomCurrencyPipe } from '../../../../shared/pipes/custom-currency.pipe';

export interface CardExpense {
  month: string;
  gastoActual?: number;
  montoCuotas?: number;
  totalMes: number;
}

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    CustomCurrencyPipe,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './credit-card-details.component.html',
  styleUrl: './credit-card-details.component.scss',
})
export class CreditCardDetailsComponent {
  @Input() cardDetails: CreditCardSummary[] = [];
  @Input() cardMonthlyDetails: CreditCardMonthlyDetailSummary[] = [];
  constructor(private router: Router) {}

  getCardExpenses(card: any): CardExpense[] {
    if (card?.resumenMensual) {
      // Nuevo formato: mostrar todas las columnas
      return card.resumenMensual.map((row: any) => ({
        month: row.mes,
        gastoActual: row.gastoActual,
        montoCuotas: row.montoCuotas,
        totalMes: row.totalMes,
      }));
    }
    if (card?.Months) {
      // Formato anterior
      return Object.keys(card.Months).map((month) => ({
        month,
        totalMes: card.Months[month],
      }));
    }
    return [];
  }

  getTotal(card: any): number {
    if (card?.Total !== undefined) return card.Total;
    if (card?.totalAnual !== undefined) return card.totalAnual;
    return 0;
  }

  getCardName(card: any): string {
    return card?.CreditCard || card?.nombreTarjeta || '';
  }

  onDetailsClick(card: any) {
    this.router.navigate(['/credit-cards', card.Id || card.tarjetaId], {
      state: { cardDetails: card },
    });
  }
}
