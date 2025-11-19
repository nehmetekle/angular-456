import { createSelector } from '@ngrx/store';

export const selectWishlist = (state: any) => state.wishlist || { items: [] };

export const selectWishlistItems = createSelector(selectWishlist, (s) => s.items || []);
export const selectWishlistCount = createSelector(selectWishlistItems, (it) => (it || []).length);
export const selectWishlistHas = (productId: number) =>
  createSelector(selectWishlistItems, (it) => (it || []).some((p: any) => p.id === productId));
