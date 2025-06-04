'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/request';
import Cookies from 'js-cookie';
import { SmartLogo } from '@/components/ui/smart-logo';

/**
 * LogoutPage component
 * Displays a friendly message after user logs out
 * @returns {JSX.Element} Logout page component
 */
export default function LogoutPage() {
  const t = useTranslations('Auth.logout');

  // Clear authentication data on component mount
  useEffect(() => {
    // Remove auth tokens and user data
    Cookies.remove('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    // Any additional cleanup logic can be added here
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <SmartLogo withText={true} className="mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>

          {/* Success icon */}
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-xs text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {t('back_to_login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
