import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreditCardAnnualGeneralSummary,
  CreditCardMonthlyDetailSummary,
} from '../models/card.model';
import { CuotasPendientesFuturasResponse } from '../features/cards/credit-card-form/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CuotaService {
  private apiUrl = environment.apiUrl + 'Cuota';

  constructor(private http: HttpClient) {}

  getAnnualSummary(anio?: number): Observable<any> {
    let url = `${this.apiUrl}/resumen-anual`;
    if (anio) {
      url += `?anio=${anio}`;
    }
    return this.http.get<any>(url);
  }

  getAnnualGeneralSummary(anio?: number) {
    let url = `${this.apiUrl}/resumen-general-anual`;
    if (anio) url += `?anio=${anio}`;
    return this.http.get<CreditCardAnnualGeneralSummary>(url);
  }

  getMonthlyDetailByCard(tarjetaId: number, anio?: number) {
    let url = `${this.apiUrl}/resumen-tarjeta/${tarjetaId}`;
    if (anio) url += `?anio=${anio}`;
    return this.http.get<CreditCardMonthlyDetailSummary>(url);
  }

  getCuotasPendientesFuturasPorTarjeta(tarjetaId: number) {
    let url = `${this.apiUrl}/pendientes-futuras/${tarjetaId}`;
    return this.http.get<CuotasPendientesFuturasResponse>(url);
  }
}
