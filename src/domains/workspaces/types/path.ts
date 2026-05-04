export type WorkspacePathSegmentKind = "workspace" | "project" | "section";

export type WorkspacePathOption = {
  name: string;
  href: string;
  id?: string;
  isCurrent?: boolean;
};

export type WorkspacePathSwitcher = {
  ariaLabel: string;
  emptyLabel: string;
  options: WorkspacePathOption[];
};

export type WorkspacePathSegment = {
  name: string;
  href?: string;
  kind?: WorkspacePathSegmentKind;
  switcher?: WorkspacePathSwitcher;
};
