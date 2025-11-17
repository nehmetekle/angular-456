import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthAction } from '../../../state/auth/store/auth.actions';
import { loginModel } from '../../../state/auth/models/login.model';
import { Observable } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../../state/auth/store/auth.selectors';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  form!: FormGroup;
  error$!: Observable<any>;
  loading$!: Observable<boolean>;

  private store = inject(Store);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: [this.loginFormValidator] },
    );
    this.error$ = this.store.select(selectAuthError);
    this.loading$ = this.store.select(selectAuthLoading);
  }

  onFocus(controlName: string) {
    const c = this.form.get(controlName);
    if (c) {
      // mark as touched on focus so errors show as soon as user clicks the field
      c.markAsTouched();
    }
  }

  getErrorMessage(err: any): string {
    if (!err) return '';
    if (typeof err === 'string') return err;
    if (err && (err as any).detail) return (err as any).detail;
    return 'Login failed';
  }

  private loginFormValidator(control: AbstractControl): ValidationErrors | null {
    const username = control.get('username')?.value as string | undefined;
    const password = control.get('password')?.value as string | undefined;
    const errors: any = {};

    if (username && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      errors.invalidEmail = true;
    }

    if (password && password.length > 0 && password.length < 6) {
      errors.passwordTooShort = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  submit() {
    if (this.form.valid) {
      const user = this.form.value as loginModel;
      this.store.dispatch(AuthAction.login({ user }));
    } else {
      this.form.markAllAsTouched();
    }
  }
}
