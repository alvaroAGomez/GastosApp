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

  getCreditCardHeaderDetail(id: number) {
    return this.http.get<CreditCardDetailHeader>(
      `${this.apiUrl}/${id}/detalle`
    );
  }

  getCardsSummary(): Observable<CreditCardSummary[]> {
    return this.http.get<CreditCardSummary[]>(`${this.apiUrl}/resumen`);
  }

  getCardMovements(tarjetaId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${tarjetaId}/movimientos`);
  }
}
