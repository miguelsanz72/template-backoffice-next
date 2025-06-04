import React from 'react';

interface LogoSkeletonProps {
  withText?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Componente de esqueleto para el logo que se muestra mientras el logo está cargando
 */
export const LogoSkeleton: React.FC<LogoSkeletonProps> = ({ withText = false, width = 180, height = 38, className = '' }) => {
  // Si es con texto, hacemos el esqueleto más ancho
  const skeletonWidth = withText ? width : height * 1.2;

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{
        width: `${skeletonWidth}px`,
        height: `${height}px`,
      }}
    />
  );
};
