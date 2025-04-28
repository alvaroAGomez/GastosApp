import { Component, OnInit, OnDestroy, LOCALE_ID } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { DeleteCardModalComponent } from './delete-card-modal/delete-card-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  expensesSummary!: CreditCardSummary;
  cardDetails: CreditCardSummary[] = [];
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  annualSummary: any[] = [];
  annualGeneralSummary?: CreditCardAnnualGeneralSummary;
  cardMonthlyDetails: CreditCardMonthlyDetailSummary[] = [];
  showGeneralSummary = true;

  // Paleta de colores suaves y modernos
  cardColors = [
    '#f8fafc', // gris muy claro
    '#e3e8f0', // gris azulado claro
    '#f1f5f9', // gris azulado más claro
    '#e9f1fb', // azul muy claro
    '#e0e7ef', // gris azulado intermedio
    '#dbeafe', // azul pastel claroption = new Subscription();
    '#e0ecf7', // azul grisáceo claro
    '#f3f6fb', // gris azulado extra claro
  ];

  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cardService: CardService,
    private router: Router // agrega el router
  ) {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from(
      { length: 8 },
      (_, index) => currentYear + 2 - index
    );
  }

  ngOnInit() {
    this.subscriptions.add(
      this.cardService.getCards().subscribe((cards) => {
        this.creditCards = cards;
        this.loadAllCardMonthlyDetails(this.selectedYear);
      })
    );
    this.loadAnnualGeneralSummary(this.selectedYear);
  }

  loadAnnualGeneralSummary(year: number) {
    this.subscriptions.add(
      this.cardService.getAnnualGeneralSummary(year).subscribe((summary) => {
        this.annualGeneralSummary = summary;
      })
    );
  }

  loadAllCardMonthlyDetails(year: number) {
    this.cardMonthlyDetails = [];
    this.creditCards.forEach((card) => {
      this.subscriptions.add(
        this.cardService
          .getMonthlyDetailByCard(card.id, year)
          .subscribe((detail) => {
            this.cardMonthlyDetails.push(detail);
          })
      );
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openNewCardDialog() {
    const dialogRef = this.dialog.open(CreditCardFormModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      height: 'auto',
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cardService.getCards().subscribe((cards) => {
          this.creditCards = cards;
          this.loadAllCardMonthlyDetails(this.selectedYear);
        });
        this.loadAnnualGeneralSummary(this.selectedYear);
      }
    });
  }

  openEditCardDialog() {
    const dialogRef = this.dialog.open(CreditCardFormModalComponent, {
      width: '600px',
      maxWidth: '100vw',
      disableClose: false,
      data: {
        mode: 'edit',
        cards: this.creditCards,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cardService.getCards().subscribe((cards) => {
          this.creditCards = cards;
          this.loadAllCardMonthlyDetails(this.selectedYear);
        });
        this.loadAnnualGeneralSummary(this.selectedYear);
      }
    });
  }

  openDeleteCardDialog() {
    const dialogRef = this.dialog.open(DeleteCardModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      data: {
        cards: this.creditCards,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.deleted) {
        this.cardService.getCards().subscribe((cards) => {
          this.creditCards = cards;
          this.loadAllCardMonthlyDetails(this.selectedYear);
        });
        this.loadAnnualGeneralSummary(this.selectedYear);
      }
    });
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.loadAnnualGeneralSummary(this.selectedYear);
    this.loadAllCardMonthlyDetails(this.selectedYear);
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
    if (card?.Total !== undefined) return card.Total;
    if (card?.totalAnual !== undefined) return card.totalAnual;
    return 0;
  }

  onDetailsClick(card: any) {
    this.router.navigate(['/credit-cards', card.Id || card.tarjetaId], {
      state: { cardDetails: card },
    });
  }

  getCardColor(index: number): string {
    return this.cardColors[index % this.cardColors.length];
  }

  toggleGeneralSummary() {
    this.showGeneralSummary = !this.showGeneralSummary;
  }
}
