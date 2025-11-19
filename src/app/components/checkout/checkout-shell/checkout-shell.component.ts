import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectCartItems,
  selectCartTotal,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartCoupon,
} from '../../../state/cart/store/cart.selectors';
import { selectCartTotalExcludingShipping, selectCartShipping } from '../../../state/cart/store/cart.selectors';
import { selectShippingMethod } from '../../../state/cart/store/cart.selectors';
import { CartAction } from '../../../state/cart/store/cart.actions';
import { ToastService } from '../../../services/toast.service';
import { Actions, ofType } from '@ngrx/effects';
import { CartAction as CActions } from '../../../state/cart/store/cart.actions';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-checkout-shell',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-shell.component.html',
  styleUrls: ['./checkout-shell.component.css'],
})
export class CheckoutShellComponent {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private router = inject(Router);

  step = 1;
  items$: Observable<any[]> = this.store.select(selectCartItems);
  subtotal$: Observable<number> = this.store.select(selectCartSubtotal);
  discount$: Observable<number> = this.store.select(selectCartDiscount);
  total$: Observable<number> = this.store.select(selectCartTotal);
  totalExShipping$: Observable<number> = this.store.select(selectCartTotalExcludingShipping);
  shipping$: Observable<number> = this.store.select(selectCartShipping);
  coupon$ = this.store.select(selectCartCoupon);

  // Simple address model (template-driven)
  address: any = { name: '', line1: '', city: '', postal: '', country: '' };

  // coupon input
  couponCode = '';
  // shipping options (will be updated from validate response but provide defaults)
  shippingOptions = [
    { id: 'standard', name: 'Standard', price: 0 },
    { id: 'express', name: 'Express (2-3 days)', price: 8.9 },
    { id: 'priority', name: 'Priority (next day)', price: 12.9 },
  ];
  selectedShipping: string = 'standard';
  lastSummary: any = null;
  isValidating = false;
  hasUnavailable = false;

