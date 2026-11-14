import { z } from "zod";
import { createEmailSchema } from "./email-schema";

export const usernameSchema = z
  .string()
  .min(2, {
    message: "El nombre de usuario debe tener al menos 2 caracteres",
  })
  .max(10, {
    message: "El nombre de usuario debe tener menos de 10 caracteres",
  });

export const genderSchema = z.enum(["male", "female"], {
  error: () => "Gender is required",
});

export const dateSchema = z.date();

export const marketingEmailSchema = z.boolean().default(false);

export const formSchema = z
  .object({
    username: usernameSchema,
    email: createEmailSchema(),
    gender: genderSchema,
    date: dateSchema,
    marketingEmail: marketingEmailSchema,
  })
  .refine((data) => data.marketingEmail === true, {
    message: "You must by check marketing email",
    path: ["marketingEmail"],
  });
