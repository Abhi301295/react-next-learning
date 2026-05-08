'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation/auth.schema";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // matches your previous behavior
  });

  const onSubmit = async (_data: LoginFormData) => {
    try {
      await new Promise((res) => setTimeout(res, 1000));
    } catch (err) {
      console.error(err);
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};