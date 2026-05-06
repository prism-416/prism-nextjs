import { RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";

type ProjectErrorStateProps = {
  title?: string;
  description?: string;
  onRetry: () => void;
};

export function ProjectErrorState({
  title = "Project could not be loaded.",
  description = "Check the project route or try again.",
  onRetry,
}: ProjectErrorStateProps) {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-prism-danger-soft bg-surface p-8 text-center text-prism-danger">
      <Typography
        variant="title"
        tone="inherit"
      >
        {title}
      </Typography>
      <Typography
        variant="bodySm"
        tone="inherit"
        className="mt-2 opacity-80"
      >
        {description}
      </Typography>
      <Button
        className="mt-5 h-10 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
        onClick={onRetry}
        variant="outline"
      >
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </section>
  );
}
