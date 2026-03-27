import { Bot, CheckCheck, GitBranch, type LucideIcon } from "lucide-react";

export type LandingCapability = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type LandingSignal = {
  label: string;
  value: string;
};

export type LandingStep = {
  step: string;
  title: string;
  description: string;
};

export type LandingHeroStat = {
  label: string;
  value: string;
  className: string;
};

export type LandingTimelineItem = {
  title: string;
  detail: string;
};

export const HERO_CONTENT = {
  badge: "Agent Operating System",
  title: "Run faster with agents. Stay sharp with Prizmatic.",
  description:
    "Prizmatic keeps agent execution, approvals, and delivery signals in one clear operating layer so teams move fast without losing control.",
  primaryCta: {
    href: "/sign-up",
    label: "Get started",
  },
  secondaryCta: {
    href: "/#capabilities",
    label: "See capabilities",
  },
} as const;

export const HERO_BACKGROUND = {
  colors: ["#fff1a8", "#ff9b73", "#ff6bc6", "#9d7bff", "#63b2ff", "#62d7c7", "#0c4767"],
  speed: 0.2,
  scale: 0.84,
  frequency: 1.18,
  warpStrength: 1.24,
  autoRotate: 6,
  mouseInfluence: 0.07,
  parallax: 0.24,
  noise: 0.03,
} as const;

export const LANDING_SIGNALS: readonly LandingSignal[] = [
  { label: "Agent runs", value: "24/7" },
  { label: "Decision points", value: "Human-owned" },
  { label: "Task granularity", value: "Small & traceable" },
] as const;

export const LANDING_CAPABILITIES_INTRO = {
  eyebrow: "Capabilities",
  title: "Built for teams already operating with complexity, velocity, and multiple execution layers.",
  description:
    "Prizmatic makes execution legible across strategy, delivery, and review so teams can move faster without losing coordination quality.",
} as const;

export const LANDING_CAPABILITIES: readonly LandingCapability[] = [
  {
    title: "Delegation without drift",
    description:
      "Convert strategy into bounded agent work, keep ownership explicit, and maintain a clean review path across active projects.",
    icon: Bot,
  },
  {
    title: "One operational graph",
    description:
      "Goals, tasks, dependencies, and run history stay connected so teams always see the current state of execution.",
    icon: GitBranch,
  },
  {
    title: "Human checkpoints",
    description:
      "Automation drives throughput while approvals, prioritization, and release decisions stay visible and accountable.",
    icon: CheckCheck,
  },
] as const;

export const LANDING_WORKFLOW_INTRO = {
  eyebrow: "Operating Model",
  title: "The operating layer for teams already shipping with agents in the loop.",
  description:
    "Prizmatic keeps execution structured across teams, agent runs, and delivery checkpoints so scaling work does not reduce clarity.",
} as const;

export const LANDING_OPERATING_STEPS: readonly LandingStep[] = [
  {
    step: "01",
    title: "Set the operating context",
    description: "Capture goals, ownership, and delivery constraints so every run starts from a clear operational frame.",
  },
  {
    step: "02",
    title: "Coordinate execution",
    description: "Route work across teams and agents with clear dependencies, priorities, and visible checkpoints.",
  },
  {
    step: "03",
    title: "Monitor live progress",
    description: "Track progress, blockers, retries, and quality signals from one shared operational surface.",
  },
  {
    step: "04",
    title: "Improve continuously",
    description: "Use delivery history and run outcomes to keep the operating model sharper over time.",
  },
] as const;

export const LANDING_WORKFLOW_HIGHLIGHT = {
  title: "Shared visibility",
  description: "Tasks, approvals, and outcomes stay visible across every operating lane.",
} as const;

export const LANDING_HERO_PANEL = {
  eyebrow: "Workspace",
  title: "Control room",
  badge: "Live orchestration",
  focusLabel: "Current focus",
  focusTitle: "Q2 product launch coordination",
  status: "Healthy",
} as const;

export const LANDING_HERO_STATS: readonly LandingHeroStat[] = [
  { label: "Open tasks", value: "18", className: "bg-prism-mint-100/70" },
  { label: "Agents active", value: "6", className: "bg-prism-cream" },
  { label: "Awaiting review", value: "3", className: "bg-prism-sand/55" },
] as const;

export const LANDING_EXECUTION_LANES = [
  "Campaign rollout aligned across product and ops",
  "Execution distributed across specialized agent runs",
  "Launch readiness surfaced for executive review",
] as const;

export const LANDING_TIMELINE: readonly LandingTimelineItem[] = [
  {
    title: "Priority updated",
    detail: "Leadership changed the launch order and every dependent run re-synced instantly.",
  },
  {
    title: "Risk escalated",
    detail: "A blocked dependency was surfaced early enough for the team to reroute execution.",
  },
  {
    title: "Review completed",
    detail: "Agent output, team notes, and delivery status closed into a single release record.",
  },
] as const;

export const LANDING_LAUNCH = {
  eyebrow: "Prizmatic Platform",
  title: "A production platform for teams running real execution with agents.",
  description:
    "Product, engineering, and operations teams use Prizmatic to coordinate execution, maintain accountability, and keep delivery visible from strategy through release.",
  primaryCta: {
    href: "/sign-up",
    label: "Get started",
  },
  secondaryCta: {
    href: "/#capabilities",
    label: "Explore platform",
  },
} as const;

