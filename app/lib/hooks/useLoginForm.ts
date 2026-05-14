"use client";

import { getFirebaseClientAuth } from "@/lib/firebase/client-app";
import { loginSchema } from "@/lib/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

const POST_LOGIN_FALLBACK = "/dashboard";

function firebaseAuthErrorMessage(e: unknown): string | null {
  if (typeof e !== "object" || e === null || !("code" in e)) return null;
  const code = (e as { code?: unknown }).code;
  if (typeof code !== "string" || !code.startsWith("auth/")) return null;
  const map: Record<string, string> = {
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
  return map[code] ?? `Firebase: ${code}`;
}

function safeRedirectPath(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return POST_LOGIN_FALLBACK;
  }
  try {
    const path = new URL(from, "https://dashboard.invalid").pathname;
    if (!path.startsWith("/") || path.startsWith("//")) return POST_LOGIN_FALLBACK;
    if (path === "/login") return POST_LOGIN_FALLBACK;
    return path || POST_LOGIN_FALLBACK;
  } catch {
    return POST_LOGIN_FALLBACK;
  }
}

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");
  const [isNavigationPending, startNavigation] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (data: LoginFormData) => {
    form.clearErrors("root");

    try {
      const auth = getFirebaseClientAuth();
      const cred = await signInWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const payload = (await res.json()) as {
        message?: string;
        user?: unknown;
      };

      if (!res.ok) {
        form.setError("root", {
          type: "server",
          message:
            typeof payload.message === "string"
              ? payload.message
              : "Sign-in failed.",
        });
        return;
      }

      const target = safeRedirectPath(fromParam);
      startNavigation(() => {
        router.replace(target);
        router.refresh();
      });
    } catch (e: unknown) {
      const msg = firebaseAuthErrorMessage(e);
      form.setError("root", {
        type: "server",
        message: msg ?? "Sign-in failed. Check email/password and try again.",
      });
    }
  });

  return {
    ...form,
    onSubmit,
    isNavigationPending,
  };
}
