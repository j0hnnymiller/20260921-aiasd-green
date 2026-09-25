---
ai_generated: true
model: "unknown/unknown@2026-09-25"
operator: "johnmillerATcodemag-com"
chat_id: "d79e7e5d-59cd-426a-b501-ff0efedad44a"
prompt: "review the comments on PR 1 and propose instruction changes to prevent generating code in the future that doesn't pass code reviews\n\ngo ahead make thes changes"
started: "2026-09-25T19:08:17Z"
ended: "2026-09-25T19:16:04Z"
task_durations:
  [
    { task: "PR feedback and guidance review", duration: "00:02:00" },
    { task: "instruction updates and provenance", duration: "00:05:47" },
  ]
total_duration: "00:07:47"
ai_log: "ai-logs/2026/09/25/d79e7e5d-59cd-426a-b501-ff0efedad44a/conversation.md"
source: "johnmillerATcodemag-com"
name: "electron-react-typescript-stack"
description: "Use when building or reviewing the Electron, React, TypeScript, and SQLite TODO application stack, including process boundaries, application services, repositories, state, UI, and tests."
applyTo: "**/{src,app,main,renderer,preload,electron}/**/*.{ts,tsx,js,jsx}"
version: "1.0.1"
author: "johnmillerATcodemag-com"
tags: ["electron", "react", "typescript", "sqlite", "desktop"]
owner: "Development Team"
reviewedDate: "2026-09-25"
nextReview: "2026-12-25"
---

# Electron React TypeScript Stack Instructions

## Overview

Build the TODO manager as a local-first Electron desktop application with a React and TypeScript renderer, a constrained preload bridge, an Electron main process, and a SQLite repository. Preserve the boundaries defined by [ADR-001](../../architecture/decisions/ADR-001-desktop-local-sqlite.md): one local user, no backend, no authentication, no synchronization, and no remote task transmission.

## Process Boundaries

Keep responsibilities separated:

- **Renderer**: Render accessible UI, manage view state, and invoke typed preload APIs. Do not access Node.js, Electron modules, SQLite, or the filesystem directly.
- **Preload**: Expose the smallest typed API required by the renderer. Do not expose raw `ipcRenderer`, filesystem methods, arbitrary channels, or general-purpose code execution.
- **Main process**: Own application lifecycle, IPC handlers, validation orchestration, error mapping, database access, and native capabilities.
- **Application services**: Express task use cases such as create, edit, complete, delete, filter, count, load, and persistence-error handling without depending on React or Electron globals.
- **Repository**: Define a `TodoRepository` interface and keep SQLite-specific SQL inside its adapter.
- **Database**: Store the versioned SQLite database in the per-user application-data directory.

Use a one-way dependency direction:

```text
React renderer -> typed preload API -> main-process application services -> TodoRepository -> SQLite adapter
```

Do not import renderer modules into the main process or database modules into React components.

## TypeScript and Domain Rules

- Enable strict TypeScript checking and avoid `any` at process boundaries.
- Define shared DTOs and IPC result types in a dependency-light shared module.
- Model TODO state explicitly as active or completed; do not use ambiguous truthy values.
- Preserve the TODO identifier and creation timestamp when editing or changing completion state.
- Trim leading and trailing whitespace before persistence and reject blank titles.
- Return structured success and failure results from application services; do not leak SQLite errors to the renderer.
- Keep filtering and counts derived from the same loaded task collection or authoritative query result.
- Keep user-visible strings outside persistence and infrastructure modules.

## React UI Rules

- Keep components focused on presentation and user interaction.
- Put task commands behind typed hooks or application-facing clients; do not put SQL or IPC channel names in components.
- Represent loading, empty, validation-error, persistence-error, edit, and success states explicitly.
- Use semantic controls and accessible names for create, edit, cancel, complete, delete, and filter actions.
- Preserve logical keyboard focus, especially after entering edit mode, cancelling, deleting, and displaying an error.
- Do not rely on color alone to communicate completion state.
- Keep task titles and controls usable from 320 pixels through 1280 pixels without horizontal scrolling.
- Avoid optimistic UI for mutations unless the failure path can restore the previous state and explain that persistence failed.

## SQLite Repository Rules

- Use parameterized SQL for every value supplied by the user or application.
- Version the schema and run migrations before loading application data.
- Use transactions for mutations that must update multiple records or derived data atomically.
- Return domain-level errors for unavailable, read-only, malformed, or failed storage.
- Validate the complete schema contract, not only table or column names: verify schema version, column types, nullability, primary keys, defaults, and constraints. Test SQLite `CHECK` constraints with invalid writes because column metadata alone does not establish them.
- Reject or explicitly migrate a same-version schema with incompatible types or missing constraints; never report it initialized based only on matching column names.
- Map the original database exception to the domain error before attempting rollback or close. Cleanup failures must not mask the original mapped failure.
- Preserve the original database file before attempting risky recovery or migration.
- Test the repository independently from Electron and React with a temporary database.
- Never log task titles or task content while diagnosing persistence failures.

## Testing Requirements

- Unit-test domain validation, task commands, filters, counts, and error mapping without Electron.
- Test the repository against a temporary SQLite database, including migration and transaction failure behavior.
- Include same-version incompatible-schema cases, invalid writes for declared constraints, read-only initialization or migration failures, and assertions for the exact mapped domain error.
- Exercise failures at transaction start, schema changes, commit, and cleanup where implemented; confirm cleanup errors do not hide the triggering storage error.
- Test preload and IPC contracts for valid requests, invalid payloads, unknown channels, and rejected operations.
- Test React behavior for keyboard workflows, accessible names, empty states, validation, persistence errors, and count updates.
- Run end-to-end tests against a packaged-like Electron process for create, edit, complete, delete, reload, and recovery scenarios.
- Use deterministic fixtures and do not depend on a developer's real application-data directory.

## Validation Checklist

- [ ] Renderer code has no direct Node.js, Electron, filesystem, or SQLite access.
- [ ] Preload exposes only typed, task-specific operations.
- [ ] Main-process IPC handlers validate inputs before invoking application services.
- [ ] Application services are testable without Electron or React.
- [ ] SQLite access is isolated behind `TodoRepository`.
- [ ] Strict TypeScript checking passes without new `any` escapes.
- [ ] Schema tests verify column types, nullability, keys, defaults, and constraints, and reject incompatible same-version schemas.
- [ ] Each supported persistence failure is tested through the public result contract and maps to its declared error code.
- [ ] Task mutations persist before success is shown.
- [ ] Persistence failures preserve state where possible and are visible to the user.
- [ ] Keyboard and assistive-technology workflows are tested.
- [ ] The application does not transmit TODO content remotely.
- [ ] The full project verification command passes after the final source or test edit, and required CI checks pass for the exact reviewed commit.

## Summary

Keep the renderer narrow, the preload bridge smaller, and the main process authoritative. Treat SQLite as an infrastructure detail behind a repository, and make every user-visible mutation testable from the UI through durable persistence.
