"use client";

import { Typography } from "@/atomics/atoms/Typography";
import { cn } from "@/shared/utils/cn";

type FormHintChecklistProps = {
  title?: string;
  items: readonly { label: string; isValid: boolean }[];
};

export function FormHintChecklist({ title = "To continue", items }: FormHintChecklistProps) {
  return (
    <div className="space-y-2">
      <Typography
        variant="overline"
        tone="inherit"
        className="text-[0.7rem] text-prism-body/46 tracking-[0.22em]"
      >
        {title}
      </Typography>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li
            key={item.label}
            className="flex items-center gap-2.5 text-sm"
          >
            <span
              className={cn(
                "inline-flex size-4 items-center justify-center rounded-full text-[0.62rem] font-semibold",
                item.isValid ? "bg-primary text-white" : "bg-prism-danger-soft text-prism-danger",
              )}
            >
              {item.isValid ? "??" : "!"}
            </span>
            <Typography
              as="span"
              variant="bodySm"
              tone="inherit"
              className={item.isValid ? "text-prism-body/72" : "text-prism-danger"}
            >
              {item.label}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}
