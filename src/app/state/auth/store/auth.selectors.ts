import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

const selectAuthFeature = createFeatureSelector<any>('auth');

export const selectAuthState = createSelector(selectAuthFeature, (s: AuthState) => s || {});
export const selectAccess = createSelector(selectAuthState, (s: any) => s.access);
export const selectRefresh = createSelector(selectAuthState, (s: any) => s.refresh);
export const selectIsAuthenticated = createSelector(selectAccess, (access) => !!access);
export const selectAuthLoading = createSelector(selectAuthState, (s: any) => !!s.loading);
export const selectAuthError = createSelector(selectAuthState, (s: any) => s.error ?? null);
