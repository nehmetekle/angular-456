import { createReducer, on } from '@ngrx/store';
import { CartAction } from './cart.actions';
import { CartState } from './cart.state';

const initialState: CartState = { items: [], totalPrice: 0, count: 0 };

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
);
