import {
  Activity,
  Bot,
  CalendarDays,
  CheckCheck,
  GitBranch,
  GitPullRequest,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export type LandingHeroFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type LandingCapability = {
  title: string;
  description: string;
  icon: LucideIcon;
  signal: string;
};

export type LandingStep = {
  step: string;
  title: string;
  description: string;
};

export type LandingProductMetric = {
  label: string;
  value: string;
};

export type LandingProductBoardItem = {
  title: string;
  meta: string;
  agent: string;
};

export type LandingProductBoardColumn = {
  title: string;
  summary: string;
  items: readonly LandingProductBoardItem[];
};

export const HERO_CONTENT = {
  badge: "AI-powered project management",
  title: "Your Project Manager Never Sleeps.",
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

export const LANDING_TRUST_COMPANIES = ["Linear", "Vercel", "Figma", "Retool", "GitHub", "Notion", "Slack"] as const;

export const LANDING_CAPABILITIES_INTRO = {
  eyebrow: "Agent Capabilities",
  title: "The work around the work, handled by agents.",
  description:
    "Prizmatic turns scattered product signals into a calm operating layer for planning, reviews, updates, and daily execution.",
} as const;

export const LANDING_CAPABILITIES: readonly LandingCapability[] = [
  {
    title: "AI Backlog Assistant",
    description: "Turn goals, customer notes, and open questions into prioritized work with crisp acceptance criteria.",
    icon: Bot,
    signal: "Goal to backlog in minutes",
  },
  {
    title: "Sprint Planning",
    description:
      "Balance scope, dependencies, and capacity into a sprint plan that stays readable as priorities shift.",
    icon: CalendarDays,
    signal: "Capacity-aware planning",
  },
  {
    title: "PR Review Bot",
    description: "Summarize code changes, flag risky diffs, and connect pull requests back to the work they unblock.",
    icon: GitPullRequest,
    signal: "Context before review",
  },
  {
    title: "Daily Summaries",
    description:
      "Collect progress, blockers, and decisions into concise updates before another status meeting appears.",
    icon: Newspaper,
    signal: "Async team visibility",
  },
] as const;

export const LANDING_PRODUCT_PREVIEW_INTRO = {
  eyebrow: "Product Preview",
  title: "A sprint board that already knows the plan.",
  description:
    "The landing preview mirrors how Prizmatic keeps goals, agent output, and delivery signals in one premium workspace without live data dependencies.",
} as const;

export const LANDING_PRODUCT_METRICS: readonly LandingProductMetric[] = [
  { label: "Sprint health", value: "92%" },
  { label: "Open blockers", value: "3" },
  { label: "Agent actions", value: "18" },
] as const;

export const LANDING_PRODUCT_BOARD: readonly LandingProductBoardColumn[] = [
  {
    title: "Ready",
    summary: "Backlog shaped by AI",
    items: [
      {
        title: "Refine onboarding checklist",
        meta: "Acceptance criteria drafted",
        agent: "Backlog Assistant",
      },
      {
        title: "Map analytics events",
        meta: "Dependencies linked",
        agent: "Sprint Planner",
      },
    ],
  },
  {
    title: "In Progress",
    summary: "Work moving this sprint",
    items: [
      {
        title: "Ship workspace invite flow",
        meta: "PR review context ready",
        agent: "PR Review Bot",
      },
      {
        title: "Resolve billing edge cases",
        meta: "Blocker surfaced",
        agent: "Daily Summary",
      },
    ],
  },
  {
    title: "Done",
    summary: "Signals closed out",
    items: [
      {
        title: "Launch reference hero",
        meta: "Release notes prepared",
        agent: "Daily Summary",
      },
      {
        title: "Triage navigation copy",
        meta: "Decision logged",
        agent: "Backlog Assistant",
      },
    ],
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
