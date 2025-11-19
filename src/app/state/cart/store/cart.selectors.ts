import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

const selectCartFeature = createFeatureSelector<any>('cart');

export const selectCartState = createSelector(selectCartFeature, (s: CartState) => s || {});

export const selectCartItems = createSelector(selectCartState, (s: any) => s.items ?? []);
export const selectCartTotal = createSelector(selectCartState, (s: any) => s.totalPrice ?? 0);
export const selectCartCount = createSelector(selectCartState, (s: any) => s.count ?? 0);
