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
      subtotal: Number(parsed.subtotal) || 0,
      discount: Number(parsed.discount) || 0,
      totalPrice: Number(parsed.totalPrice) || 0,
      count: Number(parsed.count) || 0,
      coupon: parsed.coupon || null,
    };
  } catch (e) {
    return { items: [], subtotal: 0, discount: 0, totalPrice: 0, count: 0, coupon: null };
  }
}

const initialState: CartState = loadInitialState();

function computeTotals(items: any[]) {
  const count = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const subtotal = +items
    .reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 0), 0)
    .toFixed(2);
  // by default no discounts/shipping/tax applied on client compute
  const discount = 0;
  const totalPrice = subtotal - discount;
  return { count, subtotal, discount, totalPrice };
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
    return {
      ...state,
      items,
      count: totals.count,
      subtotal: totals.subtotal,
      discount: totals.discount,
      totalPrice: totals.totalPrice,
    };
  }),

  on(CartAction.removeItem, (state, { productId }) => {
    const items = (state.items || []).filter((i) => i.product?.id !== productId);
    const totals = computeTotals(items);
    return {
      ...state,
      items,
      count: totals.count,
      subtotal: totals.subtotal,
      discount: totals.discount,
      totalPrice: totals.totalPrice,
    };
  }),

  on(CartAction.updateQuantity, (state, { productId, quantity }) => {
    const items = (state.items || [])
      .map((i) => (i.product?.id === productId ? { ...i, quantity: Number(quantity) } : i))
      .filter((i) => i.quantity > 0);
    const totals = computeTotals(items);
    return {
      ...state,
      items,
      count: totals.count,
      subtotal: totals.subtotal,
      discount: totals.discount,
      totalPrice: totals.totalPrice,
    };
  }),
  on(CartAction.clearCart, () => ({
    items: [],
    subtotal: 0,
    discount: 0,
    totalPrice: 0,
    count: 0,
    coupon: null,
  })),

  // Replace entire cart state (used for hydration across tabs / restore)
  on(CartAction.hydrateCart, (_state, { cartState }) => {
    try {
      if (!cartState) return initialState;
      // basic shape normalization
      const items = Array.isArray(cartState.items) ? cartState.items : [];
      const subtotal = Number(cartState.subtotal) || 0;
      const discount = Number(cartState.discount) || 0;
      const totalPrice = Number(cartState.totalPrice) || 0;
      const count = Number(cartState.count) || 0;
      const coupon = cartState.coupon || null;
      return {
        items,
        subtotal,
        discount,
        totalPrice,
        count,
        coupon,
        shippingMethod: cartState.shippingMethod || null,
      };
    } catch (e) {
      return initialState;
    }
  }),

  // Apply coupon locally (optimistic): compute discount from known codes
  on(CartAction.applyCoupon, (state, { code }) => {
    try {
      const items = state.items ?? [];
      const totals = computeTotals(items);
      // simple client-side coupon rules (mirror server mocks)
      const key = String(code || '')
        .trim()
        .toUpperCase();
      let percent = 0;
      if (key === 'SAVE10') percent = 0.1;
      else if (key === 'HALF') percent = 0.5;
      else if (key === 'FREESHIP') percent = 0; // handled server-side for shipping

      const discount = +(totals.subtotal * percent).toFixed(2);
      const totalPrice = +(totals.subtotal - discount).toFixed(2);
      return {
        ...state,
        coupon: { code: key, percent: percent * 100 },
        discount,
        subtotal: totals.subtotal,
        totalPrice,
      } as CartState;
    } catch (e) {
      return { ...state, coupon: { code } } as CartState;
    }
  }),
  on(CartAction.removeCoupon, (state) => {
    const items = state.items ?? [];
    const totals = computeTotals(items);
    return {
      ...state,
      coupon: null,
      discount: 0,
      subtotal: totals.subtotal,
      totalPrice: totals.totalPrice,
    } as CartState;
  }),

  on(CartAction.setShippingMethod, (state, { method }) => ({ ...state, shippingMethod: method })),

  // When backend returns validation summary, update totals and discounts
  on(CartAction.validateCartSuccess, (state, { summary }) => {
    try {
      return {
        ...state,
        // keep items as-is; assume summary corresponds
        subtotal: Number(summary.subtotal) || 0,
        discount: Number(summary.discounts) || 0,
        tax: Number(summary.tax) || 0,
        shipping: Number(summary.shipping) || 0,
        shipping_options: Array.isArray(summary.shipping_options)
          ? summary.shipping_options
          : state.shipping_options || null,
        totalPrice: Number(summary.total) || 0,
        // if backend reports applied coupon, persist it
        coupon: summary.coupon
          ? { code: summary.coupon.code, percent: summary.coupon.percent }
          : state.coupon || null,
      } as CartState;
    } catch (e) {
      return state;
    }
  }),
);
