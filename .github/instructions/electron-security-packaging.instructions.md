---
ai_generated: true
model: "anthropic/claude-3.5-sonnet@2024-10-22"
operator: "johnmillerATcodemag-com"
chat_id: "electron-react-typescript-stack-20260925"
prompt: |
  Create instruction files for stack 3
started: "2026-09-25T09:20:00-07:00"
ended: "2026-09-25T09:20:00-07:00"
task_durations:
  - task: "stack and ADR review"
    duration: "00:05:00"
  - task: "security and packaging instruction drafting"
    duration: "00:10:00"
  - task: "validation and provenance"
    duration: "00:05:00"
total_duration: "00:20:00"
ai_log: "ai-logs/2026/09/25/electron-react-typescript-stack-20260925/conversation.md"
source: "johnmillerATcodemag-com"
name: "electron-security-packaging"
description: "Use when securing, packaging, updating, or testing the Electron desktop TODO application, including IPC, preload, native SQLite dependencies, permissions, and release artifacts."
applyTo: "**/{src,app,main,renderer,preload,electron,build,dist}/**/*.{ts,tsx,js,jsx,json,jsonc}"
version: "1.0.0"
author: "johnmillerATcodemag-com"
tags: ["electron", "security", "ipc", "packaging", "sqlite", "supply-chain"]
owner: "Development Team"
reviewedDate: "2026-09-25"
nextReview: "2026-12-25"
---

# Electron Security and Packaging Instructions

## Security Baseline

Treat the renderer as untrusted content even when all UI assets are local. Preserve the Electron security boundary on every build and test configuration.

- Enable `contextIsolation` and sandboxing where supported.
- Keep `nodeIntegration` disabled in the renderer.
- Expose a narrow, typed API through `contextBridge` from preload.
- Never expose raw `ipcRenderer`, `process`, filesystem APIs, shell execution, or arbitrary native commands to React.
- Validate every IPC payload in the main process; renderer-side validation is not a security boundary.
- Use allowlisted IPC channel names and reject unknown channels.
- Do not construct SQL, file paths, shell commands, or URLs from untrusted input without validation and parameterization.
- Disable or restrict navigation, new-window creation, and remote module loading.
- Do not load remote content for the TODO manager MVP.
- Keep development-only debugging and test hooks out of production builds.

## IPC Design

Define IPC as explicit use cases rather than generic transport:

```text
createTodo(input) -> Result<Todo, TodoError>
updateTodo(input) -> Result<Todo, TodoError>
setTodoCompletion(input) -> Result<Todo, TodoError>
deleteTodo(input) -> Result<void, TodoError>
loadTodos() -> Result<Todo[], TodoError>
```

- Use one request and response schema per operation.
- Return serializable domain data and stable error codes.
- Do not return database connections, native objects, stack traces, or filesystem paths to the renderer.
- Make failures visible without exposing sensitive diagnostic details.
- Test malformed payloads, missing fields, unexpected fields, invalid identifiers, and rejected storage operations.

## SQLite and Native Dependencies

- Pin and audit Electron, SQLite, native database bindings, build tools, and packaging dependencies.
- Rebuild native SQLite modules for the exact Electron runtime before packaging.
- Verify native modules for every supported operating system and CPU architecture.
- Use parameterized queries and least-privilege file access.
- Store the database in the user-specific application-data directory.
- Apply migrations explicitly and preserve the original database before risky migration or recovery.
- Do not bundle sample credentials, secrets, or user data in the application or installer.
- Do not send TODO content to telemetry, crash reports, analytics, or remote update services.

## Packaging and Updates

- Produce signed release artifacts where the target platform supports code signing.
- Build reproducible artifacts from a clean checkout with lockfiles enforced.
- Separate development, test, and production configuration.
- Test installation, first launch, relaunch, upgrade, downgrade, uninstall behavior, and data preservation.
- Never remove the user's database during application update or rollback.
- Stop migration rather than overwrite a database that cannot be read or upgraded safely.
- Publish checksums and retain the exact release artifact used for validation.
- Limit automatic updates to trusted, integrity-checked release sources if updates are added.

## Supply Chain Controls

- Commit the package-manager lockfile and use frozen or locked installs in CI.
- Review dependency changes for security, license, native build, and runtime implications.
- Prefer maintained packages with clear release history and minimal permissions.
- Scan application and installer dependencies before release.
- Avoid dynamic installation of packages or native binaries at runtime.
- Keep Electron and native dependencies within supported security versions.

## Logging and Privacy

- Log operation type, status, timing, and stable error codes without task titles or task content.
- Redact filesystem paths when they could expose usernames or sensitive locations.
- Do not log full IPC payloads or SQL statements containing values.
- Make local-only behavior verifiable with network tests and review production permissions.
- Document that clearing application data can remove tasks because the MVP has no remote backup.

## Release Validation Checklist

- [ ] `contextIsolation` is enabled.
- [ ] `nodeIntegration` is disabled for renderer windows.
- [ ] The renderer receives only the allowlisted preload API.
- [ ] IPC payloads are validated in the main process.
- [ ] Navigation and external windows are restricted.
- [ ] No remote TODO-content transmission occurs.
- [ ] Native SQLite modules are rebuilt and tested for every target platform.
- [ ] Database migrations preserve the original file on failure.
- [ ] Lockfile-based clean installation succeeds.
- [ ] Dependency, license, and vulnerability checks pass.
- [ ] Install, update, rollback, and data-preservation tests pass.
- [ ] Release artifacts are signed or checksummed according to platform policy.
- [ ] Production logs contain no task content, secrets, or unnecessary personal data.

## Summary

The Electron security model is part of the application architecture, not a packaging afterthought. Keep native capabilities behind a narrow validated IPC boundary, treat SQLite and native modules as release-critical dependencies, and prove that upgrades preserve local user data.
