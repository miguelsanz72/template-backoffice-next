import { z } from 'zod';
import { createPasswordSchema, createRequiredStringSchema, createVerificationCodeSchema } from './base-schemas';

export interface ChangePasswordValidationMessages {
  password?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
  };
  confirmPassword?: {
    required?: string;
    match?: string;
  };
  code?: {
    required?: string;
    length?: string;
    format?: string;
  };
}

export type ChangePasswordFormValues = z.infer<ReturnType<typeof changePasswordSchema>>;

export const changePasswordSchema = (messages?: ChangePasswordValidationMessages) => {
  return z
    .object({
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

export type VerificationCodeFormValues = z.infer<ReturnType<typeof verificationCodeSchema>>;

export const verificationCodeSchema = (messages?: ChangePasswordValidationMessages) => {
  return z.object({
    code: createVerificationCodeSchema(6, {
      required: messages?.code?.required,
      length: messages?.code?.length,
      format: messages?.code?.format,
    }),
  });
};
