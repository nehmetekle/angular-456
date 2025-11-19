import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCartItems, selectCartTotal } from '../../../state/cart/store/cart.selectors';
import { CartAction } from '../../../state/cart/store/cart.actions';
import { Actions, ofType } from '@ngrx/effects';
import { CartAction as CActions } from '../../../state/cart/store/cart.actions';
import { take } from 'rxjs/operators';

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

  step = 1;
  items$: Observable<any[]> = this.store.select(selectCartItems);
  total$: Observable<number> = this.store.select(selectCartTotal);

  // Simple address model (template-driven)
  address: any = { name: '', line1: '', city: '', postal: '', country: '' };

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
  }

  processing = false;
  orderResult: any = null;

  next() {
    if (this.step < 3) this.step++;
  }

  back() {
    if (this.step > 1) this.step--;
  }

  confirmOrder() {
    // dispatch create order with items + address
    this.processing = true;
    let currentItems: any[] = [];
    this.items$.pipe(take(1)).subscribe((it) => (currentItems = it || []));

    const payload = { items: currentItems, address: this.address };
    this.store.dispatch(CartAction.createOrder({ payload }));

    // Wait for success/failure
    this.actions$.pipe(ofType(CActions.createOrderSuccess), take(1)).subscribe(({ order }) => {
      this.processing = false;
      this.orderResult = order;
      this.step = 3;
      // optionally clear cart
      this.store.dispatch(CartAction.clearCart());
      // save address for future prefill
      try {
        localStorage.setItem('checkout_address', JSON.stringify(this.address));
      } catch (e) {
        // ignore
      }
    });

    this.actions$.pipe(ofType(CActions.createOrderFailure), take(1)).subscribe(() => {
      this.processing = false;
      // stay on step 2 and show an error (could be improved)
      // for now, set orderResult to null
      this.orderResult = null;
    });
  }
}
