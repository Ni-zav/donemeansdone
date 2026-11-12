# Executed verification evidence

This file records observations from actual GitHub Actions rather than assuming tests passed because their code exists. No local developer machine, deployed public endpoint or paid AI provider has been claimed.

## Verified GitHub Actions results — November 12, 2026

**MVP merge:** PR #1 was squash-merged into main as `1049c429c239e464b3f9ac16d61ed924a8a2813b` after two successful workflows on feature SHA `ec9065b1e4974b1f5ac7b89bab98e6cf23c9a540`:

- [Run 43238652224](https://github.com/Ni-zav/donemeansdone/actions/runs/43238652224) — completed, success.
- [Run 43238634978](https://github.com/Ni-zav/donemeansdone/actions/runs/43238634978) — completed, success.

This version added eight regression tests covering ambiguous CI runs, partial check inventory, fictional evidence links, Markdown escaping, invalid UTF-8 and the original request reaching the model adapter. The Node suite contains **26 tests** in total. Browser execution ran separately. These tests do not establish a live LLM request or public deployment.

### Earlier baseline

**Commit:** c9bba879be94f4303df1d2c14e230a1fbbc24b8d

- [Workflow run 43235790926](https://github.com/Ni-zav/donemeansdone/actions/runs/43235790926) — completed, success.
- [Workflow run 43235783698](https://github.com/Ni-zav/donemeansdone/actions/runs/43235783698) — completed, success.

**Independent test evidence:** a previous successful run [43235330708](https://github.com/Ni-zav/donemeansdone/actions/runs/43235330708) contains two successful jobs:
- Node test job, including source syntax verification and 18 unit/mock/HTTP integration cases (18 passed, 0 failed in the job log).
- Chromium browser job exercising the actual app at 390px and desktop; checking four distinct labels, truthful synthetic mode, Markdown export and malicious PR URL rejection.
- The same run produced GitHub Actions artifact **done-means-done-browser**, containing mobile and desktop screenshots. These are test artifacts, not a publicly deployed page.

The later c9bba success confirms current source as of that commit. Any code changes after it require a new exact-commit CI check.

## Test methodology

Tests are deterministic and use fictional snapshots and mocked GitHub endpoints. They confirm the verdict engine rejects forged citations, stale checks, missing SHA provenance, partial coverage, unsafe URLs and moving PR heads. They do **not** establish general behavioral correctness of third-party projects, live AI quality or real GitHub API import reliability.

## Outstanding external gates

- No real live AI inference was observed or recorded in this work session; adapter code exists but requires server-side provider configuration.
- No public hosted demo URL has been verified.
- No current student eligibility confirmation or Devpost submission confirmation has been obtained.
- No manual audit of screenshot pixels was completed in this report; Chromium did run and archive screenshots.

When those gates are completed, append actual URLs, commits, provider names, timestamps and observed evidence. Never substitute a prediction.
