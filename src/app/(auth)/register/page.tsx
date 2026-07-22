import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register | Nepali Community UK",
  description: "Create your Nepali Community UK account.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
      <p className="mt-2 text-muted-foreground">
        Join the largest Nepali community platform in the UK.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
