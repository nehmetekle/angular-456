import { createReducer, on } from '@ngrx/store';
import {
  WishlistAdd,
  WishlistRemove,
  WishlistToggle,
  WishlistHydrate,
  WishlistClear,
} from './wishlist.actions';

export interface WishlistState {
  items: any[];
}

const STORAGE_KEY = 'wishlist_state';

function loadFromStorage(): WishlistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    return JSON.parse(raw) as WishlistState;
  } catch {
    return { items: [] };
  }
}

export const initialWishlist: WishlistState = loadFromStorage();

export const wishlistReducer = createReducer(
  initialWishlist,
  on(WishlistAdd, (s, { product }) => {
    const exists = s.items.find((x) => x.id === product.id);
    if (exists) return s;
    const next = { ...s, items: [...s.items, product] };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    return next;
  }),
  on(WishlistRemove, (s, { productId }) => {
    const next = { ...s, items: s.items.filter((x) => x.id !== productId) };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    return next;
  }),
  on(WishlistToggle, (s, { product }) => {
    const exists = s.items.find((x) => x.id === product.id);
    const next = exists
      ? { ...s, items: s.items.filter((x) => x.id !== product.id) }
      : { ...s, items: [...s.items, product] };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    return next;
  }),
  on(WishlistHydrate, (s, { items }) => ({ ...s, items: items || [] })),
  on(WishlistClear, (s) => ({ ...s, items: [] })),
);
