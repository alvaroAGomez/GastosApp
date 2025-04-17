import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateCreditCardDTO,
  CreditCard,
  UpdateCreditCardDTO,
  CreditCardAnnualGeneralSummary,
  CreditCardMonthlyDetailSummary,
} from '../models/card.model';
import { Expense } from '../models/expense.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

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

  /*   private cards: CreditCard[] = [
    { id: 1, nombreTarjeta: 'Visa Platinum', gastos: 2500.5 },
    { id: 2, nombreTarjeta: 'Mastercard Gold', amount: 3200.75 },
    { id: 3, nombreTarjeta: 'American Express', amount: 4100.0 },
  ];  */
}
