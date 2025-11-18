import { Product } from '../models/product.model';

export interface ProductsState {
  data?: Product[];
  count?: number;
  loading?: boolean;
  error?: any;
  selected?: number | null;
  rating?: number | null;
}
