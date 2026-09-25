---
ai_generated: true
model: "unknown/unknown@2026-09-25"
operator: "johnmillerATcodemag-com"
chat_id: "0f8a2161-3869-4ee6-b6be-7a4de1e887cf"
prompt: |
  @file:implement-todo-list-manager-slice-2.prompt.md
started: "2026-09-25T19:46:00Z"
ended: "2026-09-25T19:59:14Z"
task_durations:
  - task: "repository review and platform baseline"
    duration: "00:02:00"
  - task: "Slice 2 implementation and focused tests"
    duration: "00:06:00"
  - task: "quality gates, showcase, and provenance"
    duration: "00:05:00"
total_duration: "00:13:00"
ai_log: "ai-logs/2026/09/25/0f8a2161-3869-4ee6-b6be-7a4de1e887cf/conversation.md"
source: ".github/prompts/implement-todo-list-manager-slice-2.prompt.md"
---

# TODO List Manager

The TODO List Manager is a local-first Electron desktop app. Slice 0 established the secure shell and versioned SQLite database; Slice 2 adds validated task creation with durable local persistence.

## Development

Use Node.js 22.22.0 and npm. The initial supported smoke target is Windows x64. The app uses Electron 44.4.5, React, TypeScript, Vite, and Node's built-in SQLite module; the Node test runner currently emits its experimental SQLite warning.

```powershell
npm ci
npm run dev
```

Run the complete repeatable gate with `npm run verify`. It performs strict type checking, linting, tests, a production build, and a packaged-like Electron launch against a disposable profile. `npm run demo` opens that same built shell in a disposable profile for a presenter-led walk-through; closing the window removes the profile.

## Project References


See the [requirements](requirements/todo-list-manager-requirements.md), [architecture decision](architecture/decisions/ADR-001-desktop-local-sqlite.md), [implementation plan](docs/todo-list-manager-vertical-slice-implementation-plan.md), [Slice 0 stakeholder showcase guide](docs/todo-list-manager-slice-0-showcase.md), and [Slice 2 implementation prompt](.github/prompts/implement-todo-list-manager-slice-2.prompt.md).
## Current Capability and Limits

- Create one active TODO with a non-blank title. Boundary whitespace is trimmed; internal whitespace and case are preserved.
- The task is reported as saved and shown in the current window only after the SQLite transaction succeeds.
- The renderer uses a typed preload operation; main validates requests, and storage errors are mapped to safe domain codes.
- The visible list contains tasks created in the current window. Slice 1 launch/restore is not integrated, so previously saved tasks are not loaded on launch yet.
- Editing, completion, filtering, counts, deletion, accounts, synchronization, backend services, and TODO-content network transmission are not implemented.

## Verification and Showcase

Latest implementation verification: `npm run verify` passed strict typecheck, lint, all 19 tests, production build, and the Windows x64 disposable-profile smoke launch. This automated gate does not test actual keyboard events or viewport layouts; presenters should verify the live form before the stakeholder walkthrough.

See the [Slice 2 stakeholder showcase guide](docs/todo-list-manager-slice-2-showcase.md) for the six-minute run of show, evidence commands, and demo limitations. The guide and implementation record are in the [Slice 2 chat summary](ai-logs/2026/09/25/0f8a2161-3869-4ee6-b6be-7a4de1e887cf/summary.md).

See the [requirements](requirements/todo-list-manager-requirements.md), [approved architecture decision](architecture/decisions/ADR-001-desktop-local-sqlite.md), [implementation plan](docs/todo-list-manager-vertical-slice-implementation-plan.md), [Slice 0 showcase guide](docs/todo-list-manager-slice-0-showcase.md), and [Slice 2 implementation prompt](.github/prompts/implement-todo-list-manager-slice-2.prompt.md).

The Windows x64 smoke target is not cross-platform certification. Installer/distribution choices and any additional supported operating systems remain open for release planning.
