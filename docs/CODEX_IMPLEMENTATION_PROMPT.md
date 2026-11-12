# Self-sufficient Codex continuation prompt — DoneMeansDone

You are the engineering lead, critical reviewer, accessibility tester and release preparer for the existing repository **Ni-zav/donemeansdone**.

**Start by inspecting the actual code.** Read AGENTS.md, README.md, docs/MVP_BLUEPRINT.md, docs/TRUST_MODEL.md, docs/MVP_SCOPE.md and the latest PR branch. The active implementation branch is feat/mvp-evidence-engine, draft PR #1. Continue that branch/PR; do not create competing branches or reset work. Preserve unrelated changes.

## Mission

Finish a real, demonstrable AI OpenBuild MVP that lets users paste their original request, confirm acceptance criteria, analyze a public GitHub PR and get a conservative evidence-linked report. AI suggests which changes might satisfy requirements; deterministic direct checks alone may mark verified or contradicted.

## Self-sufficient execution rules

1. Audit existing files and Git state, list remaining scope, then implement complete fixes rather than stop after plans.
2. Make reasonable engineering decisions autonomously; do not request routine approval. Stop only for security-sensitive, destructive or external actions that genuinely need human decisions.
3. Critically self-review every implemented slice; run npm run check, npm test and feasible browser tests, fix failures, rerun, and record actual commands/results.
4. Never invent successful tests, a deployed URL, an authenticated live model call, eligibility, or organizer approval.
5. Push to existing feature branch and update draft PR #1 with concrete evidence; avoid force-push and avoid merging until release gates pass.
6. Keep AGENTS.md compact and no scope creep.

## Immediate tasks, priority order

P0. Verify actual GitHub Actions state and Chromium test. Inspect and fix any failures (never mark passing based on a previous commit).
P0. Audit the trust engine for false-positive verified/contradicted outcomes. Require exact-SHA HEAD source, stable PR capture, unambiguous named CI and model citation validation. Repro race, 404, 429, body budget and hostile URL test cases.
P0. Test browser workflow at 390px and desktop. Verify no horizontal overflow, keyboard focus, fixture mode label, safe rendering, report export and errors; fix actual browser failures.
P0. Document practical commands and accurate screenshots/results in docs/DEVPOST_SUBMISSION.md. Treat AI model key absent as a blocker to authentic live inference, not a failed deterministic test.
P1. Improve requirement input based on observed UX, accessible errors, test coverage, and display of coverage note; do not introduce generic scoring.
P1. If an authorized model key exists in environment, perform a *real* chat-completions inference against a permitted public or fictional source, record provider/model and scrubbed evidence. Never paste secrets or private company code.
P1. Improve data schema/version and request validation without unnecessary framework rewrites.
P2. Only after MVP is complete consider a controlled criterion-suggestion flow with explicit user confirmation. No autonomous code execution or speculative semantic certification.

## Trust invariants

- Source provenance must distinguish real GitHub and fictional/recorded data.
- No model-generated text can independently assign verified or contradicted.
- A diff and a generic successful CI status never prove arbitrary runtime behavior.
- Direct checks: HEAD file existence, exact literal in bounded HEAD file, exact-name completed successful CI at HEAD.
- Failures only contradict the same direct criterion; unknown/missing data is insufficient or blocked.
- Pin everything to immutable HEAD SHA. Detect moving PR head/base and block stale positive conclusions.
- Validate AI-proposed IDs against fetched evidence; never use AI-provided URLs as evidence.
- No SSRF, GitHub writes, private client data, tokens in UI, persistent source storage, untrusted code execution or fake results.

## Scope exclusions

No OAuth, billing, users, GitHub PR comments/merges, agentic repairs, arbitrary command execution of imported repos, vector database, CI certification of unrelated features, all-repo index, multi-model product UI or large framework migration. This is a focused hackathon MVP.

## Evidence requirements

Provide a concise completion report with branch+commit, exact changed files, GitHub Actions run URLs/conclusions, local/browser command results, screenshots only when actually captured, sample-mode and live-mode status, remaining limitations and Devpost manual steps. Do not assert completion, production readiness or hackathon submission unless independently verified.
