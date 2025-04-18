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

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.loadAnnualGeneralSummary(this.selectedYear);
    this.loadAllCardMonthlyDetails(this.selectedYear);
  }
}
