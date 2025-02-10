import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CreditCardSummary } from '../interfaces';
import { Router, RouterModule } from '@angular/router';

export interface CardExpense {
  month: string;
  amount: number;
}

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [
    MatExpansionModule, MatTableModule,
    MatSelectModule, MatOptionModule, MatFormFieldModule,
    CurrencyPipe, CommonModule, RouterModule
  ], 
  templateUrl: './credit-card-details.component.html',
  styleUrl: './credit-card-details.component.scss'
})
export class CreditCardDetailsComponent {
  @Input() cardDetails: CreditCardSummary[] = [];
  constructor(private router: Router) {}

  getCardExpenses(card: any): CardExpense[] {
    if (!card?.Months) return []; 
    return Object.keys(card.Months).map(month => ({
      month,
      amount: card.Months[month],
    }));
  }

  onDetailsClick(card: any) {
    console.log('Ver detalles de:', card);
    // Aquí puedes abrir un modal, navegar a otra pantalla, etc.
    this.router.navigate(['/credit-cards', card.Id], {
      state: { cardDetails: card } // Pasamos todo el objeto de la tarjeta como estado
    });
  }
  
}
