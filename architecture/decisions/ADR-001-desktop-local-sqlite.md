---
ai_generated: true
model: "anthropic/claude-3.5-sonnet@2024-10-22"
operator: "johnmillerATcodemag-com"
chat_id: "adr-001-desktop-local-sqlite-20260925"
prompt: |
  Create an ADR for Option 2
started: "2026-09-25T09:05:00-07:00"
ended: "2026-09-25T09:05:00-07:00"
task_durations:
  - task: "requirements and ADR guidance review"
    duration: "00:05:00"
  - task: "architecture decision drafting"
    duration: "00:12:00"
  - task: "validation and provenance"
    duration: "00:05:00"
total_duration: "00:22:00"
ai_log: "ai-logs/2026/09/25/adr-001-desktop-local-sqlite-20260925/conversation.md"
source: "johnmillerATcodemag-com"
---

# ADR-001: Use a Desktop Local Application with SQLite

- **Status**: Approved
- **Date**: 2026-09-25
- **Deciders**: Product owner and engineering
- **Reviewers**: To be assigned
- **Supersedes**: Not applicable
- **Superseded by**: Not applicable

## Context

The TODO list manager requirements define a single-user, single-device MVP. The application must create, display, edit, complete, filter, count, and delete TODO items, and must persist changes between application launches. The MVP must not transmit task content to a remote service and must provide visible behavior when persistence fails.

The requirements allow a local persistence mechanism but do not prescribe a UI framework, desktop runtime, database, or deployment model. The architecture must therefore provide durable local storage without introducing accounts, synchronization, collaboration, or backend operations that are explicitly outside the MVP scope.

## Decision Drivers

- Durable local persistence and data integrity.
- Clear failure behavior when storage is unavailable or corrupted.
- Privacy through local-only task storage.
- Support for up to 1,000 stored TODO items.
- Keyboard accessibility and responsive user interaction.
- Low operational complexity after installation.
- A clean boundary between application behavior and storage technology.
- Reasonable support for future local export or backup without requiring cloud synchronization.

## Options Considered

| Option                                   | Strengths                                                                                                              | Costs and risks                                                                                           | Outcome                                                                                       |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Local-first web SPA with browser storage | Zero installation, simple distribution, strong fit for a small MVP                                                     | Browser storage can be cleared; browser support and storage behavior vary                                 | Rejected for this decision because desktop-managed storage provides stronger local durability |
| Desktop local application with SQLite    | Transactional local storage, explicit file ownership, offline operation, no backend, supports the expected data volume | Requires installation, packaging, updates, and platform testing                                           | Selected                                                                                      |
| Client with backend API and database     | Enables accounts, backup, synchronization, and future collaboration                                                    | Violates the current local-only boundary and adds hosting, identity, security, and operational complexity | Rejected for the MVP; reconsider only if requirements change                                  |

## Decision

Adopt a desktop local application architecture with a desktop UI, an application service layer, a TODO repository interface, and a SQLite persistence adapter stored within the user's local application data boundary.

The application MUST keep task content local in the MVP and MUST NOT require a backend, account, network connection, authentication, or synchronization service for core operation.

The application behavior MUST depend on the repository interface rather than SQLite-specific calls. The repository MUST support complete collection load, create, update, completion-state changes, and delete operations, and MUST surface persistence failures to the application layer.

This decision does not select a specific desktop shell, UI framework, operating system support matrix, backup format, or distribution channel. Those choices require separate decisions or implementation constraints.

## Consequences

### Positive

- SQLite provides transactional local persistence suitable for the required TODO data volume.
- Create, edit, completion, and delete operations can be committed atomically before the UI reports success.
- Task content remains within the local storage boundary, aligning with the MVP privacy requirement.
- The repository interface allows tests to use an in-memory implementation and allows a future storage adapter without changing user-facing behavior.
- The application can operate offline without degraded core functionality.
- A local database creates a straightforward path for future local export, import, or backup features.

### Negative and Risks

- Users must install and update a desktop application rather than open a static web page.
- Packaging, code signing, update delivery, and support increase release responsibilities.
- The supported operating systems and desktop runtime must be selected and tested.
- Local database files can be deleted, corrupted, or become inaccessible; the MVP cannot provide server-side recovery.
- SQLite schema migrations must be versioned even though the initial data model is small.
- The desktop shell and UI runtime introduce a larger application footprint than a browser-only implementation.

### Security and Privacy

- The application MUST store the database in the platform's user-specific application-data location, not in a shared or system-wide location.
- The application MUST avoid transmitting TODO content in the MVP.
- The implementation MUST define file permissions and protect against unintended access by other local users where the target platform supports it.
- The application MUST treat imported or restored database content as untrusted if import or recovery is added later.
- The desktop runtime MUST restrict unnecessary filesystem, process, and network capabilities.

### Operational Effects

- Releases require desktop artifact creation and installation testing.
- Support documentation must explain local storage location, data-clearing behavior, and the limitation that the MVP has no remote backup.
- Diagnostics should record storage failures without recording task titles or other task content.
- A recovery or export capability should be considered before the application is used for high-value task data.

## Implementation and Validation

### Initial Implementation

1. Define a technology-neutral `TodoRepository` interface for load, create, update, complete, and delete operations.
2. Implement application services for validation, task state changes, counts, filters, and error mapping.
3. Implement a SQLite adapter with a versioned schema containing identifier, title, completion state, and creation timestamp.
4. Place the database in the per-user application-data directory selected by the target desktop runtime.
5. Build an accessible desktop UI that consumes application services and does not issue SQL directly.
6. Add a migration runner that fails visibly and safely if the database schema cannot be upgraded.

### Validation Evidence

- Functional tests cover FR-001 through FR-013 and the corresponding acceptance criteria in the requirements specification.
- Fault-injection tests verify FR-014 for unavailable, read-only, malformed, and failed-transaction storage conditions.
- Data-integrity tests verify that title, identifier, completion state, and creation timestamp survive application relaunch.
- Transaction tests verify that a failed mutation does not report durable success or leave a partially committed item.
- Accessibility tests verify keyboard operation, logical focus order, accessible names, and completion state exposure.
- Performance tests verify NFR-001 and NFR-002 with 1,000 stored TODO items.
- Network tests verify NFR-006 by confirming that core task operations do not transmit task content.
- Packaging tests verify installation, launch, update, and clean-user-data behavior for every supported platform.

### Rollout and Rollback

- Release the application first to a test channel with a disposable database.
- Validate schema creation, migration, mutation recovery, and relaunch behavior before wider distribution.
- Preserve backward-compatible database migrations for supported releases.
- If a release corrupts or cannot open the database, stop automatic migration, preserve the original database file, and provide an actionable error.
- Roll back the application binary to the previous supported release when possible; do not delete or overwrite user data during rollback.

## Related Records

- [TODO List Manager Requirements](../../requirements/todo-list-manager-requirements.md)
- [Software Requirements Document Instructions](../../.github/instructions/software-requirements-document.instructions.md)
- [Architecture Decision Record Instructions](../../.github/instructions/architecture-decision-record.instructions.md)

## Open Follow-up Decisions

- Select the supported operating systems and desktop runtime.
- Define behavior for malformed or unreadable SQLite data.
- Decide whether the first release requires local export or backup.
- Define the maximum task-title length and corresponding database/UI limits.
- Assign accountable deciders and reviewers before changing the status to `Accepted`.
