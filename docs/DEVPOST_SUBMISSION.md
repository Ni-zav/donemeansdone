# Devpost submission — draft, NOT submitted

Project name: **DoneMeansDone**  
Tagline: *Stop trusting “implemented successfully.” Start checking the evidence.*

## Copy-ready project description (draft)

AI coding assistants can produce confident completion summaries even when user requirements remain untested. DoneMeansDone makes their claims inspectable. Paste the original request, confirm atomic acceptance criteria and supply a public GitHub pull request. The app fetches source evidence pinned to a commit, asks an AI model to propose relevant code-to-requirement mappings, and applies independent, deliberately narrow deterministic acceptance checks. Its report explains the difference between a passing check, plausible source support, missing evidence and a direct contradiction — with immutable links and suggested next tests.

Our distinctive principle is *AI interpretation is not verification*. A modified UI file may support a hypothesis that a mobile menu was implemented, but it cannot prove the menu works. A passing unit test only proves that GitHub reported that named check as passed for the examined SHA. Unknown remains unknown.

## Demo script (90–150 seconds)

1. **Problem**: an AI agent says "Done," but reviewers still don't know whether criteria passed.
2. **Input**: click the fictional sample; inspect four user-confirmed criteria.
3. **Evidence**: run analysis; show narrow file-existence verified, mobile menu only supported, named unit CI contradicted, keyboard behavior insufficient.
4. **Safety**: show the synthetic/recorded AI label, exact SHA and provenance. Mention fabricated evidence IDs are rejected and moving-head snapshots get blocked.
5. **Export**: download Markdown/JSON report and describe next verification steps.
6. **Real AI**: perform a genuinely live model call only if actually configured; identify provider and model, clearly distinguish from synthetic fallback.

## Tech stack and originality disclosure

- Node.js 22 built-in HTTP server and browser HTML/CSS/JavaScript; no runtime npm packages.
- GitHub REST API, read-only, bounded source and check retrieval.
- Optional chat-completions-compatible LLM server adapter, with configurable provider URL and model ID; meaningful model output is candidate evidence mapping, not a verdict.
- Node built-in tests and Playwright Chromium browser smoke in GitHub Actions.
- Fictional demo sources and cases are synthetic original test data.
- Planning, architecture and code drafting used OpenAI ChatGPT assistance; exact human contributors and final model use must be disclosed truthfully.

## What has NOT happened yet

- [ ] Participant's current student eligibility independently confirmed by AI OpenBuild organizer.
- [ ] Deployed no-login public demo URL independently checked.
- [ ] Real external AI provider inference run captured (if any, log truthful provider/model and sanitized input/output).
- [ ] Final browser test run/screenshots reviewed on exact release HEAD.
- [ ] 90–150 second project video recorded and hosted.
- [ ] External user/usability test and privacy review.
- [ ] Complete Devpost form and submit before verified deadline.

## Legal and privacy cautions

Use only fictional fixture data or authorized public GitHub repos. Do not expose company code, private source, production records, credentials or nonpublic issues. The app does not execute target repository code and does not offer correctness certification. AI provider receives bounded public file patches if enabled. No account or persistent database in MVP.

## Final handoff checklist

- Run npm run check and npm test with recorded pass/fail.
- Run Chromium Playwright browser test and check mobile screenshots.
- Check latest PR diff, CI statuses and current HEAD SHA.
- Confirm model mode labels are truthful and all evidence IDs and URLs resolve.
- Confirm organizer eligibility and verify event submission deadline/timezone.
- Capture video, screenshots and a genuine AI inference or labeled recorded run.
- Add exact public demo URL and repo PR link.
- Attribute assistants, models, dependencies and other contributors.
- Submit on Devpost; record actual submission confirmation, never infer it.
