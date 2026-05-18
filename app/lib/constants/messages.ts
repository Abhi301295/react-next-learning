/** User-facing copy for HTTP clients, API JSON bodies, and UI. */
export const messages = {
  common: {
    somethingWentWrong: "Something went wrong",
    requestCancelled: "Request was cancelled.",
    unexpectedError: "Unexpected error.",
  },
  http: {
    networkError: "Network error",
    emptyResponse: "Empty response body.",
    invalidJson: "Invalid JSON in response.",
    requestFailed: (status: number, statusText: string) =>
      `Request failed (${status} ${statusText || ""}).`.trim(),
  },
  api: {
    unauthorized: "Unauthorized",
    invalidJsonBody: "Invalid JSON body.",
    invalidUserId: "Invalid user id.",
    notFound: "Not found.",
    validationFailed: "Validation failed",
    missingAuthToken: "Missing authentication token.",
    signInInvalidOrExpired: "Invalid or expired sign-in. Try again.",
    couldNotCreateUser: "Could not create user.",
    couldNotUpdateUser: "Could not update user.",
  },
  users: {
    unexpectedListShape: "Unexpected user list response shape.",
    listLoadFailed: "Could not load users.",
    repositoryReadCreated: "Failed to read created user.",
    detailLoadFailed: "Failed to load user.",
    detailMissingDescription: "This user could not be loaded.",
    emptyListTitle: "No users found",
    emptyListDescription:
      "Try adjusting search or filters, or add a user to get started.",
    filterTitle: "Filter users",
    searchPlaceholder: "Search by name, email",
    addUser: "Add new user",
    editUser: "Edit user",
    loadForEditFailed: "Could not load user for editing.",
    requestFailed: "Request failed.",
    unexpectedServiceResponse: "Unexpected response from the user service.",
    tryAgain: "Something went wrong. Try again.",
    formFixErrors: "Please fix the errors in the form before submitting.",
    createdSuccess: "User was created.",
    updatedSuccess: "User was updated.",
  },
  auth: {
    signInFailed: "Sign-in failed.",
    signInFailedRetry:
      "Sign-in failed. Check email/password and try again.",
    signedOut: "You have been signed out.",
    signOutFailed: "Could not sign out. Try again.",
  },
  errors: {
    routePageBody:
      "We could not load this page. Check your connection and try again.",
    globalAppBody:
      "The application failed to load. Try again or reload the page.",
  },
  actions: {
    retry: "Retry",
    tryAgain: "Try again",
    reloadPage: "Reload page",
  },
} as const;

/** Firebase Auth `auth/*` codes → short user-facing strings (client). */
export const AUTH_FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/user-not-found": "No account exists for this email.",
  "auth/invalid-email": "That email address is not valid.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/invalid-api-key":
    "Firebase web API key is missing or wrong. Check NEXT_PUBLIC_FIREBASE_* in .env.local and restart the dev server.",
  "auth/network-request-failed":
    "Network error talking to Firebase. Check your connection.",
  "auth/operation-not-allowed":
    "Email/password sign-in is not enabled. In Firebase Console → Authentication → Sign-in method, enable Email/Password.",
};

export function firebaseAuthCodeMessage(code: string): string {
  return AUTH_FIREBASE_ERROR_MESSAGES[code] ?? `Firebase: ${code}`;
}
