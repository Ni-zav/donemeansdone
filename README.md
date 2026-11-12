# DoneMeansDone

**Stop trusting “implemented successfully.” Start checking the evidence.**

Read-only, evidence-linked verification of coding acceptance criteria against GitHub pull requests. Built for AI OpenBuild (2026).

**Status:** implementation in progress on `feat/mvp-evidence-engine`. A passing CI check is not proof that arbitrary software behavior works. AI suggestions must never be promoted into deterministic verification.

## Core trust rules

- The AI suggests mappings and follow-up tests, never authoritative verdicts.
- Only a narrowly defined machine-verifiable criterion at the analyzed PR HEAD can be `verified`.
- Insufficient or incomplete evidence is never silently converted into a success claim.
- No repository write actions; public GitHub repositories and synthetic fixtures only.
- Hackathon eligibility, demo deployment and real model execution must be verified separately.

See the feature branch and its draft pull request for working implementation and tests.
