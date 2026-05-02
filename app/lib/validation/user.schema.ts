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
    phone: z
        .string()
        .trim()
        .regex(/^\d{10}$/, { message: "Phone must be 10 digits" })
        .optional(),
    role: z.enum(["admin", "user"]),
    status: z.enum(["active", "inactive"]),

    addresses: z.array(
        z.object({
            street: z.string().min(3, "Street required"),
            city: z.string().min(2, "City required"),
            state: z.string().min(2, "State required"),
            zip: z.string().min(4, "Invalid ZIP"),
            country: z.string().min(2, "Country required"),
        })
    ).min(1, "At least one address required"),
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

export type UserFormData = z.infer<typeof userSchema>;