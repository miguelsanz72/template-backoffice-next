'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { BeakerIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/request';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">{t('description')}</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-blue-500/5 dark:from-gray-800 dark:to-gray-900 rounded-3xl transform rotate-1" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-xl">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('mission.title')}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">{t('mission.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center text-gray-900 dark:text-white">{t('values.title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Innovation Card */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <BeakerIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('values.innovation.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('values.innovation.description')}</p>
              </div>
            </div>

            {/* Security Card */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('values.security.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('values.security.description')}</p>
              </div>
            </div>

            {/* Collaboration Card */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <UserGroupIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('values.collaboration.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('values.collaboration.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-blue-400 mb-2">{t('stats.clients')}</div>
              <div className="text-gray-600 dark:text-gray-300">{t('stats.clients_label')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-blue-400 mb-2">{t('stats.users')}</div>
              <div className="text-gray-600 dark:text-gray-300">{t('stats.users_label')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-blue-400 mb-2">{t('stats.uptime')}</div>
              <div className="text-gray-600 dark:text-gray-300">{t('stats.uptime_label')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-blue-400 mb-2">{t('stats.support')}</div>
              <div className="text-gray-600 dark:text-gray-300">{t('stats.support_label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-linear-to-br from-primary/5 to-blue-500/5 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('team.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{t('team.description')}</p>
            <Link
              href="/careers"
              className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
            >
              {t('team.cta')}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
