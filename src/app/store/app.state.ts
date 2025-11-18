import { AuthState } from '../state/auth/store/auth.state';
import { ProductsState } from '../state/products/store/products.state';

export interface AppState {
  auth: AuthState;
  products: ProductsState;
}
