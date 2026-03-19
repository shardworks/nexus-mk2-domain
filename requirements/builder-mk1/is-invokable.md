---
title: Builder Is Invokable
status: draft
acceptance:
  - A shell script exists at bin/build.sh that triggers a build
  - Running the script produces either a commit addressing a failing requirement or a clean exit with no changes
  - The script requires no arguments for default operation
---

# Builder Is Invokable

The builder must be invokable via a shell script so that builds can be triggered by humans, other agents, or automation without knowledge of the underlying agent mechanics.
