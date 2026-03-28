"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AuthPageShell } from "@/domains/auth/components/AuthPageShell";
import { AuthVisualBackdrop } from "@/domains/auth/components/AuthVisualBackdrop";
import { AuthVisualPanel } from "@/domains/auth/components/AuthVisualPanel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignUpPage = pathname === "/sign-up";

  if (isSignUpPage) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-(image:--gradient-auth-main)">
        <AuthVisualBackdrop withAurora={false} />
        <div className="relative z-10 min-h-screen">{children}</div>
      </main>
    );
  }

  return (
    <AuthPageShell>
      {children}
      <AuthVisualPanel />
    </AuthPageShell>
  );
}
