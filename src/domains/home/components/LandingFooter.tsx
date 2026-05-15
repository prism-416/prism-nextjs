import Link from "next/link";

import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";
import { METADATA } from "@/shared/constants/metadata";
import { SITE_FOOTER_LINKS } from "@/shared/constants/site";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface-strong">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
          >
            {METADATA.siteName}
          </Typography>
          <Typography
            variant="bodySm"
            tone="inherit"
            className="text-muted"
          >
            {METADATA.description}
          </Typography>
        </div>
        <div className="flex flex-wrap gap-4">
          {SITE_FOOTER_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-sm text-muted transition-colors duration-150 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
