import * as React from "react";

import { cn } from "@/shared/utils/cn";
import { SidebarInset, SidebarProvider } from "@/atomics/organisms/Sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
  defaultSidebarOpen?: boolean;
  headerHeight?: string;
  className?: string;
  contentClassName?: string;
};

const DEFAULT_HEADER_HEIGHT = "4rem";

export default function MainLayout({
  children,
  header,
  sidebar,
  defaultSidebarOpen = true,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  className,
  contentClassName,
}: MainLayoutProps) {
  return (
    <SidebarProvider
      defaultOpen={defaultSidebarOpen}
      className={cn("flex-col bg-background text-prism-body", className)}
      style={{ "--header-height": headerHeight } as React.CSSProperties}
    >
      {header}
      <div className="flex w-full flex-1">
        {sidebar}
        <SidebarInset>
          <div className={cn("flex-1 overflow-y-auto px-4 py-6 md:px-6", contentClassName)}>{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
