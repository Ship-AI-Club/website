/* The October 2026 hackathon is finished, so its outcome is a fixed
   record: 17 teams launched and the judges placed these three. The
   full list lives on the results page. The homepage and both event
   pages read it from here. */
const HACKATHON_PATH = "/programs/zero-to-launch/hackathon";

export const SHIPPED_RESULTS = `${HACKATHON_PATH}/results`;

export const SHIPPED = {
  event: "Ship AI AZ GTM Hackathon",
  held: "Oct 17–18, 2026",
  registered: 21,
  teams: 17,
  builders: 22,
  podium: [
    { place: "First place", project: "Dropdone", team: "anshul", line: "A desktop app that learns how you clean a messy export, then repeats it every week." },
    { place: "Second place", project: "Agent Task Lock", team: "agent-task-lock", line: "A Mac app that shows what your AI agents are doing, step by step." },
    { place: "Third place", project: "Orbis", team: "launchcraft", line: "Turns old photos into a 3D world you can walk through and share." },
  ].map((entry) => ({ ...entry, pitch: `${HACKATHON_PATH}/teams/${entry.team}#team-pitch` })),
};

/* Where an event stands today. Event pages pick their one action from
   this: the RSVP before, the podium after. */
export function eventState(startISO, endISO, now = Date.now()) {
  if (now < Date.parse(startISO)) return "before";
  if (now <= Date.parse(endISO)) return "during";
  return "after";
}

export function daysUntil(startISO, now = Date.now()) {
  return Math.max(0, Math.ceil((Date.parse(startISO) - now) / 86400000));
}
