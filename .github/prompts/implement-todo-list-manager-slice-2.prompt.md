---
name: implement-todo-list-manager-slice-2
description: Implement and verify Slice 2 task creation and validation, then prepare a human-led stakeholder showcase of its user value.
mode: agent
model: "anthropic/claude-3.5-sonnet@2024-10-22"
tools: ["search", "read", "edit", "terminal"]
prompt_metadata:
  id: implement-todo-list-manager-slice-2
  title: Implement TODO List Manager Slice 2
  owner: johnmillerATcodemag-com
  repository: 20260921-aiasd-green
  version: 1.0.0
  created: "2026-09-25"
  updated: "2026-09-25"
  output_path: application source, tests, and docs/todo-list-manager-slice-2-showcase.md
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
chat_id: "implement-todo-list-manager-slice-2-prompt-20260925"
prompt: |
  using the implemtation plan as a guide, create a implementation prompt file for slice 2. Include the verification steps and showcase instruction. The showcase instruction are targeted at a human guidee demo that demostrate to stake holders the value of the slice
started: "2026-09-25T12:43:44-07:00"
ended: "2026-09-25T12:44:34-07:00"
task_durations:
  - task: "implementation-plan, requirements, and prompt convention review"
    duration: "00:00:25"
  - task: "Slice 2 implementation and showcase prompt drafting"
    duration: "00:00:20"
  - task: "provenance, README, and link validation"
    duration: "00:00:05"
total_duration: "00:00:50"
ai_log: "ai-logs/2026/09/25/implement-todo-list-manager-slice-2-prompt-20260925/conversation.md"
source: "johnmillerATcodemag-com"
---

# Implement TODO List Manager Slice 2

Implement **Slice 2: Create and Validate a TODO** from [the vertical-slice implementation plan](../../docs/todo-list-manager-vertical-slice-implementation-plan.md). Follow applicable repository instructions, especially [the Electron/React/TypeScript stack guidance](../instructions/electron-react-typescript-stack.instructions.md), [ADR-001](../../architecture/decisions/ADR-001-desktop-local-sqlite.md), and [the requirements](../../requirements/todo-list-manager-requirements.md).

## Gate Before Implementation

1. Inspect the current repository state, local instructions, contracts, tests, and available commands before choosing file locations or implementation details. Preserve unrelated work and follow existing patterns; do not add dependencies unless the current project requires them and repository policy permits them.
2. Confirm ADR-001 remains approved. Check the plan's Slice 2 implementation dependencies (Slice 0 contracts and Slice 1 renderer primitives) and integration dependency (Slice 1 launch/restore flow). If Slice 1 is not integrated, keep Slice 2 independently testable with the existing test patterns or a fake repository, do not silently implement Slice 1 or claim an integrated create-and-restore workflow, and report the integration limitation. Do not block feature-owned work that the plan explicitly allows before integration.
3. Check recorded decisions that affect this feature, including title-length behavior and persistence/error conventions. Do not invent a product limit or change shared contracts without evidence and coordination. If an unresolved decision blocks a safe implementation, state the exact decision and ask for the smallest needed direction.
4. Before editing, state the narrow file-level scope, one falsifiable behavior hypothesis, and the focused check that can disconfirm it.

## Slice 2 Outcome and Scope

A user can create one valid active TODO. The title is trimmed at its boundaries, blank or whitespace-only titles are rejected without persistence, and the entry control clears only after durable success.

Implement only the create capability and its necessary end-to-end plumbing:

- Feature-owned create flow using the existing feature organization where present.
- Authoritative non-blank title validation in the application/service boundary; renderer feedback may mirror it for immediate usability but must not replace it.
- A typed, narrow preload operation and validated main-process IPC request/result using the repository's established conventions. Do not expose raw IPC or privileged APIs to the renderer.
- Create a unique identifier and creation timestamp using existing utilities/conventions or a small injectable seam that makes tests deterministic. New items start active. Preserve the title exactly after trimming leading and trailing whitespace; do not normalize internal whitespace or alter case.
- Persist via `TodoRepository.create` and the SQLite adapter transactionally. Return the saved item and only then update the visible list, report success, or clear the input.
- Accessible form semantics, keyboard submission, visible validation feedback, and an actionable persistence-error state. On validation or save failure, keep the user's draft; on save failure, do not add an unsaved item to the list or claim success.
- Focused unit, repository, IPC/preload, and renderer tests using the repository's existing harness. Use a fake repository for service/UI cases and a temporary SQLite database for persistence cases where supported.

Do not implement completion, filtering, counts, editing, deletion, remote services, accounts, synchronization, task-content telemetry, unrelated shell redesign, or a second implementation of Slice 1. Keep the UI responsive from 320 px through 1280 px, and preserve the renderer/main/preload/repository boundaries. Never log task titles or include them in error details.

## Implementation Procedure

1. Inspect the current app, repository contract, renderer, preload, main process, SQLite adapter, test helpers, and package scripts. Identify the smallest feature-owned path through those boundaries.
2. Add a focused test for the create behavior before or alongside implementation. Keep shared API changes coordinated and only extend contracts when the slice needs them.
3. Implement validation and durable creation through the application boundary, then wire the typed IPC/preload request and accessible renderer form. Do not add optimistic success before persistence resolves.
4. Exercise successful creation with the SQLite adapter and verify that closing/reopening the temporary database preserves the saved item. Keep all test data outside real user application data.
5. Run the verification steps below. Fix regressions from this slice and rerun the failing focused check before the full gate. Do not broaden scope to later slices.
6. Create `docs/todo-list-manager-slice-2-showcase.md` from verified behavior. The guide is for a human presenter demonstrating stakeholder value, not an implementation walkthrough or a fictional product flow. Update the README with a link to the guide if the guide is created.

