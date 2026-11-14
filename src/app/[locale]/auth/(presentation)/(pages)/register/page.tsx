'use client';

import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/request';
import { Link } from '@/i18n/request';
import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { RightPanel } from '../../components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@/components/forms/text-field';
import { EmailField } from '@/components/forms/email-field';
import { Form } from '@/components/ui/form';
import { registerSchema, RegisterFormValues } from '@/lib/validations/register-schema';
import { Button } from '@/components/ui/button';
import { SmartLogo } from '@/components/ui/smart-logo';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const status = useAuthStore((state) => state.status);

  const router = useRouter();
  const t = useTranslations('Auth.register');

  // Crear los mensajes de validación utilizando las traducciones
  const validationMessages = {
    name: {
      required: t('validation.name_required'),
    },
    lastName: {
      required: t('validation.lastName_required'),
    },
    email: {
      required: t('validation.email_required'),
      invalid: t('validation.email_invalid'),
    },
    password: {
      required: t('validation.password_required'),
      minLength: t('validation.password_min_length'),
      maxLength: t('validation.password_max_length'),
    },
    confirmPassword: {
      required: t('validation.confirmPassword_required'),
      match: t('validation.confirmPassword_match'),
    },
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema(validationMessages)),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (values: RegisterFormValues) => {
    setError('');
    setIsLoading(true);

    try {
      await register({
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      // After successful registration, redirect to validate account with email parameter
      router.push(`/auth/validate-account?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('error.general'));
      console.error('Registration error:', err);
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
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('create_account')}</p>
          </div>

          {/* Social Register Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button>
              <Image src="/images/illustrations/google-icon.svg" alt="Google" width={20} height={20} className="mr-2" />
              <span className="text-sm text-white">Google</span>
            </Button>
            <Button>
              <Image src="/images/illustrations/facebook-icon.svg" alt="Facebook" width={20} height={20} className="mr-2" />
              <span className="text-sm text-white">Facebook</span>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">{t('or_continue_with_email')}</span>
            </div>
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
            <form noValidate className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <TextField name="name" label={t('first_name')} placeholder={t('enter_first_name')} required />
                <TextField name="lastName" label={t('last_name')} placeholder={t('enter_last_name')} required />
              </div>

              <EmailField name="email" label={t('email')} placeholder={t('enter_email')} required />

              <TextField name="password" label={t('password')} placeholder={t('enter_password')} type="password" required />

              <TextField
                name="confirmPassword"
                label={t('confirm_password')}
                placeholder={t('enter_confirm_password')}
                type="password"
                required
              />

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
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
                    {t('registering')}
                  </>
                ) : (
                  t('register')
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-900 dark:text-gray-100">
            {t('already_have_account')}{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              {t('login_here')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <RightPanel />
    </div>
  );
}
