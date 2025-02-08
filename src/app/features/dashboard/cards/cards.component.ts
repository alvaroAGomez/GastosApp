import { Component, OnInit } from '@angular/core';
import { Card, CreditCard } from '../../../models/card.model';
import { CardService } from '../../../services/card.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  creditCards: CreditCard[] = [];

  constructor(private creditCardService: CardService) { }

  ngOnInit(): void {
    this.creditCardService.getCards().subscribe(cards => {
      this.creditCards = cards;
    });
  }
}