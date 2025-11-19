import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartAction } from './cart.actions';
import { CartService } from '../service/cart.service';
import { mergeMap, map, catchError, of, tap } from 'rxjs';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);

  validateCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartAction.validateCart),
      mergeMap(({ items }) =>
        this.cartService.validateCart({ items }).pipe(
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

  // Persist cart to localStorage on local modifications
  persistCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartAction.addItem,
          CartAction.removeItem,
          CartAction.updateQuantity,
          CartAction.clearCart,
        ),
        tap((action) => {
          // read the latest cart from localStorage (or keep minimal representation)
          // here we just store the action for simplicity; real app should select and store full state
          try {
            const existing = JSON.parse(localStorage.getItem('cart') || '[]');
            // naive append - consumer should replace with actual state write
            localStorage.setItem('cart_actions', JSON.stringify(existing.concat([action])));
          } catch (e) {
            // ignore
          }
        }),
      ),
    { dispatch: false },
  );
}
