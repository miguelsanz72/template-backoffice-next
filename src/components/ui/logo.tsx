"use client";

import React, { useEffect, useState } from 'react';
import { images } from '@/core/constants/images';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export type LogoVariant = 'default' | 'light' | 'dark' | 'auto';

interface LogoProps {
  /**
   * Determines if the logo should include text
   * @default false
   */
  withText?: boolean;

  /**
   * Specifies the logo variant to use
   * - 'default': Uses the standard logo
   * - 'light': Forces the light version of the logo
   * - 'dark': Forces the dark version of the logo
   * - 'auto': Automatically selects based on the current theme (default)
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
   * Whether to preload both light and dark versions to avoid flicker on theme change
   * @default true
   */
  preloadBothThemes?: boolean;

  /**
   * Callback when the image has finished loading
   */
  onLoad?: () => void;
}

/**
 * Preloads an image to browser cache
 * @param src Image source URL
 */
const preloadImage = (src: string): void => {
  const img = new window.Image();
  img.src = src;
};

/**
 * Logo component that automatically adapts to the current theme
 * and supports different variants (with/without text, light/dark)
 */
export const Logo: React.FC<LogoProps> = ({
  withText = false,
  variant = 'auto',
  width = 180,
  height = 38,
  className = '',
  alt = 'Logo',
  priority = true,
  preloadBothThemes = true,
  onLoad,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Preload both themes to prevent flicker on theme change
  useEffect(() => {
    if (preloadBothThemes) {
      if (withText) {
        preloadImage(images.logoText);
        preloadImage(images.logoDarkText);
      } else {
        preloadImage(images.logo);
        preloadImage(images.logoDark);
      }
    }
  }, [withText, preloadBothThemes]);

  const getLogoSrc = (): string => {
    // For specific variants that override theme detection
    if (variant === 'light') {
      return withText ? images.logoLightText : images.logoLight;
    }

    if (variant === 'dark') {
      return withText ? images.logoDarkText : images.logoDark;
    }

    // For auto or default, respond to the current theme
    if (isDark) {
      return withText ? images.logoDarkText : images.logoDark;
    }

    // Default (light mode)
    return withText ? images.logoText : images.logo;
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const src = (!mounted && variant === 'auto')
    ? (withText ? images.logoText : images.logo)
    : getLogoSrc();

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onLoad={onLoad}
      style={{ visibility: !mounted && variant === 'auto' ? 'hidden' : 'visible' }}
    />
  );
};
