import { IChangePassword, IUser, IUserRegister, IValidateAccount } from '../../domain';
import { IResponseMessage } from '@/core';

export type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

export interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: IUser | null;
  errorMessage: string | null;
  successMessage: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: IUserRegister) => Promise<void>;
  forgotPassword: (email: string) => Promise<IResponseMessage>;
  resetPassword: (data: IChangePassword) => Promise<IResponseMessage>;
  validateAccount: (data: IValidateAccount) => Promise<IResponseMessage>;
  resendActivationCode: (email: string) => Promise<IResponseMessage>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;
