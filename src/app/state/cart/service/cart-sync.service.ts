import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartAction } from '../store/cart.actions';

@Injectable({ providedIn: 'root' })
export class CartSyncService {
  private store = inject(Store);

  constructor() {
    // listen for storage events in other tabs and hydrate cart when it changes
    if (typeof window !== 'undefined' && 'addEventListener' in window) {
      window.addEventListener('storage', (e: StorageEvent) => {
        if (!e.key) return;
        if (e.key !== 'cart_state') return;
        try {
          const newVal = e.newValue ? JSON.parse(e.newValue) : null;
          this.store.dispatch(CartAction.hydrateCart({ cartState: newVal }));
        } catch (err) {
          // ignore parse errors
        }
      });
    }
  }
}
