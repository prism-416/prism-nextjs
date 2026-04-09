import type { SignUpStepContent } from "../types";

export type AuthHighlight = {
  title: string;
  description: string;
};

export const SIGN_UP_STEPS: readonly SignUpStepContent[] = [
  {
    key: "account",
    step: "01",
    label: "Account",
    title: "Create your account",
    description: "Start with a secure sign-up to get into Prizmatic.",
  },
  {
    key: "profile",
    step: "02",
    label: "Profile",
    title: "Set up your profile",
    description: "This is how teammates will recognize you across projects and work items.",
  },
] as const;

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
