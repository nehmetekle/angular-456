import { Product } from '../../products/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items?: CartItem[];
  totalPrice?: number;
  count?: number;
}
