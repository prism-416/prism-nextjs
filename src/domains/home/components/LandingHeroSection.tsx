import Image from "next/image";
import { Sparkles } from "lucide-react";

import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";

import LandingCtaLink from "./LandingCtaLink";
import { HERO_CONTENT, HERO_FEATURES, type LandingHeroFeature } from "../constants/content";

export default function LandingHeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-[#f8f7fc]"
    >
      <Container className="relative py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="relative z-30 lg:col-span-6">
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
              className="mt-5 text-[2.75rem] leading-[0.98] text-prism-navy sm:mt-6 sm:text-[3.5rem] md:text-[4.5rem] lg:text-left lg:text-[5rem] xl:text-[5.5rem]"
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

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
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

          <div className="relative z-10 lg:col-span-6">
            <div className="relative isolate mx-auto min-h-72 max-w-3xl sm:min-h-88 lg:mr-0 lg:min-h-112">
              <div className="pointer-events-none absolute inset-x-[-28%] -top-24 bottom-[-28%] z-0">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_52%_60%,rgba(128,192,255,0.24),transparent_54%)] blur-3xl" />
                <Image
                  src="/images/prizmatic-crystal-logo-hero.png"
                  alt="Prizmatic crystal prism"
                  width={3072}
                  height={2048}
                  priority
                  quality={100}
                  sizes="(min-width: 1280px) 960px, (min-width: 1024px) 840px, calc(100vw - 48px)"
                  className="relative z-0 h-full w-full object-contain"
                />
              </div>

              <div className="relative z-10 min-h-72 sm:min-h-88 lg:min-h-112" />

              <div className="relative z-20 grid gap-3 sm:grid-cols-2 lg:absolute lg:right-0 lg:top-1/2 lg:w-64 lg:-translate-y-1/2 lg:grid-cols-1 2xl:translate-x-20">
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
      </Container>
    </section>
  );
}

function HeroFeatureCard({ feature }: { feature: LandingHeroFeature }) {
  const Icon = feature.icon;

  return (
    <article className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-prism-navy/10 backdrop-blur-md transition duration-150 hover:-translate-y-0.5 hover:bg-white/90 sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-prism-navy text-white shadow-md shadow-prism-navy/10">
          <Icon
            className="size-5"
            aria-hidden
          />
        </div>
        <div>
          <Typography
            variant="caption"
            tone="inherit"
            weight="semibold"
            className="text-prism-navy"
          >
            {feature.title}
          </Typography>
          <Typography
            variant="caption"
            tone="muted"
            lineHeight="5"
            className="mt-1"
          >
            {feature.description}
          </Typography>
        </div>
      </div>
    </article>
  );
}
