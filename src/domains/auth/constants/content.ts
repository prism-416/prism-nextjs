export type AuthHighlight = {
  title: string;
  description: string;
};

export const SIGN_IN_CONTENT = {
  title: "Sign in",
  description: "Access your workspace.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Password",
  showPasswordLabel: "Show password",
  hidePasswordLabel: "Hide password",
  rememberMeLabel: "Keep me signed in",
  submitLabel: "Sign in",
  socialLegend: "Continue with a social account",
  socialSeparatorLabel: "Or",
  signUpPrompt: "New to Prizmatic?",
  signUpLabel: "Create an account",
  panelEyebrow: "Prizmatic Workspace",
  panelTitle: "Keep product, execution, and decisions moving in the same direction.",
  panelDescription:
    "Prizmatic gives teams a single operating surface for planning, tracking, and shipping work without losing context between conversations and delivery.",
  panelFooterEyebrow: "Designed for teams",
  panelFooterDescription:
    "A calmer sign-in surface for product, design, and engineering teams working across shared priorities.",
} as const;

export const AUTH_SOCIAL_LABELS = {
  github: "Continue with GitHub",
  google: "Continue with Google",
} as const;

export const AUTH_HIGHLIGHTS: readonly AuthHighlight[] = [
  {
    title: "Shared visibility",
    description: "Track delivery health, ownership, and blockers from one place without chasing updates.",
  },
  {
    title: "Decision-ready context",
    description: "Keep specs, conversations, and progress signals connected to the work they affect.",
  },
  {
    title: "Built for momentum",
    description: "Move from planning to execution with fewer handoffs and less status reporting overhead.",
  },
] as const;
