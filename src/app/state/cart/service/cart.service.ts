import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  validateCart(payload: any): Observable<any> {
    const url = this.baseUrl + 'cart/validate/';
    return this.http.post(url, payload);
  }

  createOrder(payload: any): Observable<any> {
    const url = this.baseUrl + 'order/';
    return this.http.post(url, payload);
  }
}
