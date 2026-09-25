---
name: implement-todo-list-manager-slice-0
description: Implement and verify Slice 0 of the local TODO manager, then prepare a human-led stakeholder showcase of its foundation value.
mode: agent
model: "anthropic/claude-3.5-sonnet@2024-10-22"
tools: ["search", "read", "edit", "terminal"]
prompt_metadata:
  id: implement-todo-list-manager-slice-0
  title: Implement TODO List Manager Slice 0
  owner: johnmillerATcodemag-com
  repository: 20260921-aiasd-green
  version: 1.0.0
  created: "2026-09-25"
  updated: "2026-09-25"
  output_path: application source and tests defined by the existing project structure
  category: implementation
  tags:
    [
      electron,
      react,
      typescript,
      sqlite,
      vertical-slice,
      verification,
      showcase,
    ]
  output_format: code
ai_generated: true
operator: "johnmillerATcodemag-com"
chat_id: "implement-todo-list-manager-slice-0-20260925"
prompt: |
  using the implemtation plan as a guide, create a implementation prompt file for slice 0. Include the verification steps and showcase instruction. The showcase instruction are targeted at a human guidee demo that demostrate to stake holders the value of the slice
started: "2026-09-25T11:12:00-07:00"
ended: "2026-09-25T11:18:56-07:00"
task_durations:
  - task: "plan, architecture, and prompt convention review"
    duration: "00:03:00"
  - task: "prompt and showcase drafting"
    duration: "00:03:00"
  - task: "index, provenance, and validation"
    duration: "00:01:00"
total_duration: "00:07:00"
ai_log: "ai-logs/2026/09/25/implement-todo-list-manager-slice-0-20260925/conversation.md"
source: "johnmillerATcodemag-com"
---

# Implement TODO List Manager Slice 0

Implement **Slice 0: Runnable Desktop and Persistence Foundation** from [the vertical-slice implementation plan](../../docs/todo-list-manager-vertical-slice-implementation-plan.md). Follow the repository's applicable instructions, especially [the Electron/React/TypeScript stack guidance](../instructions/electron-react-typescript-stack.instructions.md), [ADR-001](../../architecture/decisions/ADR-001-desktop-local-sqlite.md), and [the requirements](../../requirements/todo-list-manager-requirements.md).

## Gate Before Implementation

1. Inspect the repository and its instructions before choosing tools, dependencies, directory layout, or commands. Reuse existing conventions and avoid adding dependencies unless the current project structure requires them.
2. Check ADR-001's status and the implementation-readiness decisions in the plan. If ADR-001 is still `Proposed`, do not represent it as accepted. Ask for explicit approval to proceed with development. If the supported runtime, operating systems, or other decisions needed to make a runnable foundation are unresolved, identify the specific blocker and ask for the smallest decision needed; do not silently choose one.
3. State the intended file-level scope and a falsifiable verification check. Keep changes limited to Slice 0 and preserve unrelated work already in the repository.

## Slice 0 Outcome and Scope

Deliver a runnable desktop foundation that can open or create a versioned SQLite database through a repository boundary. Implement only what is needed to establish and verify that foundation:

- Electron main, narrow preload, and React renderer entry points using secure defaults. Enable context isolation, disable renderer Node integration, and expose no raw IPC, arbitrary channel, filesystem, SQLite, or Node.js API to the renderer.
- Dependency-light shared TODO data model, structured result type, domain error codes, and `TodoRepository` contract aligned with the planned follow-on slices.
- SQLite schema and migration runner for identifier, title, completion state, and creation timestamp. Initialize the app database in the selected per-user application-data location.
- A temporary test-database factory and deterministic fixtures that can migrate and close cleanly without touching a developer's real application data.
- Project commands and CI-compatible checks for strict TypeScript, lint, unit tests, and a packaged-like Electron smoke launch, using the repository's actual tooling.

Keep process boundaries explicit: renderer -> typed preload API -> main-process application services -> repository -> SQLite. Validate process-boundary inputs and map infrastructure failures to structured domain-level results. Never expose SQLite errors or task content in renderer errors or diagnostic logs.

Do not implement task creation, listing UI, completion, filtering, counts, editing, or deletion workflows in this slice. Do not add a backend, authentication, synchronization, telemetry that includes TODO content, or unrelated product features. The app may show a minimal shell needed to prove a successful launch; do not imply that a TODO workflow is complete.

## Implementation Procedure

1. Inspect the existing repository state, runtime/toolchain choices, and test setup. Record any unresolved decision before changing architecture-dependent files.
2. Implement the smallest coherent end-to-end foundation, keeping SQLite-specific code behind the repository boundary and keeping renderer imports free of main-process modules.
3. Add focused tests alongside each boundary: shared types/contracts as appropriate, migration/repository initialization using a temporary database, and security/IPC configuration where supported by the existing harness.
4. Add or update scripts and CI configuration only as needed to make the required checks repeatable. Do not claim a check is available if no command or harness exists; report the gap and the smallest remedy.
5. Run the verification steps below. Fix regressions caused by this work and rerun the failing focused check. Do not broaden the change to later slices.
6. Prepare the human-led showcase guide from actual implemented behavior and evidence. Clearly label any step that depends on a tool or script rather than a user-facing screen.

