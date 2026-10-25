# Actual native FX execution audit

2026-10-02T04:43:57.035Z · libfx 0.0.12 · native backend · openai/gpt-4.1-nano

These are real bounded model executions through the actual source adapters. No simulated outputs. The existing credential was read into memory; no credential or database data was written. Each run used only the fixed fictional read_brief tool. This verifies standalone generation, not HTTP access gating.

## program:day-zero:first-threads

Task: meeting-notes · Model calls: 2 · Stop reason: failure

Events: 

Failure: HostStreamFailed

Actual output:

```text

```
