import { cartReducer } from './cart.reducers';
import { CartAction } from './cart.actions';

describe('cartReducer basic', () => {
  it('adds items and computes subtotal', () => {
    const product: any = { id: 999, name: 'Test', price: 10 };
    let state: any = cartReducer(undefined as any, { type: '[Init]' } as any);
    state = cartReducer(state, CartAction.addItem({ product, quantity: 2 }));
    expect(state.subtotal).toBeCloseTo(20);
    expect(state.count).toBe(2);
  });

  it('applies coupon and validate success updates totals', () => {
    const initial: any = {
      items: [{ product: { id: 1, price: 5 }, quantity: 1 }],
      subtotal: 5,
      discount: 0,
      totalPrice: 5,
    };
    const summary = {
      subtotal: 5,
      discounts: 1,
      total: 4,
      coupon: { code: 'SAVE20', percent: 20 },
    };
    const state = cartReducer(initial, CartAction.validateCartSuccess({ summary }));
    expect(state.discount).toBe(1);
    expect(state.totalPrice).toBe(4);
    expect(state.coupon.code).toBe('SAVE20');
  });
});
