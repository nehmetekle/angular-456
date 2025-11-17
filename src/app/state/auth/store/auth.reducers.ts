import { createReducer, on } from '@ngrx/store';
import { AuthAction } from './auth.actions';
import { AuthState } from './auth.state';

const initialState: AuthState = {};

export const authReducer = createReducer(
  initialState,
  on(AuthAction.login, (state) => ({ ...state, loading: true })),
  on(AuthAction.loginSuccess, (state, { access, refresh }) => ({
    ...state,
    loading: false,
    access,
    refresh,
  })),
  on(AuthAction.loginFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(AuthAction.refreshSuccess, (state, { access }) => ({ ...state, access })),
  on(AuthAction.logout, () => ({})),
);
