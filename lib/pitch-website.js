import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { BlockList, isIP } from "node:net";

const blocked = new BlockList();
for (const [address, prefix] of [["0.0.0.0",8],["10.0.0.0",8],["100.64.0.0",10],["127.0.0.0",8],
  ["169.254.0.0",16],["172.16.0.0",12],["192.0.0.0",24],["192.0.2.0",24],["192.168.0.0",16],
  ["192.88.99.0",24],["198.18.0.0",15],["198.51.100.0",24],["203.0.113.0",24],["224.0.0.0",3]]) blocked.addSubnet(address,prefix,"ipv4");

export function publicWebsiteAddress(address) {
  const family = isIP(address);
  if (family === 4) return !blocked.check(address, "ipv4");
  if (family !== 6) return false;
  const canonical = new URL(`http://[${address}]/`).hostname.slice(1,-1).toLowerCase();
  // Only global unicast. Exclude mapped, transition, and documentation space.
  return /^[23][0-9a-f]{3}:/.test(canonical)
    && !/^(2001:(db8:|:|10:|20:)|2002:|3fff:)/.test(canonical);
}

export function websiteUrl(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 400) throw Error("Enter your public website URL first.");
  const raw = value.trim();
  if (/\s/.test(raw) || (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw))) throw Error("Use a public http or https website address.");
  let url;
  try { url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); }
  catch { throw Error("Use a complete public website address."); }
  if (!["https:","http:"].includes(url.protocol) || url.username || url.password || url.port) throw Error("Use a public website on a standard http or https port, without sign-in details.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (/(^|\.)(localhost|local|internal|invalid|test)$/.test(host) || (!isIP(host) && !host.includes(".")) || (isIP(host) && !publicWebsiteAddress(host))) throw Error("Use a publicly accessible website. Local and private addresses cannot be read.");
  url.hash = "";
  return url;
}

