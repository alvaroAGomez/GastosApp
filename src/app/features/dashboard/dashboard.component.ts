import { Component } from '@angular/core';
import { CardService } from '../../services/card.service';
import { ApexChart, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { Card } from '../../models/card.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, MatCardModule, CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  cards: Card[] = [];
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