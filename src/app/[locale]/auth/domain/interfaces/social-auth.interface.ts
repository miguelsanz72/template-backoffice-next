import { ESignInMethod } from '../enums';

export interface ISocialAuthProvider {
  name: string;
  id: string;
}

export interface ISocialAuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface ISocialAuthCredential {
  user: ISocialAuthUser;
  accessToken: string; // Token de acceso para la API de Google
  idToken: string; // Token de ID para verificación en el backend con Firebase Admin
  providerId: string;
}

export interface ISocialLoginRequest {
  network: ESignInMethod;
  socialToken: string; // Debe contener el idToken para verificación en el backend
  email: string;
}
