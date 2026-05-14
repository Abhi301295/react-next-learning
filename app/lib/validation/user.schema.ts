import { validationMessages } from "@/lib/constants/validation-messages";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const addressSchema = z.object({
  street: z
    .string()
    .trim()
    .min(3, { message: validationMessages.user.street }),
  city: z
    .string()
    .trim()
    .min(2, { message: validationMessages.user.city }),
  state: z
    .string()
    .trim()
    .min(2, { message: validationMessages.user.state }),
  zip: z
    .string()
    .trim()
    .min(3, { message: validationMessages.user.postalCode }),
  country: z
    .string()
    .trim()
    .min(2, { message: validationMessages.user.country }),
});

/**
 * User profile form stored in Firestore (see `USERS_COLLECTION_ID` in `user-repository.ts`).
 * `status` is listing-only (active / inactive).
 */
export const userProfileFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: validationMessages.user.firstName })
    .max(50),
  lastName: z
    .string()
    .trim()
    .min(1, { message: validationMessages.user.lastName })
    .max(50),
  username: z
    .string()
    .trim()
    .min(2, { message: validationMessages.user.usernameMin })
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: validationMessages.user.usernamePattern,
    }),
  email: z
    .string()
    .trim()
    .min(1, { message: validationMessages.user.emailRequired })
    .email({ message: validationMessages.user.emailInvalid }),
  phone: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .min(7, { message: validationMessages.user.phoneShort })
      .max(40, { message: validationMessages.user.phoneLong })
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
  status: z.enum(["active", "inactive"]),
  address: addressSchema,
  image: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .url({ message: validationMessages.user.imageUrl })
      .optional()
  ),
});

export type UserProfileFormInput = z.input<typeof userProfileFormSchema>;
export type UserProfileFormValues = z.infer<typeof userProfileFormSchema>;

export const defaultUserProfileFormInput: UserProfileFormInput = {
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
