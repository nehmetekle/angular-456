import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authReducer } from './state/auth/store/auth.reducers';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AuthEffects } from './state/auth/store/auth.effects';
import { authInterceptor } from './state/auth/interceptors/auth.interceptor';
import { ProductsEffects } from './state/products/store/products.effects';
import { productsReducer } from './state/products/store/products.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer, products: productsReducer }),
    provideEffects([AuthEffects, ProductsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
  ],
};
