import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '../service/product.service';
import { ProductsAction } from './products.actions';
import { mergeMap, map, catchError, of, tap } from 'rxjs';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.loadProducts),
      mergeMap(({ page, pageSize, minRating, ordering }) =>
        this.productService.getProducts({ page, pageSize, minRating, ordering }).pipe(
          map((response: any) =>
            ProductsAction.loadProductsSuccess({
              data: response.results ?? response,
              count: response.count,
            }),
          ),
          catchError((error) => of(ProductsAction.loadProductsFailure({ error }))),
        ),
      ),
    ),
  );

  // When a product is selected, fetch its rating
  selectProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.selectProduct),
      mergeMap(({ id }) =>
        this.productService.getRating(id).pipe(
          map((res: any) =>
            ProductsAction.loadRatingSuccess({
              id,
              rating: res.avg_rating ?? res.rating ?? (typeof res === 'number' ? res : res),
            }),
          ),
          catchError((error) => of(ProductsAction.loadRatingFailure({ error }))),
        ),
      ),
    ),
  );
}
