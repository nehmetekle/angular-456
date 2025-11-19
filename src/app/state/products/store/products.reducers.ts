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
  on(ProductsAction.adjustStock, (state, { productId, delta }) => {
    try {
      const data = Array.isArray(state.data)
        ? state.data.map((p: any) => {
            if (p.id !== productId) return p;
            const current = Number(p.stock || 0);
            const next = Math.max(0, current + Number(delta || 0));
            return { ...p, stock: next };
          })
        : state.data;
      return { ...state, data };
    } catch (e) {
      return state;
    }
  }),
);
