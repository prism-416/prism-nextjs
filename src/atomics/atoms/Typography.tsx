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
      xs: "text-[0.75rem]",
      sm: "text-[0.875rem]",
      base: "text-[1rem]",
      lg: "text-[1.125rem]",
      xl: "text-[1.25rem]",
      "2xl": "text-[1.5rem]",
      "3xl": "text-[1.875rem]",
      "4xl": "text-[2.25rem]",
      "5xl": "text-[3rem]",
      "6xl": "text-[3.75rem]",
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
      "9": "leading-9",
      "10": "leading-10",
    },
  },
});

const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "text-[3.5rem] leading-[0.94] tracking-[-0.055em] md:text-[4.75rem] lg:text-[5.5rem]",
      h1: "text-[2.75rem] leading-[1.02] tracking-[-0.045em] md:text-[3.5rem] lg:text-[4rem]",
      h2: "text-[2.25rem] leading-[1.05] tracking-[-0.035em] md:text-[2.75rem] lg:text-[3rem]",
      h3: "text-[1.5rem] leading-[1.12] tracking-[-0.025em] md:text-[1.75rem]",
      title: "text-xl leading-[1.2] tracking-[-0.02em] md:text-2xl",
      bodyLg: "text-lg leading-8 md:text-xl md:leading-9",
      body: "leading-7",
      bodySm: "leading-6",
      caption: "leading-5",
      overline: "text-[0.6875rem] uppercase leading-4 tracking-[0.22em]",
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

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  fontSize?: VariantProps<typeof typographySizeVariants>["fontSize"];
  weight?: VariantProps<typeof typographyWeightVariants>["weight"];
  lineHeight?: VariantProps<typeof typographyLineHeightVariants>["lineHeight"];
}

const typographyFontSizeDefaults: Record<TypographyVariant, NonNullable<TypographyProps["fontSize"]> | undefined> = {
  display: undefined,
  h1: undefined,
  h2: undefined,
  h3: undefined,
  title: undefined,
  bodyLg: undefined,
  body: "base",
  bodySm: "sm",
  caption: "xs",
  overline: undefined,
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

const typographyLineHeightDefaults: Record<TypographyVariant, NonNullable<TypographyProps["lineHeight"]> | undefined> =
  {
    display: undefined,
    h1: undefined,
    h2: undefined,
    h3: undefined,
    title: undefined,
    bodyLg: undefined,
    body: undefined,
    bodySm: undefined,
    caption: undefined,
    overline: undefined,
    code: undefined,
  };

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ as, className, variant = "body", tone, align, wrap, truncate, fontSize, weight, lineHeight, ...props }, ref) => {
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
