import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from './cart-item.component';

const product = { id: 42, name: 'Ceramic Mug', price: 12.5, image: '/assets/avif-test-image.avif' };

const meta: Meta<any> = {
  title: 'Cart/Cart Item',
  component: CartItemComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {
  args: { product, quantity: 1 },
};

export const QuantityTwo: Story = {
  args: { product, quantity: 2 },
};
