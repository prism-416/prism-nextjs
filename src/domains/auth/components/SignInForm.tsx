"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@/atomics/atoms/Button";
import { Checkbox } from "@/atomics/atoms/Checkbox";
import { Typography } from "@/atomics/atoms/Typography";
import { signInWithEmail } from "@/domains/auth/api";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/atomics/molecules/Field";
import { AuthFormSeparator } from "./AuthFormSeparator";
import { AuthPasswordField } from "./AuthPasswordField";
import { AuthSocialButtons } from "./AuthSocialButtons";
import { AuthTextField } from "./AuthTextField";

export function SignInForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: NonNullable<React.ComponentProps<"form">["onSubmit"]> = async event => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signInWithEmail({
        email: trimmedEmail,
        password,
      });
      const data = result?.data;

      if (!data?.accessToken) {
        setErrorMessage(result?.message || "Sign in failed.");
        return;
      }

      const ok = await setSession(data);
      if (!ok) {
        setErrorMessage("Failed to establish session.");
        return;
      }

      router.replace("/");
    } catch {
      setErrorMessage("Sign in failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-6 py-12 lg:px-8">
      <form
        className="w-full max-w-sm text-primary"
        onSubmit={handleSubmit}
      >
        <FieldSet className="gap-6">
          <div className="space-y-1">
            <Typography
              variant="h3"
              tone="primary"
            >
              Sign in
            </Typography>
            <Typography
              variant="bodySm"
              tone="inherit"
              className="text-prism-body/70"
            >
              Access your workspace.
            </Typography>
          </div>

          <FieldGroup className="gap-5">
            <AuthTextField
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={value => {
                setErrorMessage(null);
                setEmail(value);
              }}
            />

            <AuthPasswordField
              id="password"
              name="password"
              label="Password"
              autoComplete="current-password"
              placeholder="Password"
              isVisible={isPasswordVisible}
              value={password}
              onChange={value => {
                setErrorMessage(null);
                setPassword(value);
              }}
              onVisibilityToggle={() => setIsPasswordVisible(prev => !prev)}
            />

            <Field
              orientation="horizontal"
              className="items-center gap-3"
            >
              <Checkbox
                id="remember-me"
                name="rememberMe"
              />
              <FieldLabel
                htmlFor="remember-me"
                className="text-sm font-medium text-prism-body/80"
              >
                Keep me signed in
              </FieldLabel>
            </Field>

            <Button
              type="submit"
              className="h-11 w-full rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </FieldGroup>

          {errorMessage ? (
            <Typography
              variant="bodySm"
              tone="inherit"
              className="text-center text-red-500"
            >
              {errorMessage}
            </Typography>
          ) : null}

          <AuthFormSeparator />

          <AuthSocialButtons legend="Continue with a social account" />

          <Typography
            variant="bodySm"
            tone="inherit"
            align="center"
            className="text-prism-body/70"
          >
            New to Prizmatic?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Create an account
            </Link>
          </Typography>
        </FieldSet>
      </form>
    </section>
  );
}
