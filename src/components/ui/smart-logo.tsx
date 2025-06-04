import React, { useState } from 'react';
import { Logo, LogoVariant } from './logo';
import { LogoSkeleton } from './logo-skeleton';

interface SmartLogoProps {
  /**
   * Determines if the logo should include text
   * @default false
   */
  withText?: boolean;

  /**
   * Specifies the logo variant to use
   * @default 'auto'
   */
  variant?: LogoVariant;

  /**
   * Width of the logo in pixels
   * @default 180
   */
  width?: number;

  /**
   * Height of the logo in pixels
   * @default 38
   */
  height?: number;

  /**
   * Additional CSS classes to apply to the logo
   */
  className?: string;

  /**
   * Alt text for accessibility
   * @default 'Logo'
   */
  alt?: string;

  /**
   * Whether to prioritize loading of the logo
   * @default true
   */
  priority?: boolean;

  /**
   * Show skeleton while loading
   * @default true
   */
  showSkeleton?: boolean;
}

/**
 * SmartLogo component that shows a skeleton while the image is loading
 * and handles all the variants of the logo
 */
export const SmartLogo: React.FC<SmartLogoProps> = ({
  withText = false,
  variant = 'auto',
  width = 180,
  height = 38,
  className = '',
  alt = 'Logo',
  priority = true,
  showSkeleton = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && showSkeleton && <LogoSkeleton withText={withText} width={width} height={height} className={className} />}

      <div className={isLoading && showSkeleton ? 'opacity-0' : 'opacity-100'}>
        <Logo
          withText={withText}
          variant={variant}
          width={width}
          height={height}
          className={className}
          alt={alt}
          priority={priority}
          onLoad={handleLoadingComplete}
        />
      </div>
    </div>
  );
};
