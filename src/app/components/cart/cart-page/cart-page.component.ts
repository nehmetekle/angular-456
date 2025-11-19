import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  selectCartItems,
  selectCartTotal,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartCoupon,
} from '../../../state/cart/store/cart.selectors';
import { CartAction } from '../../../state/cart/store/cart.actions';
import { ProductsAction } from '../../../state/products/store/products.actions';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent {
  private store = inject(Store);
  private router = inject(Router);
  private toast = inject(ToastService);
  items$: Observable<any[]> = this.store.select(selectCartItems);
  subtotal$: Observable<number> = this.store.select(selectCartSubtotal);
  discount$: Observable<number> = this.store.select(selectCartDiscount);
  total$: Observable<number> = this.store.select(selectCartTotal);
  coupon$ = this.store.select(selectCartCoupon);
  // animation tracking
  animatingIds = new Set<number>();
  removingIds = new Set<number>();

  constructor() {
    // subscribe to items changes to detect added/removed items and trigger CSS animations
    let prev: any[] = [];
    this.items$.subscribe((next) => {
      const prevIds = new Set(prev.map((i) => i.product?.id));
      const nextIds = new Set((next || []).map((i) => i.product?.id));

      // additions
      (next || [])
        .filter((i) => !prevIds.has(i.product?.id))
        .forEach((i) => {
          const id = i.product?.id;
          if (!id) return;
          this.animatingIds.add(id);
          setTimeout(() => this.animatingIds.delete(id), 400);
        });

      // removals - trigger a quick leave animation by marking id, it will be removed from DOM soon
      prev
        .filter((i) => !nextIds.has(i.product?.id))
        .forEach((i) => {
          const id = i.product?.id;
          if (!id) return;
          this.animatingIds.add(id);
          setTimeout(() => this.animatingIds.delete(id), 400);
        });

      prev = (next || []).slice();
    });
  }

  remove(productId: number) {
    // play removal animation, then dispatch the remove action
    if (this.removingIds.has(productId)) return;
    this.removingIds.add(productId);
    // allow CSS animation to run before removing from store
    setTimeout(() => {
      // find item quantity, restore stock, then remove
      let currentItems: any[] = [];
      this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));
      const it = currentItems.find((x) => x.product?.id === productId);
      const qty = it ? Number(it.quantity || 0) : 0;
      if (qty > 0) this.store.dispatch(ProductsAction.adjustStock({ productId, delta: qty }));
      this.store.dispatch(CartAction.removeItem({ productId }));
      try {
        this.toast.show('Removed from cart');
      } catch {}
      this.removingIds.delete(productId);
    }, 320);
  }

  updateQuantity(productId: number, quantity: any) {
    const q = Number(quantity) || 0;
    if (q <= 0) return;
    // compute previous quantity and adjust stock accordingly
    let currentItems: any[] = [];
    this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));
    const existing = currentItems.find((x) => x.product?.id === productId);
    const prev = existing ? Number(existing.quantity || 0) : 0;
    const stockDelta = prev - q; // positive -> restore stock, negative -> reserve more
    if (stockDelta !== 0)
      this.store.dispatch(ProductsAction.adjustStock({ productId, delta: stockDelta }));
    this.store.dispatch(CartAction.updateQuantity({ productId, quantity: q }));
    try {
      this.toast.show('Cart updated');
    } catch {}
  }

  proceedToCheckout() {
    // navigate to checkout — validation will run there
    this.router.navigate(['/app/shop/checkout']);
  }
}
