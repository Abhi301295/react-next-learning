"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconEye, IconEyeOff } from "@/components/icons";
import Input from "@/components/ui/Input";
import { WorkspaceHandoffLoader } from "@/components/auth/WorkspaceHandoffLoader";
import { useLoginForm } from "@/lib/hooks/useLoginForm";
import { useState } from "react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    onSubmit,
    formState: { errors, isSubmitting },
    isNavigationPending,
  } = useLoginForm();

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="text-center text-xl">
              Sign in
            </CardTitle>
            <p className="mt-2 text-center text-xs text-subtle">
              DummyJSON accounts use a username (for example{" "}
              <code className="rounded bg-background px-1 py-px text-foreground">
                emilys
              </code>{" "}
              /{" "}
              <code className="rounded bg-background px-1 py-px text-foreground">
                emilyspass
              </code>
              ).
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Input
                id="username"
                type="text"
                label="Username"
                autoComplete="username"
                placeholder="your username"
                {...register("username")}
                error={errors.username?.message}
                aria-invalid={!!errors.username}
              />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
                aria-invalid={!!errors.password}
                rightIcon={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    iconOnly
                    className="-m-1 shrink-0 border-transparent bg-transparent text-subtle shadow-none hover:bg-panel hover:text-foreground focus-visible:ring-offset-0"
                    icon={
                      showPassword ? (
                        <IconEyeOff className="h-4 w-4" />
                      ) : (
                        <IconEye className="h-4 w-4" />
                      )
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-controls="password"
                    aria-pressed={showPassword}
                  />
                }
              />

              {errors.root?.message ? (
                <p
                  role="alert"
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {errors.root.message}
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isNavigationPending}
              >
                {isSubmitting
                  ? "Signing in…"
                  : isNavigationPending
                    ? "Opening workspace…"
                    : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {isNavigationPending ? <WorkspaceHandoffLoader /> : null}
    </section>
  );
};

export default LoginForm;
