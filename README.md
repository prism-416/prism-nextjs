# Prizmatic Frontend

Prizmatic is an AI-assisted project management web application for teams that need a shared workspace for planning, project membership, sprint organization, work items, comments, and progress tracking.

This repository contains the Next.js frontend. The backend API, database, and API persistence services run separately and are configured through `NEXT_PUBLIC_API_HOST`.

## Current Project Status

- Repository: <https://github.com/prism-416/prism-nextjs>
- Default development branch: `develop`
- Latest stable/released checkout: no release tag is recorded in this checkout, so use the repository default branch unless the team creates a release tag for the milestone.
- Beta API documentation: <https://api.prizmatic.app/dev/docs-json>
- Public beta frontend URL: not recorded in this repository yet; add it here before Milestone 4 submission.
- Local frontend URL: <http://localhost:3000>
- Local API URL expected by `.env.example`: <http://localhost:4000>
- Bug tracker: <https://github.com/prism-416/prism-nextjs/issues>

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Query through project wrappers in `src/shared/query`
- pnpm 10.26.1
- Node.js 24.12.0

## Supported Operating Systems

These instructions are intended for the operating systems used by the team:

- macOS 14 or newer
- Linux distributions with a current Node.js toolchain
- Windows 11 through WSL2 with Ubuntu

Native Windows PowerShell can run the same Node.js and pnpm commands, but WSL2 is preferred so every developer uses the same shell behavior as CI.

## Check Out the Source Code

Install Git first, then clone the repository:

```bash
git clone https://github.com/prism-416/prism-nextjs.git
cd prism-nextjs
git fetch --all --tags
```

Use the current default branch for normal development:

```bash
git switch develop
git pull --ff-only
```

If the team creates a release tag, check out that exact released version instead:

```bash
git switch --detach <release-tag>
```

Use feature branches for new work:

```bash
git switch -c feature/<task-id-or-short-name>
```

## Local Setup

Install Node.js `24.12.0` and pnpm `10.26.1`. Any Node version manager is acceptable. With Corepack:

```bash
corepack enable
corepack prepare pnpm@10.26.1 --activate
```

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` as needed:

```bash
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_API_HOST=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PASSWORD_VERIFY_SECRET=change-me
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Do not commit `.env.local` or real secrets.

## Backend and Database Setup

This frontend does not include database migrations or a local database container. To test authenticated pages and project data locally, run the Prizmatic backend API separately and point `NEXT_PUBLIC_API_HOST` at it.

Minimum backend requirements for frontend testing:

- API server reachable at `NEXT_PUBLIC_API_HOST`
- Database migrated and seeded according to the backend repository instructions
- Auth endpoints enabled for email sign-in/sign-up
- OAuth credentials configured if testing Google or GitHub sign-in
- CORS and cookie settings allowing `NEXT_PUBLIC_SITE_URL`

When the backend is running locally, verify the API documentation endpoint:

```bash
curl -sS http://localhost:4000/docs-json
```

The current deployed beta API documentation is available at:

```text
https://api.prizmatic.app/dev/docs-json
```

## Run the Website Locally

Start the development server:

```bash
pnpm dev
```

Open <http://localhost:3000>.

For a production-like local run:

```bash
pnpm build
pnpm start
```

## Build the Software

Run the production build:

```bash
pnpm build
```

The build uses Next.js and writes generated output to `.next/`. Do not commit `.next/` or other generated build artifacts.

## Test and Verify the Software

Automated unit tests are not configured in this frontend repository yet. Until a test runner is added, every pull request should pass the available verification commands:

```bash
pnpm lint
pnpm type-check
pnpm build
```

Manual smoke test for a local development environment:

