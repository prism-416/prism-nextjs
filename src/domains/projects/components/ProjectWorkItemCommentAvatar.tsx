type ProjectWorkItemCommentAvatarProps = {
  label: string;
};

export function ProjectWorkItemCommentAvatar({ label }: ProjectWorkItemCommentAvatarProps) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-prism-navy text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
