import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createApp } from "../src/server.mjs";
import { chromium } from "playwright";

const server=createApp();
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port;
let browser;
try {
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true});
  await page.goto(base,{waitUntil:"domcontentloaded"});
  await page.getByRole("button",{name:"Try synthetic demo"}).click();
  await page.getByRole("button",{name:"Analyze evidence"}).click();
  await page.getByRole("heading",{name:"Evidence report"}).waitFor();
  const verdicts=await page.locator(".report-card .status").allTextContents();
  assert.deepEqual(verdicts,["verified","supported","contradicted","insufficient"]);
  assert.equal(await page.locator("#summary").textContent().then(t=>t.includes("synthetic_fixture")),true);
  assert.equal(await page.locator("#warnings").textContent().then(t=>t.includes("recorded and synthetic")),true);
  const scroll=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(scroll.width<=scroll.viewport+1,"mobile page overflows horizontally: "+JSON.stringify(scroll));
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:"Export Markdown"}).click();
  const file=await downloadPromise;
  assert.equal(file.suggestedFilename(),"donemeansdone-report.md");
  await mkdir("test-results",{recursive:true});
  await page.screenshot({path:"test-results/demo-mobile.png",fullPage:true});
  await page.setViewportSize({width:1280,height:900});
  await page.screenshot({path:"test-results/demo-desktop.png",fullPage:true});
  await page.getByRole("button",{name:"Analyze a public PR"}).click();
  assert.equal(await page.locator("#pr-url").isVisible(),true);
  await page.locator("#pr-url").fill("https://not-github.example/a/b/pull/1");
  await page.getByRole("button",{name:"Analyze evidence"}).click();
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").textContent(),/Only public github.com/);
  console.log("Browser smoke: 390px and desktop, four verdicts, truthful fixture label, export and unsafe URL rejection PASS.");
} finally {
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
