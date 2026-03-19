---
title: Herald Is Invokable
status: active
acceptance:
  - A shell script exists at bin/herald.sh that invokes herald with a freeform prompt
  - bin/herald.sh accepts a single string argument describing what to produce
  - Running the script produces a markdown narrative without manual intervention
---

# Herald Is Invokable

Herald must be invokable via a shell script so that publishing can be triggered by humans or automation without knowledge of the underlying agent mechanics.

Usage: `bin/herald.sh "Write a weekly recap for the week of March 17, 2026"`

The prompt determines scope, format, and focus. Herald decides which sessions are relevant based on the prompt.
