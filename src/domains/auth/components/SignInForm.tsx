"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@/atomics/atoms/Button";
import { Checkbox } from "@/atomics/atoms/Checkbox";
import { Typography } from "@/atomics/atoms/Typography";
import { signInWithEmail } from "@/domains/auth/api";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/atomics/molecules/Field";
import { AUTHENTICATED_ENTRY_PATH } from "@/shared/constants/site";
import { AuthFormSeparator } from "./AuthFormSeparator";
import { AuthPasswordField } from "./AuthPasswordField";
import { AuthSocialButtons } from "./AuthSocialButtons";
import { AuthTextField } from "./AuthTextField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignInFieldName = "email" | "password";

type SignInFieldErrors = Partial<Record<SignInFieldName, string>>;

type SignInError = {
  fields?: SignInFieldName[];
  message: string;
  messageField?: SignInFieldName;
};

function getSignInError(code?: string, message?: string): SignInError {
  if (code === "INVALID_CREDENTIALS") {
    return {
      fields: ["email", "password"],
      message: "Email or password is incorrect.",
      messageField: "password",
    };
  }

  if (code === "EMAIL_NOT_VERIFIED") {
    return {
      fields: ["email"],
      message: "Verify your email before signing in.",
      messageField: "email",
    };
  }

  return { message: message || "Sign in failed. Please try again." };
}

export function SignInForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({});
  const [invalidFields, setInvalidFields] = useState<Partial<Record<SignInFieldName, boolean>>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: NonNullable<React.ComponentProps<"form">["onSubmit"]> = async event => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFieldErrors({ email: "Email is required." });
      setInvalidFields({ email: true });
      setErrorMessage(null);
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setFieldErrors({ email: "Enter a valid email address." });
      setInvalidFields({ email: true });
      setErrorMessage(null);
      return;
    }

    if (!password) {
      setFieldErrors({ password: "Password is required." });
      setInvalidFields({ password: true });
      setErrorMessage(null);
      return;
    }

    setFieldErrors({});
    setInvalidFields({});
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signInWithEmail({
        email: trimmedEmail,
        password,
      });
      const data = result?.data;

      if (!data?.accessToken) {
        const signInError = getSignInError(result?.code, result?.message);

        if (signInError.fields?.length) {
          setInvalidFields(Object.fromEntries(signInError.fields.map(field => [field, true])));
          setFieldErrors(signInError.messageField ? { [signInError.messageField]: signInError.message } : {});
          return;
        }

        setErrorMessage(signInError.message);
        return;
      }

      const ok = await setSession(data);
      if (!ok) {
        setErrorMessage("Failed to establish session.");
        return;
      }

      router.replace(AUTHENTICATED_ENTRY_PATH);
    } catch {
      setErrorMessage("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-6 py-12 lg:px-8">
      <form
        className="w-full max-w-sm text-primary"
        onSubmit={handleSubmit}
        noValidate
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
              error={fieldErrors.email}
              invalid={invalidFields.email}
              onChange={value => {
                setFieldErrors({});
                setInvalidFields({});
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
              error={fieldErrors.password}
              invalid={invalidFields.password}
              onChange={value => {
                setFieldErrors({});
                setInvalidFields({});
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
              {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Sign in
            </Button>

            <div
              className="min-h-6 text-center"
              aria-live="polite"
            >
              {errorMessage ? (
                <Typography
                  variant="bodySm"
                  tone="inherit"
                  className="text-red-500"
                >
                  {errorMessage}
                </Typography>
              ) : null}
            </div>
          </FieldGroup>

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
