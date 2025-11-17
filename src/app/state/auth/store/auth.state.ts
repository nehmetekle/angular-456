import { AuthModel } from '../models/auth.model';
import { loginModel } from '../models/login.model';

export interface AuthState {
  auth?: AuthModel;
  login?: loginModel;
}
