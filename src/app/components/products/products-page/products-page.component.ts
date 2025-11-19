import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../../state/products/models/product.model';
import { ProductsAction } from '../../../state/products/store/products.actions';
import { CartAction } from '../../../state/cart/store/cart.actions';
import { ToastService } from '../../../services/toast.service';
import {
  selectProductsData,
  selectProductsError,
  selectProductsLoading,
  selectProductsCount,
  selectSelectedProduct,
  selectSelectedRating,
} from '../../../state/products/store/products.selectors';

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent implements OnInit {
  private store = inject(Store);
  private toast = inject(ToastService);

  products$: Observable<Product[]> = this.store.select(selectProductsData);
  loading$: Observable<boolean> = this.store.select(selectProductsLoading);
  error$: Observable<any> = this.store.select(selectProductsError);
  selectedId$: Observable<number | null> = this.store.select(selectSelectedProduct);
  selectedRating$: Observable<number | null> = this.store.select(selectSelectedRating);
  count$: Observable<number> = this.store.select(selectProductsCount as any);

  // pagination state
  page = 1;
  pageSize = 10;
  totalPages$: Observable<number> = this.count$.pipe(
    map((c) => Math.max(1, Math.ceil(c / this.pageSize))),
  );

  ngOnInit(): void {
    this.loadPage(1);
  }

  showRating(id: number) {
    this.store.dispatch(ProductsAction.selectProduct({ id }));
  }

  addToCart(product: Product) {
    this.store.dispatch(CartAction.addItem({ product, quantity: 1 }));
    this.store.dispatch(ProductsAction.adjustStock({ productId: product.id, delta: -1 }));
    try {
      this.toast.show(`${product.name} added to cart`);
    } catch {}
  }

  // transient UI feedback when item added
  addedMessage = '';
  recentlyAddedId: number | null = null;
  addToCartWithFeedback(product: Product) {
    this.store.dispatch(CartAction.addItem({ product, quantity: 1 }));
    this.store.dispatch(ProductsAction.adjustStock({ productId: product.id, delta: -1 }));
    try {
      this.toast.show(`${product.name} added to cart`);
    } catch {}
    this.addedMessage = `${product.name} added to cart`;
    setTimeout(() => (this.addedMessage = ''), 1800);
    this.recentlyAddedId = product.id;
    setTimeout(() => (this.recentlyAddedId = null), 360);
  }

  loadPage(page: number) {
    this.page = Math.max(1, page);
    this.store.dispatch(ProductsAction.loadProducts({ page: this.page, pageSize: this.pageSize }));
    // refresh totalPages$ in case pageSize changed
    this.totalPages$ = this.count$.pipe(map((c) => Math.max(1, Math.ceil(c / this.pageSize))));
  }

  prevPage() {
    if (this.page > 1) this.loadPage(this.page - 1);
  }

  nextPage(totalPages: number) {
    if (this.page < totalPages) this.loadPage(this.page + 1);
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.loadPage(1);
  }
}
