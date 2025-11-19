/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    // Ici on accepte tout payload pour valider l'intégration front.
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({ ...p, _avg: avgRating(p.ratings) }))
      .filter((p) => p._avg >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),

  // Product detail: GET /api/products/:id/ -> full product details
  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });

    const detail = {
      ...p,
      avg_rating: avgRating(p.ratings),
      rating_count: p.ratings.length,
      description: `Description for ${p.name}`,
      images: [`/assets/${p.id}.jpg`],
      available: true,
    };

    return HttpResponse.json(detail, { status: 200 });
  }),

  // Cart validation: POST /api/cart/validate/ -> price summary
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    const items: Array<{ product_id: number; quantity: number }> = body?.items || [];

    const taxRate = 0.2; // 20% VAT
    const shippingThreshold = 50; // free shipping over 50
    const flatShipping = 4.9;

    const validatedItems = items.map((it) => {
      const p = products.find((x) => x.id === Number(it.product_id));
      const unit_price = p ? p.price : 0;
      const quantity = Number(it.quantity) || 0;
      const line_total = +(unit_price * quantity).toFixed(2);
      return {
        product_id: Number(it.product_id),
        name: p ? p.name : 'Unknown product',
        unit_price,
        quantity,
        line_total,
        available: Boolean(p),
      };
    });

    const subtotal = +validatedItems.reduce((s, i) => s + i.line_total, 0).toFixed(2);
    const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : flatShipping;
    const tax = +(+subtotal * taxRate).toFixed(2);
    const discounts = 0;
    const total = +(+subtotal + +tax + +shipping - +discounts).toFixed(2);

    return HttpResponse.json(
      {
        items: validatedItems,
        subtotal,
        discounts,
        shipping,
        tax,
        total,
      },
      { status: 200 },
    );
  }),

  // Order creation: POST /api/order/ -> order confirmation
  http.post(`${API}/order/`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    const items: Array<{ product_id: number; quantity: number }> = body?.items || [];

    // Reuse validation logic (lightweight)
    const validated = items.map((it) => {
      const p = products.find((x) => x.id === Number(it.product_id));
      const unit_price = p ? p.price : 0;
      const quantity = Number(it.quantity) || 0;
      return { unit_price, quantity, line_total: +(unit_price * quantity).toFixed(2) };
    });

    const subtotal = +validated.reduce((s, i) => s + i.line_total, 0).toFixed(2);
    const tax = +(+subtotal * 0.2).toFixed(2);
    const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 4.9;
    const total = +(+subtotal + +tax + +shipping).toFixed(2);

    const order = {
      id: `ORD-${Date.now()}`,
      status: 'confirmed',
      subtotal,
      tax,
      shipping,
      total,
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return HttpResponse.json(order, { status: 201 });
  }),
];
