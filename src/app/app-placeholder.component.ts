import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated } from './state/auth/store/auth.selectors';
import { AuthAction } from './state/auth/store/auth.actions';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastHostComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';
import { selectAuthLoading } from './state/auth/store/auth.selectors';
import { selectCartCount } from './state/cart/store/cart.selectors';
import { selectWishlistCount } from './state/wishlist/store/wishlist.selectors';
import { CartSyncService } from './state/cart/service/cart-sync.service';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [CommonModule, RouterModule, MatButtonModule, MatProgressBarModule, ToastHostComponent],
  templateUrl: './app-placeholder.component.html',
  styleUrls: ['./app-placeholder.components.css'],
})
export class AppPlaceholderComponent {
  private store = inject(Store);
  private router = inject(Router);
  cartPulse = false;
  // instantiate CartSyncService to enable cross-tab hydration listener
  private cartSync = inject(CartSyncService);
  // provide toast service to children via DI

  isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  isLoading$: Observable<boolean> = this.store.select(selectAuthLoading);
  cartCount$: Observable<number> = this.store.select(selectCartCount);
  wishlistCount$: Observable<number> = this.store.select(selectWishlistCount as any);

  constructor() {
    // pulse the cart badge when the count changes
    let prev = -1;
    this.cartCount$.subscribe((n) => {
      if (prev !== -1 && n !== prev) {
        this.cartPulse = true;
        setTimeout(() => (this.cartPulse = false), 380);
      }
      prev = n;
    });
  }

  logout() {
    this.store.dispatch(AuthAction.logout());
    // navigate home to avoid protected routes
    this.router.navigate(['/app']);
  }
}
