"use client";

import { Typography } from "@/atomics/atoms/Typography";
import { AuthVisualBackdrop } from "@/domains/auth/components/AuthVisualBackdrop";
import { AUTH_HIGHLIGHTS } from "@/domains/auth/constants/content";

export function AuthVisualPanel() {
  return (
    <section className="relative hidden overflow-hidden lg:block">
      <AuthVisualBackdrop />

      <div className="relative flex h-full flex-col justify-between px-12 py-14 text-white">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <Typography
              variant="overline"
              tone="inverse"
              className="text-prism-cream/70 tracking-[0.32em]"
            >
              Prizmatic Workspace
            </Typography>
            <div className="space-y-4">
              <Typography
                variant="h1"
                tone="inverse"
                lineHeight="tight"
                className="max-w-2xl tracking-[-0.03em] xl:text-5xl"
              >
                Keep product, execution, and decisions moving in the same direction.
              </Typography>
              <Typography
                variant="body"
                tone="inverse"
                lineHeight="7"
                className="max-w-xl text-white/72"
              >
                Prizmatic gives teams a single operating surface for planning, tracking, and shipping work without
                losing context between conversations and delivery.
              </Typography>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {AUTH_HIGHLIGHTS.map(item => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm"
              >
                <Typography
                  variant="bodySm"
                  tone="inverse"
                  weight="semibold"
                  className="tracking-[0.02em] text-prism-cream"
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="bodySm"
                  tone="inverse"
                  className="mt-3 text-white/72"
                >
                  {item.description}
                </Typography>
              </article>
            ))}
          </div>
        </div>

        <div className="max-w-xl border-t border-white/12 pt-8">
          <Typography
            variant="bodySm"
            tone="inverse"
            weight="medium"
            className="text-prism-cream/72 tracking-[0.22em] uppercase"
          >
            Designed for teams
          </Typography>
          <Typography
            variant="body"
            tone="inverse"
            lineHeight="7"
            className="mt-3 text-white/68"
          >
            A calmer sign-in surface for product, design, and engineering teams working across shared priorities.
          </Typography>
        </div>
      </div>
    </section>
  );
}
