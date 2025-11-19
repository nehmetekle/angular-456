import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model';

export abstract class ProductsAction {
  static loadProducts = createAction(
    '[Products] Load Products',
    props<{ page?: number; pageSize?: number; minRating?: number; ordering?: string }>(),
  );

  static loadProductsSuccess = createAction(
    '[Products] Load Products Success',
    props<{ data: Product[]; count?: number }>(),
  );

  static loadProductsFailure = createAction(
    '[Products] Load Products Failure',
    props<{ error: any }>(),
  );

  static selectProduct = createAction('[Products] Select Product', props<{ id: number }>());

  static loadRating = createAction('[Products] Load Rating', props<{ id: number }>());
  static loadRatingSuccess = createAction(
    '[Products] Load Rating Success',
    props<{ id: number; rating: number }>(),
  );
  static loadRatingFailure = createAction(
    '[Products] Load Rating Failure',
    props<{ error: any }>(),
  );

  // Adjust product stock (delta may be negative to reserve stock, positive to restore)
  static adjustStock = createAction(
    '[Products] Adjust Stock',
    props<{ productId: number; delta: number }>(),
  );
}
