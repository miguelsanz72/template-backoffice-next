export const defaultLocale = 'es';
export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

// Validar que el defaultLocale esté primero en el array
export const localePrefixes = locales.filter((l) => l !== defaultLocale);

export default {
  defaultLocale,
  locales,
} as const;
