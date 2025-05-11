import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GastosHistorico } from '../models/dashboard-expense.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardExpenseService {
  constructor(private http: HttpClient) {}

  getDashboardExpenses(filters?: {
    fechaDesde?: string;
    fechaHasta?: string;
    categoriaId?: number;
    tarjetaId?: number;
  }): Observable<GastosHistorico[]> {
    const params: any = {};

    if (filters?.fechaDesde) params.fechaDesde = filters.fechaDesde;
    if (filters?.fechaHasta) params.fechaHasta = filters.fechaHasta;
    if (filters?.categoriaId) params.categoriaId = filters.categoriaId;
    if (filters?.tarjetaId) params.tarjetaId = filters.tarjetaId;

    return this.http.get<GastosHistorico[]>(
      `${environment.apiUrl}gastos/dashboard/tarjetas`,
      { params }
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
