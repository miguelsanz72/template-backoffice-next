import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';

export interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'facebook' | 'microsoft' | 'github';
  label: string;
  isLoading?: boolean;
}

/**
 * Componente para botones de inicio de sesión con redes sociales
 */
export const SocialLoginButton = ({ provider, label, isLoading = false, className = '', disabled, ...props }: SocialLoginButtonProps) => {
  // Mapa de iconos por proveedor
  const iconMap = {
    google: '/images/illustrations/google-icon.svg',
    facebook: '/images/illustrations/facebook-icon.svg',
    microsoft: '/images/illustrations/microsoft-icon.svg',
    github: '/images/illustrations/github-icon.svg',
  };

  return (
    <button
      type="button"
      disabled={isLoading || disabled}
      className={`cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-t-transparent border-gray-600 rounded-full animate-spin mr-2"></div>
      ) : (
        <Image src={iconMap[provider]} alt={provider} width={20} height={20} className="mr-2" />
      )}
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );
};
