import { Sparkles } from "lucide-react";

import ColorBends from "@/atomics/atoms/ColorBends";
import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";

import LandingCtaLink from "./LandingCtaLink";
import LandingSignalCard from "./LandingSignalCard";
import { HERO_BACKGROUND, HERO_CONTENT, LANDING_SIGNALS } from "../constants/content";

export default function LandingHeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-[image:var(--gradient-hero-surface)]"
    >
      <ColorBends
        className="pointer-events-none absolute inset-0 opacity-[0.98] mask-[radial-gradient(circle_at_center,black,transparent_82%)]"
        colors={[...HERO_BACKGROUND.colors]}
        speed={HERO_BACKGROUND.speed}
        scale={HERO_BACKGROUND.scale}
        frequency={HERO_BACKGROUND.frequency}
        warpStrength={HERO_BACKGROUND.warpStrength}
        autoRotate={HERO_BACKGROUND.autoRotate}
        mouseInfluence={HERO_BACKGROUND.mouseInfluence}
        parallax={HERO_BACKGROUND.parallax}
        noise={HERO_BACKGROUND.noise}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-prism-teal-500/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-hero-overlay)]" />
      <div className="pointer-events-none absolute left-4 top-20 size-48 rounded-full bg-prism-glow-gold/22 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-1/2 size-52 rounded-full bg-prism-glow-magenta/12 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-14 size-56 rounded-full bg-prism-glow-violet/16 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-1/4 size-64 rounded-full bg-prism-glow-sky/12 blur-3xl" />

      <Container className="relative py-18 md:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-1.5 shadow-sm backdrop-blur">
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
            className="mt-6 text-center text-prism-navy"
          >
            {HERO_CONTENT.title}
          </Typography>

          <Typography
            variant="bodyLg"
            tone="muted"
            wrap="pretty"
            className="mx-auto mt-6 max-w-2xl"
            align="center"
          >
            {HERO_CONTENT.description}
          </Typography>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
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

          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {LANDING_SIGNALS.map(signal => (
              <LandingSignalCard
                key={signal.label}
                label={signal.label}
                value={signal.value}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
