import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = environment.apiBaseUrl + 'products/';

  constructor(private http: HttpClient) {}

  getProducts(options: {
    page?: number;
    pageSize?: number;
    minRating?: number;
    ordering?: string;
  }): Observable<{ results: Product[]; count?: number } | any> {
    const params = new URLSearchParams();
    if (options.page != null) params.append('page', String(options.page));
    if (options.pageSize != null) params.append('page_size', String(options.pageSize));
    if (options.minRating != null) params.append('min_rating', String(options.minRating));
    if (options.ordering) params.append('ordering', options.ordering);

    const url = this.baseUrl + (params.toString() ? `?${params.toString()}` : '');
    return this.http.get(url);
  }

  getRating(id: number): Observable<{ rating: number } | any> {
    const url = environment.apiBaseUrl + `products/${id}/rating/`;
    return this.http.get(url);
  }
}
