import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CardService } from '../../../services/card.service';
import { Card, CardType } from '../../../models/card.model';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreditCardSummaryComponent } from './credit-card-summary/credit-card-summary.component';
import { CreditCardDetailsComponent } from './credit-card-details/credit-card-details.component';
import { CreditCardFormModalComponent } from './credit-card-form-modal/credit-card-form-modal.component';
import { CreditCardSummary } from './interfaces';



@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    CreditCardSummaryComponent,
    CreditCardDetailsComponent // Asegúrate de incluir los componentes necesarios
],
    providers: [MatDialog],
  templateUrl: './credit-card-form.component.html'
})
export class CreditCardFormComponent implements OnInit {
  creditCards: Card[] = [];
  expensesSummary!: CreditCardSummary;
  cardDetails: { name: string, expenses: { month: string, amount: number }[] }[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    // Simulando respuesta del backend
    const response: CreditCardSummary[] = [
      {
        "CreditCard": "ALL",
        "Months": {
          "January": 4515,
          "February": 56000,
          "March": 415864,
          "April": 10000,
          "May": 4515,
          "June": 56000,
          "July": 415864,
          "August": 10000,
          "September": 4515,
          "October": 56000,
          "November": 415864,
          "December": 10000
        },
        "Total": 100000000
      },
      {
        "CreditCard": "VISA",
        "Months": {
          "January": 4515,
          "February": 56000,
          "March": 415864,
          "April": 10000,
          "May": 4515,
          "June": 56000,
          "July": 415864,
          "August": 10000,
          "September": 4515,
          "October": 56000,
          "November": 415864,
          "December": 10000
        },
        "Total": 100000000
      },
      {
        "CreditCard": "YOY",
        "Months": {
          "January": 4515,
          "February": 56000,
          "March": 415864,
          "April": 10000,
          "May": 4515,
          "June": 56000,
          "July": 415864,
          "August": 10000,
          "September": 4515,
          "October": 56000,
          "November": 415864,
          "December": 10000
        },
        "Total": 100000000
      }]
      
      

    this.processData(response);
  }

  processData(data: CreditCardSummary[]) {
    if(data[0].CreditCard == 'ALL'){
      this.expensesSummary = data[0];
    }
    const months = Object.keys(data[0].Months);
/*     this.expensesSummary = months.map(month => ({
      month,
      total: data.reduce((sum, card) => sum + (card.Months[month] || 0), 0)
    })); */

    this.cardDetails = data.map(card => ({
      name: card.CreditCard,
      expenses: Object.entries(card.Months).map(([month, amount]) => ({ month, amount }))
    }));
  }

  openNewCardDialog() {
    const dialogRef = this.dialog.open(CreditCardFormModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.creditCards.push(result);
      }
    });
  }
}
