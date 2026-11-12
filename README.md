# DoneMeansDone

> **Stop trusting “implemented successfully.” Start checking the evidence.**

DoneMeansDone is a read-only pull-request acceptance-criteria analyzer for AI-assisted software development. You tell it what you asked Codex or another coding agent to deliver, confirm up to eight criteria, and provide a public GitHub PR. AI proposes **possible relationships** to changed files; a separate deterministic checker decides what can actually be verified.

**Hackathon:** [AI OpenBuild](https://ai-openbuild.devpost.com/) · **Status:** functional MVP under development, currently in [draft PR #1](https://github.com/Ni-zav/donemeansdone/pull/1). Eligibility and final submission are **not confirmed**.

## Run locally

Requires Node.js **22+**. There are **no runtime npm dependencies**.

```bash
git clone https://github.com/Ni-zav/donemeansdone.git
cd donemeansdone
git checkout feat/mvp-evidence-engine
npm run check
npm test
npm start
```

Open **http://localhost:3000**. Click **Try synthetic demo**, then **Analyze evidence**. The demo needs no account, API key or internet connection.

To enable a real AI provider, set server environment variables from [`.env.example`](.env.example): `AI_API_KEY`, optional `AI_BASE_URL`, and `AI_MODEL`. Environment variables are read by Node; no keys are accepted through the browser. Model calls are only attempted when AI is enabled, and **public PR snippets will be sent to that model provider**.

The browser smoke script uses Playwright separately: `npm install --no-save --package-lock=false playwright@1.56.1`, `npx playwright install chromium`, then `npm run test:browser`. GitHub Actions runs these separately and retains screenshots.

## What works

- A browser editor for original request, source choice and 1–8 *confirmed* atomic acceptance criteria.
- Exact HEAD `head_file_exists` and `head_file_contains_literal` acceptance checks.
- Exact HEAD `named_ci_check_success` for a specifically named check, not overall code quality.
- Semantically relevant GitHub file evidence proposed by a bounded AI API or a **labeled recorded synthetic** example.
- Five conservative decisions: **verified**, **supported**, **contradicted**, **insufficient**, **blocked**.
- Immutable evidence links, commit SHA, source identity, incomplete coverage warnings, AI mode label.
- Markdown and JSON evidence-report exports.
- Secure public GitHub URL parsing, fixed-host GET API calls, 50-file/30k-patch-char and 100k-file-content budgets, request/time limits.
- No GitHub write permissions, repository code execution, private repository access or persistent user database.

## Example criteria

| User-confirmed criterion | Machine check | What green means |
| --- | --- | --- |
| Create `docs/guide.md` | `head_file_exists` + path | The file existed at pinned commit |
| Include exact heading | `head_file_contains_literal` + path + literal | These exact bytes were present in decoded HEAD file |
| Make `unit` CI pass | `named_ci_check_success` + name | GitHub reported completed success for *that* check at HEAD |
| Make mobile menu work | none | **Never automatically verified.** AI may only show supporting code evidence and suggest browser tests |

**Critical:** “Verified” never means the whole software feature works. A passing generic CI run and a plausible diff do not prove user-visible behavior. AI never controls the final verdict.

## API

- `GET /health`: service health.
- `GET /api/demo`: fictional criteria/sample request, clearly synthetic.
- `POST /api/analyze`: request:
  ```json
  {
    "source":{"kind":"fixture"},
    "originalRequest":"Add documentation and make the unit check pass.",
    "requirements":[
      {"id":"r1","text":"Add setup instructions","check":{"kind":"head_file_exists","path":"docs/guide.md"}}
    ],
    "enableAi":true
  }
  ```
  For a real public PR use `{"kind":"github","pullRequestUrl":"https://github.com/owner/repo/pull/123"}`. Response includes `report`, `markdown`, and any AI warning.

## Safety, limitations and data handling

Only analyze authorized **public** repositories. The service does not persist submitted source code; its process memory holds data during a request. An optional model provider receives bounded public code snippets. Do **not** paste private client code, passwords or tokens into the form. A shared-host deployment needs additional production abuse protection and independent review.

The fixture uses a fictional repository and fake links; it is **not a live GitHub verification**. Missing patches, files over budget, GitHub rate limits, or changes during collection cannot silently produce a green result. CI evidence applies to the pinned commit only. No external app execution or behavioral acceptance testing occurs.

## Development & submission

- [Trust model](docs/TRUST_MODEL.md)
- [MVP scope](docs/MVP_SCOPE.md)
- [Blueprint](docs/MVP_BLUEPRINT.md)
- [Codex continuation](docs/CODEX_IMPLEMENTATION_PROMPT.md)
- [Devpost draft and readiness checklist](docs/DEVPOST_SUBMISSION.md)
- [Contributing conventions](AGENTS.md)

**Originality/credits:** DoneMeansDone is new work for this entry. Uses Node.js, GitHub REST API, optional third-party chat-completions-compatible model, and Playwright only for testing. Product planning and implementation assistance used OpenAI ChatGPT. No private company data or repositories are part of the demo.
