'use client';

import dynamic from 'next/dynamic';

// Importar el componente de forma dinámica para evitar problemas de hidratación
const AuthInitializer = dynamic(() => import('./auth-initializer').then((mod) => ({ default: mod.AuthInitializer })), {
  ssr: false, // Desactivar SSR para este componente
});

/**
 * Wrapper para el componente AuthInitializer
 * Este wrapper se utiliza para cargar el componente de forma dinámica
 * y evitar problemas de hidratación en el servidor
 */
export function AuthInitializerWrapper() {
  return <AuthInitializer />;
}
