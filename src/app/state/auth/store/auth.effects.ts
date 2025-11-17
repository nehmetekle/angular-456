import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../service/auth.service';
import { AuthAction } from './auth.actions';
import { mergeMap, map, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.login),
      mergeMap((response) =>
        this.authService.login(response.user).pipe(
          map((tokens) =>
            AuthAction.loginSuccess({ access: tokens.access, refresh: tokens.refresh }),
          ),
          catchError((error) => of(AuthAction.loginFailure({ error }))),
        ),
      ),
    ),
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.refreshToken),
      mergeMap(({ refresh }) =>
        this.authService.refresh(refresh).pipe(
          map((response) => AuthAction.refreshSuccess({ access: response.access })),
          catchError((error) => of(AuthAction.loginFailure({ error }))),
        ),
      ),
    ),
  );

  // Navigate to the products page after a successful login
  loginSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthAction.loginSuccess),
        tap(() => this.router.navigate(['/app', 'shop', 'products'])),
      ),
    { dispatch: false },
  );
}
