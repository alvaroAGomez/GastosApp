import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateCreditCardDTO,
  CreditCard,
  UpdateCreditCardDTO,
  CreditCardAnnualGeneralSummary,
  CreditCardMonthlyDetailSummary,
} from '../models/card.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreditCardSummary } from '../models/card-summary.model';
import { Expense } from '../models/expense.model';

export interface CreditCardDetailHeader {
  tarjetaId: number;
  nombreTarjeta: string;
  banco?: string;
  limiteTotal: number;
  gastoActualMensual: number;
  totalConsumosPendientes: number;
  limiteDisponible: number;
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = environment.apiUrl + 'tarjetas-credito';

  constructor(private http: HttpClient) {}

  getCards(): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(this.apiUrl);
  }

  createCreditCard(dto: CreateCreditCardDTO): Observable<CreditCard> {
    return this.http.post<CreditCard>(this.apiUrl, dto);
  }

  updateCreditCard(
    id: number,
    dto: UpdateCreditCardDTO
  ): Observable<CreditCard> {
    return this.http.put<CreditCard>(`${this.apiUrl}/${id}`, dto);
  }

  deleteCreditCard(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAnnualSummary(anio?: number): Observable<any> {
    let url = `${environment.apiUrl}Cuota/resumen-anual`;
    if (anio) {
      url += `?anio=${anio}`;
    }
    return this.http.get<any>(url);
  }

  getAnnualGeneralSummary(anio?: number) {
    let url = `${environment.apiUrl}Cuota/resumen-general-anual`;
    if (anio) url += `?anio=${anio}`;
    return this.http.get<CreditCardAnnualGeneralSummary>(url);
  }

  getMonthlyDetailByCard(tarjetaId: number, anio?: number) {
    let url = `${environment.apiUrl}Cuota/resumen-tarjeta/${tarjetaId}`;
    if (anio) url += `?anio=${anio}`;
    return this.http.get<CreditCardMonthlyDetailSummary>(url);
  }

  getCreditCardHeaderDetail(id: number) {
    return this.http.get<CreditCardDetailHeader>(
      `${this.apiUrl}/${id}/detalle`
    );
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

  getCardsSummary(): Observable<CreditCardSummary[]> {
    return this.http.get<CreditCardSummary[]>(`${this.apiUrl}/resumen`);
  }
}
