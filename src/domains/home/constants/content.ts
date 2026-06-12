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

export type LandingBoardStatus = "todo" | "in_progress" | "in_review" | "done";

export type LandingBoardPriority = "low" | "medium" | "high" | "urgent";

export type LandingBoardAssignee = {
  id: string;
  name: string;
};

export type LandingProductBoardItem = {
  code: string;
  title: string;
  description: string;
  priority: LandingBoardPriority;
  schedule?: string;
  assignees: readonly LandingBoardAssignee[];
};

export type LandingProductBoardColumn = {
  status: LandingBoardStatus;
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
  title: "The project board your team actually works in.",
  description:
    "A look at the Prizmatic dashboard: top-level work items grouped by status, each with its code, priority, schedule, and assignees — the same board your team opens every day.",
} as const;

export const LANDING_PRODUCT_BOARD: readonly LandingProductBoardColumn[] = [
  {
    status: "todo",
    items: [
      {
        code: "PRZ-128",
        title: "Refine onboarding checklist",
        description: "Draft acceptance criteria for the first-run setup flow.",
        priority: "medium",
        assignees: [{ id: "u-mina", name: "Mina Park" }],
      },
      {
        code: "PRZ-131",
        title: "Map analytics events",
        description: "Catalog the events we need before instrumenting reporting.",
        priority: "low",
        assignees: [{ id: "u-ravi", name: "Ravi Shah" }],
      },
    ],
  },
  {
    status: "in_progress",
    items: [
      {
        code: "PRZ-117",
        title: "Ship workspace invite flow",
        description: "Wire up email invites and seat assignment for new members.",
        priority: "high",
        schedule: "Jun 3 - Jun 10",
        assignees: [
          { id: "u-jay", name: "Jay Cole" },
          { id: "u-noa", name: "Noa Kim" },
        ],
      },
      {
        code: "PRZ-124",
        title: "Resolve billing edge cases",
        description: "Handle proration when a workspace downgrades mid-cycle.",
        priority: "urgent",
        assignees: [{ id: "u-ravi", name: "Ravi Shah" }],
      },
    ],
  },
  {
    status: "in_review",
    items: [
      {
        code: "PRZ-109",
        title: "Realtime presence indicators",
        description: "Show who is viewing a work item in the side panel.",
        priority: "medium",
        schedule: "Due Jun 12",
        assignees: [{ id: "u-mina", name: "Mina Park" }],
      },
    ],
  },
  {
    status: "done",
    items: [
      {
        code: "PRZ-101",
        title: "Launch reference hero",
        description: "Replace the placeholder hero with the prism crystal render.",
        priority: "medium",
        assignees: [{ id: "u-jay", name: "Jay Cole" }],
      },
      {
        code: "PRZ-098",
        title: "Triage navigation copy",
        description: "Finalize labels for the workspace sidebar.",
        priority: "low",
        assignees: [{ id: "u-noa", name: "Noa Kim" }],
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
