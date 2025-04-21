import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExpenseChartFilters, ExpenseChartData } from './expense-charts.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ExpenseChartsService {
  constructor(private http: HttpClient) {}

  getChartData(
    filters: ExpenseChartFilters,
    chartType: string
  ): Observable<ExpenseChartData> {
    return this.http.post<ExpenseChartData>(
      `${environment.apiUrl}gastos/charts/${chartType}`,
      filters
    );
  }
}
