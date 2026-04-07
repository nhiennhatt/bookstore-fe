"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { login } from "@/services/auth/login";
import { cn } from "@/lib/utils/cn";
import { loginSchema } from "@/lib/validations/auth";
import z from "zod";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useUser, useLoadingUser } from "@/hooks";
import { useRouter } from "next/navigation";
import { useLoadUser } from "@/hooks";

function InputField({
  label,
  id,
  className,
  error,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  id: string;
  error?: string;
}) {
  return (
    <Field className={cn("grid gap-2", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        className="transition-[box-shadow,border-color] duration-200"
        {...props}
        aria-invalid={error ? "true" : "false"}
      />
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </Field>
  );
}

export function Auth() {
  const base = useId();
  const router = useRouter();
  const [, setUser] = useUser();
  const [, setLoading] = useLoadingUser();
  const loadUser = useLoadUser();

  const [signinUsername, setSigninUsername] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = async () => {
    let parsedData: z.infer<typeof loginSchema>;
    setErrors({});

    try {
      parsedData = loginSchema.parse({
        username: signinUsername,
        password: signinPassword,
      });
    } catch (error) {
      const resultError = error as z.ZodError<typeof loginSchema>;
      const errors = new Map(
        resultError.issues.map((issue) => {
          const key = issue.path.join(".");
          return [
            `signin${key.charAt(0).toUpperCase() + key.slice(1)}`,
            issue.message,
          ];
        }),
      );
      setErrors(Object.fromEntries(errors));
      return;
    }
    await login(parsedData.username, parsedData.password);
    await loadUser();
    router.push("/");
  };

  const tabPanelClass =
    "flex flex-col gap-4 outline-none duration-300 ease-out data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 motion-reduce:data-[state=active]:animate-none";

  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      <div className="absolute inset-0 animate-in fade-in duration-700 motion-reduce:animate-none">
        <Image
          src="/auth_bg.webp"
          alt=""
          fill
          priority
          className="object-cover motion-reduce:animate-none animate-[auth-bg-drift_28s_ease-in-out_infinite_alternate]"
          sizes="100vw"
        />
      </div>
      <div
        className="absolute inset-0 animate-in fade-in duration-500 bg-linear-to-br from-background/85 via-background/55 to-primary/25 motion-reduce:animate-none"
        aria-hidden
      />
      <div className="relative flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
        <div
          className={cn(
            "w-full max-w-md rounded-2xl border border-border/60 bg-card/90 p-6 shadow-xl backdrop-blur-md sm:p-8",
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out motion-reduce:animate-none",
          )}
        >
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 text-center delay-100 duration-500 fill-mode-both motion-reduce:animate-none">
            <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              BOOKSHOP
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Đăng nhập hoặc tạo tài khoản mới
            </p>
          </div>

          <Tabs defaultValue="signin" className="gap-6">
            <TabsList className="grid w-full grid-cols-2 duration-200">
              <TabsTrigger
                value="signin"
                className="transition-[color,background-color,box-shadow] duration-200 ease-out"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="transition-[color,background-color,box-shadow] duration-200 ease-out"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className={tabPanelClass}>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <InputField
                  id={`${base}-signin-username`}
                  name="username"
                  label="Tên đăng nhập"
                  type="text"
                  autoComplete="username"
                  required
                  value={signinUsername}
                  onChange={(e) => setSigninUsername(e.target.value)}
                  error={errors.signinUsername}
                />
                <InputField
                  id={`${base}-signin-password`}
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  error={errors.signinPassword}
                />
                <Button
                  type="submit"
                  className="mt-1 w-full"
                  size="lg"
                  onClick={handleLogin}
                >
                  Đăng nhập
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className={tabPanelClass}>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <InputField
                  id={`${base}-signup-username`}
                  name="username"
                  label="Tên đăng nhập"
                  type="text"
                  autoComplete="username"
                  required
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  error={errors.signupUsername}
                />
                <InputField
                  id={`${base}-signup-email`}
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  error={errors.signupEmail}
                />
                <InputField
                  id={`${base}-signup-password`}
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  error={errors.signupPassword}
                />
                <Button type="submit" className="mt-1 w-full" size="lg">
                  Đăng ký
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 animate-in fade-in text-center text-sm text-muted-foreground delay-200 duration-500 fill-mode-both motion-reduce:animate-none">
            <Link
              href="/"
              className="font-medium text-primary underline-offset-4 transition-colors duration-200 hover:underline"
            >
              Về cửa hàng
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