## Verification Steps

Report each check as **Pass**, **Fail**, or **Not available**, with the exact command or evidence and a concise result:

- **App launch and database initialization:** Start the app using the project's packaged-like development/smoke configuration with no existing database. Confirm the app opens and the initial versioned schema is created in the selected per-user application-data location.
- **Renderer isolation:** Verify the BrowserWindow configuration enables context isolation and disables Node integration. Verify renderer code has no direct Node.js, Electron, filesystem, or SQLite imports/access, and the preload exposes only the narrow typed API. Use an automated assertion or a documented runtime smoke check where the harness allows it.
- **SQLite lifecycle:** Run the repository test against a temporary database. Confirm migration creates the expected identifier, title, completion-state, and creation-timestamp schema; migration can be safely run according to its intended idempotency/version rules; and the connection closes cleanly. Confirm the test leaves no data in the developer's real app-data directory.
- **Quality gates:** Run strict TypeScript checking, linting, the baseline/unit test suite, and the packaged-like launch smoke test using the actual project commands. Include results and any pre-existing failures separately.
- **Failure and privacy review:** Confirm startup/migration failure does not appear as successful initialization, storage details are mapped safely, and logs do not contain task titles or other task content. Confirm no TODO-content network transmission path was introduced.
- **Traceability:** Link changed contracts and tests to Slice 0 and its verification requirements. Note follow-up decisions or deferred workflows without expanding this slice.

Do not mark Slice 0 complete unless app launch and initial schema creation, renderer isolation, the temporary database lifecycle test, and strict TypeScript plus baseline tests all pass. If a packaged-like smoke launch is blocked by missing platform/runtime decisions, state that blocker explicitly.

## Human-Led Stakeholder Showcase

Prepare a concise **5- to 8-minute, presenter-led demo** for product and engineering stakeholders. It should demonstrate why this foundation reduces delivery and data-risk for the later TODO workflows, not pretend that those workflows already exist.

### Before the Demo

- Use a disposable development profile/database and the packaged-like launch configuration. Never expose a stakeholder's or developer's real application data.
- Confirm the app launches, the schema initialization check passes, and the repository lifecycle test is green. Have command output or test results ready as a fallback if the environment cannot display database internals safely.
- Do not show real task content, secrets, local usernames, or unrelated files. Redact machine-specific paths in screenshots or shared notes.
- Prepare the actual app window and only the minimum terminal/test evidence needed. Do not create a fake TODO UI or present mock data as a working feature.

### Presenter Run of Show

1. **Frame the value (about 1 minute):** Explain that the MVP is local-first and that Slice 0 establishes a desktop app boundary and durable local-storage foundation before task actions are layered on.
2. **Launch the app (about 1 minute):** Start the packaged-like build and show that the desktop application opens. Point out only UI that truly exists; state plainly that task workflows are later slices if the shell is intentionally minimal.
3. **Show local persistence readiness (about 2 minutes):** Demonstrate the startup/schema check or migration test using the disposable database. Explain that a versioned schema and repository contract let later features persist data without tying the renderer to SQLite. Do not claim create/reload behavior unless it has actually been implemented and tested in this slice.
4. **Show the security boundary (about 1 minute):** Present the BrowserWindow security settings and narrow preload API, or their automated assertions. Explain that the renderer does not receive direct filesystem, SQLite, or Node.js access.
5. **Show repeatable evidence (about 1 minute):** Run or display the actual focused test and quality-gate results. Connect these checks to reduced integration risk for future slices.
6. **Close with scope and next value (about 1 minute):** Summarize what Slice 0 enables and what remains out of scope. Name Slice 1's launch/restore/empty-state flow as the next user-observable capability; do not imply it is included here.

### Demo Success Criteria

Stakeholders should be able to explain, based on what they saw, that:

- The desktop shell launches in the demonstrated environment.
- Local database initialization and migration have repeatable test evidence.
- The renderer is separated from privileged filesystem and database capabilities.
- The repository contract and test foundation reduce risk as user-facing slices are added.
- Slice 0 is a foundation milestone, not a finished TODO manager; the next demonstrable user outcome is Slice 1.

If any criterion cannot be demonstrated, say what is missing and show the closest verified evidence. Do not fabricate results, success states, screenshots, or user-facing capabilities.

## Completion Report

At completion, provide:

- A concise summary of the foundation delivered and changed files.
- Verification results, exact commands, and any blockers or unavailable checks.
- Any architecture decisions still requiring approval and any deferred scope.
- The human-led showcase run of show, prerequisites, evidence to show, and an explicit statement of Slice 0's limits.
