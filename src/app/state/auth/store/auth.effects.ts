import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../service/auth.service';
import { AuthAction } from './auth.actions';
import { mergeMap, map, catchError, of } from 'rxjs';

@Injectable()
export class AuthEffects {
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

  constructor(
    private actions$: Actions,
    private authService: AuthService,
  ) {}
}
