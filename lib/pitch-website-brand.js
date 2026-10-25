import { readPublicPitchResource } from "./pitch-website.js";
import { normalizePitchBrand } from "./pitch-brand.js";

function colorHex(value) {
  if(/^#[0-9a-f]{6}$/i.test(value))return value.toUpperCase();
  if(/^#[0-9a-f]{3}$/i.test(value))return `#${value.slice(1).split("").map(c=>c+c).join("")}`.toUpperCase();
  const match=value.match(/^rgba?\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);
  return match?`#${match.slice(1).map(n=>Math.min(255,Number(n)).toString(16).padStart(2,"0")).join("")}`.toUpperCase():"";
}

export function extractBrandStyles(styles,baseUrl) {
  const colors=new Map(),fonts=new Map();
  for(const source of styles) {
    const css=typeof source==="string"?source:source.css;const base=typeof source==="string"?baseUrl:source.url;
    for(const match of css.matchAll(/(--[\w-]+|background(?:-color)?|color|fill|stroke)\s*:\s*(#[0-9a-f]{3,8}\b|rgba?\([^)]{1,60}\))/gi)){
      const color=colorHex(match[2]);if(!color)continue;
      const name=match[1].toLowerCase();const score=/^--(bg|background|ink|foreground|primary|accent|brand)(?:-|$)/.test(name)?20:/primary|brand|accent|green|cream|paper|ink|background|foreground|surface/.test(name)?8:1;
      const current=colors.get(color);colors.set(color,{color,label:current?.priority>score?current.label:name,priority:Math.max(current?.priority||0,score),score:(current?.score||0)+score});
    }
    for(const match of css.matchAll(/(--[\w-]*font[\w-]*|font-family)\s*:\s*([^;}]+)/gi)) {
      const family=match[2].split(",")[0].trim().replace(/^['"]|['"]$/g,"");
      if(!/^[a-z][a-z0-9 _-]{1,79}$/i.test(family)||/^(inherit|sans-serif|serif|monospace|system-ui)$/i.test(family))continue;
      const previous=fonts.get(family)||{};fonts.set(family,{...previous,family,role:/display|heading|title/.test(match[1])?"heading":/body|text/.test(match[1])?"body":previous.role||""});
    }
    for(const match of css.matchAll(/@font-face\s*\{([^}]{1,12000})\}/gi)){
      const family=match[1].match(/font-family\s*:\s*['"]?([^;'"}]+)/i)?.[1]?.trim();
      const rawUrl=match[1].match(/src\s*:[^;}]*?url\(\s*['"]?([^)'"\s]+)/i)?.[1];
      if(!family||!fonts.has(family)||!rawUrl||/^data:/i.test(rawUrl))continue;
      try {const url=new URL(rawUrl,base).href;const previous=fonts.get(family);if(!previous.url||/U\+0000-00FF/i.test(match[1])||!match[1].includes("unicode-range"))fonts.set(family,{...previous,url});}catch{}
    }
  }
  return{palette:[...colors.values()].sort((a,b)=>b.score-a.score).slice(0,12),fonts:[...fonts.values()].slice(0,8)};
}

export async function readWebsiteBrand(page,{readResource=readPublicPitchResource}={}) {
  const styles=[{css:page.inlineStyles||"",url:page.url}];
  const sheets=await Promise.allSettled((page.stylesheets||[]).slice(0,4).map(url=>readResource(url,{kind:"css",signal:AbortSignal.timeout(4000)})));
  for(const result of sheets)if(result.status==="fulfilled")styles.push({css:result.value.html,url:result.value.url});
  const evidence=extractBrandStyles(styles,page.url);
  const candidateLogo=page.logoCandidates?.[0],candidateImage=page.imageCandidates?.[0];
  const heading=evidence.fonts.find(font=>font.role==="heading")||evidence.fonts[0];
  const body=evidence.fonts.find(font=>font.role==="body")||heading;
  const checks=await Promise.allSettled([
    candidateLogo?readResource(candidateLogo.url,{kind:"image",signal:AbortSignal.timeout(4000)}):Promise.resolve(null),
    candidateImage?readResource(candidateImage.url,{kind:"image",signal:AbortSignal.timeout(4000)}):Promise.resolve(null),
    heading?.url?readResource(heading.url,{kind:"font",signal:AbortSignal.timeout(4000)}):Promise.resolve(null),
    body?.url?readResource(body.url,{kind:"font",signal:AbortSignal.timeout(4000)}):Promise.resolve(null),
  ]);
  const checked=index=>checks[index].status==="fulfilled"?checks[index].value?.url||"":"";
  const color=(pattern,fallback)=>evidence.palette.find(item=>pattern.test(item.label))?.color||fallback;
  const accent=color(/primary|brand|accent|green/,evidence.palette.find(item=>{const rgb=[1,3,5].map(i=>parseInt(item.color.slice(i,i+2),16));return Math.max(...rgb)-Math.min(...rgb)>35;})?.color||"#2B59D6");
  const background=color(/^--(bg|background|cream|paper)$/ ,color(/background|cream|paper|surface/,"#FBFBF9")),ink=color(/foreground|ink/,"#0D0F14");
  const brand=normalizePitchBrand({accent,background,ink,headingFont:heading?.family||"",bodyFont:body?.family||"",headingFontUrl:checked(2),bodyFontUrl:checked(3),
    logoUrl:checked(0),imageUrl:checked(1),imageAlt:candidateImage?.alt||"Brand imagery from the website",sourceUrl:page.url});
  return{brand:evidence.palette.length||brand.logoUrl||brand.imageUrl||heading?brand:null,palette:evidence.palette,fonts:evidence.fonts};
}

export function modelBrandChoice(input,evidence) {
  if(!evidence.brand)return null;
  const brand={...evidence.brand};const colors=new Set(evidence.palette.map(item=>item.color.toUpperCase()));
  for(const field of ["accent","background","ink"])if(typeof input?.[field]==="string"&&colors.has(input[field].toUpperCase()))brand[field]=input[field];
  return normalizePitchBrand(brand);
}
