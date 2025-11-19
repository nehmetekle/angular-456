import { Product } from '../../products/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items?: CartItem[];
  // raw subtotal before discounts/tax/shipping
  subtotal?: number;
  // discount amount applied (absolute value)
  discount?: number;
  // total after discounts + tax + shipping
  totalPrice?: number;
  // tax amount
  tax?: number;
  // shipping cost
  shipping?: number;
  // shipping options returned by validator
  shipping_options?: Array<{ id: string; name: string; price: number }> | null;
  count?: number;
  // coupon applied (if any)
  coupon?: { code?: string; percent?: number } | null;
  // selected shipping method id (e.g. 'standard' | 'express')
  shippingMethod?: string | null;
}
