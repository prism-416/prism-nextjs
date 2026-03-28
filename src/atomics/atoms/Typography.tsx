import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/cn";

const typographyElementMap = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  title: "h4",
  bodyLg: "p",
  body: "p",
  bodySm: "p",
  caption: "p",
  overline: "span",
  code: "code",
} as const;

type TypographyVariant = keyof typeof typographyElementMap;

const typographySizeVariants = cva("", {
  variants: {
    fontSize: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    },
  },
});

const typographyWeightVariants = cva("", {
  variants: {
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
});

const typographyLineHeightVariants = cva("", {
  variants: {
    lineHeight: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
      "5": "leading-5",
      "6": "leading-6",
      "7": "leading-7",
      "8": "leading-8",
    },
  },
});

const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "tracking-[-0.04em] md:text-6xl lg:text-[5rem] lg:leading-[0.96]",
      h1: "tracking-tight md:text-5xl",
      h2: "tracking-tight md:text-4xl",
      h3: "tracking-tight md:text-3xl",
      title: "tracking-tight md:text-xl",
      bodyLg: "md:text-xl",
      body: "",
      bodySm: "",
      caption: "",
      overline: "uppercase tracking-[0.24em]",
      code: "rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-[0.925em]",
    },
    tone: {
      default: "text-prism-body",
      primary: "text-primary",
      muted: "text-prism-muted",
      accent: "text-prism-accent",
      inverse: "text-white",
      inherit: "text-inherit",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    wrap: {
      normal: "text-wrap",
      balance: "text-balance",
      pretty: "text-pretty",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "default",
    align: "left",
    wrap: "normal",
    truncate: false,
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  fontSize?: VariantProps<typeof typographySizeVariants>["fontSize"];
  weight?: VariantProps<typeof typographyWeightVariants>["weight"];
  lineHeight?: VariantProps<typeof typographyLineHeightVariants>["lineHeight"];
}

const typographyFontSizeDefaults: Record<TypographyVariant, NonNullable<TypographyProps["fontSize"]> | undefined> = {
  display: "5xl",
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  title: "lg",
  bodyLg: "lg",
  body: "base",
  bodySm: "sm",
  caption: "sm",
  overline: "xs",
  code: undefined,
};

const typographyWeightDefaults: Record<TypographyVariant, NonNullable<TypographyProps["weight"]> | undefined> = {
  display: "semibold",
  h1: "semibold",
  h2: "semibold",
  h3: "semibold",
  title: "semibold",
  bodyLg: undefined,
  body: undefined,
  bodySm: undefined,
  caption: undefined,
  overline: "semibold",
  code: undefined,
};

const typographyLineHeightDefaults: Record<
  TypographyVariant,
  NonNullable<TypographyProps["lineHeight"]> | undefined
> = {
  display: undefined,
  h1: undefined,
  h2: undefined,
  h3: undefined,
  title: undefined,
  bodyLg: "8",
  body: "7",
  bodySm: "6",
  caption: "5",
  overline: undefined,
  code: undefined,
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    { as, className, variant = "body", tone, align, wrap, truncate, fontSize, weight, lineHeight, ...props },
    ref,
  ) => {
    const resolvedVariant = (variant ?? "body") as TypographyVariant;
    const Component = as ?? typographyElementMap[resolvedVariant] ?? "p";

    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({ variant: resolvedVariant, tone, align, wrap, truncate }),
          typographySizeVariants({ fontSize: fontSize ?? typographyFontSizeDefaults[resolvedVariant] }),
          typographyWeightVariants({ weight: weight ?? typographyWeightDefaults[resolvedVariant] }),
          typographyLineHeightVariants({
            lineHeight: lineHeight ?? typographyLineHeightDefaults[resolvedVariant],
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };
