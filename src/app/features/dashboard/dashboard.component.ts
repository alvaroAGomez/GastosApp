import { Component } from '@angular/core';
import { CardService } from '../../services/card.service';
import { ApexChart, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { Card, CreditCard } from '../../models/card.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CardsComponent } from "./cards/cards.component";
import { GridComponent } from "./grid/grid.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, MatCardModule, CommonModule, CardsComponent, GridComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  cards: CreditCard[] = [];
  chartSeries: ApexNonAxisChartSeries = [35, 40, 25];
  chartConfig: ApexChart = {
    type: 'donut',
    height: 350
  };

  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.cardService.getCards().subscribe(cards => {
      this.cards = cards.slice(0, 4);
    });
  }


}