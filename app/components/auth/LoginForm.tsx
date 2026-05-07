'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLoginForm } from '@/lib/hooks/useLoginForm';

const LoginForm = () => {
  const {
    register,
    onSubmit,
    formState: { errors, isSubmitting },
  } = useLoginForm();

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-4">

      <div className="w-full max-w-md">

        <Card>

          <CardHeader>
            <CardTitle className="text-center text-xl">
              Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">

              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message}
                aria-invalid={!!errors.email}
              />

              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                {...register("password")}
                error={errors.password?.message}
                aria-invalid={!!errors.password}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>

            </form>
          </CardContent>

        </Card>

      </div>

    </section>
  );
};

export default LoginForm;