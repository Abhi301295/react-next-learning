"use client";

import { loginSchema } from "@/lib/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

const POST_LOGIN_FALLBACK = "/dashboard";

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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (data: LoginFormData) => {
    form.clearErrors("root");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username.trim(),
          password: data.password,
        }),
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

      router.replace(safeRedirectPath(fromParam));
      router.refresh();
    } catch {
      form.setError("root", {
        type: "server",
        message: "Network error. Try again.",
      });
    }
  });

  return {
    ...form,
    onSubmit,
  };
}
