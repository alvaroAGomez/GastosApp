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
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule, 
    MatOptionModule,
    CreditCardSummaryComponent,
    CreditCardDetailsComponent,
    CommonModule
],
    providers: [MatDialog],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.scss'


})
export class CreditCardFormComponent implements OnInit {
  creditCards: Card[] = [];
  expensesSummary!: CreditCardSummary;
  cardDetails: CreditCardSummary[] =[];
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];

  constructor(public dialog: MatDialog) {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, index) => currentYear - index);

  }

  ngOnInit() {
    // Simulando respuesta del backend
    const response: CreditCardSummary[] = [
      {"Id":1,
        "CreditCard": "ALL",
        "Months": {
          "Enero": 4515,
          "Febrero": 56000,
          "Marzo": 415864,
          "Abril": 10000,
          "Mayo": 4515,
          "Junio": 56000,
          "Julio": 415864,
          "Agosto": 10000,
          "Septiembre": 4515,
          "Octubre": 56000,
          "Noviembre": 415864,
          "Diciembre": 10000
        },
        "Total": 10000000
      },
      {"Id":2,
        "CreditCard": "VISA",
        "Months": {
          "Enero": 4515,
          "Febrero": 56000,
          "Marzo": 415864,
          "Abril": 10000,
          "Mayo": 4515,
          "Junio": 56000,
          "Julio": 415864,
          "Agosto": 10000,
          "Septiembre": 4515,
          "Octubre": 56000,
          "Noviembre": 415864,
          "Diciembre": 10000
        },
        "Total": 200000
      },
      {"Id":3,
        "CreditCard": "MASTER",
        "Months": {
          "Enero": 4515,
          "Febrero": 56000,
          "Marzo": 415864,
          "Abril": 10000,
          "Mayo": 4515,
          "Junio": 56000,
          "Julio": 415864,
          "Agosto": 10000,
          "Septiembre": 4515,
          "Octubre": 56000,
          "Noviembre": 415864,
          "Diciembre": 10000
        },
        "Total": 4156419
      },
      {"Id":4,
        "CreditCard": "NARANJA",
        "Months": {
          "Enero": 4515,
          "Febrero": 56000,
          "Marzo": 415864,
          "Abril": 10000,
          "Mayo": 4515,
          "Junio": 56000,
          "Julio": 415864,
          "Agosto": 10000,
          "Septiembre": 4515,
          "Octubre": 56000,
          "Noviembre": 415864,
          "Diciembre": 10000
        },
        "Total": 6785678
      },
      {"Id":5,
        "CreditCard": "YOY",
        "Months": {
          "Enero": 4515,
          "Febrero": 56000,
          "Marzo": 415864,
          "Abril": 10000,
          "Mayo": 4515,
          "Junio": 56000,
          "Julio": 415864,
          "Agosto": 10000,
          "Septiembre": 4515,
          "Octubre": 56000,
          "Noviembre": 415864,
          "Diciembre": 10000
        },
        "Total": 123123213
      },
      {"Id":6,
        "CreditCard": "UALA",
        "Months": {
          "Enero": 4515,
          "Febrero": 56000,
          "Marzo": 415864,
          "Abril": 10000,
          "Mayo": 4515,
          "Junio": 56000,
          "Julio": 415864,
          "Agosto": 10000,
          "Septiembre": 4515,
          "Octubre": 56000,
          "Noviembre": 415864,
          "Diciembre": 10000
        },
        "Total": 66666666
      }]
      
      

    this.processData(response);
  }

  processData(data: CreditCardSummary[]) {
    if(data[0].CreditCard == 'ALL'){
      this.expensesSummary = data[0];
    }
    const months = Object.keys(data[0].Months);

    const cardDetail = data.slice(1);
    
/*     this.cardDetails = data.map(card => ({
      name: card.CreditCard,
      expenses: Object.entries(card.Months).map(([month, amount]) => ({ month, amount }))
    })); */
    this.cardDetails = cardDetail
  }

  openNewCardDialog() {
    const dialogRef = this.dialog.open(CreditCardFormModalComponent, {
      width: '600px',       // Ajusta a tu gusto
      maxWidth: '90vw',     // Para que no exceda el 90% del ancho de la ventana
      height: 'auto',
      disableClose: false,
      data:{}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.creditCards.push(result);
      }
    });
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    //this.loadExpensesData();
  }
}
