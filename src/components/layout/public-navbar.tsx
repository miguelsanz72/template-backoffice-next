'use client';

import { Link } from '@/i18n/request';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/request';
import { locales, defaultLocale } from '@/i18n/config';
import { ThemeToggle } from '@/components/theme/theme-toggle';

type Locale = 'es' | 'en';

export function PublicNavbar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(defaultLocale as Locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const pathLocale = pathname.split('/')[1];

    if (locales.includes(pathLocale as Locale)) {
      setSelectedLanguage(pathLocale as Locale);
      localStorage.setItem('language', pathLocale as Locale);
    } else {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage && locales.includes(storedLanguage as Locale)) {
        setSelectedLanguage(storedLanguage as Locale);
      }
    }
  }, [pathname]);

  const handleLanguageChange = (locale: Locale) => {
    setSelectedLanguage(locale);
    localStorage.setItem('language', locale);

    // Set next-intl cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    // Get current path segments
    const pathSegments = pathname.split('/').filter(Boolean);

    // Remove current locale if it exists
    if (locales.includes(pathSegments[0] as Locale)) {
      pathSegments.shift();
    }

    // Build new path
    const finalPath =
      locale === defaultLocale
        ? pathSegments.length
          ? `/${pathSegments.join('/')}`
          : '/'
        : `/${locale}${pathSegments.length ? '/' + pathSegments.join('/') : ''}`;

    setIsLanguageDropdownOpen(false);

    // Use Next.js router for client-side navigation
    window.location.href = finalPath;
  };

  const languageNames = {
    es: 'Español',
    en: 'English',
  };

  // Only render language-specific content after client-side hydration
  if (!mounted) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary dark:text-primary-light">
            {t('brand')}
          </Link>
          <div className="flex space-x-6 items-center">
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary dark:text-primary-light">
          {t('brand')}
        </Link>
        <div className="flex space-x-6 items-center">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
            {t('home')}
          </Link>
          <Link
            href="/features"
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {t('features')}
          </Link>
          <Link
            href="/pricing"
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {t('pricing')}
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {t('about')}
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {t('contact')}
          </Link>
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center"
            >
              {languageNames[selectedLanguage as keyof typeof languageNames] || 'Language'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {locales.map((locale) => (
                  <button
                    key={locale}
                    onClick={() => handleLanguageChange(locale as Locale)}
                    className={`w-full text-left px-4 py-2 transition-colors ${
                      selectedLanguage === locale
                        ? 'bg-primary text-white dark:bg-primary-dark'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {languageNames[locale]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/auth/login"
            className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
