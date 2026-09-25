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
name: "architecture-decision-record"
description: "Use when creating, reviewing, or updating an ADR, Architecture Decision Record, architecture decision, decision log, or record of a technical trade-off."
applyTo: "**/{adr,adrs,architecture,decisions}/**/*.md"
version: "1.0.1"
author: "johnmillerATcodemag-com"
tags: ["adr", "architecture", "decisions", "trade-offs", "documentation"]
owner: "Development Team"
reviewedDate: "2026-09-25"
nextReview: "2026-12-25"
---

# Architecture Decision Record Instructions

## Overview

Create Architecture Decision Records (ADRs) that preserve why an important technical or architectural choice was made, which alternatives were considered, and what consequences the choice creates. Write for current and future engineers, product stakeholders, operators, security reviewers, and AI assistants.

Use an ADR for a decision that affects system boundaries, technology direction, data ownership, security posture, reliability, operational practice, or long-term maintainability. Keep one primary decision per ADR.

## When to Apply

Apply these instructions when:

- Creating or reviewing an ADR or Architecture Decision Record.
- Recording a technology, integration, data, security, reliability, or deployment decision.
- Comparing architectural alternatives and documenting trade-offs.
- Superseding, deprecating, or revisiting an existing decision.

Do not use an ADR for routine implementation tasks, transient experiments, ordinary bug fixes, or requirements that do not establish an architectural choice. Use a requirements document, design document, issue, or runbook when that artifact is the authoritative source instead.

## Naming and Metadata

- Assign a stable identifier such as `ADR-001` and do not renumber it after publication.
- Use a descriptive filename such as `ADR-001-use-managed-identity.md`.
- Record the decision date, status, deciders, and reviewers when known.
- Link related requirements, business rules, issues, designs, threat models, and superseding ADRs.
- Keep the status explicit: `Proposed`, `Accepted`, `Rejected`, `Deprecated`, or `Superseded`.
- Use `Superseded by` and `Supersedes` links rather than rewriting history.

## Required Structure

Use these sections unless a section is genuinely not applicable. Mark an omitted section `Not applicable` with a reason; do not leave an empty heading.

1. **Title and Status** - Include the ADR identifier, decision title, status, date, deciders, and reviewers.
2. **Context** - Describe the problem, forces, constraints, system boundaries, and facts that motivated the decision.
3. **Decision Drivers** - State the criteria used to compare options, such as security, cost, performance, reliability, compliance, team capability, or delivery risk.
4. **Options Considered** - Describe viable alternatives and why each was retained or rejected.
5. **Decision** - State the selected option in direct, testable language.
6. **Consequences** - Record benefits, costs, risks, limitations, operational effects, and follow-on work.
7. **Implementation and Validation** - Define migration, rollout, observability, rollback, and evidence that will show the decision is working.
8. **Related Records** - Link requirements, standards, issues, diagrams, decisions, and supersession relationships.

## Decision Quality

- Separate facts and constraints in **Context** from the chosen action in **Decision**.
- Explain why the selected option is appropriate now; do not claim it is universally best.
- Compare at least one credible alternative when alternatives exist. If only one option is viable, explain the constraint that rules out alternatives.
- Make trade-offs explicit. Every meaningful benefit should be balanced with relevant cost, risk, or limitation.
- Record assumptions and identify which assumptions could invalidate the decision.
- Prefer durable rationale over temporary implementation details, vendor marketing, or personal preference.
- State what the decision does not decide when the boundary matters.
- Use precise language such as `MUST`, `SHOULD`, and `MAY` only for requirements created by the decision; do not turn every explanation into a requirement.
- Do not silently alter an accepted ADR. Create a superseding ADR when the decision materially changes.

## Alternatives and Trade-offs

For each option, capture:

- The option name and the part of the system it affects.
- Important advantages and disadvantages.
- Security, privacy, reliability, performance, cost, and operational implications where relevant.
- Migration or adoption effort.
- The reason it was selected, rejected, or deferred.

Use a comparison table when it improves clarity:

