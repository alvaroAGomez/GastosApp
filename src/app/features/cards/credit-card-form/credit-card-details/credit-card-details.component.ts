import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion'; 


export interface CardExpense {
  month: string;
  amount: number;
}

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [MatExpansionModule, CurrencyPipe, CommonModule], 
  templateUrl: './credit-card-details.component.html',
  styleUrl: './credit-card-details.component.scss'
})
export class CreditCardDetailsComponent {
  @Input() cardName: string = '';
  @Input() expenses: CardExpense[] = [];
  @Input() cardDetails: any;
}
