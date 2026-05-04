# Responsive Website Starter

A responsive website starter template built with Next.js 16 App Router.

This template is designed for browser environments without relying on a webview bridge. The project structure follows a layered architecture with the following principles:

- `src/domains`: Business logic
- `src/atomics`: UI components
- `src/shared`: Shared utilities and common code

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm type-check
```

## Start Point

- Main page: `src/app/page.tsx`
- Root layout: `src/app/layout.tsx`
- Global styles: `src/app/globals.css`

## Environment

Before starting the project, create a `.env.example`file based on `.env.local`.

- `NEXT_PUBLIC_API_HOST`: Backend API host
- `NEXT_PUBLIC_SITE_URL`: Frontend base URL
- `PASSWORD_VERIFY_SECRET`: Secret key for server-side validation

## Auth Flow

- After a successful login, store access/refresh tokens using `useAuth().setSession()`
- The access token is stored in a short-lived cookie
- The refresh token is stored in an `HttpOnly` cookie
- On a `401` response, the access token is automatically refreshed via `/api/auth/refresh`
- On logout, cookies are cleared via `/api/auth/logout`

```tsx
"use client";

import { useAuth } from "@/app/_providers/AuthProvider";

export function LoginExample() {
  const { setSession, clearSession } = useAuth();

  const handleLogin = async () => {
    await setSession({
      accessToken: "issued-access-token",
      refreshToken: "issued-refresh-token",
      accessTokenExpiresIn: 60 * 15,
      refreshTokenExpiresIn: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLogin}
      >
        Save Login
      </button>
      <button
        type="button"
        onClick={clearSession}
      >
        Logout
      </button>
    </>
  );
}
```

## Query Example

Refer to `src/domains/template-status` for examples of `QUERY_KEYS` and query wrappers.

```tsx
"use client";

import { useTemplateStatusQuery } from "@/domains/template-status";

export function TemplateStatusExample() {
  const { data, isLoading } = useTemplateStatusQuery();

  if (isLoading) return <p>Loading...</p>;

  return <p>{data?.version}</p>;
}
```

## Template Structure Example

- `src/domains/template-status/model`: Domain types
- `src/domains/template-status/api`: API functions
- `src/domains/template-status/hooks`: Query wrapper hooks
- `src/atomics/organisms/TemplateStatusCard.tsx`: UI usage example

## CI

- CI checks for `linting`, `type-checking`, and `build` are configured in `.github/workflows/ci.yml`.

## Notes

- Built with Next.js 16 App Router
- Uses wrapper hooks instead of directly calling TanStack Query (useQuery, etc.)
- Includes default metadata and base UI for a website template
- Environment variables are validated using `zod`
- Includes `robots`, `sitemap`, `manifest`, and default Open Graph images
