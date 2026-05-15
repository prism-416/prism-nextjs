import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type LandingCtaLinkProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "inversePrimary" | "inverseSecondary";
};

const CTA_VARIANTS = {
  primary: "bg-prism-navy text-white shadow-lg shadow-prism-navy/15 hover:-translate-y-0.5 hover:bg-prism-navy-deep",
  secondary:
    "border border-border-strong bg-surface text-prism-navy backdrop-blur hover:-translate-y-0.5 hover:border-prism-teal-500 hover:bg-surface-strong",
  inversePrimary: "bg-white text-prism-navy shadow-lg hover:-translate-y-0.5 hover:bg-prism-cream",
  inverseSecondary: "border border-white/24 text-white hover:-translate-y-0.5 hover:border-white hover:bg-white/10",
} as const;

export default function LandingCtaLink({ href, label, variant = "primary" }: LandingCtaLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold transition duration-150",
        CTA_VARIANTS[variant],
      )}
    >
      {label}
    </Link>
  );
}
