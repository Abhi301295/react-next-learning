import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" })
    .max(128, { message: "Email is too long" }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(128, { message: "Password is too long" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
