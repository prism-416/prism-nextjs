import { Activity, Bot, CheckCheck, GitBranch, type LucideIcon } from "lucide-react";

export type LandingHeroFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type LandingCapability = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type LandingStep = {
  step: string;
  title: string;
  description: string;
};

export const HERO_CONTENT = {
  badge: "AI-powered project management",
  title: "The Autonomous Project Management Platform",
  description:
    "Prizmatic brings AI agents, structured workflows, and deep integrations together in one place so teams can plan, coordinate, and ship with less manual project management.",
  primaryCta: {
    href: "/sign-up",
    label: "Get started",
  },
  secondaryCta: {
    href: "/#capabilities",
    label: "See how it works",
  },
} as const;

export const HERO_FEATURES: readonly LandingHeroFeature[] = [
  {
    title: "AI Project Manager",
    description: "Agents turn goals into plans, priorities, and next actions.",
    icon: Bot,
  },
  {
    title: "Smart Workflows",
    description: "Structured execution paths keep every handoff moving.",
    icon: CheckCheck,
  },
  {
    title: "Deep Integrations",
    description: "Connect work signals across the tools your team already uses.",
    icon: GitBranch,
  },
  {
    title: "Actionable Insights",
    description: "Surface blockers, progress, and decisions before they drift.",
    icon: Activity,
  },
] as const;

export const LANDING_CAPABILITIES_INTRO = {
  eyebrow: "Why Prizmatic",
  title: "New teams need momentum, not ceremony.",
  description:
    "Prizmatic gives small teams structure before process debt appears. Agents define the shape of the work early so the project can move before rituals and overhead slow it down.",
} as const;

export const LANDING_CAPABILITIES: readonly LandingCapability[] = [
  {
    title: "Agents build the first operating system",
    description:
      "Start with a goal, not a perfect process. Agents turn the objective into milestones, priorities, and the first execution path automatically.",
    icon: Bot,
  },
  {
    title: "Everything stays aligned from day one",
    description:
      "Goals, tasks, and progress stay connected in one system so a small team does not fragment the moment work begins.",
    icon: GitBranch,
  },
  {
    title: "Humans stay on product judgment",
    description:
      "Agents carry the management load while the team steps in for priorities, tradeoffs, and the decisions that actually require human context.",
    icon: CheckCheck,
  },
] as const;

export const LANDING_WORKFLOW_INTRO = {
  eyebrow: "Operating Model",
  title: "Agent-authoritative first. Collaborative where it counts.",
  description:
    "Prizmatic is built for small teams starting fresh. Agents handle structure and coordination first, then the team steps in where judgment and direction matter most.",
} as const;

export const LANDING_OPERATING_STEPS: readonly LandingStep[] = [
  {
    step: "01",
    title: "Set the project goal",
    description: "Describe what you are building and what success looks like. Agents use that as the operating brief.",
  },
  {
    step: "02",
    title: "Let agents map the work",
    description:
      "Agents generate structure, priorities, and execution order so the team does not start from a blank board.",
  },
  {
    step: "03",
    title: "Keep momentum visible",
    description:
      "Progress, blockers, and next actions stay visible automatically while the project is still finding its rhythm.",
  },
  {
    step: "04",
    title: "Step in where judgment matters",
    description: "The team handles key decisions while agents continue carrying the operational load around them.",
  },
] as const;

export const LANDING_WORKFLOW_HIGHLIGHT = {
  title: "No blank board",
  description: "Agents establish scope, order, and next actions before the first status meeting even exists.",
} as const;

export const LANDING_LAUNCH = {
  eyebrow: "Prizmatic Platform",
  title: "Built for small teams starting something new.",
  description:
    "Create the project, let agents establish the structure, and keep the team focused on shipping instead of inventing project management from scratch.",
  primaryCta: {
    href: "/sign-up",
    label: "Get started",
  },
  secondaryCta: {
    href: "/sign-in",
    label: "Sign in",
  },
} as const;
