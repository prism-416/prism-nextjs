import type { ComponentType } from "react";

type ProfileFieldProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

export function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-prism-muted">
        <Icon className="size-4" />
        {label}
      </div>
      <div className="mt-3 break-words text-sm font-medium text-prism-heading">{value}</div>
    </div>
  );
}
