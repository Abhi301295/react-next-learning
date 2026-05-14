import { validationMessages } from "@/lib/constants/validation-messages";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: validationMessages.login.emailRequired })
    .email({ message: validationMessages.login.emailInvalid })
    .max(128, { message: validationMessages.login.emailTooLong }),

  password: z
    .string()
    .min(1, { message: validationMessages.login.passwordRequired })
    .max(128, { message: validationMessages.login.passwordTooLong }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
