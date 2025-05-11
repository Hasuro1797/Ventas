/* eslint-disable @next/next/no-img-element */
import { LoginForm } from "@/components/auth/LoginForm";
import React from "react";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const p = (await searchParams).p;
  return (
    <section className="grid min-h-svh lg:grid-cols-2">
      <LoginForm redirect={p} />
      <div className="relative hidden bg-muted lg:flex justify-center items-center">
        <img src="/background-auth.png" alt="Image" className="w-[70%]" />
      </div>
    </section>
  );
}
