"use client";

import { DEFAULT_POST_LOGIN_PATH } from "@/lib/constants/routes";
import {
  firebaseAuthCodeMessage,
  messages,
} from "@/lib/constants/messages";
import { loginSchema } from "@/lib/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppRouter } from "@/lib/navigation/use-app-router";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

function firebaseAuthErrorMessage(e: unknown): string | null {
  if (typeof e !== "object" || e === null || !("code" in e)) return null;
  const code = (e as { code?: unknown }).code;
  if (typeof code !== "string" || !code.startsWith("auth/")) return null;
  return firebaseAuthCodeMessage(code);
}

function safeRedirectPath(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return DEFAULT_POST_LOGIN_PATH;
  }
  try {
    const path = new URL(from, "https://dashboard.invalid").pathname;
    if (!path.startsWith("/") || path.startsWith("//"))
      return DEFAULT_POST_LOGIN_PATH;
    if (path === "/login") return DEFAULT_POST_LOGIN_PATH;
    return path || DEFAULT_POST_LOGIN_PATH;
  } catch {
    return DEFAULT_POST_LOGIN_PATH;
  }
}

export function useLoginForm() {
  const router = useAppRouter();
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
      const [{ getFirebaseClientAuth }, { signInWithEmailAndPassword }] =
        await Promise.all([
          import("@/lib/firebase/client-app"),
          import("firebase/auth"),
        ]);
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
              : messages.auth.signInFailed,
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
        message: msg ?? messages.auth.signInFailedRetry,
      });
    }
  });

  return {
    ...form,
    onSubmit,
    isNavigationPending,
  };
}
