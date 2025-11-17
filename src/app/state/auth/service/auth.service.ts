// ...existing code...
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { loginModel } from '../models/login.model';
// ...existing code...
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenUrl = environment.apiBaseUrl + 'auth/token/';
  private readonly refreshUrl = environment.apiBaseUrl + 'auth/token/refresh/';

  constructor(private http: HttpClient) {}

  login(user: loginModel): Observable<{ access: string; refresh: string }> {
    return this.http.post<{ access: string; refresh: string }>(this.tokenUrl, { ...user });
  }

  refresh(refreshToken: string): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(this.refreshUrl, { refresh: refreshToken });
  }
}
