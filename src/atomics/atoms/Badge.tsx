import type * as React from "react";

import { cn } from "@/shared/utils/cn";

type BadgeSize = "sm" | "default";
type BadgeTone = "blue";

type BadgeIcon = React.ComponentType<{ className?: string }>;

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  icon?: BadgeIcon;
  iconClassName?: string;
  size?: BadgeSize;
  tone?: BadgeTone;
};

const badgeSizeClassNames: Record<BadgeSize, string> = {
  sm: "gap-1 px-1.5 py-0.5 text-[11px] leading-none [&_svg]:size-3",
  default: "gap-1 px-2.5 py-1 text-xs [&_svg]:size-3.5",
};

const badgeToneClassNames: Record<BadgeTone, string> = {
  blue: "border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy",
};

const badgeIconToneClassNames: Record<BadgeTone, string> = {
  blue: "text-prism-glow-sky",
};

export function Badge({ children, className, icon: Icon, iconClassName, size = "default", tone = "blue" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border font-medium",
        badgeSizeClassNames[size],
        badgeToneClassNames[tone],
        className,
      )}
    >
      {Icon ? <Icon className={cn(badgeIconToneClassNames[tone], iconClassName)} /> : null}
      {children}
    </span>
  );
}
