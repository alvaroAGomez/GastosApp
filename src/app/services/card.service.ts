import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card, CreateCardDTO, CreditCard } from '../models/card.model';
import { Expense } from '../models/expense.model';
import { Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) {}

  getCards() : Observable<CreditCard[]>{
    return of(this.cards);
    // return this.http.get<Card[]>(this.apiUrl);
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
  


  private cards: CreditCard[] = [
    { id: 1, name: 'Visa Platinum', amount: 2500.50 },
    { id: 2, name: 'Mastercard Gold', amount: 3200.75 },
    { id: 3, name: 'American Express', amount: 4100.00 },



    
  ];


}