```markdown
| Option   | Strengths | Costs and risks | Outcome              |
| -------- | --------- | --------------- | -------------------- |
| Option A | ...       | ...             | Selected             |
| Option B | ...       | ...             | Rejected because ... |
```

Do not use a score or ranking without stating the criteria and evidence behind it.

## Consequences and Operations

Document both positive and negative consequences. Include the effects on:

- System design and ownership boundaries.
- Data flows, contracts, and compatibility.
- Security controls, privacy, identity, and auditability.
- Availability, performance, scaling, recovery, and support.
- Cost, licensing, staffing, and developer experience.
- Testing, deployment, monitoring, and incident response.

When implementation is required, identify incremental rollout steps, success signals, rollback conditions, and unresolved risks. Keep detailed procedures in a runbook and link to it rather than duplicating operational instructions in the ADR.

## Review and Lifecycle

Before accepting an ADR:

1. Verify that the problem and decision drivers are understandable without private conversation history.
2. Check that the selected decision directly addresses the stated problem.
3. Confirm that credible alternatives and trade-offs are documented.
4. Review security, privacy, reliability, cost, compliance, and operational consequences.
5. Confirm links, owners, validation evidence, and migration or rollback plans.
6. Compare the ADR status with linked implementation plans, readiness gates, and decision summaries. Use only the permitted status values and resolve any conflict before acceptance.
7. Keep the ADR `Proposed` while approval is pending. Change it to `Accepted` only after the accountable decision makers approve it, and update linked readiness records to reflect that same recorded decision.
8. Record reviewer concerns as explicit follow-up work or open risks.

When a decision is no longer valid, create a new ADR with the new decision and link the old ADR as `Superseded`. Preserve the original context and decision for historical traceability.

## ADR Template

```markdown
# ADR-XXX: [Decision Title]

- **Status**: Proposed
- **Date**: YYYY-MM-DD
- **Deciders**: [Names or roles]
- **Reviewers**: [Names or roles]
- **Supersedes**: [ADR link or Not applicable]
- **Superseded by**: [ADR link or Not applicable]

## Context

[Problem, forces, constraints, and relevant facts]

## Decision Drivers

- [Driver]

## Options Considered

| Option     | Strengths   | Costs and risks   | Outcome              |
| ---------- | ----------- | ----------------- | -------------------- |
| [Option A] | [Strengths] | [Costs and risks] | Selected or rejected |

## Decision

[State the selected option and its boundary]

## Consequences

### Positive

- [Benefit]

### Negative and Risks

- [Cost, limitation, or risk]

## Implementation and Validation

- [Rollout or migration step]
- [Success measure]
- [Rollback condition]

## Related Records

- [Requirement, issue, diagram, standard, or related ADR]
```

## Validation Checklist

- [ ] The ADR has a stable identifier, descriptive title, status, date, and deciders.
- [ ] The context explains the problem and constraints without relying on hidden conversation.
- [ ] Decision drivers are explicit and relevant to the system.
- [ ] The selected decision is stated directly and has a clear boundary.
- [ ] Credible alternatives and their trade-offs are documented.
- [ ] Benefits, costs, risks, and operational consequences are recorded.
- [ ] Security, privacy, reliability, performance, cost, and compliance impacts were considered where relevant.
- [ ] Implementation, validation, rollout, and rollback needs are identified.
- [ ] Related records and supersession links resolve.
- [ ] The ADR status uses a permitted value and agrees with linked plans and readiness gates.
- [ ] `Accepted` is supported by recorded approval from the accountable deciders.
- [ ] The ADR does not silently rewrite a previous accepted decision.
- [ ] No secrets, credentials, or unnecessary personal data are included.

## Summary

An effective ADR makes the decision and its rationale discoverable long after the original discussion ends. Record the context, drivers, credible alternatives, selected option, consequences, and lifecycle links with enough precision that another engineer can understand both what was decided and why.

---

**Document Version**: 1.0.1
**Last Updated**: 2026-09-25
**Maintainer**: Development Team
**Related Instructions**: [Instruction File Standards](instruction-files.instructions.md), [Software Requirements Document](software-requirements-document.instructions.md)
