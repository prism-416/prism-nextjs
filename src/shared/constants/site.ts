export const SITE_NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#workflow", label: "Workflow" },
] as const;

export const AUTHENTICATED_ENTRY_PATH = "/workspaces";

export const SITE_AUTH_ACTIONS = [
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Sign up" },
] as const;

export const SITE_AUTHENTICATED_ACTION = {
  href: AUTHENTICATED_ENTRY_PATH,
  label: "Go to workspaces",
} as const;

export const SITE_FOOTER_LINKS = [
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Sign up" },
] as const;
