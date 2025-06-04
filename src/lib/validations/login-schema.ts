import { z } from 'zod';
import { createEmailSchema, createPasswordSchema } from './base-schemas';

export interface LoginValidationMessages {
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

export const loginSchema = (messages?: LoginValidationMessages) => {
  return z.object({
    email: createEmailSchema({
      required: messages?.email?.required || 'El email es requerido',
      invalid: messages?.email?.invalid || 'Formato de correo electrónico inválido',
    }),
    password: createPasswordSchema({
      required: messages?.password?.required || 'La contraseña es requerida',
      minLength: messages?.password?.minLength || 'La contraseña debe tener al menos 8 caracteres',
      maxLength: messages?.password?.maxLength || 'La contraseña no puede exceder los 32 caracteres',
    }),
    rememberMe: z.boolean().optional(),
  });
};

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;
