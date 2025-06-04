/**
 * Validation helpers for creating validation schemas with translations
 */
import { z } from 'zod';

/**
 * Type for translation function
 */
export type TranslationFunction = (key: string) => string;

/**
 * Creates a password validation schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for password validation
 */
export const createPasswordSchema = (t: TranslationFunction) =>
  z.string().min(8, {
    message: t('validation.passwordLength'),
  });

/**
 * Creates an email validation schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for email validation
 */
export const createEmailSchema = (t: TranslationFunction) =>
  z.string().email({
    message: t('validation.invalidEmail'),
  });

/**
 * Creates a verification code validation schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for verification code validation
 */
export const createVerificationCodeSchema = (t: TranslationFunction) =>
  z
    .string()
    .length(6, {
      message: t('validation.codeLength'),
    })
    .regex(/^[a-zA-Z0-9]{6}$/, {
      message: t('validation.codeAlphanumeric'),
    });

/**
 * Creates a change password validation schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for change password validation
 */
export const createChangePasswordSchema = (t: TranslationFunction) => {
  const passwordSchema = createPasswordSchema(t);

  return z
    .object({
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });
};

/**
 * Creates a login validation schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for login validation
 */
export const createLoginSchema = (t: TranslationFunction) => {
  return z.object({
    email: createEmailSchema(t),
    password: createPasswordSchema(t),
  });
};

/**
 * Creates a register validation schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for register validation
 */
export const createRegisterSchema = (t: TranslationFunction) => {
  const passwordSchema = createPasswordSchema(t);

  return z
    .object({
      name: z.string().min(1, { message: t('validation.nameRequired') }),
      lastName: z.string().min(1, { message: t('validation.lastNameRequired') }),
      email: createEmailSchema(t),
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });
};

/**
 * Creates a forgot password validation schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for forgot password validation
 */
export const createForgotPasswordSchema = (t: TranslationFunction) => {
  return z.object({
    email: createEmailSchema(t),
  });
};

/**
 * Creates a validate account schema with translated error messages
 * @param t Translation function
 * @returns Zod schema for account validation
 */
export const createValidateAccountSchema = (t: TranslationFunction) => {
  return z.object({
    email: createEmailSchema(t),
    code: createVerificationCodeSchema(t),
  });
};
