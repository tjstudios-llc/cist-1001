# Architecture Overview

## Core requirements
- **Browser IDE**: Code editor with language servers, file browser, and live preview where possible.
- **Isolated workspaces**: Each user gets a dedicated environment with private filesystem, networking limits, and resource quotas.
- **Terminals & shells**: Provide interactive shells with support for installing packages (npm, pip, apt) while respecting quotas and security policies.
- **Persistent storage**: User files and environment state should persist between sessions with snapshotting/versioning.
- **Collaboration**: Optional shared sessions (pair programming) via WebRTC or WebSocket multiplexing, plus role-based permissions.
- **Project templates**: Quick-start templates for popular stacks (Node, Python, Rust, etc.) with one-click provisioning.
- **Observability & billing**: Metrics for CPU/memory/IO usage, audit logs, and hooks for billing/quotas.

## High-level design
- **Frontend (Web)**
  - React/TypeScript SPA delivered from a CDN or edge network.
  - Monorepo-friendly structure with shared UI kit for editor panes, terminals, and dashboards.
  - Connects to backend over WebSocket for terminals and file sync; REST/gRPC for control plane actions.
- **Gateway/API**
  - Authenticates requests (OIDC, GitHub, email-magic-link support) and issues short-lived workspace tokens.
  - Routes traffic to per-workspace agents via service mesh or reverse proxy (e.g., Envoy/Traefik).
- **Control plane**
  - Orchestrates workspace lifecycle using a container scheduler (Kubernetes, Nomad, or Firecracker-based microVMs).
  - Manages images, templates, secrets injection, and resource quotas.
  - Handles persistence using CSI volumes or object storage-backed filesystems.
- **Workspace agent**
  - Runs inside each workspace container/VM.
  - Provides:
    - File API (fs sync over WebSocket/HTTP)
    - Exec/pty endpoints for shells/terminals
    - Language server management (starting/stopping per project)
    - Port forwarding for previews
  - Reports metrics and health to the control plane.
- **Data layer**
  - Postgres (metadata/auth/session), Redis (queue/cache), S3-compatible object storage (snapshots/artifacts), and optional ClickHouse (analytics).
- **Networking & security**
  - Per-workspace network policies (egress filtering), rate limiting, DDoS protection, and container sandboxing (gVisor/Kata as needed).
  - TLS termination at the edge; mTLS between services.

## Technology options
- **Editor**: Monaco/VSCode extensions via `vscode-web` components.
- **Terminals**: xterm.js frontend + WebSocket pty backend.
- **Templates**: Buildpacks, Nix flakes, or pre-built OCI images.
- **Realtime sync**: CRDT-based collaboration (Yjs/Automerge) layered on file service.
- **Queues/Workers**: Task runners for image builds, linting, and tests.

## Scaling considerations
- Autoscale workspaces based on CPU/RAM; hibernate idle ones and snapshot to object storage.
- Use layered images to speed cold starts; warm pools for popular templates.
- Observability: OpenTelemetry tracing, structured logs, and per-tenant dashboards.

## Security notes
- Enforce resource limits and seccomp profiles on all workspaces.
- Use content filtering on outgoing requests (optional) and dependency scanning on templates.
- Rotate credentials frequently; store secrets in a dedicated vault service.

## Next steps
- Build a minimal vertical slice: create workspace -> open editor -> run terminal -> edit file -> preview port.
- Add collaboration and template workflows after the slice is reliable.
