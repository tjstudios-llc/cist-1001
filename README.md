# Collaborative Cloud IDE Platform

This repository contains an early multi-application starter for a collaborative, Replit-style cloud IDE. It is a development foundation, not a production-ready multi-tenant hosting platform.

## Applications

| Path | Purpose | Development URL |
| --- | --- | --- |
| `apps/web` | Vite + React project dashboard | http://localhost:5173 |
| `apps/api` | Express API, local authentication, GitHub OAuth, and SQLite-backed project records | http://localhost:4000 |
| `apps/authenticator` | Next.js authenticator PWA with a locally locked account vault | http://localhost:3000 |

## Requirements

- Node.js 20 or newer
- npm

Install workspace dependencies from the repository root:

```bash
npm install
```

## Configure the API

Copy the API environment template and set a unique session secret:

```bash
cp apps/api/.env.example apps/api/.env
openssl rand -hex 32
```

Put the generated value in `SESSION_SECRET`. Configure GitHub OAuth credentials if GitHub sign-in is needed. The GitHub callback URL must match the OAuth application configuration.

The API defaults to a local SQLite database for development. SQLite is not the planned production database for a multi-tenant hosting service; a PostgreSQL migration, schema migrations, and production session store are still required.

## Run each application

Start each service in a separate terminal from the repository root:

```bash
npm run dev:api
npm run dev:web
npm run dev:auth
```

The root workspace scripts change into the corresponding application directory before starting it.

## Current limitations

- The web dashboard is a starter UI and still needs to be connected to real project and deployment data.
- The API currently uses SQLite and the default in-memory Express session store.
- Container/IDE execution, per-workspace isolation, publishing infrastructure, and custom-domain provisioning are not implemented as production services.
- The authenticator PWA is a separate local-vault application; it is not the platform's account identity provider.

Do not expose this starter API publicly until production session storage, database migrations, request validation, authentication rate limits, CSRF protections, tenant isolation, and deployment controls have been implemented and tested.

## Security configuration

- Set a unique `SESSION_SECRET`; the API now fails fast when it is missing.
- Configure `CORS_ORIGINS` as a comma-separated allowlist of trusted frontend origins.
- Production cookies are HTTP-only, secure, and same-site.
- Keep OAuth secrets and environment files out of Git.
