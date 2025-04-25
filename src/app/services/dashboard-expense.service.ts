import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardExpense } from '../models/dashboard-expense.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardExpenseService {
  constructor(private http: HttpClient) {}

  getDashboardExpenses(): Observable<DashboardExpense[]> {
    return this.http.get<DashboardExpense[]>(
      `${environment.apiUrl}gastos/dashboard/tarjetas`
    );
  }
}
