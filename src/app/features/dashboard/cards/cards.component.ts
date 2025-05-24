import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CardService } from '../../../services/card.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CreditCardSummary } from '../../../models/card-summary.model';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface CreditCardDetailHeader {
  tarjetaId: number;
  nombreTarjeta: string;
  banco?: string;
  limiteTotal: number;
  gastoActualMensual: number;
  totalConsumosPendientes: number;
  limiteDisponible: number;
}
@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, CustomCurrencyPipe, MatIconModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent implements OnInit {
  @Output() cardsCount = new EventEmitter<number>();
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
      this.cardsCount.emit(this.cardSummaries.length);
    });
  }

  goToDetail(cardId: number) {
    this.router.navigate(['/credit-cards', cardId]);
  }

  getLimitColorClass(header: CreditCardSummary | undefined): string {
    if (!header) return '';
    const percent =
      header.limiteTotal > 0
        ? (header.limiteDisponible / header.limiteTotal) * 100
        : 0;
    if (percent <= 15) return 'limit-red';
    if (percent > 15 && percent <= 55) return 'limit-orange';
    return 'limit-green';
  }
}
