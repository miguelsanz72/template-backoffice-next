import { IResponseMessage } from '@/core';
import { AuthRepository } from '../../domain';
import {
  ILoginResponse,
  ISocialLoginRequest,
  IUser,
  IUserLogin,
} from '../../domain/interfaces';

// Development-only repository: accepts any credentials and never calls the API.
export const isMockAuthEnabled = process.env.NEXT_PUBLIC_AUTH_MOCK === 'true';

const base64Url = (value: object) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(value))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const buildMockLoginResponse = (email: string): ILoginResponse => {
  const username = email.split('@')[0] || 'demo';
  const user: IUser = {
    id: 'mock-user',
    email,
    username,
    displayName: username,
    isActive: true,
    emailVerified: true,
    organization: null,
    userRoles: ['admin'],
    avatar: { url: null, charter: username.charAt(0).toUpperCase(), color: '#2563eb' },
  };

  // Unsigned JWT-shaped token so checkAuthStatus can decode it after a reload.
  const accessToken = [
    base64Url({ alg: 'none', typ: 'JWT' }),
    base64Url({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.displayName,
      user_roles: user.userRoles,
      avatar: user.avatar,
    }),
    'mock',
  ].join('.');

  return { accessToken, user };
};

const ok = (message: string): Promise<IResponseMessage> => Promise.resolve({ message } as IResponseMessage);

export class MockAuthRepository implements AuthRepository {
  async login({ email }: IUserLogin): Promise<ILoginResponse> {
    return buildMockLoginResponse(email);
  }

  async socialLogin({ email }: ISocialLoginRequest): Promise<ILoginResponse> {
    return buildMockLoginResponse(email);
  }

  register() {
    return ok('Mock: registro simulado');
  }

  forgotPassword() {
    return ok('Mock: correo de recuperación simulado');
  }

  resetPassword() {
    return ok('Mock: contraseña actualizada');
  }

  resendActivationCode() {
    return ok('Mock: código reenviado');
  }

  validateAccount() {
    return ok('Mock: cuenta validada');
  }
}
