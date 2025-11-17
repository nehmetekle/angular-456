import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectAccess } from '../store/auth.selectors';
import { Observable, take, switchMap } from 'rxjs';
import { AuthAction } from '../store/auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private store = inject(Store);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectAccess).pipe(
      take(1),
      switchMap((access) => {
        if (access) {
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${access}` },
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      }),
    );
  }
}

export const provideAuthInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
