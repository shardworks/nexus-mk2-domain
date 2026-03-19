---
title: Build Loop
status: draft
acceptance:
  - A shell script exists that runs an indefinite audit-then-build loop
  - Each iteration runs an audit; if any requirements fail, it invokes the builder
  - The loop does not exit on its own under normal operation
  - The loop sleeps for 30 seconds between iterations
  - The loop can be stopped by the user (e.g., Ctrl+C / SIGINT)
---

# Build Loop

The system must include a continuously-running loop that sequences the audit and build operators. The loop audits the project, invokes the builder if any requirements are failing, then waits before repeating. It runs indefinitely — as new requirements are added or code changes, the loop detects and responds.

## Rationale

The audit→build→audit cycle is the system's core feedback mechanism. Without automation, a human must manually invoke each step. The build loop makes the system self-sustaining: add a requirement, and the loop will eventually detect it, audit against it, and invoke the builder to satisfy it.

## Scope

The loop:

- Runs indefinitely until interrupted by the user.
- Each iteration: audit, then build (if failures exist), then sleep.
- Sleeps for 30 seconds between iterations.
- Is a shell script — pure orchestration, not a new operator. It sequences existing operators.
