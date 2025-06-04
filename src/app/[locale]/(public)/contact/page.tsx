'use client';

import React, { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Aquí iría la lógica para enviar el mensaje
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

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

      {/* Contact Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="relative">
                <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25" />
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('form.name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('form.email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('form.message')}
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    {status === 'success' && (
                      <div className="bg-green-50 dark:bg-green-900/30 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                        {t('success')}
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                        {t('error')}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className={`w-full px-8 py-4 bg-primary hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${
                        status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t('form.submitting')}
                        </span>
                      ) : (
                        t('form.submit')
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-12">
                {/* Email Card */}
                <div className="relative group">
                  <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                      <EnvelopeIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('info.email_title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('info.email')}</p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="relative group">
                  <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                      <PhoneIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('info.phone_title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('info.phone')}</p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="relative group">
                  <div className="absolute inset-0.5 bg-linear-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                      <MapPinIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('info.address_title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('info.address')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
