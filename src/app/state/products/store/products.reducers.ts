import { createReducer, on } from '@ngrx/store';
import { ProductsAction } from './products.actions';
import { ProductsState } from './products.state';

const initialState: ProductsState = {};

export const productsReducer = createReducer(
  initialState,
  on(ProductsAction.loadProducts, (state) => ({ ...state, loading: true })),
  on(ProductsAction.loadProductsSuccess, (state, { data, count }) => ({
    ...state,
    loading: false,
    data,
    count,
  })),
  on(ProductsAction.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductsAction.selectProduct, (state, { id }) => ({ ...state, selected: id })),
  on(ProductsAction.loadRatingSuccess, (state, { id, rating }) => ({
    ...state,
    rating,
    selected: id,
  })),
  on(ProductsAction.loadRatingFailure, (state, { error }) => ({ ...state, error })),
);
