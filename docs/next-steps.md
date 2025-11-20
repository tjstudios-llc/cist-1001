# Next steps checklist

Use this as a short, practical backlog to turn the scaffolding into a usable cloud IDE. Tackle items in order to get a working vertical slice, then iterate.

## 1) Environment + auth
- Create `apps/api/.env` from `.env.example` and set `SESSION_SECRET`, GitHub app credentials, and `GITHUB_CALLBACK_URL` if not using the default.
- Run database bootstrap (SQLite is bundled) and create an initial admin user via the local signup endpoint.
- Verify local + GitHub login flows through `/auth/login` and `/auth/github` with session cookies persisting across requests.

## 2) Wire the dashboard to the API
- Replace placeholder dashboard data with real API calls (`/projects`, `/projects/:id/publish`, `/auth/session`).
- Add authenticated fetch helpers that reuse `fetch` with `credentials: 'include'` so the browser sends the session cookie.
- Surface login/logout states in the React router and gate project routes behind auth guards.

## 3) Data model + persistence
- Expand from SQLite to Postgres for multi-user reliability; add a migration tool (Knex/Prisma) and migration scripts.
- Introduce per-user project settings: repo URL, build command, run command, custom domain, and publish status.
- Add audit fields (created_at/updated_at) and indexes on user + project tables.

## 4) Workspace runtime
- Add a workspace service that provisions isolated containers/VMs per project with quotas (CPU/memory/disk) and a WebSocket pty endpoint for shells.
- Wire the web UI terminal to the pty WebSocket and expose port-forwarded previews for app ports.
- Implement background jobs for workspace startup/shutdown and snapshotting to persistent storage.

## 5) Publishing + domains
- Extend the publish endpoint to trigger a build pipeline (e.g., container image or static export) and store artifacts.
- Integrate a proxy (Traefik/NGINX) to map custom domains to the built artifact or running workspace, with TLS (Let’s Encrypt).
- Add DNS verification flow in the UI for custom domains and display status in the dashboard.

## 6) Security + operations
- Harden session handling (secure cookies, sameSite, HTTPS-only in production) and add rate limiting to auth routes.
- Add logging/metrics (OpenTelemetry-friendly) and health checks for API and workspace agents.
- Document runbooks for rotating secrets, restoring backups, and handling abuse (resource throttling + account suspension).

## 7) Developer experience
- Add seeded demo data for onboarding and Cypress/Playwright tests for auth + project flows.
- Create a CLI or SDK for programmatic project creation and triggering publishes.
- Set up CI to run lint/test on web + API, and CD to deploy preview environments per branch.
