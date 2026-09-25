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
  - task: "repository review and implementation"
    duration: "00:08:00"
  - task: "verification and showcase preparation"
    duration: "00:03:00"
  - task: "provenance and documentation"
    duration: "00:01:00"
total_duration: "00:13:00"
ai_log: "ai-logs/2026/09/25/0f8a2161-3869-4ee6-b6be-7a4de1e887cf/conversation.md"
source: ".github/prompts/implement-todo-list-manager-slice-2.prompt.md"
---

# Slice 2 Stakeholder Showcase

**Audience:** Product and engineering stakeholders
**Duration:** 6 minutes
**Target:** Windows x64 development build

## Before the Demo

- Run `npm run verify` and confirm the typecheck, lint, tests, build, and disposable-profile smoke launch pass.
- Run `npm run demo` to build and open the real app in a disposable profile. The implementation in `scripts/smoke.mjs` removes that profile after the app window closes. Do not use a normal user profile or database.
- Use fictional task text such as `Email the sample supplier about the 3 PM delivery`. Do not show personal task content, local usernames, secrets, or machine-specific paths.
- Keep test evidence available. `npm run verify` passed 19 tests; focused evidence is available with `npm test -- src/infrastructure/sqlite/sqlite-todo-repository.test.ts` and `npm test -- src/renderer/todo-creation-state.test.ts src/features/todos/create-todo/create-todo.test.ts`.
- Manually confirm Enter submission, visible validation, error feedback, and comfortable layout at approximately 320 px and 1280 px before presenting. Automated tooling in this repository does not drive UI events or viewport screenshots.
- Slice 1 launch/restore is not integrated. The current-window list only displays tasks created since the app opened; do not claim pre-existing tasks appear after relaunch.

## Presenter Run of Show

1. **Frame the need (1 minute):** Describe an ordinary moment when someone needs to capture a next action before context changes. Set scope: this slice makes task capture quick and trustworthy; it is not the complete task manager.
2. **Create a real task (1 minute):** In the app window, enter the fictional task and submit with Enter. Show the active task and cleared input. Explain that the app updates the list only after SQLite reports a committed save.
3. **Recover from invalid input (1 minute):** Submit spaces or a whitespace-only value. Show the announced, actionable validation message and confirm no task appears. Replace it with a valid title and continue; the draft remains editable after validation failure.
4. **Show durability evidence (1 minute):** Present the passing temporary-database test, which closes and reopens SQLite and checks the saved item's identifier, title, active status, and timestamp. The demo profile is deleted on close, and integrated launch/restore is not implemented, so do not close and reopen the app expecting the item to reload.
5. **Show failure honesty (1 minute):** Present the service/repository failure tests and renderer state test. They verify that failure does not create a saved row, append an unsaved item, clear the draft, or report success. Do not inject a live fault or fabricate an error state; the automated UI harness does not render and interact with failure states.
6. **Close with evidence and scope (1 minute):** Show `npm run verify` and summarize the result: 9 test files and 19 tests passed, followed by successful build and disposable-profile launch. Name the remaining integration dependency and state that completion, filtering, counts, editing, and deletion are later slices.

## Evidence and Traceability

- **FR-001, AC-001:** Create service trims title boundaries, creates an active item with generated ID and timestamp, and returns the repository's saved value. Service tests use deterministic ID/time; SQLite tests confirm durable readback.
- **FR-002, BR-001, AC-002:** Service tests reject empty, spaces-only, and tabs/newlines-only titles without repository writes. Renderer exposes a labeled form and an announced validation message.
- **FR-003:** Renderer reducer tests verify that success appends the returned item and clears the draft; failure retains it.
- **FR-012, BR-004:** SQLite test verifies the saved item survives close/reopen. The adapter commits its transaction before returning success.
- **BR-005, AC-008:** Service and SQLite tests cover returned/thrown persistence errors and failed transactions; renderer state tests confirm no false list update or draft loss.
- **IPC/security:** Main-handler tests reject malformed and unexpected request fields and verify serializable results. Preload and renderer-boundary tests confirm the bridge remains narrow and renderer sources do not import privileged APIs.

## Verified Limits

- `npm run verify` passed after implementation: strict TypeScript check, ESLint, 9 test files / 19 tests, production build, and Windows x64 Electron smoke launch against a disposable profile.
- The automated renderer test checks semantic form markup, and reducer tests exercise state transitions; no browser/DOM event harness is installed. Actual keyboard and viewport behavior must be confirmed during presenter preflight.
- Slice 1 launch/restore is outstanding. This guide uses database close/reopen test evidence instead of claiming integrated relaunch behavior.
- The interactive `npm run demo` walkthrough is a presenter preflight action, not part of the automated verification run reported above.
