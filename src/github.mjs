import { Buffer } from "node:buffer";
import { safePath } from "./core.mjs";

export class GithubFetchError extends Error {
  constructor(message, code = 502) { super(message); this.name = "GithubFetchError"; this.statusCode = code; }
}

export async function fetchPublicPullRequest(parsed, requirements, fetcher = fetch) {
  const { owner, repo, number } = parsed;
  const base = "https://api.github.com/repos/" + owner + "/" + repo;
  const headers = { "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "DoneMeansDone-MVP" };
  const get = async (path, allow404 = false) => {
    const response = await fetcher(base + path, { method: "GET", headers, redirect: "error", signal: AbortSignal.timeout(10000) });
    if (response.status === 404 && allow404) return { missing: true };
    if (response.status === 403 || response.status === 429) {
      const limited = response.headers?.get?.("x-ratelimit-remaining") === "0" || response.status === 429;
      throw new GithubFetchError(limited ? "GitHub API rate limit reached; retry later." : "GitHub did not allow this read-only request.", 429);
    }
    if (response.status === 404) throw new GithubFetchError("Pull request or required repository endpoint is unavailable.", 404);
    if (!response.ok) throw new GithubFetchError("GitHub request failed with HTTP " + response.status);
    return { data: await response.json() };
  };
  const pr = (await get("/pulls/" + number)).data;
  const headSha = pr?.head?.sha, baseSha = pr?.base?.sha;
  if (!/^[a-f0-9]{40}$/i.test(headSha || "") || !/^[a-f0-9]{40}$/i.test(baseSha || "")) throw new GithubFetchError("GitHub returned invalid commit IDs.");
  const rawFiles = (await get("/pulls/" + number + "/files?per_page=50&page=1")).data;
  if (!Array.isArray(rawFiles)) throw new GithubFetchError("Invalid GitHub changed-file response.");
  let patchChars = 0, partialPatches = false;
  const files = rawFiles.slice(0, 50).map((f, i) => {
    const path = typeof f.filename === "string" ? f.filename : "";
    const patch = typeof f.patch === "string" ? f.patch : "";
    const available = Math.max(0, 30000 - patchChars);
    const selected = patch.slice(0, Math.min(3000, available));
    patchChars += selected.length;
    if (!patch || selected.length < patch.length) partialPatches = true;
    return { id: "file:" + i, path, status: f.status || "unknown", patch: selected,
      url: "https://github.com/" + owner + "/" + repo + "/blob/" + headSha + "/" + path.split("/").map(encodeURIComponent).join("/") };
  });
  const headFiles = {};
  const requested = [...new Set(requirements.filter(r => r.check.kind.startsWith("head_file")).map(r => r.check.path))];
  await Promise.all(requested.map(async path => {
    if (!safePath(path)) { headFiles[path] = { status: "unavailable" }; return; }
    try {
      const encoded = path.split("/").map(encodeURIComponent).join("/");
      const response = await get("/contents/" + encoded + "?ref=" + headSha, true);
      if (response.missing) { headFiles[path] = { status: "absent", sha: headSha }; return; }
      const obj = response.data;
      if (obj?.type !== "file" || obj?.encoding !== "base64" || typeof obj.content !== "string" || obj.size > 100000) {
        headFiles[path] = { status: "unavailable" }; return;
      }
      const bytes = Buffer.from(obj.content.replace(/\s/g, ""), "base64");
      if (bytes.length > 100000) { headFiles[path] = { status: "unavailable" }; return; }
      headFiles[path] = { status: "found", sha: headSha, content: bytes.toString("utf8") };
    } catch {
      headFiles[path] = { status: "unavailable" };
    }
  }));
  let checks = [], checksComplete = true, checkWarning = null;
  try {
    const data = (await get("/commits/" + headSha + "/check-runs?per_page=50&page=1")).data;
    const rawChecks = data?.check_runs;
    if (!Array.isArray(rawChecks)) throw Error("Unrecognized check list");
    checksComplete = Number(data.total_count || 0) <= rawChecks.length;
    checks = rawChecks.map((c, i) => ({
      id: "ci:" + i, name: c.name, headSha: c.head_sha || null, status: c.status,
      conclusion: c.conclusion, url: typeof c.html_url === "string" && c.html_url.startsWith("https://github.com/") ? c.html_url : ""
    }));
  } catch (err) {
    checksComplete = false;
    checkWarning = err instanceof Error ? err.message : "Checks unavailable";
  }
  const total = Number.isInteger(pr.changed_files) ? pr.changed_files : files.length;
  const complete = total <= files.length && !partialPatches;
  return { source: "github_api_at_head_sha", owner, repo, prNumber: number, headSha, baseSha, files, checks, headFiles,
    coverage: { complete, checksComplete, filesFetched: files.length, filesTotal: total, patchesPartial: partialPatches, checkWarning,
      note: complete ? "Changed-file snapshot complete within budget" : "Only first 50 files and bounded patches analyzed" } };
}
