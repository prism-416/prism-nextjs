import { Sparkles } from "lucide-react";
import ColorBends from "@/atomics/atoms/ColorBends";
import Container from "@/atomics/atoms/Container";
import LandingCtaLink from "./LandingCtaLink";
import LandingSignalCard from "./LandingSignalCard";
import { HERO_BACKGROUND, HERO_CONTENT, LANDING_SIGNALS } from "../constants/content";

export default function LandingHeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#fcf8ef_0%,#f4ecd6_46%,#eef4f1_100%)]"
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,241,168,0.48),transparent_18%),radial-gradient(circle_at_28%_74%,rgba(255,107,198,0.14),transparent_22%),radial-gradient(circle_at_84%_18%,rgba(157,123,255,0.3),transparent_18%),radial-gradient(circle_at_78%_70%,rgba(99,178,255,0.18),transparent_24%),linear-gradient(180deg,rgba(252,248,239,0.03),rgba(252,248,239,0.66))]" />
      <div className="pointer-events-none absolute left-4 top-20 size-48 rounded-full bg-[#fff1a8]/22 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-1/2 size-52 rounded-full bg-[#ff6bc6]/12 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-14 size-56 rounded-full bg-[#9d7bff]/16 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-1/4 size-64 rounded-full bg-[#63b2ff]/12 blur-3xl" />

      <Container className="relative py-18 md:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-prism-navy shadow-sm backdrop-blur">
              <Sparkles
                className="size-3.5 text-prism-teal-500"
                aria-hidden
              />
              {HERO_CONTENT.badge}
            </div>
          </div>

          <h1
            id="hero-heading"
            className="mt-6 text-balance text-5xl font-semibold tracking-[-0.04em] text-prism-navy md:text-6xl lg:text-[5rem] lg:leading-[0.96]"
          >
            {HERO_CONTENT.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-prism-muted md:text-xl">
            {HERO_CONTENT.description}
          </p>

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
