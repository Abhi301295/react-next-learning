import { z } from "zod";

export const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(3, {
        message:
            'Name must be at least 3 characters'
    })
        .max(50, { message: 'Name is too long' }),
    email: z.string()
        .trim()
        .min(1, { message: "Email is required" })
        .refine(
            (val) => /^\S+@\S+\.\S+$/.test(val),
            { message: 'Invalid email address' }
        ),
    role: z.enum(["admin", "user"]),
    status: z.enum(["active", "inactive"]).default("active"),

    address: z
        .object({
            street: z.string().trim().min(3, { message: 'Street is required' }),
            city: z.string().trim().min(2, { message: 'City is required' }),
            state: z.string().trim().min(2, { message: 'State required' }),
            zip: z.string().trim().min(4, { message: "Invalid ZIP" }),
            country: z.string().trim().min(2, { message: "Country required" }),
        }),
    description: z
        .string()
        .trim()
        .max(200, { message: "Max 200 characters allowed" })
        .optional(),
    avatar: z
        .string()
        .url({ message: "Invalid URL" })
        .optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type UserFromData = z.infer<typeof userSchema>;