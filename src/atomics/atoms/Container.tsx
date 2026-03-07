import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: Props) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`.trim()}>{children}</div>;
}
