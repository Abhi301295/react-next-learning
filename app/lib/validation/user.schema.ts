import { validationMessages } from "@/lib/constants/validation-messages";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

/** E.164-style length on digits only (8–15 subscriber digits incl. country code). */
export const USER_PHONE_DIGIT_MIN = 8;
export const USER_PHONE_DIGIT_MAX = 15;

const phoneDigitCountRegex = new RegExp(
  `^\\d{${USER_PHONE_DIGIT_MIN},${USER_PHONE_DIGIT_MAX}}$`
);

function preprocessPhone(value: unknown): unknown {
  if (value === "" || value === undefined || value === null) return undefined;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const digits = trimmed.replace(/\D/g, "").slice(0, USER_PHONE_DIGIT_MAX);
  return digits === "" ? undefined : digits;
}

/** Postal / PIN: letters, digits, single internal spaces or hyphens between groups. */
const POSTAL_CODE_PATTERN = /^[A-Za-z0-9]+(?:[\s-][A-Za-z0-9]+)*$/;
const POSTAL_CODE_MAX_LEN = 16;

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
    .min(3, { message: validationMessages.user.postalCode })
    .max(POSTAL_CODE_MAX_LEN, {
      message: validationMessages.user.postalCodeLong,
    })
    .regex(POSTAL_CODE_PATTERN, {
      message: validationMessages.user.postalCodeFormat,
    }),
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
    preprocessPhone,
    z
      .string()
      .optional()
      .refine(
        (s) => s === undefined || phoneDigitCountRegex.test(s),
        { message: validationMessages.user.phoneDigitsRange }
      )
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
