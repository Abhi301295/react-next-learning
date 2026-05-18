import UsersClient from "./client-page";
import UseImperativeDemo from "./useImperativeDemo";
import UseReducerDemo from "./useReducerDemo";
import UseDeferredValueDemo from "./useDefferedValueDemo";
import UseTransitionDemo from "./useTransitionDemo";
import type { Metadata } from "next";
import UseLayoutEffectDemo from "./useLayoutEffectDemo";
import UseActionStateDemo from "./useActionStateDemo";
import { Form } from "./Form";

export const metadata: Metadata = {
  title: "Testing",
  description: "Testing area for redirects and users flow.",
  alternates: {
    canonical: "/testing",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestingPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Testing Redirects and Users</h1>
        <div className="mb-8 space-y-4">
          {/* <UseReducerDemo />
          <UseImperativeDemo />
          <UseTransitionDemo />
          <UseDeferredValueDemo />
          <UseLayoutEffectDemo />
          <UseActionStateDemo /> */}
          <Form />
        </div>
      <UsersClient />
    </div>
  );
}