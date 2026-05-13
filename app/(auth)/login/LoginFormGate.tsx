"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoginFormSkeleton from "./LoginFormSkeleton";

const LoginFormFields = dynamic(
  () => import("@/components/auth/LoginFormFields"),
  {
    loading: () => <LoginFormSkeleton />,
  }
);

export default function LoginFormGate() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginFormFields />
    </Suspense>
  );
}
