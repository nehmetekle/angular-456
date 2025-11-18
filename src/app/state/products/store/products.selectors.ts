import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.state';

const selectProductsFeature = createFeatureSelector<any>('products');

export const selectProductsState = createSelector(
  selectProductsFeature,
  (s: ProductsState) => s || {},
);

export const selectProductsData = createSelector(selectProductsState, (s: any) => s.data ?? []);
export const selectProductsCount = createSelector(selectProductsState, (s: any) => s.count ?? 0);
export const selectProductsLoading = createSelector(selectProductsState, (s: any) => !!s.loading);
export const selectProductsError = createSelector(selectProductsState, (s: any) => s.error ?? null);
export const selectSelectedProduct = createSelector(
  selectProductsState,
  (s: any) => s.selected ?? null,
);
export const selectSelectedRating = createSelector(
  selectProductsState,
  (s: any) => s.rating ?? null,
);
