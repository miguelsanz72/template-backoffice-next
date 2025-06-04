import { auth } from '@/core/firebase/firebase.config';
import { GoogleAuthProvider, signInWithPopup, signOut, getIdToken } from 'firebase/auth';
import { ISocialAuthCredential, ISocialAuthUser } from '../../domain/interfaces/social-auth.interface';

export class FirebaseAuthDataSource {
  /**
   * Inicia sesión con Google utilizando Firebase Authentication
   * @returns Credenciales del usuario de Google
   */
  async signInWithGoogle(): Promise<ISocialAuthCredential> {
    try {
      // Crear un proveedor de autenticación de Google
      const provider = new GoogleAuthProvider();

      // Configurar los scopes que necesitamos
      provider.addScope('email');
      provider.addScope('profile');

      // Configurar el flujo de autenticación para dispositivos móviles
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      // Realizar el inicio de sesión con popup
      const result = await signInWithPopup(auth, provider);

      // Obtener las credenciales de Google
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) {
        throw new Error('No se pudieron obtener las credenciales de Google');
      }
      
      // Obtener el ID token (que es lo que necesita Firebase Admin en el backend)
      const idToken = await getIdToken(result.user);
      
      // Obtener el token de acceso
      const accessToken = credential.accessToken || '';

      // Obtener la información del usuario
      const user: ISocialAuthUser = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
      };

      return {
        user,
        accessToken,
        idToken,
        providerId: credential.providerId,
      };
    } catch (error: unknown) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión en Firebase
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.error('Error al cerrar sesión en Firebase:', error);
      throw error;
    }
  }
}
