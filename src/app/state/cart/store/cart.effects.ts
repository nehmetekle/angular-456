import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartAction } from './cart.actions';
import { CartService } from '../service/cart.service';
import { mergeMap, map, catchError, of, tap, take, debounceTime } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCartState } from './cart.selectors';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private store = inject(Store);

  validateCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartAction.validateCart),
      mergeMap(({ items, coupon, shippingMethod }: any) =>
        this.cartService.validateCart({ items, coupon, shippingMethod }).pipe(
          map((res: any) => CartAction.validateCartSuccess({ summary: res })),
          catchError((error) => of(CartAction.validateCartFailure({ error }))),
        ),
      ),
    ),
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartAction.createOrder),
      mergeMap(({ payload }) =>
        this.cartService.createOrder(payload).pipe(
          map((res: any) => CartAction.createOrderSuccess({ order: res })),
          catchError((error) => of(CartAction.createOrderFailure({ error }))),
        ),
      ),
    ),
  );

  // Persist cart to localStorage on local modifications (store full cart state)
  persistCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartAction.addItem,
          CartAction.removeItem,
          CartAction.updateQuantity,
          CartAction.clearCart,
          CartAction.applyCoupon,
          CartAction.removeCoupon,
          CartAction.setShippingMethod,
          CartAction.validateCartSuccess,
        ),
        debounceTime(200),
        mergeMap(() =>
          this.store.select(selectCartState).pipe(
            take(1),
            tap((state) => {
              try {
                localStorage.setItem('cart_state', JSON.stringify(state));
              } catch (e) {
                // ignore
              }
            }),
          ),
        ),
      ),
    { dispatch: false },
  );
}
