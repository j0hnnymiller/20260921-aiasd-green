---
ai_generated: true
model: "anthropic/claude-3.5-sonnet@2024-10-22"
operator: "johnmillerATcodemag-com"
chat_id: "software-requirements-document-20260925"
prompt: |
  Follow instructions in #prompt:SKILL.md with these arguments: for a software requirements document
started: "2026-09-25T08:25:57-07:00"
ended: "2026-09-25T08:25:57-07:00"
task_durations:
  - task: "requirements analysis"
    duration: "00:03:00"
  - task: "instruction drafting"
    duration: "00:07:00"
  - task: "validation and provenance"
    duration: "00:02:00"
total_duration: "00:12:00"
ai_log: "ai-logs/2026/09/25/software-requirements-document-20260925/conversation.md"
source: "johnmillerATcodemag-com"
name: "software-requirements-document"
description: "Use when creating, reviewing, or refining a software requirements document, specification, functional requirement, non-functional requirement, acceptance criterion, or traceability matrix."
applyTo: "**/{requirements,specs}/**/*.{md,txt}"
version: "1.0.0"
author: "johnmillerATcodemag-com"
tags: ["requirements", "specification", "acceptance-criteria", "traceability"]
owner: "Development Team"
reviewedDate: "2026-09-25"
nextReview: "2026-12-25"
---

# Software Requirements Document Instructions

## Overview

Create software requirements documents that describe user and system needs clearly enough for design, implementation, and verification. Keep requirements technology-neutral unless an implementation constraint is explicitly in scope. Write for product owners, engineers, testers, security reviewers, and AI assistants.

## Document Structure

Use these sections when they apply:

1. **Purpose and Scope** - State the problem, intended outcome, in-scope capabilities, and explicit exclusions.
2. **Stakeholders and Users** - Identify actors, roles, goals, and affected systems.
3. **Definitions** - Define domain terms, abbreviations, and status values.
4. **Assumptions, Constraints, and Dependencies** - Record facts that limit or influence the solution.
5. **Functional Requirements** - Describe observable system behavior.
6. **Non-Functional Requirements** - State measurable quality, security, compliance, operational, and accessibility targets.
7. **External Interfaces and Data** - Describe integrations, inputs, outputs, ownership, validation, and failure behavior.
8. **Acceptance Criteria and Traceability** - Link requirements to business goals, use cases, tests, and open decisions.
9. **Risks and Open Questions** - Identify unresolved decisions, owners, impact, and due dates.
10. **Change History** - Record meaningful changes and their rationale.

Do not add empty sections. Mark intentionally deferred sections as `Not applicable` with a reason.

## Requirement Quality

- Assign stable identifiers: `FR-001` for functional requirements, `NFR-001` for non-functional requirements, and `INT-001` for interfaces.
- Give every requirement one clear subject, action, and outcome.
- Use one normative term consistently: `MUST` for mandatory behavior, `SHOULD` for justified preference, and `MAY` for optional behavior.
- Make each requirement atomic, unambiguous, feasible, and independently testable.
- Replace vague words such as `fast`, `easy`, `secure`, `soon`, and `appropriate` with observable thresholds or link them to an explicit decision.
- State conditions, inputs, outputs, validation rules, permissions, error behavior, and timing where they affect behavior.
- Separate the requirement from its rationale and implementation notes.
- Avoid prescribing a technology, class structure, endpoint shape, or database schema unless it is a stated constraint or required interface.
- Do not duplicate requirements. Cross-reference the authoritative identifier instead.

## Non-Functional Requirements

Express quality attributes with a metric, target, measurement context, and verification method. Cover relevant areas such as:

- Performance and capacity
- Availability, resilience, recovery, and data retention
- Security, privacy, identity, authorization, and auditability
- Accessibility and usability
- Compatibility, portability, and localization
- Observability, supportability, and operational limits
- Regulatory or contractual obligations

Example:

```markdown
**NFR-001: Search response time**

The system MUST return the first page of search results within 750 ms for at least 95% of requests with up to 100 concurrent users and 1 million indexed records, measured in production-like load tests.
```

## Acceptance Criteria and Traceability

- Provide acceptance criteria for every externally valuable functional requirement.
- Prefer Given/When/Then criteria for workflows and scenario-based behavior.
- Include at least one success case, relevant validation or authorization cases, and failure or boundary cases.
- Map each requirement to its source goal, user story, business rule, interface, or decision.
- Map each requirement to one or more verification methods: test, inspection, analysis, or demonstration.
- Flag requirements without a source, owner, acceptance criteria, or verification method as incomplete.

Example:

```markdown
**FR-001: Submit a support request**

An authenticated user MUST be able to submit a support request with a subject, description, and priority.

**Acceptance criteria**

- Given valid required fields, when the user submits the request, then the system creates a uniquely identified request.
- Given a missing subject, when the user submits the form, then the system rejects it and identifies the missing field.
- Given an unauthenticated request, when the user submits the request, then the system denies access without creating data.
```

## Ambiguity and Review Workflow

When source material is incomplete:

1. Preserve the source intent and record the assumption.
2. Flag the ambiguity as an open question rather than silently inventing behavior.
3. Offer a concrete clarification with options and its impact.
4. Identify the decision owner and required decision date when known.
5. Do not mark the requirement ready for implementation until its blocking ambiguity is resolved.

Before finalizing, check completeness, consistency, feasibility, security and privacy impact, testability, dependency order, and traceability. Treat conflicting requirements as explicit issues and identify which source or stakeholder must resolve them.

## Validation Checklist

- [ ] Purpose, scope, exclusions, stakeholders, and terminology are clear.
- [ ] Requirements use stable IDs and normative language consistently.
- [ ] Each requirement is atomic, feasible, unambiguous, and testable.
- [ ] Functional behavior includes validation, authorization, errors, and boundary cases where relevant.
- [ ] Non-functional targets are measurable and include verification context.
- [ ] Interfaces and data ownership, validation, and failure behavior are documented.
- [ ] Acceptance criteria cover success, failure, and important edge cases.
- [ ] Requirements trace to goals and verification methods.
- [ ] Assumptions, dependencies, risks, and open questions have owners where possible.
- [ ] No unresolved ambiguity is presented as settled behavior.
- [ ] The document contains no secrets, credentials, or unnecessary personal data.

## Summary

Produce requirements documents that are stable, testable, measurable, traceable, and honest about uncertainty. Prefer precise behavioral statements over solution design, and expose missing decisions before implementation begins.

---

**Document Version**: 1.0.0
**Last Updated**: 2026-09-25
**Maintainer**: Development Team
**Related Instructions**: [Business Rules to Vertical Slices](business-rules-to-slices.instructions.md), [Instruction File Standards](instruction-files.instructions.md)
