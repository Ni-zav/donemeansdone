# DoneMeansDone — canonical MVP blueprint

**Created:** 2026-11-12 for AI OpenBuild. **Status:** working MVP in draft PR #1, not a submitted or deployed hackathon entry.

## Core product promise

An AI-assisted, read-only evidence-linked acceptance analysis for public GitHub pull requests. Users paste the original coding instruction, confirm 1–8 atomic acceptance criteria, and inspect what can *actually* be established at one pinned Git commit. AI proposes code-to-criterion relationships and next tests. A deterministic checker alone assigns verdicts.

**Why this is different from a normal AI code reviewer:** AI suggestions can never certify a requirement. Every claim is scoped to a specific check and linked to immutable evidence. Unknown evidence is visibly unknown.

## Target workflow

1. Open a no-login synthetic example or paste a public GitHub PR URL.
2. Paste original request for reviewer context. Edit and explicitly confirm 1–8 criteria.
3. Select an explicit machine check for criteria narrow enough for deterministic verification, or leave the check as none.
4. Analyze: a fixed-host GitHub reader resolves HEAD/base SHAs, changed files, exact-SHA HEAD file contents and CI check runs. It records partial coverage.
5. Optional model suggests candidate evidence IDs and missing tests from bounded snippets. Missing model key means recorded **synthetic** fixture mapping or deterministic-only mode, labeled.
6. The verifier independently derives one of five verdicts, rejecting unrecognized AI citations.
7. Inspect exact-commit links and export Markdown/JSON report. Refresh for a new HEAD.

## Evidence tiers and verdict contract

| Verdict | Definition | What never counts |
| --- | --- | --- |
| verified | A *confirmed*, directly corresponding acceptance check passed using pinned HEAD evidence | AI confidence; diff-only; generic passing CI |
| supported | AI proposes relationship to valid changed-file/check evidence, but behavior untested | A claim that a feature works |
| contradicted | A directly corresponding deterministic acceptance check failed | An unrelated failed check, speculation |
| insufficient | No qualifying evidence or direct test | Absence inferred from limited search |
| blocked | Required source could not be trusted, was incomplete, stale or inaccessible | A negative implementation conclusion |

**Separation of sources:** github_api_at_head_sha, synthetic_fixture, model proposal. The model's response is never source-of-truth; recorded fixture mappings are never described as live model inference.

**Explicit supported checks:**
- head_file_exists(path): fetched file exists at exact SHA; failure at a resolved commit contradicts file-existence claim.
- head_file_contains_literal(path,literal): bounded UTF-8 HEAD file contains exact user-approved literal. Proves only textual presence.
- named_ci_check_success(name): named check is completed, conclusion success and head_sha matches. Failure of the exact named criterion contradicts it. Generic CI cannot certify unrelated behavior.
- none: only AI-supported semantic hypothesis or unknown/blocked status. There is no free-form automatic behavioral proof.

## Architecture now implemented

~~~text
Browser (HTML/CSS/JS)
    | confirmed requirements + source selector
    v
Node HTTP API (src/server.mjs; no external runtime packages)
    |-- fixed Github REST reader (src/github.mjs)
    |-- optional chat-completions adapter (src/ai.mjs)
    +-- deterministic engine (src/core.mjs)
               |
               v
  report cards + immutable refs + Markdown/JSON export
~~~

Source layout:
- src/core.mjs: URL and acceptance input validation, sanitized model IDs, verdict evaluation, export.
- src/github.mjs: read-only API requests, HEAD file and CI lookups, budgets, HEAD drift detection.
- src/ai.mjs: bounded provider request, untrusted evidence instruction boundary, error fallback.
- src/fixtures.mjs: original fictional sample with mixed verdicts.
- src/server.mjs: fixed routes /health, /api/demo, /api/analyze.
- public/index.html: actual responsive browser app, no accounts.
- test/core.test.mjs: deterministic tests and mocked HTTP/GitHub integration.
- test/browser.e2e.mjs: Chromium 390px and desktop flows, report export, false URL rejection.
- .github/workflows/ci.yml: separate Node and Playwright browser gates.

