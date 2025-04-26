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

  getDoughnutCategoryChart(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}gastos/charts/doughnut-category`
    );
  }

  getBarMonthlyEvolutionChart(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}gastos/charts/bar-monthly-evolution`
    );
  }

  getPieCardDistributionChart(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}gastos/charts/pie-card-distribution`
    );
  }
}
