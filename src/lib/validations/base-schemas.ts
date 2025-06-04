import { z } from 'zod';

export interface BaseValidationMessages {
  required?: string;
  minLength?: string;
  maxLength?: string;
  invalid?: string;
  match?: string;
  length?: string;
  format?: string;
}

/**
 * Creates a schema for required text fields
 * @param messages Custom validation messages
 */
export const createRequiredStringSchema = (messages?: BaseValidationMessages) => {
  return z.string().min(1, { message: messages?.required });
};

/**
 * Creates a schema for password fields with common password rules
 * @param messages Custom validation messages
 */
export const createPasswordSchema = (messages?: BaseValidationMessages) => {
  return z
    .string()
    .min(1, { message: messages?.required })
    .min(8, { message: messages?.minLength })
    .max(32, { message: messages?.maxLength });
};

/**
 * Creates a schema for email fields with email format validation
 * @param messages Custom validation messages
 */
export const createEmailSchema = (messages?: BaseValidationMessages) => {
  return z.string().min(1, { message: messages?.required }).email({ message: messages?.invalid });
};

/**
 * Creates a schema for optional text fields
 */
export const createOptionalStringSchema = () => {
  return z.string().optional();
};

/**
 * Creates a schema for text fields with minimum length
 * @param min Minimum length required
 * @param messages Custom validation messages
 */
export const createMinLengthSchema = (min: number, messages?: BaseValidationMessages) => {
  return z.string().min(min, { message: messages?.minLength });
};

/**
 * Creates a schema for text fields with maximum length
 * @param max Maximum length allowed
 * @param messages Custom validation messages
 */
export const createMaxLengthSchema = (max: number, messages?: BaseValidationMessages) => {
  return z.string().max(max, { message: messages?.maxLength });
};

/**
 * Creates a schema for text fields with length range
 * @param min Minimum length required
 * @param max Maximum length allowed
 * @param messages Custom validation messages
 */
export const createLengthRangeSchema = (min: number, max: number, messages?: BaseValidationMessages) => {
  return z.string().min(min, { message: messages?.minLength }).max(max, { message: messages?.maxLength });
};

/**
 * Creates a schema for verification codes
 * @param length Length of the verification code
 * @param messages Custom validation messages
 */
export const createVerificationCodeSchema = (length: number = 6, messages?: BaseValidationMessages) => {
  return z
    .string()
    .min(1, { message: messages?.required })
    .length(length, { message: messages?.length })
    .regex(/^[0-9a-zA-Z]+$/, { message: messages?.format });
};
