/** Zod and field-level copy shared by forms and schemas. */
export const validationMessages = {
  user: {
    street: "Street is required",
    city: "City is required",
    state: "State is required",
    postalCode: "Postal code is required",
    country: "Country is required",
    firstName: "First name is required",
    lastName: "Last name is required",
    usernameMin: "Username must be at least 2 characters",
    usernamePattern: "Use letters, numbers, underscores, or hyphens only",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email address",
    phoneDigitsRange:
      "Optional. Enter 8 to 15 digits only (numbers only; include country code if needed).",
    postalCodeFormat:
      "Use letters, numbers, single spaces, or hyphens only (e.g. 110001, 94102, or SW1A 1AA).",
    postalCodeLong: "Postal code is too long",
    imageUrl: "Invalid image URL",
  },
  login: {
    emailRequired: "Email is required",
    emailInvalid: "Enter a valid email address",
    emailTooLong: "Email is too long",
    passwordRequired: "Password is required",
    passwordTooLong: "Password is too long",
  },
} as const;
