import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = environment.apiUrl + 'gastos';

  constructor(private http: HttpClient) {}

  crearGasto(gasto: Expense): Observable<any> {
    return this.http.post<any>(this.apiUrl, gasto);
  }

  actualizarGasto(id: number, gasto: Expense): Observable<any> {
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
    return this.http.get<{ data: Expense[]; total: number }>(
      `${environment.apiUrl}gastos/por-tarjeta/${tarjetaId}`,
      { params: { ...params } }
    );
  }
}
