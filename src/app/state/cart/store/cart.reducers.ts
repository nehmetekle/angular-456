import { createReducer, on } from '@ngrx/store';
import { CartAction } from './cart.actions';
import { CartState } from './cart.state';

function loadInitialState(): CartState {
  try {
    const raw = localStorage.getItem('cart_state');
    if (!raw) return { items: [], totalPrice: 0, count: 0 };
    const parsed = JSON.parse(raw);
    // basic validation
    if (!parsed || typeof parsed !== 'object') return { items: [], totalPrice: 0, count: 0 };
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      totalPrice: Number(parsed.totalPrice) || 0,
      count: Number(parsed.count) || 0,
    };
  } catch (e) {
    return { items: [], totalPrice: 0, count: 0 };
  }
}

const initialState: CartState = loadInitialState();

function computeTotals(items: any[]) {
  const count = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const totalPrice = +items
    .reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 0), 0)
    .toFixed(2);
  return { count, totalPrice };
}

export const cartReducer = createReducer(
  initialState,
  on(CartAction.addItem, (state, { product, quantity }) => {
    const q = Number(quantity || 1);
    const items = [...(state.items || [])];
    const idx = items.findIndex((i) => i.product?.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + q };
    } else {
      items.push({ product, quantity: q });
    }
    const totals = computeTotals(items);
    return { ...state, items, count: totals.count, totalPrice: totals.totalPrice };
  }),

  on(CartAction.removeItem, (state, { productId }) => {
    const items = (state.items || []).filter((i) => i.product?.id !== productId);
    const totals = computeTotals(items);
    return { ...state, items, count: totals.count, totalPrice: totals.totalPrice };
  }),

  on(CartAction.updateQuantity, (state, { productId, quantity }) => {
    const items = (state.items || [])
      .map((i) => (i.product?.id === productId ? { ...i, quantity: Number(quantity) } : i))
      .filter((i) => i.quantity > 0);
    const totals = computeTotals(items);
    return { ...state, items, count: totals.count, totalPrice: totals.totalPrice };
  }),
  on(CartAction.clearCart, () => initialState),

  // Replace entire cart state (used for hydration across tabs / restore)
  on(CartAction.hydrateCart, (_state, { cartState }) => {
    try {
      if (!cartState) return initialState;
      // basic shape normalization
      const items = Array.isArray(cartState.items) ? cartState.items : [];
      const totalPrice = Number(cartState.totalPrice) || 0;
      const count = Number(cartState.count) || 0;
      return { items, totalPrice, count };
    } catch (e) {
      return initialState;
    }
  }),
);
