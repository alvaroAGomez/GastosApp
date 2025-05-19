import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FiltrosGraficoGastos,
  DatosGraficoGastos,
} from './grafico-de-gastos.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class GraficoDeGastosService {
  constructor(private http: HttpClient) {}

  obtenerDatosGrafico(
    filtros: FiltrosGraficoGastos,
    tipoGrafico: string
  ): Observable<DatosGraficoGastos> {
    return this.http.post<DatosGraficoGastos>(
      `${environment.apiUrl}gastos/charts/${tipoGrafico}`,
      filtros
    );
  }
}
