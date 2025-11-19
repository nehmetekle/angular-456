import { createAction, props } from '@ngrx/store';
import { Product } from '../../products/models/product.model';

export abstract class CartAction {
  static addItem = createAction(
    '[Cart] Add Item',
    props<{ product: Product; quantity?: number }>(),
  );

  static removeItem = createAction('[Cart] Remove Item', props<{ productId: number }>());

  static updateQuantity = createAction(
    '[Cart] Update Quantity',
    props<{ productId: number; quantity: number }>(),
  );

  static clearCart = createAction('[Cart] Clear Cart');

  static validateCart = createAction('[Cart] Validate Cart', props<{ items: any[] }>());
  static validateCartSuccess = createAction(
    '[Cart] Validate Cart Success',
    props<{ summary: any }>(),
  );
  static validateCartFailure = createAction(
    '[Cart] Validate Cart Failure',
    props<{ error: any }>(),
  );

  static createOrder = createAction('[Cart] Create Order', props<{ payload: any }>());
  static createOrderSuccess = createAction('[Cart] Create Order Success', props<{ order: any }>());
  static createOrderFailure = createAction('[Cart] Create Order Failure', props<{ error: any }>());
}
