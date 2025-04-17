import { Injectable } from '@angular/core';
import { BancoDto } from '../models/banco.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BancosService {
  private apiUrl = environment.apiUrl + 'bancos';

  constructor(private http: HttpClient) {}

  getBancos(): Observable<BancoDto[]> {
    return this.http.get<BancoDto[]>(this.apiUrl);
  }
}
