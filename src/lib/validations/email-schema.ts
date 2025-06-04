import { z } from "zod";

export interface EmailValidationMessages {
  required?: string;
  invalid?: string;
}

export const createEmailSchema = (messages?: EmailValidationMessages) => {
  return z
    .string({
      required_error: messages?.required || "El email es requerido",
    })
    .email({
      message: messages?.invalid || "Dirección de correo electrónico inválida",
    });
};
