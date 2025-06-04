import { z } from 'zod';

export interface TextValidationMessages {
  required?: string;
  min?: string;
  max?: string;
}

export interface TextValidationOptions {
  min?: number;
  max?: number;
  required?: boolean;
}

export const createTextSchema = (options: TextValidationOptions = {}, messages?: TextValidationMessages) => {
  let schema = z.string();
  console.log(options);

  if (options.required !== false) {
    schema = schema.min(1, {
      message: messages?.required || 'Este campo es requerido',
    });
  }

  if (options.min !== undefined) {
    schema = schema.min(options.min, {
      message: messages?.min || `El texto debe tener al menos ${options.min} caracteres`,
    });
  }

  if (options.max !== undefined) {
    schema = schema.max(options.max, {
      message: messages?.max || `El texto debe tener menos de ${options.max} caracteres`,
    });
  }

  return schema;
};