This stack deliberately substitutes zero-dependency Node.js 22 for the previously suggested Next.js/Tailwind/Zod architecture to maximize a reproducible, testable MVP under the deadline. A Next rewrite is not part of MVP scope.

## Security, privacy and bounded execution

- Parse only https://github.com/owner/repo/pull/N links; reject other hosts/protocols, credentials, fragments, ports, suspicious path segments and untrusted redirects.
- Server contacts only fixed api.github.com endpoints for GitHub data. GET only; no Github mutations.
- Cap criteria (8), user request (4,000 chars), changed files (50), selected patch sum (30,000 chars), per-file selected patch (3,000), HEAD file contents (100,000 bytes), request body (65KB), and API/model duration.
- If PR changes while fetching, block instead of certifying a mixed snapshot.
- Keep API keys in server environment only. Enabling AI sends bounded *public* snippets to configured provider. No application database and no persistent user data by design.
- Treat all fetched code, filenames, AI output and PR text as untrusted. Render through textContent; never execute imported code or trust AI-supplied URLs.
- API rate-limits repeated analysis per IP (in-memory); production deployment needs additional abuse/security review.
- No private code or company repositories in public Devpost material.

## Input and output contracts

Request: source {kind:fixture|github, pullRequestUrl?}, originalRequest string, requirements array (id,text,check), enableAi boolean. Checks: kind none | head_file_exists | head_file_contains_literal | named_ci_check_success, plus approved path/literal/name.

Server result: report {source,repository,prNumber,headSha,baseSha,coverage,modelMode,modelWarnings,results[]} and Markdown export plus warning. Each result has id,text,check,verdict,reason,evidence[],nextTest,aiReason.

**Important:** a passing check is always at **the analyzed SHA**, not a continuously valid statement about the moving branch.

## Deterministic scenario matrix

T01 file at SHA -> verified existence. T02 confirmed absent file -> contradicted. T03 literal present -> verified text only. T04 plausible UI diff no behavior test -> supported. T05 no evidence -> insufficient. T06 completed exact-SHA named CI success -> verified CI only. T07 exact CI failure -> contradicted CI only. T08 stale/pending -> no green. T09 fake AI evidence ID -> discard. T10 absent/malformed model output -> deterministic fallback. T11 prompt injection in model data -> no verdict override. T12 missing patches -> partial and unknown area blocked. T13 403/429 -> structured error. T14 unsafe URL -> reject before fetch. T15 moving HEAD -> block or retain explicit historic SHA. T16 generic CI never proves unrelated behavior. T17 no-key fixture labeled synthetic. T18 file and diff budgets observable. T19 browser at 390px, desktop, keyboard, export. T20 escape untrusted text and safe links.

Current automated tests cover a useful subset. Any gaps are not claimed complete because a test matrix exists; actual GitHub Actions evidence is decisive.

## Submission quality gates

- [ ] Verify participant eligibility with organizer and time zone/deadline, not merely registration.
- [x] Original functional app committed to public repo and demo fixtures are usable without keys.
- [x] Real model adapter implemented in source (NOT evidence of an actual live model call).
- [ ] Confirm latest GitHub Actions CI including Chromium and inspect failure logs if any.
- [ ] Capture genuine, authorized live AI inference with provider/model named, or label recorded evidence.
- [ ] Verify public deployment, mobile accessibility, no secrets, and copy/paste flow.
- [ ] Produce actual 90–150-second walkthrough, screenshots and disclosure of limitations.
- [ ] Submit Devpost with working URL before event deadline; do not mark submitted prematurely.

No auto-merge, GitHub OAuth, private-repo access, PR comments, auto-fix agents, repository execution, DB, billing, vector store or certification feature in MVP.
