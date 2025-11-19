import type { Meta, StoryObj } from '@storybook/angular';
import { ProductDetailsStoryComponent } from './product-details-story.component';

const meta: Meta<any> = {
  title: 'Products/Product Details',
  component: ProductDetailsStoryComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {
  args: {
    product: {
      id: 12,
      name: 'Deluxe Notebook',
      description: 'A premium notebook for notes and sketches.',
      price: 24.5,
      image: '/assets/avif-test-image.avif',
    },
  },
};

export const OnSale: Story = {
  args: {
    product: {
      id: 13,
      name: 'Limited Mug',
      description: 'Special edition mug.',
      price: 9.99,
      image: '/assets/avif-test-image.avif',
    },
  },
};
