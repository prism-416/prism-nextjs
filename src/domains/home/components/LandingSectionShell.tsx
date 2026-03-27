import type { ReactNode } from "react";
import Container from "@/atomics/atoms/Container";
import { cn } from "@/shared/utils/cn";

type LandingSectionShellProps = {
  id?: string;
  labelledBy?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

export default function LandingSectionShell({
  id,
  labelledBy,
  className,
  containerClassName,
  children,
}: LandingSectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-20 py-20 md:py-24", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