  constructor() {
    // try to prefill address from localStorage
    try {
      const raw = localStorage.getItem('checkout_address');
      if (raw) {
        const saved = JSON.parse(raw);
        this.address = { ...this.address, ...saved };
      }
    } catch (e) {
      // ignore
    }
    // validation state initialized in class fields

    // (validation listeners attached after initial dispatch)

    // restore selected shipping method from store if present
    this.store.select(selectShippingMethod).pipe(take(1)).subscribe((m) => {
      if (m) this.selectedShipping = m;
    });

    // initial validate to ensure UI reflects server totals
    let currentItems: any[] = [];
    this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));
    let coupon: any = null;
    this.coupon$.pipe(take(1)).subscribe((c) => (coupon = c));
    this.store.dispatch(
      CartAction.validateCart({ items: currentItems, coupon: coupon?.code, shippingMethod: this.selectedShipping }),
    );

    // track validation lifecycle and results to update UI immediately
    this.actions$.pipe(ofType(CActions.validateCart)).subscribe(() => {
      this.isValidating = true;
    });

    this.actions$.pipe(ofType(CActions.validateCartSuccess)).subscribe(({ summary }: any) => {
      this.isValidating = false;
      this.lastSummary = summary;
      this.hasUnavailable = Array.isArray(summary?.items) && summary.items.some((i: any) => !i.available);
      if (summary?.shipping_options) this.shippingOptions = summary.shipping_options;
      if (summary?.coupon?.code) this.couponCode = summary.coupon.code;
    });

    this.actions$.pipe(ofType(CActions.validateCartFailure)).subscribe(() => {
      this.isValidating = false;
    });
  }
  private toast = inject(ToastService);

  processing = false;
  orderResult: any = null;

  next() {
    if (this.step < 3) this.step++;
  }

  back() {
    if (this.step > 1) this.step--;
  }

  goToShop() {
    // navigate to products listing
    try {
      this.router.navigate(['/app/shop/products']);
    } catch (e) {
      // fallback: set step to 1
      this.step = 1;
    }
  }

  isUnavailable(productId: number) {
    try {
      return (
        !!this.lastSummary &&
        Array.isArray(this.lastSummary.items) &&
        this.lastSummary.items.some((x: any) => x.product_id === productId && !x.available)
      );
    } catch (e) {
      return false;
    }
  }

  applyCoupon() {
    // dispatch coupon application and re-validate cart totals with coupon
    this.store.dispatch(CartAction.applyCoupon({ code: String(this.couponCode || '').trim() }));
    // show toast (optimistic)
    try {
      this.toast.show(`Applied coupon ${this.couponCode}`);
    } catch (e) {}
    let currentItems: any[] = [];
    this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));
    this.store.dispatch(
      CartAction.validateCart({ items: currentItems, coupon: this.couponCode || undefined, shippingMethod: this.selectedShipping }),
    );
  }

  removeCoupon() {
    this.couponCode = '';
    this.store.dispatch(CartAction.removeCoupon());
    try {
      this.toast.show(`Removed coupon`);
    } catch (e) {}
    let currentItems: any[] = [];
    this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));
    this.store.dispatch(CartAction.validateCart({ items: currentItems, shippingMethod: this.selectedShipping }));
  }

  // when user selects shipping option, persist it and re-validate totals
  shippingChanged() {
    this.store.dispatch(CartAction.setShippingMethod({ method: this.selectedShipping || 'standard' }));
    let currentItems: any[] = [];
    this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));
    this.store.dispatch(
      CartAction.validateCart({ items: currentItems, coupon: this.couponCode || undefined, shippingMethod: this.selectedShipping }),
    );
  }

  confirmOrder() {
    // First, validate current cart on the server (will also return up-to-date totals)
    this.processing = true;
    let currentItems: any[] = [];
    this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));

    // dispatch validation with coupon and shipping method
    this.store.dispatch(
      CartAction.validateCart({ items: currentItems, coupon: this.couponCode || undefined, shippingMethod: this.selectedShipping }),
    );

    // wait for validate result, then if all items available create the order
    this.actions$.pipe(ofType(CActions.validateCartSuccess), take(1)).subscribe(({ summary }: any) => {
      // check for unavailable items
      const unavailable = (summary.items || []).some((i: any) => !i.available);
      if (unavailable) {
        // show toast + stop
        try {
          this.toast.show('Some items are unavailable or exceed stock. Adjust your cart.');
        } catch (e) {}
        this.processing = false;
        return;
      }

      // build order payload from validated data (prefer server amounts)
      const payload: any = { items: currentItems, address: this.address };
      if (summary?.coupon?.code) payload.coupon = summary.coupon.code;
      else if (this.couponCode) payload.coupon = this.couponCode;
      if (this.selectedShipping) payload.shippingMethod = this.selectedShipping;

      // dispatch createOrder
      this.store.dispatch(CartAction.createOrder({ payload }));

      // wait for create result
      this.actions$.pipe(ofType(CActions.createOrderSuccess), take(1)).subscribe(({ order }) => {
        this.processing = false;
        this.orderResult = order;
        this.step = 3;
        // clear cart and persist
        this.store.dispatch(CartAction.clearCart());
        try {
          localStorage.setItem('checkout_address', JSON.stringify(this.address));
        } catch (e) {
          // ignore
        }
        try {
          this.toast.show(`Order ${order.id} confirmed`);
        } catch (e) {}
      });

      this.actions$.pipe(ofType(CActions.createOrderFailure), take(1)).subscribe(({ error }: any) => {
        this.processing = false;
        try {
          this.toast.show('Failed to place order. Please try again.');
        } catch (e) {}
        this.orderResult = null;
      });
    });

    // handle validation failure
    this.actions$.pipe(ofType(CActions.validateCartFailure), take(1)).subscribe(() => {
      this.processing = false;
      try {
        this.toast.show('Failed to validate cart. Please try again.');
      } catch (e) {}
    });
  }
}
