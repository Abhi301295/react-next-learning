'use client';

import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import Input from "../ui/input";
import {Button} from "../ui/button";

const LoginFrom = () => {
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

            <form className="space-y-4">

              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
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