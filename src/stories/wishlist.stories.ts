import type { Meta, StoryObj } from '@storybook/angular';
import { WishlistStoryComponent } from './wishlist-story.component';

const sample = [
  { id: 1, name: 'Ceramic Mug', price: 12.5, image: '/assets/avif-test-image.avif' },
  { id: 2, name: 'Notebook', price: 9.99, image: '/assets/avif-test-image.avif' },
  { id: 3, name: 'Headphones', price: 59.9, image: '/assets/avif-test-image.avif' },
];

const meta: Meta<any> = {
  title: 'Wishlist/Page',
  component: WishlistStoryComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<any>;

export const Populated: Story = {
  args: { items: sample },
};

export const Empty: Story = {
  args: { items: [] },
};
