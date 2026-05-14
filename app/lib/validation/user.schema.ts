import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const addressSchema = z.object({
  street: z.string().trim().min(3, { message: "Street is required" }),
  city: z.string().trim().min(2, { message: "City is required" }),
  state: z.string().trim().min(2, { message: "State is required" }),
  zip: z.string().trim().min(3, { message: "Postal code is required" }),
  country: z.string().trim().min(2, { message: "Country is required" }),
});

/**
 * Directory user profile stored in Firestore (`directory_users`).
 * `status` is listing-only (active / inactive).
 */
export const dummyJsonUserFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50),
  username: z
    .string()
    .trim()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Use letters, numbers, underscores, or hyphens only",
    }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  phone: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .min(7, { message: "Phone is too short" })
      .max(40, { message: "Phone is too long" })
      .optional()
  ),
  age: z.preprocess((v) => {
    if (v === "" || v === undefined || v === null) return undefined;
    const n = typeof v === "string" ? Number(v) : Number(v);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().int().min(1).max(120).optional()),
  gender: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(["male", "female", "other"]).optional()
  ),
  role: z.enum(["admin", "user"]),
  /** Used for local listing only (not sent upstream). */
  status: z.enum(["active", "inactive"]),
  address: addressSchema,
  image: z.preprocess(
    emptyToUndefined,
    z.string().url({ message: "Invalid image URL" }).optional()
  ),
});

export type DummyJsonUserFormData = z.input<typeof dummyJsonUserFormSchema>;
export type DummyJsonUserFormValues = z.infer<typeof dummyJsonUserFormSchema>;

export const defaultDummyJsonUserFormValues: DummyJsonUserFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  age: undefined,
  gender: "",
  role: "user",
  status: "active",
  address: {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
  image: "",
};
