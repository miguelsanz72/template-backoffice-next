'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useSearchParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/request';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { IChangePassword } from '../../../domain';
import { Form } from '@/components/ui/form';
import { TextField } from '@/components/forms/text-field';
import { changePasswordSchema, verificationCodeSchema, ChangePasswordFormValues } from '@/lib/validations/change-password-schema';
import { SmartLogo } from '@/components/ui/smart-logo';

/**
 * Change Password Page Component
 * Allows users to reset their password using a verification code
 */
export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const router = useRouter();
  const t = useTranslations('Auth.changePassword');

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetPassword = useAuthStore((state) => state.resetPassword);

  // Mensajes de validación para los esquemas
  const validationMessages = {
    password: {
      required: t('validation.password_required'),
      minLength: t('validation.password_min_length'),
      maxLength: t('validation.password_max_length'),
    },
    confirmPassword: {
      required: t('validation.confirmPassword_required'),
      match: t('validation.confirmPassword_match'),
    },
    code: {
      required: t('validation.code_required'),
      length: t('validation.code_length'),
      format: t('validation.code_format'),
    },
  };

  // Configuración del formulario con validación
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema(validationMessages)),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el código de verificación
    try {
      const codeValidationSchema = verificationCodeSchema(validationMessages);
      codeValidationSchema.parse({ code });
      setCodeError('');
    } catch (error) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        if (zodError.errors && zodError.errors.length > 0) {
          setCodeError(zodError.errors[0].message);
        }
      }
      return;
    }

    // Validar el formulario de contraseña
    const formIsValid = await form.trigger();
    if (!formIsValid) {
      return;
    }

    const values = form.getValues();
    setIsSubmitting(true);

    try {
      const data: IChangePassword = {
        email,
        code,
        password: values.password,
      };

      await resetPassword(data);
      form.reset();
      setCode('');

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si email is not provided, redirect to forgot password page
  useEffect(() => {
    if (!email) {
      router.push('/auth/forgot-password');
    }
  }, [email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <SmartLogo withText={true} className="mx-auto" />
          <h2 className="mt-6 text-2xl font-bold text-center text-gray-900 dark:text-white">{t('title')}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 text-center mb-4">{t('verificationCode')}</label>
              <div className="flex justify-center items-center">
                <InputOTP
                  value={code}
                  onChange={(value) => {
                    setCode(value);
                    setCodeError('');
                  }}
                  maxLength={6}
                  pattern="^[0-9a-zA-Z]+$"
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots.map((slot, index) => (
                        <InputOTPSlot
                          key={index}
                          char={slot.char}
                          hasFakeCaret={slot.hasFakeCaret}
                          isActive={slot.isActive}
                          className="w-12 h-12 text-center text-xl font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              {codeError && <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-center">{codeError}</p>}
            </div>

            <div className="space-y-4">
              <TextField name="password" label={t('newPassword')} placeholder={t('enterNewPassword')} type="password" required />

              <TextField
                name="confirmPassword"
                label={t('confirmPassword')}
                placeholder={t('enterConfirmPassword')}
                type="password"
                required
              />
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                  isSubmitting || code.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
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
                    {t('changing')}
                  </>
                ) : (
                  t('resetPassword')
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('backToLogin')}
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
