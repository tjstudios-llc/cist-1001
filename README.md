# Collaborative Cloud IDE Platform

This repository now includes a starter file structure for building a Replit-style, multi-tenant IDE with authentication, project dashboards, and publishing support.

## Structure
- `apps/api`: Express API with GitHub OAuth + local username/password authentication, SQLite-backed users/projects, and routes for publishing + custom domains.
- `apps/web`: Vite + React dashboard with sidebar navigation, project cards, and login integration guidance.
- `docs`: Architecture overview and roadmap.

## Getting started
1. Install dependencies: `npm install` (uses workspaces for API + web).
2. Configure API: copy `apps/api/.env.example` to `apps/api/.env` and fill in secrets.
3. Run services:
   - API: `npm run dev:api`
   - Web: `npm run dev:web`
4. Open the dashboard at `http://localhost:5173` and connect it to the API at `http://localhost:4000`.

## Next steps
- Follow the detailed backlog in [`docs/next-steps.md`](docs/next-steps.md) for a prioritized path to a working vertical slice.
- Wire the dashboard forms to the API endpoints and real project data.
- Swap SQLite for Postgres in production and add migrations.
- Add per-workspace container orchestration to launch IDE shells and terminals.
