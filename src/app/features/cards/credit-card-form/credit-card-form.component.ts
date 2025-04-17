import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
import { CreditCardDetailsComponent } from './credit-card-details/credit-card-details.component';
import { CreditCardFormModalComponent } from './credit-card-form-modal/credit-card-form-modal.component';
import { CreditCardSummary } from './interfaces';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../services/card.service';
import { Subscription } from 'rxjs';

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
    CreditCardDetailsComponent,
    CommonModule,
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

  private subscriptions: Subscription = new Subscription();

  constructor(public dialog: MatDialog, private cardService: CardService) {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from(
      { length: 5 },
      (_, index) => currentYear - index
    );
  }

  ngOnInit() {
    this.subscriptions.add(
      this.cardService.getCards().subscribe((cards) => {
        this.creditCards = cards;
        this.loadAllCardMonthlyDetails(this.selectedYear);
        console.log('Cards:', cards);
      })
    );

    //this.loadAnnualSummary(this.selectedYear);
    this.loadAnnualGeneralSummary(this.selectedYear);
  }

  loadAnnualSummary(year: number) {
    this.subscriptions.add(
      this.cardService.getAnnualSummary(year).subscribe((summary) => {
        this.annualSummary = summary.resumenPorTarjeta;
      })
    );
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

  processData(data: CreditCardSummary[]) {
    if (data[0].CreditCard == 'ALL') {
      this.expensesSummary = data[0];
    }
    const months = Object.keys(data[0].Months);

    const cardDetail = data.slice(1);

    this.cardDetails = cardDetail;
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
      console.log('Dialog result:', result);

      if (result) {
        this.creditCards.push(result);

        // Agregar resumen anual vacío para la nueva tarjeta
        this.annualSummary.push({
          tarjetaId: result.id,
          nombreTarjeta: result.nombreTarjeta,
          anio: this.selectedYear,
          resumenMensual: [
            { mes: 'enero', totalCuotas: 0 },
            { mes: 'febrero', totalCuotas: 0 },
            { mes: 'marzo', totalCuotas: 0 },
            { mes: 'abril', totalCuotas: 0 },
            { mes: 'mayo', totalCuotas: 0 },
            { mes: 'junio', totalCuotas: 0 },
            { mes: 'julio', totalCuotas: 0 },
            { mes: 'agosto', totalCuotas: 0 },
            { mes: 'septiembre', totalCuotas: 0 },
            { mes: 'octubre', totalCuotas: 0 },
            { mes: 'noviembre', totalCuotas: 0 },
            { mes: 'diciembre', totalCuotas: 0 },
          ],
          totalAnual: 0,
        });
      }
    });
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.loadAnnualSummary(this.selectedYear);
    this.loadAnnualGeneralSummary(this.selectedYear);
    this.loadAllCardMonthlyDetails(this.selectedYear);
  }
}
