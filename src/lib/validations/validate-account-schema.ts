import { z } from 'zod';
import { createEmailSchema, createVerificationCodeSchema } from './base-schemas';

export interface ValidateAccountValidationMessages {
  email?: {
    required?: string;
    invalid?: string;
  };
  code?: {
    required?: string;
    length?: string;
    format?: string;
  };
}

export type ValidateAccountFormValues = z.infer<ReturnType<typeof validateAccountSchema>>;

export const validateAccountSchema = (messages?: ValidateAccountValidationMessages) => {
  return z.object({
    email: createEmailSchema({
      required: messages?.email?.required,
      invalid: messages?.email?.invalid,
    }),
    code: createVerificationCodeSchema(6, {
      required: messages?.code?.required,
      length: messages?.code?.length,
      format: messages?.code?.format,
    }),
  });
};
