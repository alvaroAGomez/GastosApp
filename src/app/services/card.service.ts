import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card, CreateCardDTO } from '../models/card.model';
import { Expense } from '../models/expense.model';


@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) {}

  getCards() {
    return this.http.get<Card[]>(this.apiUrl);
  }

  createCreditCard(card: CreateCardDTO) {
    const newCard = {
      ...card,
      expenses: card.expenses || [] // Valor por defecto
    };
    return this.http.post<Card>(`${this.apiUrl}/credit`, newCard);
  }
  
  addExpense(cardId: string, expense: Expense) {
    return this.http.post<Card>(`${this.apiUrl}/${cardId}/expenses`, expense);
  }
  
}