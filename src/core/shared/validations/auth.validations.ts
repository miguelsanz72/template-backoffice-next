/**
 * Authentication validation schemas
 * This file contains all validation schemas related to authentication
 */
import { z } from 'zod';

/**
 * Password validation schema
 * Validates that a password meets the minimum requirements
 */
export const passwordSchema = z.string().min(8, { 
  message: 'Password must be at least 8 characters long' 
});

/**
 * Email validation schema
 * Validates that a string is a valid email format
 */
export const emailSchema = z.string().email({ 
  message: 'Invalid email format' 
});

/**
 * Verification code validation schema
 * Validates that a verification code is 6 digits
 */
export const verificationCodeSchema = z.string().length(6, { 
  message: 'Verification code must be 6 characters' 
}).regex(/^\d+$/, { 
  message: 'Verification code must contain only digits' 
});

/**
 * Change password validation schema
 * Validates the form data for changing a password
 */
export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Login validation schema
 * Validates the form data for logging in
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Register validation schema
 * Validates the form data for registering a new user
 */
export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Forgot password validation schema
 * Validates the form data for requesting a password reset
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
