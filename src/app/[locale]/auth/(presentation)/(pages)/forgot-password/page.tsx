'use client';

import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/request';
import { Link } from '@/i18n/request';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { EmailField } from '@/components/forms/email-field';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/lib/validations/forgot-password-schema';
import { Button } from '@/components/ui/button';
import { SmartLogo } from '@/components/ui/smart-logo';
import { RightPanel } from '../../components';

/**
 * ForgotPasswordPage Component
 * Allows users to request a password reset by providing their email
 */
export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const status = useAuthStore((state) => state.status);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const successMessage = useAuthStore((state) => state.successMessage);

  const router = useRouter();
  const t = useTranslations('Auth.forgotPassword');
  const commonT = useTranslations('common');

  // Crear los mensajes de validación utilizando las traducciones
  const validationMessages = {
    email: {
      required: t('validation.email_required'),
      invalid: t('validation.email_invalid'),
    },
  };

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(validationMessages)),
    defaultValues: {
      email: '',
    },
  });

  // Función para traducir mensajes del API
  const translateApiMessage = (message: string | null) => {
    if (!message) return '';

    // Verificar si el mensaje es una clave de traducción (AUTH.MESSAGES.XXX)
    if (message.startsWith('AUTH.MESSAGES.')) {
      const key = message.split('.').pop() || '';
      return commonT(`AUTH.MESSAGES.${key}`) || message;
    }

    return message;
  };

  useEffect(() => {
    if (status === 'not-authenticated' && errorMessage) {
      setError(translateApiMessage(errorMessage));
      setIsLoading(false);
    }

    if (status === 'not-authenticated' && successMessage) {
      // Redirigir a la página de cambio de contraseña y pasar el email como query parameter
      const email = form.getValues('email');
      if (email) {
        router.push(`/auth/change-password?email=${encodeURIComponent(email)}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, errorMessage, successMessage, router, form]);

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setError('');
    setIsLoading(true);

    try {
      await forgotPassword(values.email);
    } catch (err) {
      const errorMsg = errorMessage || t('generalError');
      setError(translateApiMessage(errorMsg));
      console.error('Forgot password error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-12 xl:px-24 bg-white dark:bg-gray-900">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <SmartLogo withText={true} className="mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('description')}</p>
          </div>

          {error && (
            <div
              className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
              <EmailField name="email" label={t('email')} placeholder={t('email')} required />

              <Button type="submit" disabled={isLoading} className={`w-full text-white`}>
                {isLoading ? (
                  <>
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
                    {t('sending')}
                  </>
                ) : (
                  t('sendResetLink')
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-lighter"
            >
              {t('backToLogin')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <RightPanel
        titleKey="title"
        descriptionKey="description"
        imageSrc="/images/illustrations/auth-illustration.svg"
        imageAlt="Forgot password illustration"
        translationNamespace="Auth.forgotPassword"
      />
    </div>
  );
}
