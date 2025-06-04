'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { DocumentTextIcon, DevicePhoneMobileIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function FeaturesPage() {
  const t = useTranslations('Features');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">{t('description')}</p>
          </div>
        </div>
      </section>

      {/* Features Cards Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center text-gray-900 dark:text-white">{t('cards_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/** Advanced Electronic Signature Card */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('cards.advanced_signature.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('cards.advanced_signature.description')}</p>
              </div>
            </div>
            {/** Document Management Card */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <DocumentTextIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('cards.document_management.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('cards.document_management.description')}</p>
              </div>
            </div>
            {/** Certified Security Card */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('cards.certified_security.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('cards.certified_security.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
