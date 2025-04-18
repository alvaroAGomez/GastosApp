import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  private expenses: Expense[] = [];

  getExpenses(): Expense[] {
    return this.expenses.sort((a, b) => b.id - a.id); // Ordenados de más nuevos a más viejos
  }

  private expensesUrl = '/expenses.json';
  getExpensesTC(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expensesUrl);
  }
}
