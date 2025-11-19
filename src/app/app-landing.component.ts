import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { selectIsAuthenticated } from './state/auth/store/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-landing',
  templateUrl: './app-landing.component.html',
  styleUrls: ['./app-placeholder.components.css'],
  imports: [RouterModule, CommonModule],
})
export class AppLandingComponent {
  private router = inject(Router);
  private store = inject(Store);

  goToShop() {
    this.store.select(selectIsAuthenticated).pipe(take(1)).subscribe((auth) => {
      if (auth) {
        this.router.navigate(['/app/shop/products']);
      } else {
        this.router.navigate(['/app/login']);
      }
    });
  }
}
