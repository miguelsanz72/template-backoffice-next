'use client';

import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/request';
import { Link } from '@/i18n/request';
import { useTranslations } from 'next-intl';
import { RightPanel, SocialLoginButton } from '../../components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailField } from '@/components/forms/email-field';
import { TextField } from '@/components/forms/text-field';
import { CheckboxField } from '@/components/forms/checkbox-field';
import { loginSchema, LoginFormValues } from '@/lib/validations/login-schema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { SmartLogo } from '@/components/ui/smart-logo';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const status = useAuthStore((state) => state.status);

  const router = useRouter();
  const t = useTranslations('Auth.login');

  const validationSchema = loginSchema({
    email: {
      required: t('validation.email_required'),
      invalid: t('validation.email_invalid'),
    },
    password: {
      required: t('validation.password_required'),
      minLength: t('validation.password_min_length'),
      maxLength: t('validation.password_max_length'),
    },
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    setIsLoading(true);

    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('error.general'));
      console.error('Login error:', err);
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
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('select_method')}</p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <SocialLoginButton
              provider="google"
              label={t('social.google')}
              isLoading={isLoading && status === 'checking'}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  setError('');
                  await loginWithGoogle();
                } catch (err) {
                  setError(err instanceof Error && err.message ? err.message : t('error.social.google'));
                  console.error('Google login error:', err);
                  setIsLoading(false);
                }
              }}
            />
            <SocialLoginButton
              provider="facebook"
              label={t('social.facebook')}
              disabled={true} // Deshabilitado hasta que se implemente
              onClick={() => {
                // Implementación futura
                alert(t('social.comingSoon'));
              }}
            />
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
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <EmailField name="email" label={t('email')} placeholder={t('enter_email')} />

              <TextField name="password" label={t('password')} placeholder={t('enter_password')} type="password" />

              <div className="flex items-center justify-between">
                <CheckboxField name="rememberMe" label={t('remember_me')} required={false} />
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-lighter"
                  >
                    {t('forgot_password')}
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full dark:text-white ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                    {t('logging_in')}
                  </>
                ) : (
                  t('sign_in')
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('no_account')}{' '}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-lighter"
            >
              {t('register_here')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <RightPanel
        titleKey="title"
        descriptionKey="description"
        imageSrc="/images/illustrations/auth-illustration.svg"
        imageAlt="Login illustration"
        translationNamespace="Auth.login"
      />
    </div>
  );
}
