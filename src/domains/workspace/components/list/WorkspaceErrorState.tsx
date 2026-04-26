import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";

type WorkspaceErrorStateProps = {
  onRetry: () => void;
};

export function WorkspaceErrorState({ onRetry }: WorkspaceErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-prism-danger-soft bg-prism-danger-soft/30 px-6 py-8 text-center">
      <Typography
        variant="title"
        tone="inherit"
        className="text-prism-danger"
      >
        Failed to load workspaces
      </Typography>
      <Typography
        variant="bodySm"
        tone="inherit"
        className="max-w-sm text-prism-danger/90"
      >
        We couldn&apos;t reach the server. Please check your connection and try again.
      </Typography>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
      >
        Retry
      </Button>
    </div>
  );
}
