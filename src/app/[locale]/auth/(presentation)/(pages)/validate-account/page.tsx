'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useSearchParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/request';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { IValidateAccount } from '../../../domain';
import { Form } from '@/components/ui/form';
import { EmailField } from '@/components/forms/email-field';
import { validateAccountSchema, ValidateAccountFormValues } from '@/lib/validations/validate-account-schema';
import { Button } from '@/components/ui/button';
import { SmartLogo } from '@/components/ui/smart-logo';

/**
 * Validate Account Page Component
 * This page allows users to validate their account using a verification code
 */
export default function ValidateAccountPage() {
  const t = useTranslations('Auth.validateAccount');
  const tValidation = useTranslations('Auth.validation.validateAccount');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [codeError, setCodeError] = useState('');

  const { validateAccount, resendActivationCode } = useAuthStore();

  // Crear los mensajes de validación utilizando las traducciones
  const validationMessages = {
    email: {
      required: tValidation('email_required'),
      invalid: tValidation('email_invalid'),
    },
    code: {
      required: tValidation('code_required'),
      length: tValidation('code_length'),
      format: tValidation('code_format'),
    },
  };

  // Initialize form with react-hook-form and zod validation
  const form = useForm<ValidateAccountFormValues>({
    resolver: zodResolver(validateAccountSchema(validationMessages)),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  // Set email from URL parameter if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      form.setValue('email', emailParam);
    }
  }, [searchParams, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el código de verificación
    try {
      form.setValue('code', otp);
      const formIsValid = await form.trigger();
      console.log('formIsValid', formIsValid);
      console.log('form errors:', form.formState.errors);

      if (!formIsValid) {
        return;
      }

      setIsLoading(true);
      setCodeError('');

      const values = form.getValues();
      const validateData: IValidateAccount = {
        email: values.email,
        code: values.code,
      };

      await validateAccount(validateData);

      setResendSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Error validating account:', error);
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        if (zodError.errors && zodError.errors.length > 0) {
          setCodeError(zodError.errors[0].message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const email = form.getValues('email');
    console.log('email', email);
    if (!email || isResending) return;

    try {
      setIsResending(true);
      setResendSuccess(false);

      await resendActivationCode(email);

      setResendSuccess(true);

      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      setIsResending(false);
    }
  };

  const isEmailValid = () => {
    return !form.formState.errors.email;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <SmartLogo withText={true} width={120} height={30} className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('header')}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('description')}</p>
          </div>

          {resendSuccess && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-400 p-4 rounded-r-md">
              <p className="text-sm">{t('resend_success')}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <EmailField name="email" label={t('enter_email')} placeholder={t('enter_email')} required />
              </div>

              {/* Verification code input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{t('enter_code')}</label>
                <div className="flex justify-center items-center">
                  <InputOTP
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
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
                            className="w-10 h-12 text-center text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg shadow-xs"
                          />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
                {codeError && <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-center">{codeError}</p>}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6 || !form.getValues('email')}
                  className={`w-full flex justify-center items-center font-medium text-white ${
                    isLoading || otp.length !== 6 || !form.getValues('email') ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      {t('validating')}
                    </>
                  ) : (
                    t('validate_code')
                  )}
                </Button>
              </div>

              <div className="flex flex-col space-y-4">
                <Button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending || !isEmailValid()}
                  variant="ghost"
                  className={`w-full flex justify-center items-center ${
                    isResending || !isEmailValid() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isResending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600 dark:text-gray-400"
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
                      {t('resending')}
                    </>
                  ) : (
                    t('resend_code')
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t('back_to_login')}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
