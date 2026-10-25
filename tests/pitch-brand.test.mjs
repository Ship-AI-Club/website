import test from "node:test";
import assert from "node:assert/strict";
import { normalizePitchBrand, readPitchBrand, pitchBrandStyle, brandContrast } from "../lib/pitch-brand.js";
import { extractBrandStyles, readWebsiteBrand, modelBrandChoice } from "../lib/pitch-website-brand.js";
import { extractPitchWebsite } from "../lib/pitch-website.js";
import { readSubmission } from "../lib/submissions.js";
import { DEMO_PITCH, DEMO_PITCH_TEAM, buildPitch } from "../lib/hackathon-pitch.js";

const css=':root{--cream:#F7F2E6;--ink:#17261C;--green:#255C3B;--font-display:"Bricolage Grotesque",sans-serif;--font-body:"Atkinson Hyperlegible Next",sans-serif} @font-face{font-family:"Bricolage Grotesque";src:url(/fonts/heading.woff2)} @font-face{font-family:"Atkinson Hyperlegible Next";src:url(/fonts/body.woff2)}';

test("brand styles retain named palette roles and the website's heading/body fonts",()=>{
  const result=extractBrandStyles([{css,url:"https://brand.example/styles.css"}],"https://brand.example/");
  assert.ok(result.palette.some(item=>item.color==="#255C3B"&&item.label==="--green"));
  assert.equal(result.fonts.find(font=>font.role==="heading").url,"https://brand.example/fonts/heading.woff2");
  assert.equal(result.fonts.find(font=>font.role==="body").family,"Atkinson Hyperlegible Next");
});

test("website asset candidates prefer own logo and imagery over sponsors",()=>{
  const page=extractPitchWebsite('<html><head><meta property="og:image" content="/brand-card.png"></head><body><img src="/logo.png" alt="Our logo"><img src="/sponsor-other.png" alt="Sponsor"><img src="/hero.jpg" width="1200" alt="A plant-filled home"></body></html>',"https://brand.example/");
  assert.equal(page.logoCandidates[0].url,"https://brand.example/logo.png");
  assert.equal(page.imageCandidates[0].url,"https://brand.example/hero.jpg");
  assert.ok(!page.imageCandidates.some(item=>item.url.includes("sponsor")));
});

test("brand import verifies each asset with the guarded resource reader",async()=>{
  const calls=[];
  const result=await readWebsiteBrand({url:"https://brand.example/",inlineStyles:css,stylesheets:[],logoCandidates:[{url:"https://brand.example/logo.svg"}],imageCandidates:[{url:"https://brand.example/hero.jpg",alt:"Plants"}]},{readResource:async(url,options)=>{calls.push({url,kind:options.kind});return{url,html:""};}});
  assert.equal(result.brand.accent,"#255C3B");assert.equal(result.brand.background,"#F7F2E6");assert.equal(result.brand.logoUrl,"https://brand.example/logo.svg");
  assert.deepEqual(calls.map(call=>call.kind).sort(),["font","font","image","image"]);
  assert.equal(modelBrandChoice({accent:"#FF0000"},result).accent,"#255C3B","AI cannot introduce an unsupported palette color");
});

test("unsafe URLs and font strings cannot become deck styles",()=>{
  const brand=normalizePitchBrand({...DEMO_PITCH.pitch.brand,logoUrl:"javascript:alert(1)",imageUrl:"data:text/html,bad",headingFont:'bad"; color:red',headingFontUrl:"https://user:secret@example.com/font.woff2"});
  assert.equal(brand.logoUrl,"");assert.equal(brand.imageUrl,"");assert.equal(brand.headingFont,"");assert.equal(brand.headingFontUrl,"");
  assert.equal(readPitchBrand("{bad"),null);
});

test("deck colors preserve the brand while keeping text contrast readable",()=>{
  const styles=pitchBrandStyle({...DEMO_PITCH.pitch.brand,accent:"#FFFF00",background:"#FFFFFF",ink:"#EEEEEE"});
  assert.equal(styles["--hp-brand-color"],"#FFFF00");
  assert.ok(brandContrast(styles["--accent"],styles["--bg"])>=4.5);
  assert.ok(brandContrast(styles["--ink"],styles["--bg"])>=4.5);
});

test("the selected brand survives form parsing and feeds the generated pitch",()=>{
  const form=new FormData();form.set("project","Porchlight");form.set("pitch_brand",JSON.stringify(DEMO_PITCH.pitch.brand));
  const saved=readSubmission(form);const deck=buildPitch(saved,DEMO_PITCH_TEAM);
  assert.equal(deck.brand.accent,"#255C3B");assert.equal(deck.brand.bodyFont,"Atkinson Hyperlegible Next");
  assert.match(deck.brand.logoUrl,/porchlight-logo.svg/);
});