1. Start the backend API and confirm `NEXT_PUBLIC_API_HOST` is correct.
2. Start the frontend with `pnpm dev`.
3. Visit `/` and verify the landing page loads.
4. Sign up or sign in through `/sign-up` or `/sign-in`.
5. Verify email verification, Google sign-in, and GitHub sign-in if credentials are configured.
6. Create a workspace from `/workspaces`.
7. Open a workspace and verify settings, members, invitations, and jobs.
8. Create a project in the workspace.
9. Verify project overview, project members, work items, my tasks, sprints, sprint detail, work item detail, and comments.
10. Visit `/profile` and verify account/profile actions that are available to the test user.

Completed features in the schedule should be verified by a teammate who did not implement that feature. Any failure found during verification should be reported as a GitHub Issue and linked back to the schedule item or pull request.

## CI

GitHub Actions is configured in `.github/workflows/ci.yml` to run:

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

The workflow currently runs for pushes and pull requests targeting `main`. If the team continues using `develop` as the default integration branch, update the workflow branch filters or open pull requests into `main` before relying on CI as the release gate.

## Bug Tracking

Outstanding bugs are tracked with GitHub Issues:

- All open issues: <https://github.com/prism-416/prism-nextjs/issues>
- Open bugs only: <https://github.com/prism-416/prism-nextjs/issues?q=is%3Aissue+is%3Aopen+label%3Abug>
- New issue form: <https://github.com/prism-416/prism-nextjs/issues/new>

When reporting a bug, include:

- A short title
- Environment: operating system, browser, branch, and API host
- Steps to reproduce
- Expected result
- Actual result
- Screenshots or screen recordings when useful
- Console, terminal, or network errors
- Severity: blocker, high, medium, or low

Serious bugs should be labeled `bug`, assigned to a developer, and accounted for in the remaining schedule before new feature work is accepted.

## Project Schedule

The table below is the README schedule snapshot for milestones 1-4 and the remainder of the semester. Keep it synced with the course schedule and any external planning board the team uses.

| Schedule item                                                                                          | Status      | Notes and adjustments                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Milestone 1: repository setup, architecture, README setup instructions, initial landing/auth direction | Completed   | Next.js 16 App Router project is in place with `src/domains`, `src/atomics`, and `src/shared` boundaries. README setup instructions have been updated from the starter template.                                                                              |
| Milestone 2: authentication and account flows                                                          | Completed   | Email sign-in/sign-up, email verification, Google/GitHub OAuth entry points, token cookies, refresh, logout, and profile password change UI are represented in the frontend. OAuth verification still requires configured provider credentials.               |
| Milestone 2: workspace foundation                                                                      | Completed   | Workspace listing, creation, settings, member management, invitation acceptance, member search, and workspace jobs are implemented in the frontend.                                                                                                           |
| Milestone 3: project foundation                                                                        | Completed   | Project listing, creation, overview, metadata, project members, and member job assignment screens are implemented.                                                                                                                                            |
| Milestone 3: work planning                                                                             | Completed   | Project work items, work item detail, child work items, filters, my-tasks view, sprints, sprint detail, sprint work items, and comments are implemented in the frontend.                                                                                      |
| Milestone 4: beta release hardening                                                                    | In progress | Finish deployment verification, bug triage, non-implementer feature verification, API documentation review, and final beta demo script.                                                                                                                       |
| Milestone 4: progress update document                                                                  | In progress | Each member must add individual scheduled items, completed items, partial items with percent complete, current blockers, and next-week plan. The group section must compare actual progress against the original design schedule and assign a progress grade. |
| Final release: quality pass                                                                            | Planned     | Fix serious bugs, add or document automated tests, polish responsive layouts, confirm CI branch filters, and update README/API docs from final backend contract.                                                                                              |
| Final release: release packaging                                                                       | Planned     | Tag the final release, verify production deployment, confirm the bug list, and ensure Brightspace/GitHub deliverables match.                                                                                                                                  |

Scope adjustments:

- Core collaboration flows are prioritized first: auth, workspaces, members, projects, sprints, work items, and comments.
- AI agent automation and deeper external integrations remain dependent on backend readiness and should be documented as future or final-release work if they are not available in the beta.
- Any substantial feature changes should be discussed with the instructor and recorded in this schedule table.

