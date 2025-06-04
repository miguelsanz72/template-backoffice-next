/**
 * Register validation schema
 * This file contains the validation schema for the register form
 */
import { z } from 'zod';
import { createRequiredStringSchema, createPasswordSchema, createEmailSchema } from './base-schemas';

/**
 * Interface for register validation messages
 */
export interface RegisterValidationMessages {
  name?: {
    required?: string;
  };
  lastName?: {
    required?: string;
  };
  email?: {
    required?: string;
    invalid?: string;
  };
  password?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
  };
  confirmPassword?: {
    required?: string;
    match?: string;
  };
}

/**
 * Register schema creator
 * Creates a register schema with custom validation messages
 */
export const registerSchema = (messages?: RegisterValidationMessages) => {
  return z
    .object({
      name: createRequiredStringSchema({ required: messages?.name?.required }),
      lastName: createRequiredStringSchema({ required: messages?.lastName?.required }),
      email: createEmailSchema({
        required: messages?.email?.required,
        invalid: messages?.email?.invalid,
      }),
      password: createPasswordSchema({
        required: messages?.password?.required,
        minLength: messages?.password?.minLength,
        maxLength: messages?.password?.maxLength,
      }),
      confirmPassword: createRequiredStringSchema({ required: messages?.confirmPassword?.required }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages?.confirmPassword?.match,
      path: ['confirmPassword'],
    });
};

export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>;