## Verification Steps

For each check, report **Pass**, **Fail**, or **Not available**, the exact command or evidence, and a concise result. Distinguish pre-existing failures from failures introduced by this slice.

- **AC-001 / valid create:** Submit a title with surrounding whitespace. Confirm exactly one active item appears with a unique identifier and creation timestamp, the stored/displayed title is trimmed only at the boundaries, and the input clears only after the repository reports success.
- **AC-002 / invalid create:** Submit empty and whitespace-only values (including spaces, tabs, and line breaks where the UI permits). Confirm no repository write occurs, no item appears, the draft remains editable, and accessible, actionable validation feedback is announced.
- **FR-012 / durable create:** With a temporary SQLite database, create an item, close and reopen the database, and confirm the item and its fields remain. Verify the repository transaction completes before success is returned.
- **AC-008 / failure behavior:** Inject a repository/storage failure. Confirm the UI does not report success, clear the draft, or append an unsaved item; show a plain-language, actionable error without raw SQLite details or task content.
- **IPC and security boundary:** Test request validation and structured result serialization across the existing typed preload/main boundary. Confirm the renderer receives no direct Node.js, filesystem, SQLite, or unrestricted IPC access and no TODO-content network path was introduced.
- **Accessibility and responsive behavior:** Test form submission with the keyboard, accessible labels and validation/error announcements, logical focus behavior, and usable layout at 320 px and 1280 px using available project tooling. Report unavailable automated tooling rather than claiming a check passed.
- **Quality gates:** Run focused tests for the changed feature, then `npm run verify` (strict typecheck, lint, all tests, build, and packaged-like smoke launch). Run `npm run demo` as needed to confirm the real interactive presenter path; do not leave a demo process running.
- **Traceability:** Map implemented behavior and tests to FR-001, FR-002, FR-003, FR-012, BR-001, BR-004, BR-005, AC-001, AC-002, and relevant AC-008 failure behavior. Clearly identify any Slice 1 integration dependency still outstanding.

Do not mark Slice 2 complete unless valid creation, blank rejection, durable persistence, save-failure behavior, accessible keyboard submission, and the required project quality gates have passing evidence. If integration with Slice 1 is unavailable, report Slice 2's feature-level verification separately from the incomplete integrated application flow.

## Human-Led Stakeholder Showcase

Create a concise **5- to 7-minute presenter-led demo** for product and engineering stakeholders. Demonstrate the practical value of reliable task capture: a person can record a real next action quickly, avoid silently losing it, and recover from invalid input. Use only behavior implemented and verified in this slice.

### Before the Demo

- Run `npm run verify` and confirm the relevant checks pass. Use `npm run demo` for the built app's disposable-profile walkthrough if the current demo command supports it; verify cleanup behavior from its implementation rather than assuming it.
- Start from a disposable profile/database. Use clearly fictional, low-sensitivity demo task text. Never expose real personal data, local usernames, secrets, or unredacted machine-specific paths.
- Prepare the actual app window plus the focused test results. If showing an error state requires fault injection, use a test result or controlled test harness; do not damage a database or create a fake UI state.
- Confirm whether Slice 1's restore flow is integrated. If it is not, do not imply that the app supports integrated launch-and-restore. Present Slice 2's verified focused result and call out this limitation plainly.

### Presenter Run of Show

1. **Set the scenario (about 1 minute):** Describe a stakeholder's ordinary need to capture a next action before context changes. State that this slice focuses on fast, trustworthy creation, not full task management.
2. **Show the real entry flow (about 1 minute):** In the actual app, enter a plausible demo task and submit it using the primary keyboard path. Show the new active item and cleared input. Explain that success follows the durable save, not merely a button click.
3. **Show validation (about 1 minute):** Submit whitespace-only input. Show the accessible validation message and that no item was added; correct the input and continue. Keep the draft if that is the implemented behavior.
4. **Show durable value (about 1 minute):** If Slice 1 restore is integrated, close and reopen the app using the same disposable profile and show the task restored. Otherwise, present the passing temporary-database close/reopen test and explicitly say integrated relaunch is not yet part of this demo.
5. **Show failure honesty (about 1 minute):** Present the focused persistence-failure test. Explain that an unsuccessful save is not shown as a successful task and the entered draft remains available. Do not fabricate a live error or expose storage internals.
6. **Close with evidence and scope (about 1 minute):** Show focused test and `npm run verify` results. Summarize that Slice 2 delivers validated, durable task capture; completion, filtering, counts, editing, and deletion are later slices.

### Demo Success Criteria

Stakeholders should be able to explain from the demonstration that:

- A user can capture one valid active task and continue quickly.
- Whitespace-only input cannot silently create an invalid task.
- The task is not reported as saved until persistence succeeds.
- A failed save is visible and does not discard the draft or falsely update the list.
- The demonstration distinguishes integrated behavior from focused test evidence and clearly names any Slice 1 dependency.

If any criterion cannot be shown, state why and use the closest real, passing evidence. Do not fabricate results, screenshots, persisted state, or user-facing capabilities.

## Completion Report

Provide a concise summary of the delivered create flow and changed files; verification results with exact commands and blockers; traceability to requirements and acceptance criteria; any unresolved Slice 1 integration dependency; and the showcase guide path, presenter run of show, prerequisites, and explicit limits of the demo.
