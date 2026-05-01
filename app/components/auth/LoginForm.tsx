'use client';

import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import Input from "../ui/input";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { validateEmail, validatePassword } from "@/lib/validation";

type FormState = {
  email: string;
  password: string;
};

type FormField = keyof FormState;

type ErrorState = Record<FormField, string>;


const LoginFrom = () => {

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<ErrorState>({ email: '', password: '' });

  const validators: Record<FormField, (value: string) => string> = {
    email: validateEmail,
    password: validatePassword,
  };

  const handleChange = (field: FormField, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateField = (field: FormField, value: string) => {
    return validators[field](value);
  };

  const validateForm = () => {
    const newErrors: ErrorState = {
      email: validateField('email', form.email),
      password: validateField('password', form.password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleBlur = (field: FormField, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log('Form Submitted:', form);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md">

        <Card>

          <CardHeader>
            <CardTitle className="text-center text-xl">
              Login
            </CardTitle>

          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                onBlur={handleBlur}
                aria-invalid={!!errors.email}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={handleBlur}
                error={errors.password}
                aria-invalid={!!errors.password}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>

            </form>
          </CardContent>

        </Card>

      </div>

    </section>
  )
}

export default LoginFrom;