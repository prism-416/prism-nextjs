## Must-follow Architecture

- Use Next.js 16 App Router.
- Keep business logic in `src/domains`.
- Keep UI-only components in `src/atomics` (Atomic Design).
- Keep domain-neutral code in `src/shared`.
- Dependency rules (never violate):
  - `shared` must not depend on `domains` or `atomics`.
  - `atomics` must not depend on `domains`.
  - `domains/<a>` should not depend on `domains/<b>`; share via `shared`.

## Atomic Design Rules

Layers by composition depth: `atoms → molecules → organisms → templates`.
A component's location is decided by what it imports — always move **upward**, never sideways.

- A component that imports anything from `atoms` must live in `molecules` or above. It MUST NOT live in `atoms`.
- A component that imports anything from `molecules` must live in `organisms` or above. It MUST NOT live in `molecules`.
- A component that imports anything from `organisms` must live in `templates` (or a page / domain component).
- `templates` accept concrete organisms / domain components via props and stay domain-neutral.
- Components with domain knowledge (workspace/project/auth names, hardcoded routes, brand strings, fixed nav lists) MUST live under `src/domains/<domain>/components`, not under `src/atomics`.

If a shared sub-piece is reused by multiple components at the same layer, extract it one layer **down** (e.g., two molecules sharing markup → extract an atom).

## Page Structure (GET-driven pages)

Default composition for pages that fetch data on the server:

```
page.tsx            ← route entry (server). Renders <Suspense fallback={<FooSkeleton />}>
  └─ FooContent     ← server component. Fetches data and passes it down as `initialData`
       └─ FooClient ← "use client". Top-level client component, consumes via useApiQuery(initialData)
```

Rules:

- Naming: `FooPage` (in `page.tsx`) → `FooContent` → `FooClient`.
- The top-level client component **MUST** use the `Client` suffix. No other component in the tree should use this suffix.
- The page wraps `FooContent` in `<Suspense>` and the fallback **MUST** be a layout-matching skeleton (e.g., `<FooSkeleton />`).
- `FooContent` awaits the data on the server and passes the result to `FooClient` as an `initialData` prop (plus any other server-derived props). It does **not** use `HydrationBoundary` — data flows through props.
- `FooClient` calls `useApiQuery({ queryKey, queryFn, initialData })` with a key from `QUERY_KEYS`. Because `initialData` is present on first render, there is no loading state from SSR. `isPending` can still appear on client navigation / cache miss / refetch — render `<FooSkeleton />` in that case.
- Query key in `FooContent`'s fetch path and `FooClient`'s `useApiQuery` **MUST** match (same `QUERY_KEYS.foo.xxx()`), otherwise the cache doesn't seed correctly.
- If a page has no async data, skip the `Content` layer and render directly.
- Place `FooContent`, `FooClient`, and `FooSkeleton` under the owning domain (`src/domains/<domain>/components`). The `page.tsx` should mostly be a thin route composer.

Minimal shape:

```tsx
// src/app/foo/page.tsx
import { Suspense } from "react";
import { FooContent } from "@/domains/foo/components/FooContent";
import { FooSkeleton } from "@/domains/foo/components/FooSkeleton";

export default function FooPage() {
  return (
    <Suspense fallback={<FooSkeleton />}>
      <FooContent />
    </Suspense>
  );
}
```

```tsx
// src/domains/foo/components/FooContent.tsx  (server component)
import { fetchFoo } from "@/domains/foo/api";
import { FooClient } from "./FooClient";

export async function FooContent() {
  const initialData = await fetchFoo();
  return <FooClient initialData={initialData} />;
}
```

```tsx
// src/domains/foo/components/FooClient.tsx
"use client";
import { useApiQuery } from "@/shared/query/useApiQuery";
import { QUERY_KEYS } from "@/shared/query/queryKeys";
import { fetchFoo } from "@/domains/foo/api";
import { FooSkeleton } from "./FooSkeleton";
import type { Foo } from "@/domains/foo/types";

type FooClientProps = {
  initialData?: Foo;
};

export function FooClient({ initialData }: FooClientProps) {
  const { data, isPending } = useApiQuery<Foo>({
    queryKey: QUERY_KEYS.foo.detail(),
    queryFn: fetchFoo,
    initialData,
  });
  if (isPending || !data) return <FooSkeleton />;
  return <div>{/* render data */}</div>;
}
```

