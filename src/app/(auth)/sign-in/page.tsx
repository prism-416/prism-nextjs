"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/atomics/atoms/Button";
import { Checkbox } from "@/atomics/atoms/Checkbox";
import { Input } from "@/atomics/atoms/Input";
import { SoftAurora } from "@/atomics/atoms/SoftAurora";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/atomics/molecules/Field";
import { AUTH_HIGHLIGHTS, AUTH_SOCIAL_LABELS, SIGN_IN_CONTENT } from "@/domains/auth/constants/content";
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
    <main className="min-h-screen bg-[linear-gradient(90deg,#f4ecd6_0%,#f4ecd6_25%,#0c4767_25%,#0c4767_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_3fr]">
        <section className="flex items-center justify-center px-6 py-12 lg:px-8">
          <form className="w-full max-w-sm text-primary">
            <FieldSet>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-primary">{SIGN_IN_CONTENT.title}</h1>
                <p className="text-sm text-prism-body/70">{SIGN_IN_CONTENT.description}</p>
              </div>

              <FieldGroup>
                <Field className="space-y-2">
                  <FieldLabel htmlFor="email">{SIGN_IN_CONTENT.emailLabel}</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={SIGN_IN_CONTENT.emailPlaceholder}
                    className="border-prism-sand bg-[rgba(252,248,239,0.88)] text-primary placeholder:text-prism-body/45"
                  />
                </Field>

                <Field className="space-y-2">
                  <FieldLabel htmlFor="password">{SIGN_IN_CONTENT.passwordLabel}</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={SIGN_IN_CONTENT.passwordPlaceholder}
                      className="border-prism-sand bg-[rgba(252,248,239,0.88)] pr-12 text-primary placeholder:text-prism-body/45"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-full text-prism-body/70 hover:bg-[#e8deca] hover:text-primary"
                      onClick={() => setIsPasswordVisible(prev => !prev)}
                      aria-label={isPasswordVisible ? SIGN_IN_CONTENT.hidePasswordLabel : SIGN_IN_CONTENT.showPasswordLabel}
                    >
                      {isPasswordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </Field>

                <Field orientation="horizontal" className="items-center gap-3">
                  <Checkbox id="remember-me" name="rememberMe" />
                  <FieldLabel htmlFor="remember-me" className="text-sm font-medium text-prism-body/80">
                    {SIGN_IN_CONTENT.rememberMeLabel}
                  </FieldLabel>
                </Field>

                <Button
                  type="submit"
                  className="w-full"
                >
                  {SIGN_IN_CONTENT.submitLabel}
                </Button>
              </FieldGroup>

              <FieldSeparator className="py-1">
                <span className="px-1 text-xs font-medium uppercase tracking-[0.2em] text-prism-body/50">
                  {SIGN_IN_CONTENT.socialSeparatorLabel}
                </span>
              </FieldSeparator>

              <FieldSet className="gap-2">
                <FieldLegend variant="label" className="sr-only">
                  {SIGN_IN_CONTENT.socialLegend}
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
                {SIGN_IN_CONTENT.signUpPrompt}{" "}
                <Link href="/sign-up" className="font-semibold text-primary underline underline-offset-4">
                  {SIGN_IN_CONTENT.signUpLabel}
                </Link>
              </p>
            </FieldSet>
          </form>
        </section>

        <section className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(180deg,#0c4767_0%,#08344b_100%)]" />
          <div className="absolute inset-0 opacity-45 mix-blend-screen">
            <SoftAurora
              color1="#f4ecd6"
              color2="#78c4d4"
              speed={0.35}
              scale={1.1}
              brightness={0.7}
              noiseFrequency={1.8}
              noiseAmplitude={0.7}
              bandHeight={0.62}
              bandSpread={1.6}
              octaveDecay={0.55}
              layerOffset={0.8}
              colorSpeed={0.45}
              mouseInfluence={0.08}
            />
          </div>
          <div className="absolute inset-y-12 left-12 w-px bg-white/12" />
          <div className="absolute right-[-8%] top-20 h-64 w-64 rounded-full bg-[#f4ecd6]/10 blur-3xl" />
          <div className="absolute bottom-16 right-20 h-40 w-40 rounded-full border border-white/10" />

          <div className="relative flex h-full flex-col justify-between px-12 py-14 text-white">
            <div className="max-w-2xl space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f4ecd6]/70">{SIGN_IN_CONTENT.panelEyebrow}</p>
                <div className="space-y-4">
                  <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white xl:text-5xl">
                    {SIGN_IN_CONTENT.panelTitle}
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-white/72">{SIGN_IN_CONTENT.panelDescription}</p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                {AUTH_HIGHLIGHTS.map(item => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm"
                  >
                    <h3 className="text-sm font-semibold tracking-[0.02em] text-[#f4ecd6]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/72">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="max-w-xl border-t border-white/12 pt-8">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#f4ecd6]/72">
                {SIGN_IN_CONTENT.panelFooterEyebrow}
              </p>
              <p className="mt-3 text-base leading-7 text-white/68">{SIGN_IN_CONTENT.panelFooterDescription}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
