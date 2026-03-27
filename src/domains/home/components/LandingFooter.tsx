import Link from "next/link";
import Container from "@/atomics/atoms/Container";
import { METADATA } from "@/shared/constants/metadata";
import { SITE_FOOTER_LINKS } from "@/shared/constants/site";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface-strong">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">{METADATA.siteName}</p>
          <p className="text-sm text-muted">{METADATA.description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {SITE_FOOTER_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
