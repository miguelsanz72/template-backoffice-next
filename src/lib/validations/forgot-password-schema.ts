import { z } from 'zod';
import { createEmailSchema } from './base-schemas';

export interface ForgotPasswordValidationMessages {
  email?: {
    required?: string;
    invalid?: string;
  };
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof forgotPasswordSchema>>;

export const forgotPasswordSchema = (messages?: ForgotPasswordValidationMessages) => {
  return z.object({
    email: createEmailSchema({
      required: messages?.email?.required,
      invalid: messages?.email?.invalid,
    }),
  });
};