## Weekly Check-In Template

Each weekly milestone meeting should update the README schedule and bug tracker. Each member should be ready to state:

- What they completed last week
- What they plan to complete this week
- Anything blocking their work
- Which completed feature they verified that was implemented by someone else

## API Design Documentation

The backend API source of truth is the generated OpenAPI document:

- Deployed beta API docs: <https://api.prizmatic.app/dev/docs-json>
- Local API docs, when the backend is running: <http://localhost:4000/docs-json>

The frontend currently consumes the following API areas. All backend responses are expected to use the shared envelope shape:

```ts
type ApiResponse<T> = {
  data?: T;
  message?: string;
  code?: string;
};
```

### Frontend Session Routes

These routes live in this Next.js app under `src/app/api/auth`.

| Method   | Route               | Purpose                                                                    |
| -------- | ------------------- | -------------------------------------------------------------------------- |
| `GET`    | `/api/auth/session` | Read the browser session state from auth cookies.                          |
| `POST`   | `/api/auth/session` | Save issued access and refresh tokens into cookies.                        |
| `DELETE` | `/api/auth/session` | Clear local auth cookies.                                                  |
| `POST`   | `/api/auth/refresh` | Refresh the access token through the backend and update cookies.           |
| `POST`   | `/api/auth/logout`  | Ask the backend to invalidate the refresh token, then clear local cookies. |

### Backend Authentication Endpoints

| Method | Route                          | Purpose                                              |
| ------ | ------------------------------ | ---------------------------------------------------- |
| `POST` | `/auth/signin`                 | Sign in with email and password.                     |
| `POST` | `/auth/signup`                 | Create an account with email credentials.            |
| `POST` | `/auth/email-verification`     | Request an email verification token.                 |
| `POST` | `/auth/verify?token=<token>`   | Verify an email token.                               |
| `GET`  | `/auth/username/{username}`    | Check username availability.                         |
| `GET`  | `/auth/me`                     | Retrieve the current authenticated user.             |
| `POST` | `/auth/oauth/google`           | Sign in or sign up with a Google ID token.           |
| `GET`  | `/auth/oauth/github/authorize` | Create a GitHub OAuth authorization URL.             |
| `POST` | `/auth/oauth/github`           | Sign in or sign up with a GitHub authorization code. |
| `POST` | `/auth/password/change`        | Change password for the authenticated user.          |
| `POST` | `/auth/refresh`                | Refresh an access token.                             |
| `POST` | `/auth/logout`                 | Invalidate the refresh token.                        |

### Backend Workspace Endpoints

| Method   | Route                                             | Purpose                                          |
| -------- | ------------------------------------------------- | ------------------------------------------------ |
| `GET`    | `/workspaces`                                     | List workspaces for the current user.            |
| `POST`   | `/workspaces`                                     | Create a workspace.                              |
| `GET`    | `/workspaces/{workspaceId}`                       | Get a workspace by ID.                           |
| `PATCH`  | `/workspaces/{workspaceId}`                       | Update workspace metadata.                       |
| `DELETE` | `/workspaces/{workspaceId}`                       | Delete a workspace.                              |
| `GET`    | `/workspaces/{workspaceId}/members`               | List workspace members.                          |
| `DELETE` | `/workspaces/{workspaceId}/members/{userId}`      | Remove a workspace member.                       |
| `PUT`    | `/workspaces/{workspaceId}/members/{userId}/role` | Update a workspace member role.                  |
| `PUT`    | `/workspaces/{workspaceId}/owner`                 | Transfer workspace ownership.                    |
| `GET`    | `/workspaces/{workspaceId}/jobs`                  | List workspace project jobs.                     |
| `POST`   | `/workspaces/{workspaceId}/jobs`                  | Create workspace project jobs.                   |
| `PATCH`  | `/workspaces/{workspaceId}/jobs`                  | Update workspace project jobs in batch.          |
| `GET`    | `/workspaces/members/search`                      | Search users or emails to invite to a workspace. |
| `POST`   | `/workspaces/{workspaceId}/invitations`           | Create a workspace invitation.                   |
| `GET`    | `/workspaces/invitations?token=<token>`           | Preview an invitation by token.                  |
| `POST`   | `/workspaces/invitations/accept`                  | Accept a workspace invitation.                   |
| `POST`   | `/workspaces/invitations/decline`                 | Decline a workspace invitation.                  |

