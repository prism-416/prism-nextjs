import { Sparkles } from "lucide-react";

import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";

import LandingCtaLink from "./LandingCtaLink";
import { HERO_CONTENT, HERO_FEATURES, type LandingHeroFeature } from "../constants/content";

export default function LandingHeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-(image:--gradient-hero-surface)"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-prism-teal-500/60 to-transparent" />
      <div className="pointer-events-none absolute right-[-12rem] top-10 size-[34rem] rounded-full bg-prism-glow-sky/14 blur-3xl" />
      <div className="pointer-events-none absolute right-20 top-24 size-72 rounded-full bg-prism-glow-violet/10 blur-3xl" />

      <Container className="relative py-16 md:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-prism-teal-500/30 bg-surface-strong/85 px-4 py-1.5 shadow-sm backdrop-blur">
                <Sparkles
                  className="size-3.5 text-prism-teal-500"
                  aria-hidden
                />
                <Typography
                  as="span"
                  variant="overline"
                  tone="inherit"
                  weight="medium"
                  className="text-prism-navy"
                >
                  {HERO_CONTENT.badge}
                </Typography>
              </div>
            </div>

            <Typography
              id="hero-heading"
              variant="display"
              tone="inherit"
              wrap="balance"
              align="center"
              className="mt-6 text-prism-navy lg:text-left"
            >
              {HERO_CONTENT.title}
            </Typography>

            <Typography
              variant="bodyLg"
              tone="muted"
              wrap="pretty"
              className="mx-auto mt-6 max-w-2xl lg:mx-0 lg:text-left"
              align="center"
            >
              {HERO_CONTENT.description}
            </Typography>

            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <LandingCtaLink
                href={HERO_CONTENT.primaryCta.href}
                label={HERO_CONTENT.primaryCta.label}
                variant="primary"
              />
              <LandingCtaLink
                href={HERO_CONTENT.secondaryCta.href}
                label={HERO_CONTENT.secondaryCta.label}
                variant="secondary"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-xl lg:mr-0">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_56%_46%,rgba(99,178,255,0.2),transparent_58%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface-strong/90 p-4 shadow-2xl shadow-prism-navy/10 backdrop-blur">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,241,168,0.32),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(157,123,255,0.14),transparent_28%)]" />
                <div className="relative rounded-[1.5rem] border border-border/70 bg-white/85 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Typography
                        variant="overline"
                        tone="muted"
                        weight="medium"
                      >
                        Prizmatic core
                      </Typography>
                      <Typography
                        variant="title"
                        tone="inherit"
                        className="mt-2 text-prism-navy"
                      >
                        Autonomous coordination layer
                      </Typography>
                    </div>
                    <div className="rounded-full border border-prism-teal-500/30 bg-prism-teal-500/10 px-3 py-1 text-xs font-semibold text-prism-navy">
                      Live
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1 xl:grid-cols-[0.9fr_1.1fr]">
                    <HeroPrismGraphic />

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                      {HERO_FEATURES.map(feature => (
                        <HeroFeatureCard
                          key={feature.title}
                          feature={feature}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroPrismGraphic() {
  return (
    <div
      className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-[1.5rem] border border-border bg-prism-sand-soft/45"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,107,198,0.16),transparent_38%),radial-gradient(circle_at_52%_58%,rgba(98,215,199,0.22),transparent_46%)]" />
      <div className="absolute left-5 top-5 size-16 rounded-full border border-white/70" />
      <div className="absolute bottom-6 right-6 size-24 rounded-full bg-prism-glow-gold/22 blur-2xl" />

      <div className="relative size-44">
        <div className="absolute inset-1 rotate-45 rounded-[2rem] border border-white/70 bg-[conic-gradient(from_140deg_at_50%_50%,rgba(255,241,168,0.96),rgba(255,107,198,0.62),rgba(99,178,255,0.72),rgba(98,215,199,0.86),rgba(255,241,168,0.96))] shadow-2xl shadow-prism-navy/15" />
        <div className="absolute inset-8 rotate-45 rounded-[1.25rem] border border-white/55 bg-white/28 backdrop-blur-sm" />
        <div className="absolute left-1/2 top-1/2 h-[76%] w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/65" />
        <div className="absolute left-1/2 top-1/2 h-[76%] w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white/45" />
      </div>
    </div>
  );
}

function HeroFeatureCard({ feature }: { feature: LandingHeroFeature }) {
  const Icon = feature.icon;

  return (
    <article className="rounded-2xl border border-border/70 bg-white/90 p-4 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-prism-teal-500/45 hover:shadow-md">
      <div className="flex size-10 items-center justify-center rounded-xl bg-prism-navy text-white shadow-lg shadow-prism-navy/12">
        <Icon
          className="size-4"
          aria-hidden
        />
      </div>
      <Typography
        variant="bodySm"
        tone="inherit"
        weight="semibold"
        className="mt-4 text-prism-navy"
      >
        {feature.title}
      </Typography>
      <Typography
        variant="caption"
        tone="muted"
        lineHeight="5"
        className="mt-1.5"
      >
        {feature.description}
      </Typography>
    </article>
  );
}
