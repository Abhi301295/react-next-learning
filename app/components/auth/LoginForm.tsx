'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { validateEmail, validatePassword } from '@/lib/validation';

// Types
type FormState = {
  email: string;
  password: string;
};

type FormField = keyof FormState;

type ErrorState = Record<FormField, string>;

const LoginForm = () => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ErrorState>({
    email: '',
    password: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Validators map (type-safe)
  const validators: Record<FormField, (value: string) => string> = {
    email: validateEmail,
    password: validatePassword,
  };

  // Change handler
  const handleChange = (field: FormField, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate single field
  const validateField = (field: FormField, value: string) => {
    return validators[field](value);
  };

  // Validate full form
  const validateForm = () => {
    const newErrors: ErrorState = {
      email: validateField('email', form.email),
      password: validateField('password', form.password),
    };

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  // Blur validation
  const handleBlur = (field: FormField, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

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
                onBlur={(e) => handleBlur('email', e.target.value)}
                error={submitted ? errors.email : ''}
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
                onBlur={(e) => handleBlur('password', e.target.value)}
                error={submitted ? errors.password : ''}
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
  );
};

export default LoginForm;