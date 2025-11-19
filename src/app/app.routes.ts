import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { AppLandingComponent } from './app-landing.component';
import { LoginPageComponent } from './components/auth/login-page/login-page.component';
import { ProductsPageComponent } from './components/products/products-page/products-page.component';
import { ProductRatingPageComponent } from './components/products/product-rating-page/product-rating-page.component';
import { AuthGuard } from './state/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  // { path: 'app', component: AppPlaceholderComponent },
  // { path: '**', redirectTo: '' },
  {
    path: 'app',
    component: AppPlaceholderComponent,
    children: [
      { path: '', component: AppLandingComponent },
      { path: 'login', component: LoginPageComponent },
      { path: 'shop/products', component: ProductsPageComponent, canActivate: [AuthGuard] },
      {
        path: 'shop/products/:id',
        loadComponent: () =>
          import('./components/products/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'shop/cart',
        loadComponent: () =>
          import('./components/cart/cart-page/cart-page.component').then(
            (m) => m.CartPageComponent,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'shop/checkout',
        loadComponent: () =>
          import('./components/checkout/checkout-shell/checkout-shell.component').then(
            (m) => m.CheckoutShellComponent,
          ),
        canActivate: [AuthGuard],
      },
      { path: 'shop/rating', component: ProductRatingPageComponent, canActivate: [AuthGuard] },
      // { path: '', redirectTo: 'shop/products', pathMatch: 'full' }
    ],
  },
];
