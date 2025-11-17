import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated } from './state/auth/store/auth.selectors';
import { AuthAction } from './state/auth/store/auth.actions';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { selectAuthLoading } from './state/auth/store/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [CommonModule, RouterModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './app-placeholder.component.html',
  styleUrls: ['./app-placeholder.components.css'],
})
export class AppPlaceholderComponent {
  private store = inject(Store);
  private router = inject(Router);

  isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  isLoading$: Observable<boolean> = this.store.select(selectAuthLoading);

  logout() {
    this.store.dispatch(AuthAction.logout());
    // navigate home to avoid protected routes
    this.router.navigate(['/app']);
  }
}
