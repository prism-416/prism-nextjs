import type { ReactNode } from "react";

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(90deg,#f4ecd6_0%,#f4ecd6_25%,#0c4767_25%,#0c4767_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_3fr]">{children}</div>
    </main>
  );
}
