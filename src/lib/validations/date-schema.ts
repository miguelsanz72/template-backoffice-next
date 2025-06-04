import { z } from "zod";

export interface DateValidationMessages {
  required?: string;
  minDate?: string;
  maxDate?: string;
}

export interface DateValidationOptions {
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
}

export const createDateSchema = (
  options: DateValidationOptions = {},
  messages?: DateValidationMessages
) => {
  let schema = z.date({
    required_error: messages?.required || "La fecha es requerida",
  });

  if (options.minDate) {
    schema = schema.min(options.minDate, {
      message:
        messages?.minDate ||
        `La fecha debe ser posterior a ${options.minDate.toLocaleDateString()}`,
    });
  }

  if (options.maxDate) {
    schema = schema.max(options.maxDate, {
      message:
        messages?.maxDate ||
        `La fecha debe ser anterior a ${options.maxDate.toLocaleDateString()}`,
    });
  }

  return schema;
};
