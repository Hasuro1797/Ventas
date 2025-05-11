/* eslint-disable @next/next/no-img-element */
"use client";
import { loginAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";
import { loginFormSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, Eye, EyeOff, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

export function LoginForm({
  redirect,
}: {
  redirect: string | undefined | string[];
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // const [singin, { loading, called, error }] = useMutation(SIGN_IN_MUTATION, {
  //   fetchPolicy: "no-cache",
  //   onCompleted: (data) => {
  //     const { access_token, refresh_token, user } = data.signinAdmin;
  //     setAccessTokenCookie(access_token);
  //     setRefreshTokenCookie(refresh_token);
  //     setUser(user);
  //     router.push(redirect ? redirect : "/admin");
  //   },
  // });
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(data);
      if (response?.error) {
        setError(response.error);
      } else {
        router.push(typeof redirect === "string" ? redirect : routes.home);
      }
    });
  }

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="font-sans mx-auto max-w-sm min-h-screen lg:h-auto lg:max-w-lg flex flex-col justify-center p-8"
      >
        <div className="mb-6">
          <img
            className="mx-auto dark:invert"
            src={"/logo_dark.svg"}
            alt="logo"
            width={70}
            height={70}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-foregroundTitle">
          Iniciar Sesión
        </h2>
        <p className="text-md mb-4">
          Ingrese su correo electrónico para iniciar sesión en su cuenta.
        </p>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Correo electrónico</Label>
                <FormControl>
                  <Input
                    type="email"
                    id="email"
                    placeholder="m@example.com"
                    className="focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder=""
                      className="pr-10 dark:focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 w-10 flex items-center px-2 "
                    onClick={togglePassword}
                  >
                    {showPassword ? (
                      <Eye strokeWidth={2} className="size-4" />
                    ) : (
                      <EyeOff strokeWidth={2} className="size-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="bg-primary w-full font-semibold"
          >
            {isPending ? (
              <Loader className="animate-spin size-4 repeat-infinite" />
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </div>
        {error && (
          <div className="bg-red-400 font-normal mt-6 text-sm p-2 gap-2 rounded-lg tex-center flex items-center">
            <CircleX className="size-7" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </Form>
  );
}
