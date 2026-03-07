import Link from "next/link";
import Container from "@/atomics/atoms/Container";
import { METADATA } from "@/shared/constants/metadata";
import { SITE_FOOTER_LINKS } from "@/shared/constants/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-zinc-950">{METADATA.siteName}</p>
          <p className="text-sm text-zinc-600">{METADATA.description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {SITE_FOOTER_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
