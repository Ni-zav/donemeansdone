# Source and verdict trust model

- \`verified\`: explicit machine-checkable acceptance criterion passed at the pinned HEAD SHA; no runtime correctness implication.
- \`supported\`: AI suggests authentic GitHub evidence is relevant; still a semantic hypothesis.
- \`contradicted\`: directly corresponding, accepted deterministic check failed; unrelated failures cannot contradict behavior.
- \`insufficient\`: lacking adequate evidence or tests.
- \`blocked\`: missing, partial, inaccessible or stale data prevents a justified result.

Never let AI choose the authoritative verdict. AI may only suggest links and next tests. All model evidence IDs must exist in the fetched source snapshot. Generic CI success does not prove arbitrary product requirements.

Fixture sources and AI mappings are synthetic/recorded. No user data is stored persistently. Only public GitHub content authorized for sharing is within scope. External providers can receive bounded public changed-file snippets when AI is enabled. No GitHub writes or code execution.
