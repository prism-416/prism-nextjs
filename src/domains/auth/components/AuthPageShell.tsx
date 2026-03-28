import type { ReactNode } from "react";

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-(image:--gradient-auth-shell)">
      <div className="grid min-h-screen lg:grid-cols-[1fr_3fr]">{children}</div>
    </main>
  );
}
