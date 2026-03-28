"use client";

import { AuthVisualBackdrop } from "@/domains/auth/components/AuthVisualBackdrop";
import { AUTH_HIGHLIGHTS } from "@/domains/auth/constants/content";

export function AuthVisualPanel() {
  return (
    <section className="relative hidden overflow-hidden lg:block">
      <AuthVisualBackdrop />

      <div className="relative flex h-full flex-col justify-between px-12 py-14 text-white">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-prism-cream/70">Prizmatic Workspace</p>
            <div className="space-y-4">
              <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white xl:text-5xl">
                Keep product, execution, and decisions moving in the same direction.
              </h2>
              <p className="max-w-xl text-base leading-7 text-white/72">
                Prizmatic gives teams a single operating surface for planning, tracking, and shipping work without
                losing context between conversations and delivery.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {AUTH_HIGHLIGHTS.map(item => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm"
              >
                <h3 className="text-sm font-semibold tracking-[0.02em] text-prism-cream">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/72">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="max-w-xl border-t border-white/12 pt-8">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-prism-cream/72">Designed for teams</p>
          <p className="mt-3 text-base leading-7 text-white/68">
            A calmer sign-in surface for product, design, and engineering teams working across shared priorities.
          </p>
        </div>
      </div>
    </section>
  );
}
