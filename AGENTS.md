## Must-follow Architecture

- Use Next.js 16 App Router.
- Keep business logic in `src/domains`.
- Keep UI-only components in `src/atomics` (Atomic Design).
- Keep domain-neutral code in `src/shared`.
- Do not violate dependency rules:
  - `shared` must not depend on `domains`
  - `atomics` must not depend on `domains`

## TanStack Query

- Do not use `useQuery/useMutation/useInfiniteQuery` directly.
- Use only: `useApiQuery/useApiMutation/useApiInfiniteQuery`.
- Query keys must be centralized factories (`QUERY_KEYS`).
- RSC-first: if `initialData` is missing, use `undefined` (not `null`).
