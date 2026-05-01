'use client';

import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import Input from "../ui/input";
import { Button } from "../ui/button";
import React, { useState } from "react";

const LoginFrom = () => {

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const validate = () => {
    const newErrors = { email: '', password: '' };
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid Email';
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log(form);


  }
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
                onChange={handleChange}
                error={errors.email}
                aria-invalid={!!errors.email}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
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