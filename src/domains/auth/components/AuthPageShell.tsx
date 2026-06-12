import type { ReactNode } from "react";

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="min-h-svh overflow-hidden bg-background">
      <div className="grid min-h-svh lg:grid-cols-[minmax(420px,2fr)_minmax(0,3fr)]">{children}</div>
    </main>
  );
}
