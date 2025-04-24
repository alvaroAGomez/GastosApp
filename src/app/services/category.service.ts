import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(`${environment.apiUrl}CategoriaGasto/all`);
  }

  getCategoriesforUser() {
    return this.http.get<any[]>(`${environment.apiUrl}CategoriaGasto`);
  }

  createCategory(data: { nombre: string }) {
    return this.http.post(`${environment.apiUrl}CategoriaGasto`, data);
  }

  updateCategory(id: number, data: { nombre: string }) {
    return this.http.patch(`${environment.apiUrl}CategoriaGasto/${id}`, data);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${environment.apiUrl}CategoriaGasto/${id}`);
  }
}
