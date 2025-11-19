import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

const selectCartFeature = createFeatureSelector<any>('cart');

export const selectCartState = createSelector(selectCartFeature, (s: CartState) => s || {});

export const selectCartItems = createSelector(selectCartState, (s: any) => s.items ?? []);
export const selectCartSubtotal = createSelector(selectCartState, (s: any) => {
  // If we have items, compute subtotal from items to avoid stale persisted 0 overriding real lines.
  const items = s.items ?? [];
  if (Array.isArray(items) && items.length > 0) {
    return items.reduce(
      (sum: number, it: any) => sum + Number(it.quantity || 0) * Number(it.product?.price || 0),
      0,
    );
  }
  // fallback to stored subtotal (could be 0 for empty carts)
  return typeof s.subtotal === 'number' ? s.subtotal : 0;
});
export const selectCartDiscount = createSelector(selectCartState, (s: any) => s.discount ?? 0);
export const selectCartTotal = createSelector(selectCartState, (s: any) => {
  // prefer validated totalPrice when it's a positive number, otherwise compute from items, discount, tax and shipping
  if (typeof s.totalPrice === 'number' && s.totalPrice > 0) return s.totalPrice;
  const subtotal = selectCartSubtotal.projector(s);
  const discount = Number(s.discount || 0);
  const tax = Number(s.tax || 0);
  const shipping = Number(s.shipping || 0);
  return +(subtotal - discount + tax + shipping || 0).toFixed(2);
});
// Total excluding shipping (used in Cart Summary step before shipping is selected/applied)
export const selectCartTotalExcludingShipping = createSelector(selectCartState, (s: any) => {
  // prefer validated totalPrice minus shipping when possible
  const subtotal = selectCartSubtotal.projector(s);
  const discount = Number(s.discount || 0);
  const tax = Number(s.tax || 0);
  return +(subtotal - discount + tax || 0).toFixed(2);
});
export const selectCartShipping = createSelector(selectCartState, (s: any) =>
  Number(s.shipping || 0),
);
export const selectCartCount = createSelector(selectCartState, (s: any) => s.count ?? 0);
export const selectCartCoupon = createSelector(selectCartState, (s: any) => s.coupon ?? null);
export const selectShippingMethod = createSelector(
  selectCartState,
  (s: any) => s.shippingMethod ?? null,
);
