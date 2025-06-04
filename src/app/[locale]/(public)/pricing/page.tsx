'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { CreditCardIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { LightningBoltIcon } from '@radix-ui/react-icons';

export default function PricingPage() {
  const t = useTranslations('Pricing');

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

      {/* Pricing Plans Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center text-gray-900 dark:text-white">{t('cards_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                  <CreditCardIcon className="w-8 h-8 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{t('plans.basic.title')}</h3>
                <p className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('plans.basic.price')}</p>
                <ul className="mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('plans.basic.features.essential_signatures')}</li>
                  <li>{t('plans.basic.features.storage')}</li>
                  <li>{t('plans.basic.features.email_support')}</li>
                </ul>
                <button className="w-full px-6 py-3 bg-primary hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  {t('plans.basic.cta')}
                </button>
              </div>
            </div>
            {/* Pro Plan */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                  <LightningBoltIcon className="w-8 h-8 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{t('plans.pro.title')}</h3>
                <p className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('plans.pro.price')}</p>
                <ul className="mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('plans.pro.features.all_basic')}</li>
                  <li>{t('plans.pro.features.unlimited_storage')}</li>
                  <li>{t('plans.pro.features.priority_support')}</li>
                  <li>{t('plans.pro.features.team_collaboration')}</li>
                </ul>
                <button className="w-full px-6 py-3 bg-primary hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  {t('plans.pro.cta')}
                </button>
              </div>
            </div>
            {/* Enterprise Plan */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 transition duration-500" />
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                  <BuildingOffice2Icon className="w-8 h-8 text-primary dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{t('plans.enterprise.title')}</h3>
                <p className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('plans.enterprise.price')}</p>
                <ul className="mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('plans.enterprise.features.all_pro')}</li>
                  <li>{t('plans.enterprise.features.account_manager')}</li>
                  <li>{t('plans.enterprise.features.custom_integrations')}</li>
                  <li>{t('plans.enterprise.features.phone_support')}</li>
                </ul>
                <button className="w-full px-6 py-3 bg-primary hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  {t('plans.enterprise.cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
