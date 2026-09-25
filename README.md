---
ai_generated: true
model: "unknown/unknown@2026-09-25"
operator: "johnmillerATcodemag-com"
chat_id: "implement-todo-list-manager-slice-0-184524dc-1976-42bd-942e-21eba84b400e"
prompt: |
  #file:implement-todo-list-manager-slice-0.prompt.md
started: "2026-09-25T18:27:00Z"
ended: "2026-09-25T18:45:00Z"
task_durations:
  - task: "repository review and platform baseline"
    duration: "00:04:00"
  - task: "foundation implementation and tests"
    duration: "00:10:00"
  - task: "verification and showcase documentation"
    duration: "00:04:00"
  total_duration: "00:18:00"
ai_log: "ai-logs/2026/09/25/implement-todo-list-manager-slice-0-184524dc-1976-42bd-942e-21eba84b400e/conversation.md"
source: ".github/prompts/implement-todo-list-manager-slice-0.prompt.md"
---

# TODO List Manager

Slice 0 establishes a local Electron desktop foundation for the TODO manager. The current shell verifies that the app opens and initializes a versioned SQLite database; task workflows are intentionally not implemented.

## Development

Use Node.js 22.22.0 and npm. The initial supported smoke target is Windows x64. The app uses Electron 44.4.5, React, TypeScript, Vite, and Node's built-in SQLite module; the Node test runner currently emits its experimental SQLite warning.

```powershell
npm ci
npm run dev
```

Run the complete repeatable gate with `npm run verify`. It performs strict type checking, linting, tests, a production build, and a packaged-like Electron launch against a disposable profile. `npm run demo` opens that same built shell in a disposable profile for a presenter-led walk-through; closing the window removes the profile.

## Slice 0 Scope

- Secure Electron main/preload/renderer boundaries, typed foundation status, and a minimal launch shell.
- SQLite schema v1 and an initialization-only adapter behind the repository boundary.
- Temporary database factory, deterministic fixture, migration/security tests, and Windows CI.
- No task create/list/edit/complete/filter/count/delete workflows, backend, accounts, sync, or task-content network transmission.

See the [requirements](requirements/todo-list-manager-requirements.md), [architecture decision](architecture/decisions/ADR-001-desktop-local-sqlite.md), [implementation plan](docs/todo-list-manager-vertical-slice-implementation-plan.md), and [stakeholder showcase guide](docs/todo-list-manager-slice-0-showcase.md).

The Windows x64 smoke target is not cross-platform certification. Installer/distribution choices and any additional supported operating systems remain open for release planning.
