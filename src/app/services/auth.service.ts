import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';
  
  public isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.isAuthenticated.next(true);
      })
    );
  }

  register(userData: { name: string; email: string; password: string }) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
  }

/*   private checkAuthStatus() {
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
  } */

    // Agregar método para cargar usuario al iniciar
    private checkAuthStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.http.get<User>(`${this.apiUrl}/me`).subscribe({
          next: user => this.currentUserSubject.next(user),
          error: () => this.logout()
        });
      }
    }
  
}