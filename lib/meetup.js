const ICAL_URL = "https://www.meetup.com/shipai/events/ical/";

// Unfold RFC 5545 folded lines (continuation lines start with a space/tab).
function unfold(ics) {
  return ics.replace(/\r?\n[ \t]/g, "");
}

function prop(block, name) {
  const m = block.match(new RegExp(`^${name}(?:;[^:\\n]*)?:(.*)$`, "m"));
  return m ? m[1].trim().replace(/\\,/g, ",").replace(/\\n/g, " ") : null;
}

// DTSTART;TZID=America/Phoenix:20260725T120000 — MST has no DST, fixed -07:00.
function parseStart(block) {
  const raw = prop(block, "DTSTART");
  if (!raw) return null;
  const m = raw.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, min] = m;
  const utc = raw.endsWith("Z");
  return new Date(`${y}-${mo}-${d}T${h}:${min}:00${utc ? "Z" : "-07:00"}`);
}

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "short", month: "short", day: "numeric", timeZone: "America/Phoenix",
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric", minute: "2-digit", timeZone: "America/Phoenix",
});

// The iCal feed can keep reporting STATUS:CONFIRMED after an event is
// cancelled, and carries no LOCATION at all — so fetch each event page once
// for its real status, its venue and whether it is online. Fail open on
// fetch errors: keep the event, fall back to the generic location line.
// An online event has no venue, and must never be given the city's name.
async function fetchEventDetails(url) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { cancelled: false, venue: null, online: false };
    const html = await res.text();
    const cancelled =
      html.includes('"status":"CANCELLED"') || html.includes("EventCancelled");
    let venue = null;
    let online = html.includes('OnlineEventAttendanceMode');
    const m = html.match(/"venue":\{"__typename":"Venue",[^}]*\}/);
    if (m) {
      try {
        const v = JSON.parse(m[0].slice('"venue":'.length));
        if (v.name && /online/i.test(v.name)) online = true;
        else if (v.name) {
          online = false;
          const cityState = [v.city, v.state].filter(Boolean).join(", ");
          venue = cityState && !v.name.includes(v.city) ? `${v.name} · ${cityState}` : v.name;
        }
      } catch {}
    }
    return { cancelled, venue, online };
  } catch {
    return { cancelled: false, venue: null, online: false };
  }
}

export async function getUpcomingEvents(limit = 4) {
  try {
    const res = await fetch(ICAL_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const blocks = unfold(await res.text()).split("BEGIN:VEVENT").slice(1);
    const now = Date.now();
    const upcoming = blocks
      .map((b) => {
        const start = parseStart(b);
        const title = prop(b, "SUMMARY");
        if (!start || !title) return null;
        if (prop(b, "STATUS") === "CANCELLED") return null;
        return {
          title,
          url: prop(b, "URL") || "https://www.meetup.com/shipai/events/",
          date: DATE_FMT.format(start),
          time: TIME_FMT.format(start),
          ts: start.getTime(),
          startISO: start.toISOString(),
        };
      })
      .filter((e) => e && e.ts > now)
      .sort((a, b) => a.ts - b.ts)
      .slice(0, limit + 2);
    const details = await Promise.all(upcoming.map((e) => fetchEventDetails(e.url)));
    return upcoming
      .map((e, i) => ({
        ...e,
        online: details[i].online,
        place: details[i].venue || (details[i].online ? "Online" : "Phoenix, AZ"),
        cancelled: details[i].cancelled,
      }))
      .filter((e) => !e.cancelled)
      .slice(0, limit);
  } catch {
    return [];
  }
}
