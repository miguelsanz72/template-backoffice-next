import { z } from "zod";

export interface CheckboxValidationMessages {
  required?: string;
  min?: string;
  max?: string;
}

export interface CheckboxOption {
  value: string;
  label: string;
}

export const createCheckboxSchema = (
  messages?: CheckboxValidationMessages,
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

export const createCheckboxGroupSchema = (
  options: CheckboxOption[],
  minSelected: number = 0,
  maxSelected?: number,
  messages?: CheckboxValidationMessages
) => {
  // Define el esquema base
  let schema = z.array(z.string());

  // Aplica refinamientos
  if (minSelected > 0) {
    const minMessage =
      messages?.min ||
      `Debes seleccionar al menos ${minSelected} opción${
        minSelected > 1 ? "es" : ""
      }`;

    schema = schema.min(minSelected, { message: minMessage });
  }

  if (maxSelected && maxSelected > 0) {
    const maxMessage =
      messages?.max ||
      `No puedes seleccionar más de ${maxSelected} opción${
        maxSelected > 1 ? "es" : ""
      }`;

    schema = schema.max(maxSelected, { message: maxMessage });
  }

  // Aplicamos un default después de los refinamientos
  return schema.default([]);
};
