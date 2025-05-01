import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface User {
  id: string;
  name: string;
  email: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'auth';

  public isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ access_token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.access_token);
          this.isAuthenticated.next(true);
        })
      );
  }

  register(userData: { nombre: string; email: string; password: string }) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      userData
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
  }
}
