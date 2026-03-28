"use client";

import { cn } from "@/shared/utils/cn";

type FormHintChecklistProps = {
  title?: string;
  items: readonly { label: string; isValid: boolean }[];
};

export function FormHintChecklist({ title = "To continue", items }: FormHintChecklistProps) {
  return (
    <div className="space-y-2">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-prism-body/46">{title}</p>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={cn(
                "inline-flex size-4 items-center justify-center rounded-full text-[0.62rem] font-semibold",
                item.isValid ? "bg-primary text-white" : "bg-[#f3d9d4] text-[#9f4b3e]",
              )}
            >
              {item.isValid ? "✓" : "!"}
            </span>
            <span className={item.isValid ? "text-prism-body/72" : "text-[#9f4b3e]"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
