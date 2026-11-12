export function demoFixture(){
 const headSha="a".repeat(40),baseSha="b".repeat(40);
 return {
 snapshot:{source:"synthetic_fixture",owner:"example",repo:"fictional-app",prNumber:7,headSha,baseSha,
 files:[{id:"file:0",path:"src/navigation.ts",url:"https://github.com/example/fictional-app/blob/"+headSha+"/src/navigation.ts",patch:"+ export function mobileMenu() { return true; }"}],
 checks:[{id:"ci:0",name:"unit",headSha,status:"completed",conclusion:"failure",url:"https://github.com/example/fictional-app/actions/runs/123"}],
 headFiles:{"docs/guide.md":{status:"found",sha:headSha,content:"# Getting started"},"docs/missing.md":{status:"absent",sha:headSha}},
 coverage:{complete:true,checksComplete:true,filesFetched:1,filesTotal:1}},
 requirements:[
 {id:"r1",text:"Include docs/guide.md at HEAD",check:{kind:"head_file_exists",path:"docs/guide.md"}},
 {id:"r2",text:"Mobile navigation opens correctly",check:{kind:"none"}},
 {id:"r3",text:"Named CI check unit passes",check:{kind:"named_ci_check_success",name:"unit"}},
 {id:"r4",text:"Keyboard focus remains accessible",check:{kind:"none"}}],
 recordedProposal:{matches:[{requirementId:"r2",evidenceIds:["file:0"],reason:"A navigation function changed; behavior has not been tested.",nextTest:"Test the menu in a mobile browser with keyboard and pointer input."}]}
 };
}
