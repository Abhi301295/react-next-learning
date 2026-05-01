'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useLoginForm } from '@/lib/hooks/useLoginForm';

const LoginForm = () => {
  const {
    form,
    errors,
    submitted,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLoginForm();

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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

            </form>
          </CardContent>

        </Card>

      </div>

    </section>
  );
};

export default LoginForm;