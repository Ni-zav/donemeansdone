import http from "node:http";
import { readFile } from "node:fs/promises";
import { parsePrUrl, normalizeCriteria, assess, markdown } from "./core.mjs";
import { demoFixture } from "./fixtures.mjs";
import { fetchPublicPullRequest, GithubFetchError } from "./github.mjs";
import { aiProposal } from "./ai.mjs";

const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const perIp = new Map();
function send(res, status, data, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" });
  res.end(type.startsWith("application/json") ? JSON.stringify(data) : data);
}
async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk.toString("utf8");
    if (body.length > 65000) throw Object.assign(Error("Request exceeds 65KB"), { statusCode: 413 });
  }
  try { return JSON.parse(body); } catch { throw Object.assign(Error("Invalid JSON"), { statusCode: 400 }); }
}
export function createApp() {
  return http.createServer(async (req, res) => {
    const path = (req.url || "/").split("?")[0];
    try {
      if (req.method === "GET" && (path === "/" || path === "/index.html")) return send(res, 200, html, "text/html; charset=utf-8");
      if (req.method === "GET" && path === "/health") return send(res, 200, { ok: true, service: "DoneMeansDone" });
      if (req.method === "GET" && path === "/api/demo") {
        const { requirements } = demoFixture();
        return send(res, 200, { source: { kind: "fixture" }, requirements, originalRequest: "Create a guide, implement mobile menu, make unit CI pass, keep keyboard accessibility." });
      }
      if (req.method === "POST" && path === "/api/analyze") {
        const ip = req.socket.remoteAddress || "unknown", now = Date.now();
        const entry = perIp.get(ip);
        if (entry && now - entry.since < 60000 && entry.count >= 15) return send(res, 429, { error: "Request budget reached; retry shortly." });
        if (!entry || now - entry.since >= 60000) perIp.set(ip, { since: now, count: 1 });
        else entry.count++;
        const input = await readJson(req);
        const criteria = normalizeCriteria(input.requirements);
        if (typeof input.originalRequest !== "string" || input.originalRequest.length > 4000) throw Object.assign(Error("Provide an original request below 4000 characters"), { statusCode: 400 });
        if (!input.source || !["fixture", "github"].includes(input.source.kind)) throw Object.assign(Error("Select a valid source"), { statusCode: 400 });
        const fixture = input.source.kind === "fixture" ? demoFixture() : null;
        const snapshot = fixture ? fixture.snapshot : await fetchPublicPullRequest(parsePrUrl(input.source.pullRequestUrl), criteria);
        let proposal = { matches: [] }, modelMode = "disabled", warning = null;
        if (input.enableAi === true && fixture && !process.env.AI_API_KEY) {
          proposal = fixture.recordedProposal;
          modelMode = "recorded_synthetic_fixture";
          warning = "Demonstration mapping is recorded and synthetic, not live AI.";
        } else if (input.enableAi === true) {
          const output = await aiProposal(snapshot, criteria);
          proposal = output.proposal;
          modelMode = output.mode;
          warning = output.warning;
        }
        const report = assess(snapshot, criteria, proposal, modelMode);
        return send(res, 200, { report, markdown: markdown(report), warning });
      }
      return send(res, 404, { error: "Route not found" });
    } catch (err) {
      const code = err instanceof GithubFetchError ? err.statusCode : Number.isInteger(err?.statusCode) ? err.statusCode : /Invalid|Provide|Only|Unsafe|Duplicate|Unsupported|Missing pinned/.test(err?.message || "") ? 400 : 502;
      return send(res, code, { error: err instanceof Error ? err.message.slice(0, 240) : "Unknown error" });
    }
  });
}
if (process.argv[1] && new URL("file://" + process.argv[1]).pathname === new URL(import.meta.url).pathname) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, "0.0.0.0", () => console.log("DoneMeansDone listening on http://localhost:" + port));
}
