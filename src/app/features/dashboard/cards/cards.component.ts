import { Component, OnInit } from '@angular/core';
import { CardService } from '../../../services/card.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CreditCardSummary } from '../../../models/card-summary.model';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, CustomCurrencyPipe, MatIconModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent implements OnInit {
  cardSummaries: CreditCardSummary[] = [];

  constructor(private creditCardService: CardService, private router: Router) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.creditCardService.getCardsSummary().subscribe((summaries) => {
      this.cardSummaries = summaries.sort(
        (a, b) => b.gastoActualMensual - a.gastoActualMensual
      );
    });
  }

  goToDetail(cardId: number) {
    this.router.navigate(['/credit-cards', cardId]);
  }
}
