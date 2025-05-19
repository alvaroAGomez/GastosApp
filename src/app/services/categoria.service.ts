import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  constructor(private http: HttpClient) {}

  getCategorias() {
    return this.http.get<any[]>(`${environment.apiUrl}CategoriaGasto/all`);
  }

  getCategoriasPorUsuario() {
    return this.http.get<any[]>(`${environment.apiUrl}CategoriaGasto`);
  }

  nuevaCategoria(data: { nombre: string }) {
    return this.http.post(`${environment.apiUrl}CategoriaGasto`, data);
  }

  actualizarCategoria(id: number, data: { nombre: string }) {
    return this.http.patch(`${environment.apiUrl}CategoriaGasto/${id}`, data);
  }

  eliminarCategoria(id: number) {
    return this.http.delete(`${environment.apiUrl}CategoriaGasto/${id}`);
  }
}
