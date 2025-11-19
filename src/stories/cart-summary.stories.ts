import type { Meta, StoryObj } from '@storybook/angular';
import { CartSummaryComponent } from './cart-summary.component';

const meta: Meta<any> = {
  title: 'Cart/Summary',
  component: CartSummaryComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {
  args: { subtotal: 89.9, discount: 10, tax: 15.98, shipping: 4.9 },
};

export const FreeShipping: Story = {
  args: { subtotal: 120, discount: 20, tax: 16, shipping: 0 },
};
