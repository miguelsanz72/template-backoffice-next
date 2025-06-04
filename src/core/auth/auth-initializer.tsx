'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';

/**
 * Componente que inicializa el estado de autenticación al cargar la aplicación
 * Este componente debe ser incluido en el layout principal para asegurar
 * que el estado de autenticación se verifique en cada recarga de la página
 */
export function AuthInitializer() {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    // Verificar el estado de autenticación al cargar el componente
    const initializeAuth = async () => {
      try {
        console.log('Inicializando estado de autenticación...');
        await checkAuthStatus();
        console.log('Estado de autenticación inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar el estado de autenticación:', error);
      }
    };

    initializeAuth();
  }, [checkAuthStatus]);

  return null;
}
