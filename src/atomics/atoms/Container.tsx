import React from "react";

import { cn } from "@/shared/utils/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: Props) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)}>{children}</div>;
}
