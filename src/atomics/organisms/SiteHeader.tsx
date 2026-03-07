import Link from "next/link";
import Container from "@/atomics/atoms/Container";
import { METADATA } from "@/shared/constants/metadata";
import { SITE_NAVIGATION } from "@/shared/constants/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-950"
        >
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
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
