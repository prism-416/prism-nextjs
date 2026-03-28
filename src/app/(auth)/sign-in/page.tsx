"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/atomics/atoms/Button";
import { Checkbox } from "@/atomics/atoms/Checkbox";
import { Input } from "@/atomics/atoms/Input";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/atomics/molecules/Field";
import { AUTH_SOCIAL_LABELS } from "@/domains/auth/constants/content";
import { GITHUB_LOGIN_URL, GOOGLE_LOGIN_URL } from "@/shared/constants/api";

const SOCIAL_OPTIONS = [
  {
    label: AUTH_SOCIAL_LABELS.github,
    href: GITHUB_LOGIN_URL,
    icon: FaGithub,
  },
  {
    label: AUTH_SOCIAL_LABELS.google,
    href: GOOGLE_LOGIN_URL,
    icon: FaGoogle,
  },
] as const;

export default function SignInPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <section className="flex items-center justify-center px-6 py-12 lg:px-8">
      <form className="w-full max-w-sm text-primary">
        <FieldSet className="gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-primary">Sign in</h1>
            <p className="text-sm text-prism-body/70">Access your workspace.</p>
          </div>

          <FieldGroup className="gap-5">
            <Field className="space-y-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl border-prism-sand bg-[rgba(252,248,239,0.88)] text-primary placeholder:text-prism-body/45"
              />
            </Field>

            <Field className="space-y-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  className="h-11 rounded-xl border-prism-sand bg-[rgba(252,248,239,0.88)] pr-12 text-primary placeholder:text-prism-body/45"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-full text-prism-body/70 hover:bg-[#e8deca] hover:text-primary"
                  onClick={() => setIsPasswordVisible(prev => !prev)}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </Field>

            <Field orientation="horizontal" className="items-center gap-3">
              <Checkbox id="remember-me" name="rememberMe" />
              <FieldLabel htmlFor="remember-me" className="text-sm font-medium text-prism-body/80">
                Keep me signed in
              </FieldLabel>
            </Field>

            <Button
              type="submit"
              className="h-11 w-full rounded-xl"
            >
              Sign in
            </Button>
          </FieldGroup>

          <FieldSeparator className="py-1">
            <span className="px-1 text-xs font-medium uppercase tracking-[0.2em] text-prism-body/50">Or</span>
          </FieldSeparator>

          <FieldSet className="gap-2">
            <FieldLegend variant="label" className="sr-only">
              Continue with a social account
            </FieldLegend>
            {SOCIAL_OPTIONS.map(option => {
              const Icon = option.icon;

              return (
                <Button
                  key={option.label}
                  asChild
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-start gap-3 rounded-xl border-prism-sand bg-[rgba(252,248,239,0.88)] text-primary hover:bg-[#e8deca]"
                >
                  <a href={option.href}>
                    <Icon className="size-4" />
                    {option.label}
                  </a>
                </Button>
              );
            })}
          </FieldSet>

          <p className="text-center text-sm text-prism-body/70">
            New to Prizmatic?{" "}
            <Link href="/sign-up" className="font-semibold text-primary underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </FieldSet>
      </form>
    </section>
  );
}
