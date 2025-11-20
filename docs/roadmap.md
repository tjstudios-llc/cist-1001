# Roadmap

## Phase 0: Proof of Concept
- Workspace agent that serves a WebSocket-based shell and basic file CRUD over HTTP.
- Single-user auth (shared secret) with static provisioning of one container per workspace.
- Minimal React-based UI that connects to the shell and lists files.

## Phase 1: Multi-tenant MVP
- OIDC login and session management.
- Control plane service to create/destroy workspaces on a container orchestrator.
- Persistent volumes for workspaces with snapshot/restore endpoints.
- Port-forwarding service for HTTP previews with TLS via a reverse proxy.
- Template library for Node, Python, and Rust starter projects.

## Phase 2: Collaboration & Scale
- Live collaboration (CRDT-based editor sync) and shared terminals with permissions.
- Resource quotas, metrics, and billing hooks per tenant.
- Background jobs for image builds and dependency caching.
- Observability stack (logs, traces, metrics dashboards) and audit trails.

## Phase 3: Enterprise hardening
- Network policies (egress control), secret management, and vulnerability scanning on templates.
- Regional deployments with workspace placement policies and warm pools.
- Admin dashboards for tenant management and support tooling (impersonation, session recording).

## Phase 4: Ecosystem & extensibility
- Plugin system for custom templates, actions (CI hooks), and marketplace integrations.
- API/SDK for programmatic workspace management and embedding the IDE in third-party apps.

## Delivery checklist
- Document operational runbooks (on-call, incident response, backup/restore).
- Load/perf testing harness for cold starts and collaborative editing at scale.
- Security reviews and threat modeling before public beta.
