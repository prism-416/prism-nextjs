import React from "react";
import SiteHeader from "@/atomics/organisms/SiteHeader";
import SiteFooter from "@/atomics/organisms/SiteFooter";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />
      <div>{children}</div>
      <SiteFooter />
    </div>
  );
}
