export function parsePrUrl(s){
 if(typeof s!=="string"||s.length>400)throw Error("Invalid PR URL");
 const match=/^https:\/\/github\.com\/([a-zA-Z0-9_.-]{1,100})\/([a-zA-Z0-9_.-]{1,100})\/pull\/([1-9]\d*)\/?(?:\?[^#]*)?$/.exec(s);
 if(!match||match[1]==="."||match[2]==="."||match[1]===".."||match[2]===".."||Number(match[3])>2147483647)throw Error("Only public github.com owner/repo/pull/N URLs are supported");
 return {owner:match[1],repo:match[2],number:Number(match[3])};
}

export function safePath(s){return typeof s==="string"&&s.length>0&&s.length<=180&&!s.startsWith("/")&&!s.includes("\\")&&s.split("/").every(p=>p&&p!=="."&&p!==".."&&/^[a-zA-Z0-9_.@+() -]+$/.test(p));}

export function normalizeCriteria(input){
 if(!Array.isArray(input)||input.length<1||input.length>8)throw Error("Provide 1 to 8 confirmed criteria");
 const ids=new Set();
 return input.map((r,i)=>{
  if(!r||typeof r.text!=="string"||r.text.trim().length<4||r.text.length>500)throw Error("Invalid criterion text");
  const id=/^[a-z0-9_-]{1,32}$/i.test(r.id||"")?r.id:"r"+(i+1);
  if(ids.has(id))throw Error("Duplicate criterion ID");ids.add(id);
  const c=r.check||{kind:"none"};
  if(!["none","head_file_exists","head_file_contains_literal","named_ci_check_success"].includes(c.kind))throw Error("Unsupported check");
  const out={id,text:r.text.trim(),check:{kind:c.kind}};
  if(c.kind.startsWith("head_file")){if(!safePath(c.path))throw Error("Unsafe path");out.check.path=c.path;}
  if(c.kind==="head_file_contains_literal"){if(typeof c.literal!=="string"||!c.literal.length||c.literal.length>200)throw Error("Invalid literal");out.check.literal=c.literal;}
  if(c.kind==="named_ci_check_success"){if(typeof c.name!=="string"||!c.name.length||c.name.length>120)throw Error("Invalid CI name");out.check.name=c.name;}
  return out;
 });
}

export function sanitizeProposals(model,snap,criteria){
 const known=new Set([...(snap.files||[]),...(snap.checks||[])].map(e=>e.id));
 const ids=new Set(criteria.map(c=>c.id)),warnings=[],matches=[];
 for(const m of (Array.isArray(model?.matches)?model.matches:[]).slice(0,8)){
  if(!m||!ids.has(m.requirementId))continue;
  const wanted=Array.isArray(m.evidenceIds)?m.evidenceIds.slice(0,10):[];
  const kept=wanted.filter(id=>known.has(id));
  if(kept.length<wanted.length)warnings.push("Invalid evidence ID discarded for "+m.requirementId);
  matches.push({requirementId:m.requirementId,evidenceIds:[...new Set(kept)],reason:typeof m.reason==="string"?m.reason.slice(0,400):"",nextTest:typeof m.nextTest==="string"?m.nextTest.slice(0,300):""});
 }
 return {matches,warnings};
}

export function assess(snap,requirements,model={},mode="disabled"){
 if(!snap||!(/^[a-f0-9]{40}$/i.test(snap.headSha||"")))throw Error("Missing pinned HEAD SHA");
 const criteria=normalizeCriteria(requirements),proposals=sanitizeProposals(model,snap,criteria);
 const all=[...(snap.files||[]),...(snap.checks||[])],byId=new Map(all.map(x=>[x.id,x]));
 const rows=criteria.map(r=>{
  if(snap.captureStable===false)return {...r,verdict:"blocked",reason:"PR HEAD or base moved, or could not be rechecked during evidence collection",evidence:[],nextTest:"Rerun analysis at current PR HEAD",aiReason:""};
  let verdict="insufficient",reason="No requirement-specific proof was available",nextTest="Create and execute a direct acceptance test",refs=[];
  const check=r.check,proposal=proposals.matches.find(x=>x.requirementId===r.id);
  if(check.kind==="head_file_exists"||check.kind==="head_file_contains_literal"){
   const f=snap.headFiles?.[check.path];
   if(!f||f.status==="unavailable"||f.sha!==snap.headSha){verdict="blocked";reason="Pinned HEAD file unavailable or stale";}
   else if(f.status==="absent"){verdict="contradicted";reason="Required file absent at exact HEAD";}
   else if(f.status!=="found"){verdict="blocked";reason="Unrecognized file lookup state";}
   else if(check.kind==="head_file_exists"){verdict="verified";reason="File exists at exact HEAD; no runtime behavior was checked";}
   else if(typeof f.content!=="string"){verdict="blocked";reason="Bounded UTF-8 contents unavailable";}
   else if(f.content.includes(check.literal)){verdict="verified";reason="Exact literal present at HEAD; behavior untested";}
   else{verdict="contradicted";reason="Exact literal absent from fetched HEAD file";}
   if(f?.status==="found"&&snap.owner&&snap.repo)refs=[{id:"headfile:"+check.path,label:check.path,url:"https://github.com/"+snap.owner+"/"+snap.repo+"/blob/"+snap.headSha+"/"+check.path.split("/").map(encodeURIComponent).join("/")}];
   nextTest="Check behavioral acceptance separately if behavior was requested";
  } else if(check.kind==="named_ci_check_success"){
   const hits=(snap.checks||[]).filter(c=>c.name===check.name&&c.headSha===snap.headSha);
   const success=hits.filter(c=>c.status==="completed"&&c.conclusion==="success"),failure=hits.filter(c=>c.status==="completed"&&c.conclusion==="failure");
   refs=hits.filter(c=>typeof c.url==="string"&&c.url.startsWith("https://github.com/")).map(c=>({id:c.id,label:c.name,url:c.url}));
   if(snap.coverage?.checksComplete===false){verdict="blocked";reason="CI check inventory incomplete";}
   else if(success.length===1&&!failure.length){verdict="verified";reason="GitHub reports this named check successful at exact HEAD, not general feature correctness";}
   else if(failure.length&&!success.length){verdict="contradicted";reason="This explicitly named check failed at exact HEAD";}
   else if(hits.length){verdict="blocked";reason="Check still pending, skipped, ambiguous or stale";}
   else{verdict="insufficient";reason="No qualifying check at exact HEAD";}
   nextTest="Run the explicitly named CI check on current HEAD";
  } else {
   refs=(proposal?.evidenceIds||[]).map(id=>byId.get(id)).filter(e=>e&&typeof e.url==="string"&&e.url.startsWith("https://github.com/")).map(e=>({id:e.id,label:e.path||e.name||e.id,url:e.url}));
   if(refs.length){verdict="supported";reason="AI suggests authentic evidence is relevant; this is a hypothesis, not proof";}
   else if(snap.coverage?.complete===false){verdict="blocked";reason="Snapshot coverage incomplete and no relevant proof";}
   nextTest=proposal?.nextTest||nextTest;
  }
  return {...r,verdict,reason,evidence:refs,nextTest,aiReason:proposal?.reason||""};
 });
 return {source:snap.source,repository:snap.owner+"/"+snap.repo,prNumber:snap.prNumber,headSha:snap.headSha,baseSha:snap.baseSha,coverage:snap.coverage,modelMode:mode,modelWarnings:proposals.warnings,results:rows};
}

export function markdown(report){
 const safe=v=>String(v??"").replace(/[\r\n]/g," ").replace(/\|/g,"\\|");
 return ["# DoneMeansDone evidence report","","Source: "+safe(report.source)+" | "+safe(report.repository)+"#"+safe(report.prNumber),"HEAD: "+safe(report.headSha),"AI: "+safe(report.modelMode),"Coverage: "+(report.coverage?.complete?"complete":"partial"),"","Not a certification or safe-to-merge claim.",...report.results.flatMap(r=>["","## "+safe(r.id)+": "+safe(r.text),"**"+r.verdict.toUpperCase()+"** — "+safe(r.reason),"Next: "+safe(r.nextTest),...r.evidence.map(e=>"- "+safe(e.label)+": "+e.url)])].join("\n");
}
