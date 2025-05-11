import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CreditCard,
  CreditCardAnnualGeneralSummary,
  CreditCardMonthlyDetailSummary,
} from '../../../models/card.model';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreditCardSummaryComponent } from './credit-card-summary/credit-card-summary.component';
import { CreditCardFormModalComponent } from './credit-card-form-modal/credit-card-form-modal.component';
import { CreditCardSummary } from './interfaces';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../services/card.service';
import { forkJoin, Subscription } from 'rxjs';
import { DeleteCardModalComponent } from './delete-card-modal/delete-card-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CuotaService } from '../../../services/cuota.service';
import { CARD_COLORS } from '../../../shared/constants/theme.constants';

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatOptionModule,
    CreditCardSummaryComponent,
    CommonModule,
    MatIconModule,
    CustomCurrencyPipe,
    MatTooltipModule,
  ],
  providers: [MatDialog],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.scss',
})
export class CreditCardFormComponent implements OnInit, OnDestroy {
  creditCards: CreditCard[] = [];
  cardMonthlyDetails: CreditCardMonthlyDetailSummary[] = [];
  annualGeneralSummary?: CreditCardAnnualGeneralSummary;
  selectedYear = new Date().getFullYear();
  availableYears: number[] = [];

  showGeneralSummary = true;
  private subscriptions = new Subscription();

  readonly cardColors = CARD_COLORS;

  constructor(
    private dialog: MatDialog,
    private cardService: CardService,
    private cuotaService: CuotaService,
    private router: Router
  ) {
    this.availableYears = Array.from(
      { length: 8 },
      (_, i) => this.selectedYear + 2 - i
    );
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadData() {
    this.subscriptions.add(
      this.cardService.getCards().subscribe((cards) => {
        this.creditCards = cards;
        this.loadMonthlyDetails(this.selectedYear);
      })
    );
    this.loadAnnualSummary(this.selectedYear);
  }

  private loadAnnualSummary(year: number) {
    this.subscriptions.add(
      this.cuotaService.getAnnualGeneralSummary(year).subscribe((res) => {
        this.annualGeneralSummary = res;
      })
    );
  }

  private loadMonthlyDetails(year: number) {
    const requests = this.creditCards.map((card) =>
      this.cuotaService.getMonthlyDetailByCard(card.id, year)
    );
    this.subscriptions.add(
      forkJoin(requests).subscribe((results) => {
        this.cardMonthlyDetails = results.sort(
          (a, b) => b.totalAnual - a.totalAnual
        );
      })
    );
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.loadAnnualSummary(this.selectedYear);
    this.loadMonthlyDetails(this.selectedYear);
  }

  openCardDialog(mode: 'create' | 'edit' | 'delete') {
    let component: any;
    let data: any = {};

    if (mode === 'create') {
      component = CreditCardFormModalComponent;
    } else if (mode === 'edit') {
      component = CreditCardFormModalComponent;
      data = { mode: 'edit', cards: this.creditCards };
    } else {
      component = DeleteCardModalComponent;
      data = { cards: this.creditCards };
    }

    const dialogRef = this.dialog.open(component, {
      width: mode === 'delete' ? '500px' : '600px',
      maxWidth: '90vw',
      disableClose: false,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  toggleGeneralSummary() {
    this.showGeneralSummary = !this.showGeneralSummary;
  }

  onDetailsClick(card: any) {
    this.router.navigate(['/credit-cards', card.Id || card.tarjetaId], {
      state: { cardDetails: card },
    });
  }

  getCardName(card: any): string {
    return card?.CreditCard || card?.nombreTarjeta || '';
  }

  getCardExpenses(card: any) {
    if (card?.resumenMensual) {
      return card.resumenMensual.map((row: any) => ({
        month: row.mes,
        gastoActual: row.gastoActual,
        montoCuotas: row.montoCuotas,
        totalMes: row.totalMes,
      }));
    }
    if (card?.Months) {
      return Object.keys(card.Months).map((month) => ({
        month,
        gastoActual: null,
        montoCuotas: null,
        totalMes: card.Months[month],
      }));
    }
    return [];
  }

  getTotal(card: any): number {
    return card?.Total ?? card?.totalAnual ?? 0;
  }

  getCardColor(index: number): string {
    return this.cardColors[index % this.cardColors.length];
  }
}
