import type { Meta, StoryObj } from '@storybook/angular';
import { BehaviorSubject, of } from 'rxjs';
import { moduleMetadata } from '@storybook/angular';

import { ProductRatingPageComponent } from '../app/components/products/product-rating-page/product-rating-page.component';
import { Store } from '@ngrx/store';
import { ProductsAction } from '../app/state/products/store/products.actions';
import { products as MOCK_PRODUCTS } from '../mocks/data';

const rating$ = new BehaviorSubject<number | null>(null);
const loading$ = new BehaviorSubject<boolean>(false);
const error$ = new BehaviorSubject<any>(null);

const mockStoreValue: any = {
  select: (sel: any) => {
    // selectors in this component: selectSelectedRating, selectProductsLoading, selectProductsError
    if (sel && sel === ({} as any)) return of(null);
    // fallback by comparing imports is fragile; just return appropriate streams when component subscribes
    const name = sel && (sel.name || '').toString();
    if (name && /SelectedRating/i.test(name)) return rating$.asObservable();
    if (name && /ProductsLoading/i.test(name)) return loading$.asObservable();
    if (name && /ProductsError/i.test(name)) return error$.asObservable();
    return of(null);
  },
  dispatch: (action: any) => {
    if (action && typeof action === 'object' && 'id' in action) {
      loading$.next(true);
      setTimeout(() => {
        const id = Number((action as any).id);
        const p = MOCK_PRODUCTS.find((x: any) => x.id === id) as any | undefined;
        const ratings = (p && (p.ratings as unknown[])) || [];
        const computed = ratings.length
          ? Math.round(
              (ratings as number[]).reduce((a, b) => (a as number) + (b as number), 0) /
                ratings.length,
            )
          : 4;
        rating$.next(computed);
        loading$.next(false);
      }, 50);
    }
  },
};

const meta: Meta<any> = {
  title: 'Products/Product Rating',
  component: ProductRatingPageComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [{ provide: Store, useValue: mockStoreValue }],
    }),
  ],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: { size: 'medium' },
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {};

export const FetchExistingProduct: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement as HTMLElement;
    const size = args?.['size'] ?? 'medium';
    const input = root.querySelector('input[name="productId"]') as HTMLInputElement | null;
    const submit = root.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const id = MOCK_PRODUCTS && MOCK_PRODUCTS.length ? String(MOCK_PRODUCTS[0].id) : '1';
    if (input) {
      input.value = id;
      input.dispatchEvent(new Event('input'));
    }
    if (submit) {
      submit.classList.remove(
        'storybook-button--small',
        'storybook-button--medium',
        'storybook-button--large',
      );
      submit.classList.add(`storybook-button--${size}`);
      submit.click();
    }
    await new Promise((r) => setTimeout(r, 80));
  },
};
