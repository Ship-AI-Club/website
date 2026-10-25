const HEX = /^#[0-9a-f]{6}$/i;
export function brandAssetUrl(value) {
  if (typeof value !== "string" || value.length > 1500) return "";
  if (/^\/hackathon-pitch-demo\/[\w./-]+$/.test(value) && !value.includes("..")) return value;
  try { const url=new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.port && !/(^|\.)(localhost|local|internal|invalid|test)$/.test(url.hostname) && url.hostname.includes(".") ? url.href : ""; }
  catch { return ""; }
}
export function normalizePitchBrand(value) {
  if (!value || typeof value !== "object" || !HEX.test(value.accent) || !HEX.test(value.background) || !HEX.test(value.ink)) return null;
  const font = name => typeof name === "string" && /^[a-z0-9 _-]{1,80}$/i.test(name) ? name : "";
  return { accent:value.accent.toUpperCase(), background:value.background.toUpperCase(), ink:value.ink.toUpperCase(),
    headingFont:font(value.headingFont), bodyFont:font(value.bodyFont),
    headingFontUrl:brandAssetUrl(value.headingFontUrl), bodyFontUrl:brandAssetUrl(value.bodyFontUrl),
    logoUrl:brandAssetUrl(value.logoUrl), imageUrl:brandAssetUrl(value.imageUrl),
    imageAlt:typeof value.imageAlt === "string" ? value.imageAlt.slice(0,180) : "Brand imagery from the website",
    sourceUrl:brandAssetUrl(value.sourceUrl),
  };
}
export function readPitchBrand(raw) {
  try { return typeof raw === "string" && raw.length <= 8000 ? normalizePitchBrand(JSON.parse(raw)) : null; }
  catch { return null; }
}
const rgb = hex => [1,3,5].map(index=>parseInt(hex.slice(index,index+2),16));
const toHex = values => `#${values.map(value=>Math.round(value).toString(16).padStart(2,"0")).join("")}`;
const lum = hex => rgb(hex).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,index)=>sum+n*[.2126,.7152,.0722][index],0);
export function brandContrast(a,b) { const values=[lum(a),lum(b)].sort((a,b)=>b-a);return(values[0]+.05)/(values[1]+.05); }
function readable(color,background) {
  if(brandContrast(color,background)>=4.5)return color;
  const target=lum(background)>.4?[0,0,0]:[255,255,255];const original=rgb(color);
  for(let i=1;i<=20;i++){const candidate=toHex(original.map((value,index)=>value+(target[index]-value)*i/20));if(brandContrast(candidate,background)>=4.5)return candidate;}
  return toHex(target);
}
export function pitchBrandStyle(input) {
  const brand=normalizePitchBrand(input);if(!brand)return {};
  const ink=readable(brand.ink,brand.background),accent=readable(brand.accent,brand.background);
  return {"--bg":brand.background,"--bg-rgb":rgb(brand.background).join(","),"--surface":brand.background,
    "--ink":ink,"--dim":ink,"--faint":ink,"--fg-rgb":rgb(ink).join(","),
    "--accent":accent,"--accent-rgb":rgb(brand.accent).join(","),"--hp-brand-color":brand.accent,
    "--edge":`rgba(${rgb(ink).join(",")},.46)`,
    ...(brand.headingFont?{"--hp-heading-font":brand.headingFontUrl?'"PitchWebsiteHeading"':JSON.stringify(brand.headingFont)}:{}),
    ...(brand.bodyFont?{"--hp-body-font":brand.bodyFontUrl?'"PitchWebsiteBody"':JSON.stringify(brand.bodyFont)}:{}),
  };
}
