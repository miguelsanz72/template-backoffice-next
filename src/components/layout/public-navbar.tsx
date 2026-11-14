'use client';

import { Link, usePathname, useRouter } from '@/i18n/request';
import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { locales, type Locale } from '@/i18n/config';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function PublicNavbar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const router = useRouter();
  const selectedLanguage = useLocale() as Locale;
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const handleLanguageChange = (locale: Locale) => {
    setIsLanguageDropdownOpen(false);
    // next-intl navigation keeps the current path and updates the NEXT_LOCALE cookie
    router.replace(pathname, { locale });
  };

  const languageNames = {
    es: 'Español',
    en: 'English',
  };

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