### Backend Project Endpoints

| Method   | Route                                                 | Purpose                          |
| -------- | ----------------------------------------------------- | -------------------------------- |
| `GET`    | `/projects?workspaceId=<workspaceId>`                 | List projects by workspace ID.   |
| `GET`    | `/workspaces/{workspaceSlug}/projects`                | List projects by workspace slug. |
| `POST`   | `/projects`                                           | Create a project.                |
| `GET`    | `/projects/{projectId}`                               | Get a project by ID.             |
| `GET`    | `/projects/slugs/{projectSlug}`                       | Get a project by slug.           |
| `PATCH`  | `/projects/{projectId}`                               | Update project metadata.         |
| `DELETE` | `/projects/{projectId}`                               | Delete a project.                |
| `GET`    | `/projects/{projectId}/members`                       | List project members.            |
| `PATCH`  | `/projects/{projectId}/members`                       | Add or update project members.   |
| `DELETE` | `/projects/{projectId}/members/{memberId}`            | Remove a project member.         |
| `GET`    | `/projects/{projectId}/work-items`                    | Search/list work items.          |
| `POST`   | `/projects/{projectId}/work-items`                    | Create a work item.              |
| `GET`    | `/projects/{projectId}/work-items/{itemId}`           | Get a work item.                 |
| `PATCH`  | `/projects/{projectId}/work-items/{itemId}`           | Update a work item.              |
| `DELETE` | `/projects/{projectId}/work-items/{itemId}`           | Delete a work item.              |
| `GET`    | `/projects/{projectId}/work-items/{itemId}/children`  | List child work items.           |
| `GET`    | `/projects/{projectId}/work-items/{itemId}/comments`  | List work item comments.         |
| `POST`   | `/projects/{projectId}/work-items/{itemId}/comments`  | Create a work item comment.      |
| `GET`    | `/projects/{projectId}/sprints`                       | List project sprints.            |
| `POST`   | `/projects/{projectId}/sprints`                       | Create a sprint.                 |
| `GET`    | `/projects/{projectId}/sprints/{sprintId}`            | Get a sprint.                    |
| `PATCH`  | `/projects/{projectId}/sprints/{sprintId}`            | Update a sprint.                 |
| `DELETE` | `/projects/{projectId}/sprints/{sprintId}`            | Delete a sprint.                 |
| `GET`    | `/projects/{projectId}/sprints/{sprintId}/work-items` | List work items in a sprint.     |

When backend endpoints change, update both the OpenAPI document and this README snapshot before the milestone check-in.

## Project Structure

```text
src/app        Next.js App Router routes and route handlers
src/domains    Business logic, API clients, domain components, hooks, and types
src/atomics    Domain-neutral UI components organized by atomic design layer
src/shared     Domain-neutral utilities, HTTP clients, query wrappers, constants, and types
public         Static assets
```

Follow the architecture rules in `AGENTS.md`: business logic belongs in `src/domains`, UI-only components belong in `src/atomics`, and domain-neutral helpers belong in `src/shared`.

## Development Rules

- Use App Router pages under `src/app/**/page.tsx`.
- Keep route files thin and compose domain components from `src/domains/<domain>/components`.
- Use `useApiQuery`, `useApiMutation`, and `useApiInfiniteQuery`; do not call TanStack Query hooks directly.
- Query keys must come from `QUERY_KEYS` in `src/shared/query/queryKeys.ts`.
- Default to server components and add `"use client"` only when required.
- Compose class names with `cn()` from `@/shared/utils/cn`.
- Use Conventional Commits, for example `feat(projects): add sprint detail page`.
