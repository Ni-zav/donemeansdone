# MVP scope and AI OpenBuild delivery

**Product:** DoneMeansDone — evidence-linked public GitHub PR acceptance review. **Current implementation choice:** zero-dependency Node.js 22 HTTP service + client-rendered accessible HTML, to get a verifiable working MVP without deployment/dependency setup. The previous Next.js/Tailwind design was advisory, not an immutable requirement.

## Implemented acceptance surface (subject to CI verification)
1. Read-only public GitHub PR URL validation and file/check metadata.
2. Explicit, user-confirmed criteria: \`head_file_exists\`, \`head_file_contains_literal\`, \`named_ci_check_success\`, and unverified semantic request (\`none\`).
3. Conservative verifier with pinned SHA and five dispositions: verified, supported, contradicted, insufficient, blocked.
4. Bounded AI chat-completions-compatible model mapping, or clearly marked offline recorded fixture.
5. Browser form, per-criterion evidence links, model mode/provenance, Markdown and JSON export.
6. Synthetic samples and deterministic tests without tokens.

## Strict non-goals
No arbitrary code execution, no semantic correctness certification, no login/OAuth, no private source, no comments or repo mutations, no auto-fix, no stateful user storage, no paid infrastructure requirement. UI/browser behavior remains unverified until independently tested.

## Demo outline
Show fictional fixture with file-existence verified, mobile navigation only supported, named CI contradicted, accessibility insufficient. Show malformed citation rejection test. Then demonstrate a real public PR + live AI only when model credentials are configured, and explicitly label live vs fixture behavior.

## Hackathon submission checklist
- [ ] Confirm current student eligibility directly with organizer; registration is not proof
- [ ] Verify actual deadline in event timezone before final submission
- [ ] Run Node syntax/tests and mobile browser smoke
- [ ] Record a real model call with provider/model identification or label captured prior run truthfully
- [ ] Deploy a working no-login fixture demo
- [ ] Record video/screenshots and describe failure modes
- [ ] Credit dependencies (Node.js, GitHub API) and AI coding assistance
- [ ] Disclose limitations, privacy, date/origin of work, no private client code
- [ ] Submit Devpost entry with working link and before closing time

Event: https://ai-openbuild.devpost.com/ ; rules: https://ai-openbuild.devpost.com/rules
