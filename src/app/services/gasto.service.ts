import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gasto } from '../models/gasto.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GastoMensual } from '../features/cards/credit-card-form/interfaces';
import { GastosHistorico } from '../models/dashboard-expense.model';

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private apiUrl = environment.apiUrl + 'gastos';

  constructor(private http: HttpClient) {}

  crearGasto(gasto: Gasto): Observable<any> {
    return this.http.post<any>(this.apiUrl, gasto);
  }

  actualizarGasto(id: number, gasto: Gasto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, gasto);
  }

  eliminarGasto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getCardExpensesPaged(
    tarjetaId: number,
    params: {
      page?: number;
      limit?: number;
      fechaDesde?: string;
      fechaHasta?: string;
      categoria?: string;
      cuotasRestantes?: number;
      sortField?: string;
      sortDirection?: 'ASC' | 'DESC';
    }
  ) {
    return this.http.get<{ data: Gasto[]; total: number }>(
      `${environment.apiUrl}gastos/por-tarjeta/${tarjetaId}`,
      { params: { ...params } }
    );
  }

  getGastosMensualesPorTarjeta(tarjetaId: number): Observable<GastoMensual[]> {
    return this.http.get<GastoMensual[]>(`${this.apiUrl}/mensual/${tarjetaId}`);
  }

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
}
