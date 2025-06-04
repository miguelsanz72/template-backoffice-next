import React from 'react';
import { Logo } from './logo';

/**
 * Componente de ejemplo que muestra las diferentes variantes del logo
 * para propósitos de documentación.
 */
export const LogoExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Logo Simple (Sin Texto)</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 border rounded">
            <Logo variant="auto" />
            <span className="mt-2 text-sm">Auto (Detecta Tema)</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded">
            <Logo variant="light" />
            <span className="mt-2 text-sm">Light (Claro)</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded bg-gray-900">
            <Logo variant="dark" />
            <span className="mt-2 text-sm text-white">Dark (Oscuro)</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Logo con Texto</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 border rounded">
            <Logo withText variant="auto" />
            <span className="mt-2 text-sm">Auto con Texto</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded">
            <Logo withText variant="light" />
            <span className="mt-2 text-sm">Light con Texto</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded bg-gray-900">
            <Logo withText variant="dark" />
            <span className="mt-2 text-sm text-white">Dark con Texto</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Tamaños Personalizados</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 border rounded">
            <Logo withText width={120} height={25} />
            <span className="mt-2 text-sm">Pequeño (120x25)</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded">
            <Logo withText width={180} height={38} />
            <span className="mt-2 text-sm">Mediano (180x38)</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded">
            <Logo withText width={240} height={50} />
            <span className="mt-2 text-sm">Grande (240x50)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
