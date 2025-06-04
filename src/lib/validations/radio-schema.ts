import { z } from 'zod';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioValidationMessages {
  required?: string;
  invalid?: string;
}

export const createRadioSchema = (options: RadioOption[], messages?: RadioValidationMessages) => {
  const values = options.map((option) => option.value);

  return z.enum(values as [string, ...string[]], {
    errorMap: () => ({
      message: messages?.required || 'Este campo es requerido',
    }),
  });
};
