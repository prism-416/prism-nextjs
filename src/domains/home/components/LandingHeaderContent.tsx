import Link from "next/link";
import Container from "@/atomics/atoms/Container";
import { cn } from "@/shared/utils/cn";
import { METADATA } from "@/shared/constants/metadata";
import { SITE_AUTH_ACTIONS, SITE_AUTHENTICATED_ACTION, SITE_NAVIGATION } from "@/shared/constants/site";

type LandingHeaderContentProps = {
  isAuthenticated?: boolean;
};

export default function LandingHeaderContent({ isAuthenticated = false }: LandingHeaderContentProps) {
  const mobileAction = isAuthenticated ? SITE_AUTHENTICATED_ACTION : SITE_AUTH_ACTIONS[1];
  const mobileActionLabel = isAuthenticated ? "Open app" : mobileAction.label;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex min-h-10 min-w-32 items-center gap-2 rounded-full text-sm font-semibold tracking-tight text-primary transition-colors duration-150 hover:text-prism-navy-deep"
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-full bg-prism-navy shadow-sm shadow-prism-navy/10"
          >
            <span className="size-3.5 rotate-45 rounded-[0.35rem] bg-[conic-gradient(from_140deg_at_50%_50%,var(--color-gold-300),var(--color-magenta-400),var(--color-sky-400),var(--color-teal-500),var(--color-gold-300))]" />
          </span>
          {METADATA.siteName}
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 md:flex"
        >
          {SITE_NAVIGATION.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors duration-150 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                href={SITE_AUTHENTICATED_ACTION.href}
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-prism-navy/10 transition duration-150 hover:bg-prism-navy-deep"
              >
                {SITE_AUTHENTICATED_ACTION.label}
              </Link>
            ) : (
              SITE_AUTH_ACTIONS.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-150",
                    index === 0
                      ? "border border-border-strong bg-surface-strong text-primary hover:border-prism-teal-500 hover:bg-white"
                      : "bg-primary text-primary-foreground shadow-md shadow-prism-navy/10 hover:bg-prism-navy-deep",
                  )}
                >
                  {item.label}
                </Link>
              ))
            )}
          </div>
        </nav>
        <Link
          href={mobileAction.href}
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-prism-navy/10 transition duration-150 hover:bg-prism-navy-deep md:hidden"
        >
          {mobileActionLabel}
        </Link>
      </Container>
    </header>
  );
}
