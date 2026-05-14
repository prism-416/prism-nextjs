import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type LandingCtaVariant = "primary" | "secondary" | "ghost" | "aiAction" | "inversePrimary" | "inverseSecondary";

type LandingCtaLinkProps = {
  href: string;
  label: string;
  variant?: LandingCtaVariant;
};

const CTA_VARIANTS = {
  primary: "bg-primary text-primary-foreground shadow-lg shadow-prism-navy/15 hover:bg-prism-navy-deep",
  secondary:
    "border border-border-strong bg-surface text-primary backdrop-blur hover:border-prism-teal-500 hover:bg-surface-strong",
  ghost: "text-primary hover:bg-surface-strong hover:text-prism-navy-deep",
  aiAction:
    "bg-linear-to-r from-prism-glow-magenta via-prism-glow-violet to-prism-glow-sky text-prism-navy shadow-lg shadow-prism-glow-sky/20 hover:shadow-prism-glow-sky/30",
  inversePrimary: "bg-white text-prism-navy shadow-lg hover:bg-prism-cream",
  inverseSecondary: "border border-white/24 text-white hover:border-white hover:bg-white/10",
} as const;

export default function LandingCtaLink({ href, label, variant = "primary" }: LandingCtaLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold transition",
        CTA_VARIANTS[variant],
      )}
    >
      {label}
    </Link>
  );
}
