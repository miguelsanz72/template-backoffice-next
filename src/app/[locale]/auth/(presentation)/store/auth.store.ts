import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthStore } from './auth.types';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/auth.repository.impl';
import { isMockAuthEnabled, MockAuthRepository } from '../../infrastructure/repositories/mock.auth.repository';
import { AuthRepository } from '../../domain';
import { ApiRestDataSource } from '../../infrastructure/datasources/api.rest.datasource';
import { FirebaseAuthDataSource } from '../../infrastructure/datasources/firebase.auth.datasource';
import { IUser, IUserLogin, IUserRegister, IForgotPassword, IChangePassword, IValidateAccount } from '../../domain/interfaces';
import { createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { ESignInMethod } from '../../domain/enums';

// Crear instancias de los datasources
const apiRestDataSource = new ApiRestDataSource();
const firebaseAuthDataSource = new FirebaseAuthDataSource();

// Crear una instancia del repositorio
const authRepository: AuthRepository = isMockAuthEnabled ? new MockAuthRepository() : new AuthRepositoryImpl(apiRestDataSource);

const cookieStorage = {
  getItem: (name: string): string | null => {
    const value = Cookies.get(name);
    return value ? value : null;
  },
  setItem: (name: string, value: string): void => {
    // Establecer la cookie principal
    Cookies.set(name, value, {
      expires: 7, // Expira en 7 días
      path: '/',
      sameSite: 'lax',
    });

    // Si es la cookie de autenticación, también establecer el token separado
    if (name === 'auth-storage') {
      try {
        const authData = JSON.parse(value);
        if (authData.state?.token) {
          Cookies.set('auth_token', authData.state.token, {
            expires: 7,
            path: '/',
            sameSite: 'lax',
          });
        }
      } catch (error) {
        console.error('Error al establecer auth_token cookie:', error);
      }
    }
  },
  removeItem: (name: string): void => {
    Cookies.remove(name, { path: '/' });
    // También eliminar la cookie auth_token cuando se elimina auth-storage
    if (name === 'auth-storage') {
      Cookies.remove('auth_token', { path: '/' });
      Cookies.remove('auth-storage', { path: '/' });
    }
  },
};

const createAuthStore: StateCreator<AuthStore, [['zustand/devtools', never]], []> = (set) => ({
  status: 'checking',
  token: null,
  user: null,
  errorMessage: null,
  successMessage: null,

  login: async (email: string, password: string) => {
    try {
      set({ status: 'checking' });

      const loginData: IUserLogin = { email, password };
      const response = await authRepository.login(loginData);

      set(
        {
          status: 'authenticated',
          token: response.accessToken,
          user: response.user,
          errorMessage: null,
        },
        false,
        'login'
      );
    } catch (error) {
      if (error instanceof Error) {
        set({ status: 'not-authenticated', token: null, user: null, errorMessage: error.message }, false, 'login-error');
      }
      throw error;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ status: 'checking' });

      const googleCredential = await firebaseAuthDataSource.signInWithGoogle();

      const response = await authRepository.socialLogin({
        email: googleCredential.user.email,
        network: ESignInMethod.GOOGLE,
        socialToken: googleCredential.idToken,
      });

      set(
        {
          status: 'authenticated',
          token: response.accessToken,
          user: response.user,
          errorMessage: null,
        },
        false,
        'login-with-google'
      );
    } catch (error) {
      if (error instanceof Error) {
        set({ status: 'not-authenticated', token: null, user: null, errorMessage: error.message }, false, 'login-with-google-error');
      }
      throw error;
    }
  },

  register: async (data: IUserRegister) => {
    try {
      set({ status: 'checking' });

      const registerData: IUserRegister = {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      await authRepository.register(registerData);

      set(
        {
          status: 'not-authenticated',
          token: null,
          user: null,
          errorMessage: null,
        },
        false,
        'register'
      );
    } catch (error) {
      if (error instanceof Error) {
        set({ status: 'not-authenticated', token: null, user: null, errorMessage: error.message }, false, 'register-error');
      }
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      set({ status: 'checking' });

      const forgotPasswordData: IForgotPassword = { email };
      const response = await authRepository.forgotPassword(forgotPasswordData);

      set(
        {
          status: 'not-authenticated',
          token: null,
          user: null,
          errorMessage: null,
          successMessage: response.message,
        },
        false,
        'forgot-password'
      );

      return response;
    } catch (error) {
      if (error instanceof Error) {
        set(
          { status: 'not-authenticated', token: null, user: null, errorMessage: error.message, successMessage: null },
          false,
          'forgot-password-error'
        );
      }
      throw error;
    }
  },

  resetPassword: async (data: IChangePassword) => {
    try {
      set({ status: 'checking' });

      const changePasswordData: IChangePassword = {
        email: data.email,
        code: data.code,
        password: data.password,
      };

      const response = await authRepository.resetPassword(changePasswordData);

      set(
        {
          status: 'not-authenticated',
          token: null,
          user: null,
          errorMessage: null,
          successMessage: response.message,
        },
        false,
        'change-password'
      );

      return response;
    } catch (error) {
      if (error instanceof Error) {
        set(
          { status: 'not-authenticated', token: null, user: null, errorMessage: error.message, successMessage: null },
          false,
          'change-password-error'
        );
      }
      throw error;
    }
  },

  resendActivationCode: async (email: string) => {
    try {
      const response = await authRepository.resendActivationCode(email);
      return response;
    } catch (error) {
      throw error;
    }
  },

  validateAccount: async (data: IValidateAccount) => {
    try {
      const response = await authRepository.validateAccount(data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    // Cerrar sesión en Firebase si está disponible
    firebaseAuthDataSource.signOut().catch((error) => {
      console.error('Error al cerrar sesión en Firebase:', error);
    });
    set({ status: 'not-authenticated', token: null, user: null, errorMessage: null }, false, 'logout');
    Cookies.remove('auth_token', { path: '/' });
    Cookies.remove('auth-storage', { path: '/' });
    Cookies.remove('auth-token', { path: '/' });
  },

  checkAuthStatus: async () => {
    try {
      set({ status: 'checking' });
      // Verificar si hay un token en la cookie
      const token = Cookies.get('auth_token');
      // Intentar obtener los datos del usuario guardados directamente
      const authStorageData = Cookies.get('auth-storage');

      if (!token) {
        set({ status: 'not-authenticated', token: null, user: null }, false, 'check-auth-no-token');
        return;
      }

      try {
        let user: IUser | null = null;

        // Si tenemos los datos del usuario almacenados, usarlos primero
        if (authStorageData) {
          try {
            const parsedData = JSON.parse(authStorageData);
            // Verificar si los datos almacenados contienen directamente el estado
            if (parsedData.state && parsedData.state.user) {
              user = parsedData.state.user as IUser;
            } 
            // O si es directamente el objeto usuario
            else if (parsedData.id && parsedData.email) {
              user = parsedData as IUser;
            }
          } catch (e) {
            console.error('Error al parser datos de usuario almacenados:', e);
          }
        }

        // Si no tenemos datos de usuario válidos, extraerlos del token
        if (!user || !user.id) {
          // Decodificar el token para obtener la información del usuario
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );

          const payload = JSON.parse(jsonPayload);

          // Extraer los datos del usuario del payload
          user = {
            id: payload.id,
            email: payload.email,
            username: payload.username,
            displayName: payload.display_name,
            isActive: true,
            emailVerified: true,
            organization: null,
            userRoles: payload.user_roles || [],
            avatar: payload.avatar,
          };

          console.log('Token decodificado correctamente:', payload);
          console.log('Usuario extraído del token:', user);
        }

        set(
          {
            status: 'authenticated',
            token,
            user,
            errorMessage: null,
          },
          false,
          'check-auth-success'
        );
      } catch (error) {
        // Si hay un error al decodificar el token, lo consideramos inválido
        console.error('Error al decodificar el token:', error);
        Cookies.remove('auth_token', { path: '/' });
        Cookies.remove('auth-storage', { path: '/' });
        set({ status: 'not-authenticated', token: null, user: null }, false, 'check-auth-invalid-token');
      }
    } catch (error) {
      console.error('Error en checkAuthStatus:', error);
      set({ status: 'not-authenticated', token: null, user: null }, false, 'check-auth-error');
    }
  },
});

// Crear la store con middleware de persistencia y devtools
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(createAuthStore, {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        status: state.status,
      }),
    })
  )
);
