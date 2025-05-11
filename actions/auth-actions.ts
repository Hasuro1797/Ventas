"use server"

import { signIn } from "@/auth";
import { loginFormSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { z } from "zod";

export const loginAction = async (values: z.infer<typeof loginFormSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      const authError = error as AuthError;
      return { error: (authError.cause as { err?: { message: string } })?.err?.message };
      };
    };
  }