import { z } from "zod";

export interface SwitchValidationMessages {
  required?: string;
}

export const createSwitchSchema = (
  messages?: SwitchValidationMessages,
  required: boolean = false
) => {
  const baseSchema = z.boolean().default(false);

  if (required) {
    return baseSchema.refine((val) => val === true, {
      message: messages?.required || "Este campo es requerido",
    });
  }

  return baseSchema;
};
