import { createAction, props } from '@ngrx/store';

export const WishlistAdd = createAction('[Wishlist] Add Item', props<{ product: any }>());
export const WishlistRemove = createAction(
  '[Wishlist] Remove Item',
  props<{ productId: number }>(),
);
export const WishlistToggle = createAction('[Wishlist] Toggle Item', props<{ product: any }>());
export const WishlistHydrate = createAction('[Wishlist] Hydrate', props<{ items: any[] }>());
export const WishlistClear = createAction('[Wishlist] Clear');
