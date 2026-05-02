import {z} from "zod";

export const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(3, {message: 
        'Name must be at least 3 characters'
    })
    .max(50, {message: 'Name is too long'}),
    email: z.string()
    .trim()
    .min(1, {message: "Email is required"})
    .refine(
        (val) =>  /^\S+@\S+\.\S+$/.test(val),
        {message: 'Invalid email address'}
    ),
    role: z.enum(["admin", "user"]),
    status: z.enum(["active", "inactive"]).default("active")
});

export type UserFromData = z.infer<typeof userSchema>;