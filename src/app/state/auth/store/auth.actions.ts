import { createAction, props } from '@ngrx/store';
import { loginModel } from '../models/login.model';

export abstract class AuthAction {
  static login = createAction('[Auth] Login', props<{ user: loginModel }>());
  static loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ access: string; refresh: string }>(),
  );
  static loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());
  static refreshToken = createAction('[Auth] Refresh Token', props<{ refresh: string }>());
  static refreshSuccess = createAction('[Auth] Refresh Success', props<{ access: string }>());
}
