import type { Meta, StoryObj } from '@storybook/angular';
import { of } from 'rxjs';
import { moduleMetadata } from '@storybook/angular';

import { LoginPageComponent } from '../app/components/auth/login-page/login-page.component';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading } from '../app/state/auth/store/auth.selectors';
import { ButtonComponent } from './button.component';
import { fn } from 'storybook/test';

const mockStoreValue: any = {
  select: (sel: any) => {
    if (sel === selectAuthError) return of(null);
    if (sel === selectAuthLoading) return of(false);
    return of(null);
  },
  dispatch: () => {},
};

const meta: Meta<any> = {
  title: 'Auth/Login Page',
  component: LoginPageComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [{ provide: Store, useValue: mockStoreValue }],
      imports: [ButtonComponent],
    }),
  ],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: {
    size: 'medium',
    onLogout: fn(),
    label: 'Log out',
  },
};

export default meta;
type Story = StoryObj<any>;

export const Empty: Story = {};

export const InvalidEmail: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement as HTMLElement;
    const username = root.querySelector('input#username') as HTMLInputElement | null;
    const password = root.querySelector('input#password') as HTMLInputElement | null;
    if (username) {
      username.value = 'not-an-email';
      username.dispatchEvent(new Event('input'));
      username.dispatchEvent(new Event('blur'));
    }
    if (password) {
      password.value = 'validpass';
      password.dispatchEvent(new Event('input'));
      password.dispatchEvent(new Event('blur'));
    }
  },
};

export const ShortPassword: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement as HTMLElement;
    const username = root.querySelector('input#username') as HTMLInputElement | null;
    const password = root.querySelector('input#password') as HTMLInputElement | null;
    if (username) {
      username.value = 'user@example.com';
      username.dispatchEvent(new Event('input'));
      username.dispatchEvent(new Event('blur'));
    }
    if (password) {
      password.value = '123';
      password.dispatchEvent(new Event('input'));
      password.dispatchEvent(new Event('blur'));
    }
  },
};

export const SubmitValid: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement as HTMLElement;
    const username = root.querySelector('input#username') as HTMLInputElement | null;
    const password = root.querySelector('input#password') as HTMLInputElement | null;
    const button = root.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (username) {
      username.value = 'user@example.com';
      username.dispatchEvent(new Event('input'));
    }
    if (password) {
      password.value = 'password123';
      password.dispatchEvent(new Event('input'));
    }
    if (button) button.click();
  },
};

export const Logout: Story = {
  render: (args) => ({
    template:
      '<storybook-button [size]="size" [label]="label" (onClick)="onLogout($event)"></storybook-button>',
    props: args,
  }),
};
