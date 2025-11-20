# Cloud IDE API

Express-based API providing authentication (GitHub OAuth + local username/password) and project management endpoints for the cloud IDE platform.

## Getting started
1. Copy `.env.example` to `.env` and update secrets and database path.
2. From repo root, run `npm install` then `npm run dev:api`.
3. Endpoints:
   - `POST /auth/register` create local user
   - `POST /auth/login` start session
   - `GET /auth/github` GitHub OAuth redirect
   - `GET /auth/session` verify session
   - `POST /projects` create project (auth required)
   - `PUT /projects/:id/domain` set custom domain
   - `PUT /projects/:id/publish` set publish URL
