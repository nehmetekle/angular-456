import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductsAction } from '../../../state/products/store/products.actions';
import {
  selectSelectedRating,
  selectProductsLoading,
  selectProductsError,
} from '../../../state/products/store/products.selectors';
import { products as MOCK_PRODUCTS } from '../../../../mocks/data';
import { avgRating as computeAvg } from '../../../../mocks/utils';

@Component({
  standalone: true,
  selector: 'app-product-rating-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-rating-page.component.html',
  styleUrls: ['./product-rating-page.component.css'],
})
export class ProductRatingPageComponent {
  private store = inject(Store);

  idModel: number | null = null;
  rating$: Observable<number | null> = this.store.select(selectSelectedRating);
  loading$: Observable<boolean> = this.store.select(selectProductsLoading);
  error$: Observable<any> = this.store.select(selectProductsError);
  // expose mock products for the selector dropdown
  mockProducts = MOCK_PRODUCTS;
  localAvg: number | null = null;
  selectedProduct: any | null = null;

  fetchRating() {
    if (this.idModel == null) return;
    const id = Number(this.idModel);
    if (!Number.isFinite(id) || id <= 0) return;
    // set local product info from mock data (if available)
    const p = this.mockProducts.find((x: any) => x.id === id) as any;
    this.selectedProduct = p ?? null;
    this.localAvg = p ? computeAvg(p.ratings) : null;
    this.store.dispatch(ProductsAction.loadRating({ id }));
  }
}
