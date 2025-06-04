import { z } from 'zod';

export interface UserFormValues {
  name: string;
  lastName?: string;
  email: string;
  password?: string;
  isActive: boolean;
  role: string;
}

interface ValidationMessages {
  name?: {
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
}

export const userFormSchema = (messages: ValidationMessages = {}) => {
  return z.object({
    name: z.string({
      required_error: messages.name?.required || 'Name is required',
    }),
    lastName: z.string().optional(),
    email: z
      .string({
        required_error: messages.email?.required || 'Email is required',
      })
      .email(messages.email?.invalid || 'Invalid email format'),
    password: z
      .string()
      .min(
        8,
        messages.password?.minLength || 'Password must be at least 8 characters'
      )
      .max(
        32,
        messages.password?.maxLength || 'Password must not exceed 32 characters'
      )
      .optional()
      .or(z.literal('')),
    isActive: z.boolean().default(true),
    role: z.string().default('user'),
  });
};