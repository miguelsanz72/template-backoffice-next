'use client';

import { Link } from '@/i18n/request';
import React from 'react';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { ChartBarIcon, DevicePhoneMobileIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 pt-20 pb-32 relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">{t('title')}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{t('description')}</p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/auth/register"
                    className="px-6 py-3 bg-primary hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
                  >
                    {t('cta_primary')}
                  </Link>
                  <Link
                    href="/features"
                    className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-blue-600 text-gray-700 dark:text-gray-300 rounded-full font-medium transition-colors"
                  >
                    {t('cta_secondary')}
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
                  <div className="aspect-4/3 relative">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-lg" />
                    <div className="relative p-4">
                      <div className="h-full flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xs">
                            <div className="h-32 bg-blue-50 dark:bg-gray-800 rounded-md mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                          </div>
                          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xs">
                            <div className="h-32 bg-primary/10 dark:bg-gray-800 rounded-md mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 w-24 h-24 bg-yellow-300 dark:bg-yellow-500/20 rounded-lg rotate-12" />
                <div className="absolute bottom-0 left-1/4 -translate-x-1/2 translate-y-1/4 w-32 h-32 bg-blue-300 dark:bg-blue-500/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('features_title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('features.collaboration.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <ChartBarIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('features.collaboration.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('features.collaboration.description')}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('features.task_management.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('features.task_management.description')}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('features.secure_communication.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('features.secure_communication.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-linear-to-br from-primary/5 to-blue-500/5 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('cta_section.title')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{t('cta_section.description')}</p>
              <Link
                href="/auth/register"
                className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
              >
                {t('cta_section.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