async function requestPage(url, addresses, signal, kind = "html") {
  return new Promise((resolve, reject) => {
    const transport = url.protocol === "https:" ? httpsRequest : httpRequest;
    const req = transport(url, {
      signal,
      method: ["image","font"].includes(kind) ? "HEAD" : "GET",
      // Pin the connection to the public addresses we checked. No second DNS lookup.
      lookup: (_host, options, done) => options.all ? done(null, addresses) : done(null, addresses[0].address, addresses[0].family),
      headers: { "User-Agent": "ShipAI-Pitch-Preview/1.0", Accept: kind === "css" ? "text/css" : kind === "html" ? "text/html,application/xhtml+xml" : "*/*", "Accept-Encoding": "identity" },
    }, response => {
      const status = response.statusCode;
      if ([301,302,303,307,308].includes(status)) { response.resume(); resolve({ location: response.headers.location }); return; }
      if (status !== 200) { response.resume(); reject(Error("That page could not be opened. Check that it works without signing in.")); return; }
      const expected = kind === "css" ? /^text\/css(;|$)/i : kind === "image" ? /^image\//i : kind === "font" ? /^(font\/|application\/(font|x-font|octet-stream))/i : /^(text\/html|application\/xhtml\+xml)(;|$)/i;
      if (!expected.test(response.headers["content-type"] || "")) { response.resume(); reject(Error("Use a website page, rather than an image, PDF, or download.")); return; }
      if (["image","font"].includes(kind)) { response.resume(); resolve({html:""}); return; }
      if (Number(response.headers["content-length"]) > 524288) { response.destroy(); reject(Error("That page is too large to read. Try a simpler homepage.")); return; }
      const chunks = []; let bytes = 0;
      response.on("data", chunk => {
        bytes += chunk.length;
        if (bytes > 524288) { response.destroy(); reject(Error("That page is too large to read. Try a simpler homepage.")); }
        else chunks.push(chunk);
      });
      response.on("error", reject);
      response.on("end", () => resolve({ html: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("error", reject); req.end();
  });
}

export async function readPublicPitchResource(value, { resolveHost = lookup, getPage = requestPage, signal = AbortSignal.timeout(12000), kind = "html" } = {}) {
  let url = websiteUrl(value);
  for (let redirects = 0; redirects <= 3; redirects++) {
    signal.throwIfAborted();
    const host = url.hostname.replace(/^\[|\]$/g, "");
    const addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await Promise.race([
      resolveHost(host, { all: true, verbatim: true }),
      new Promise((_, reject) => signal.addEventListener("abort", () => reject(Error("The website took too long to respond. Try again or enter your answers manually.")), { once: true })),
    ]);
    if (!addresses.length || addresses.some(row => !publicWebsiteAddress(row.address))) throw Error("Use a publicly accessible website. Local and private addresses cannot be read.");
    addresses.sort((a,b) => a.family - b.family);
    const page = await getPage(url, addresses, signal, kind);
    if (page.location) { url = websiteUrl(new URL(page.location, url).href); continue; }
    if (typeof page.html !== "string") throw Error("The website could not be read. Enter your answers manually.");
    return { html:page.html, url:url.href };
  }
  throw Error("That website redirects too many times. Use the final page address.");
}

export async function readPitchWebsite(value, options) {
  const page=await readPublicPitchResource(value,options);
  const url=new URL(page.url);
  return { ...extractPitchWebsite(page.html,page.url),url:`${url.origin}${url.pathname}` };
}

function clean(value) {
  return String(value || "").replace(/<[^>]*>/g," ").replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
    if (entity[0] === "#") { const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2),16) : Number(entity.slice(1)); return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : " "; }
    return ({amp:"&",quot:'"',apos:"'",lt:"<",gt:">",nbsp:" "})[entity.toLowerCase()];
  }).replace(/\s+/g," ").trim();
}

export function extractPitchWebsite(html, baseUrl = "https://example.com/") {
  const source = html.slice(0,524288).replace(/<!--[^]*?-->/g," ");
  const meta = {};
  for (const tag of source.match(/<meta\b[^>]{0,5000}>/gi) || []) {
    const attrs = {};
    for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4];
    const name = (attrs.property || attrs.name || "").toLowerCase();
    if (name) meta[name] = clean(attrs.content);
  }
  const title = clean(source.match(/<title\b[^>]*>([^]*?)<\/title>/i)?.[1]).slice(0,240);
  const visible = source.replace(/<(script|style|noscript|template|svg)\b[^>]*>[^]*?<\/\1>/gi," ");
  const body = visible.match(/<body\b[^>]*>([^]*?)<\/body>/i)?.[1] || visible;
  const headings = [...body.matchAll(/<h[12]\b[^>]*>([^]*?)<\/h[12]>/gi)].map(match => clean(match[1])).filter(Boolean).slice(0,10);
  const actions = [...body.matchAll(/<(?:a|button)\b[^>]*>([^]*?)<\/(?:a|button)>/gi)].map(match => clean(match[1])).filter(value => value.length > 1 && value.length < 100).slice(0,16);
  const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(match=>[match[1].toLowerCase(),match[2]??match[3]??match[4]]));
  const assetUrl = value => { try { const url=new URL(clean(value),baseUrl);return websiteUrl(url.href).href; }catch{return "";} };
  const links=(source.match(/<link\b[^>]{0,5000}>/gi)||[]).map(attributes);
  const images=(body.match(/<img\b[^>]{0,8000}>/gi)||[]).map(attributes).map(item=>({url:assetUrl(item.src||item["data-src"]),alt:clean(item.alt),width:Number(item.width)||0})).filter(item=>item.url);
  const logoCandidates=images.filter(item=>/logo|wordmark|(?:^|[\/_. -])mark\.|\/brand\.(svg|png|webp)/i.test(`${item.alt} ${new URL(item.url).pathname}`));
  for(const link of links.filter(link=>/^(icon|shortcut icon|apple-touch-icon)$/i.test(link.rel||""))) {const url=assetUrl(link.href);if(url)logoCandidates.push({url,alt:"Website logo or icon"});}
  const imageCandidates=images.filter(item=>!logoCandidates.some(logo=>logo.url===item.url)&&!/(icon|avatar|badge|pixel|sponsor|partner|client-logo)/i.test(`${new URL(item.url).pathname} ${item.alt}`)&&(item.width>=320||!/\.svg(?:\?|$)/i.test(item.url))).sort((a,b)=>b.width-a.width).slice(0,5);
  const ogImage=assetUrl(meta["og:image"]);if(ogImage&&!imageCandidates.some(item=>item.url===ogImage)){const candidate={url:ogImage,alt:meta["og:image:alt"]||"Website brand imagery"};if(!imageCandidates[0]?.width)imageCandidates.unshift(candidate);else imageCandidates.push(candidate);}
  return { title, siteName: meta["og:site_name"] || meta["application-name"] || "",
    description: (meta.description || meta["og:description"] || "").slice(0,800),
    headings, actions, text: clean(body).slice(0,12000),
    inlineStyles:[...source.matchAll(/<style\b[^>]*>([^]*?)<\/style>/gi)].map(match=>match[1]).join("\n").slice(0,100000),
    stylesheets:links.filter(link=>(link.rel||"").toLowerCase()==="stylesheet").map(link=>assetUrl(link.href)).filter(Boolean).slice(0,4),
    logoCandidates:logoCandidates.slice(0,3),imageCandidates:imageCandidates.slice(0,4),
  };
}

export function websitePitchFallback(page) {
  return { project: (page.siteName || page.title.split(/\s[|–—]\s/)[0] || "").slice(0,120),
    summary: page.description, positioning: "", icp: "", design: "" };
}

export function validateWebsitePitch(output) {
  const result = {};
  for (const [key, limit] of [["project",120],["summary",800],["positioning",600],["icp",600],["design",600]]) {
    if (typeof output?.[key] !== "string" || output[key].length > limit) throw Error("Invalid website draft");
    result[key] = output[key].trim();
  }
  return result;
}
