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

# Slice 0 Stakeholder Showcase

**Audience:** Product and engineering stakeholders
**Duration:** 6 minutes
**Target:** Windows x64 only

## Before the Demo

- Run `npm ci` and `npm run verify`; confirm every gate passes.
- Use `npm run demo`. It builds the app, launches the real Electron shell with a new temporary user-data directory, and removes that directory after the app closes.
- Keep the result from `npm test` and the smoke output available as evidence. Do not open a developer's normal application-data directory or show local usernames, paths, secrets, or unrelated files.
- No TODO content or mock tasks are used. The shell has no task workflow.

## Presenter Run of Show

1. **Frame the milestone (1 minute):** “This is the local-first desktop foundation. We are proving the application boundary and durable storage before adding task actions; this is not yet a finished TODO manager.”
2. **Launch the shell (1 minute):** Run `npm run demo` and show the actual app window. Point to the local database-ready status. State that only schema initialization is implemented.
3. **Show persistence readiness (1 minute):** Present the `npm test` result and the smoke result. Explain that the versioned schema is created in a disposable profile and that the repository interface separates future task features from SQLite.
4. **Show the security boundary (1 minute):** Open `src/main/window-options.ts` and `src/preload/index.ts`, or show their passing tests. Explain context isolation, disabled renderer Node integration, sandboxing, and the one-operation typed preload API.
5. **Show repeatable quality evidence (1 minute):** Run `npm run verify` or show its passing result: TypeScript, lint, tests, production build, and Electron smoke launch.
6. **Close on next value (1 minute):** State that Slice 0 reduces integration and data-boundary risk. Slice 1 will add launch/restore/empty-state behavior; create, edit, complete, filter, count, and delete remain later work.

## Evidence and Success Criteria

- The actual desktop process stays open while the disposable profile receives schema v1.
- The migration test verifies `id`, `title`, `status`, and `created_at`, repeat initialization, safe rejection of malformed/newer schemas, and cleanup.
- Automated checks verify secure window settings, the narrow preload bridge, and renderer imports free of Node/Electron/SQLite access.
- `npm run verify` passes on Windows x64.
- Stakeholders leave understanding this is a foundation milestone, not a completed task workflow.

If the app window cannot be shown, say so and present the real test/smoke output instead. Do not claim cross-platform support, task persistence/reload, or features that are not implemented.
