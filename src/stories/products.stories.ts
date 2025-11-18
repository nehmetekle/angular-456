import type { Meta, StoryObj } from '@storybook/angular';
import { of } from 'rxjs';
import { moduleMetadata } from '@storybook/angular';

import { ProductsPageComponent } from '../app/components/products/products-page/products-page.component';
import { Store } from '@ngrx/store';
import {
  selectProductsData,
  selectProductsLoading,
  selectProductsError,
  selectProductsCount,
  selectSelectedProduct,
  selectSelectedRating,
} from '../app/state/products/store/products.selectors';
import { products as MOCK_PRODUCTS } from '../mocks/data';

const mockStoreValue: any = {
  select: (sel: any) => {
    if (sel === selectProductsData) return of(MOCK_PRODUCTS);
    if (sel === selectProductsLoading) return of(false);
    if (sel === selectProductsError) return of(null);
    if (sel === selectProductsCount) return of(MOCK_PRODUCTS.length);
    if (sel === selectSelectedProduct) return of(null);
    if (sel === selectSelectedRating) return of(null);
    return of(null);
  },
  dispatch: () => {},
};

const meta: Meta<any> = {
  title: 'Products/Products Page',
  component: ProductsPageComponent,
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

export const ShowFirstRating: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement as HTMLElement;
    const size = args?.['size'] ?? 'medium';
    const btn = root.querySelector('button');
    if (btn) {
      btn.classList.remove(
        'storybook-button--small',
        'storybook-button--medium',
        'storybook-button--large',
      );
      btn.classList.add(`storybook-button--${size}`);
      (btn as HTMLButtonElement).click();
    }
  },
};
