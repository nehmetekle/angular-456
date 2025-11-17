import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { LoginPageComponent } from './components/auth/login-page/login-page.component';
import { ProductsPageComponent } from './components/products/products-page/products-page.component';
import { ProductRatingPageComponent } from './components/products/product-rating-page/product-rating-page.component';

export const routes: Routes = [
//   { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  // { path: 'app', component: AppPlaceholderComponent },
  // { path: '**', redirectTo: '' },
{ path: '', component: AppPlaceholderComponent, children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'shop/products', component: ProductsPageComponent },
      { path: 'shop/rating', component: ProductRatingPageComponent },
      // { path: '', redirectTo: 'shop/products', pathMatch: 'full' }
    ]
  },

];