## TanStack Query

- Do not use `useQuery / useMutation / useInfiniteQuery` directly.
- Use only: `useApiQuery / useApiMutation / useApiInfiniteQuery`.
- Query keys MUST come from centralized factories in `QUERY_KEYS` (`src/shared/query/queryKeys.ts`).
- RSC-first: when `initialData` is missing, pass `undefined` (never `null`). `useApiQuery` already normalizes this, but callers should pass `undefined` intentionally.
- Server fetch happens in the `Content` server component and is handed to the `Client` as `initialData`. Do not use `HydrationBoundary` / `dehydrate`; props are the single source of seeding.
- The server fetch and the client `useApiQuery` **MUST** use the same `QUERY_KEYS.xxx(...)` key.

## Client / Server Boundary

- Default to server components. Add `"use client"` only when a component needs state, effects, event handlers, browser APIs, or client-only libraries.
- `"use client"` MUST be the first line of the file.
- Never import server-only modules (`next/headers`, `cookies`, `fs`, server-only utils in `src/shared/http`) from client components.
- Do not pass non-serializable values (functions, class instances) from server to client components.

## Naming & File Layout

- Components: `PascalCase`; filename matches the exported component (`FooBar.tsx` → `export function FooBar`).
- Hooks: `useXxx`, live in `src/shared/hooks` (domain-neutral) or `src/domains/<domain>/hooks`.
- Utilities: `camelCase` functions in `src/shared/utils` or domain `utils/`.
- Constants: `SCREAMING_SNAKE_CASE`, grouped in `src/shared/constants` or domain `constants/`.
- Query key factories: `<entity>Keys` object with `all` + composition helpers, re-exported via `QUERY_KEYS`.
- Page files: always `src/app/**/page.tsx`; keep them thin.
- Domain folder shape: `src/domains/<domain>/{components,hooks,api,types,constants,utils}` as needed.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <subject>

<body (optional)>
```

Rules:

- `type` is one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`, `build`, `ci`, `revert`.
- `scope` (optional) is the domain folder or area: `auth`, `workspace`, `home`, `proxy`, `shared`, `atomics`, `query`, etc. Use lowercase.
- `subject` is imperative, lowercase, no trailing period, ≤ 72 chars (e.g., `add email verification page`, not `Added…` / `Adds…`).
- Write messages in English.
- Separate subject and body with a blank line. Body explains the **why**, wraps at ~72 chars.
- Breaking changes: add `!` after type/scope (`feat(auth)!: …`) and include a `BREAKING CHANGE:` footer in the body.
- Reference issues/tasks in the body footer (`Refs: TASK-44`, `Closes #10`).
- Prefer many small, focused commits over a single large one. Never mix unrelated changes.
- Do not commit generated artifacts (`.next/`, build output) or secrets.

Type guide:

- `feat`: user-facing new capability.
- `fix`: user-facing bug fix.
- `refactor`: internal restructure, no behavior change.
- `chore`: tooling, deps, non-code housekeeping.
- `docs`: docs only (including `AGENTS.md`).
- `test`: tests only.
- `perf`: performance change.
- `style`: formatting / whitespace (not CSS styling).

Examples:

```
feat(auth): add email verification page
fix(proxy): allow unauthenticated access to landing page
refactor(auth): rename onboarding modules to sign-up flow
chore: align tsconfig paths
docs: document page structure and atomic rules
```

## Styling

- Tailwind CSS v4 syntax only (e.g., `w-[var(--foo)]`, not `w-[--foo]`; no `theme()` function).
- Compose classes with `cn()` from `@/shared/utils/cn`; never concatenate class strings manually.
- Prefer design tokens (`text-prism-body`, `bg-surface`, `border-border`) over raw colors.
- Skeletons should mirror the final layout (same spacing, dimensions, grid) so there is no visual shift on hydration.
