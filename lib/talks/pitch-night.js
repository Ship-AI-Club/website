import { ABOUT_SLIDE, JOIN_ROOM_SLIDE, PARTNER_SLIDE, FOUNDER_WEEKEND_SLIDE, COMMUNITY_CLOSE_SLIDE, takeHomeSlide, WORKUITY } from "./shared.js";

const SLUG = "pitch-night";
const DEMO_LABEL = "claude · ~/whats-for-dinner";

const PITCH_MD = `# What's for Dinner · PITCH.md

Five minutes on stage at Founder Weekend. Going over costs points. Judges score what the company is by Sunday, so every claim points at something real.

## Run of show (5:00)
| Time | Beat | What we say or show | Criterion it earns |
|---|---|---|---|
| 0:00-0:30 | The problem | 6pm, the fridge, takeout. One line from a real interview. | Opportunity size |
| 0:30-1:00 | Who and why us | Busy parents on weeknights. Why we're the ones to build it. | Market fit |
| 1:00-2:30 | Live demo | Four ingredients in, three dinners out, on a phone. | Craftsmanship |
| 2:30-3:15 | Traction | Visitors, signups, first dinners, creator replies. | Market fit |
| 3:15-4:00 | The money | $5 a month, cost per request, margin at the cap. | Scalability |
| 4:00-4:40 | Go-to-market | One channel, the weekly loop, the next 100. | Go-to-market |
| 4:40-5:00 | The ask | What we want from this room. | The pitch |

## Six slides, one idea each
1. The problem: one quote, one number
2. The demo: live, with a 30-second recording as backup
3. Traction: three numbers next to last week's
4. The money: price, cost per request, margin
5. Go-to-market: one channel and the loop
6. The ask: one sentence, then the URL

## Numbers we can defend
| Claim | Number | Source |
|---|---|---|
| People in the 6pm moment | [number] | RESEARCH.md, section 2 |
| Interviews who felt the pain | [x of 5] | RESEARCH.md, section 5 |
| Signups, last 7 days | [number] | scripts/numbers.ts |
| First dinners, last 7 days | [number] | scripts/numbers.ts |
| Creator replies | [number] | GTM-PLAN.md, Friday report |
| Margin at the fair-use cap | [percent] | RESEARCH.md, section 6 |

Anything without a source gets cut or said as a guess, out loud.

## Hard questions
Ten questions a judge is likely to ask, each with a one-line answer in our words.

## Backup
- A 30-second screen recording of the demo, saved offline
- A test account already signed in on the phone and the laptop
- The deck as a file that opens with no Wi-Fi

## Done when
- [ ] Under five minutes out loud, three times in a row
- [ ] Every number traces to a file
- [ ] The demo works on the venue Wi-Fi, and the recording works without it
- [ ] Two people scored it 1 to 10 on all six criteria, and we fixed the lowest score
`;

const DECK = {
  title: "Pitch Night",
  includeRoiSlide: false,
  includeShowcaseSlide: false,
  visual: true,
  slides: [
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "launch", dark: true, logo: true, kicker: "CLAUDE CODE BUILD NIGHT · PART 5 · TUE JAN 12", lines: ["Pitch"], em: "Night", body: "Five minutes. Six criteria. Real numbers." },
    },
    ABOUT_SLIDE,
    JOIN_ROOM_SLIDE,
    PARTNER_SLIDE,
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "harbor", dark: true, kicker: "THE IDEA", lines: ["Nobody backs a feature list."], em: "They back proof." },
    },
    {
      title: "From a demo to a pitch",
      layout: "checklist",
      diagram: "versus",
      before: { kicker: "WHAT MOST TEAMS SHOW", title: "Features, a roadmap, hope." },
      after: { kicker: "WHAT JUDGES SCORE", title: "One problem. One live demo.", em: "Numbers you can defend." },
      items: [],
    },
    {
      title: "Tonight",
      layout: "checklist",
      diagram: "result",
      items: [{ title: "Story" }, { title: "Proof" }, { title: "Deck" }, { title: "Reps" }],
    },
    {
      title: "Tonight's pitch",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "PITCH.md",
        sections: [
          { h: "Run of show", lit: true, lines: ["Seven beats in five minutes."] },
          { h: "Numbers", lines: ["Every claim points at a file."] },
          { h: "Hard questions", lines: ["Ten, answered in one line each."] },
          { h: "Done when", lines: ["[ ] Under 5:00, three times", "[ ] Scored on all six criteria"] },
        ],
      },
    },
    {
      title: "Write the story from your files",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "Read RESEARCH.md, SPEC.md, SITE-BRIEF.md, GTM-PLAN.md." }, { who: "claude", text: "Which interview line hurts the most?" }, { who: "you", text: "\"I open the fridge and see ingredients, not dinner.\"" }, { who: "out", text: "✓ PITCH.md: run of show, 5:00" }] },
      promptLabel: "Copy · the run of show",
      prompt: "Read RESEARCH.md, SPEC.md, SITE-BRIEF.md and GTM-PLAN.md, whichever exist. We're writing a five-minute pitch for Founder Weekend. Judges score six criteria from 1 to 10: craftsmanship, opportunity size, market fit, scalability, the pitch, and go-to-market.\n\nInterview me one question at a time and wait for each answer: the one line from an interview that shows the pain best, why we're the right people to build this, what the demo shows in 90 seconds, and what we want from the room.\n\nThen write PITCH.md with a Run of show table: time, beat, what we say or show, and the criterion it earns. Seven beats, five minutes total, with the live demo getting the most time. Use only facts from the files or my answers, and mark anything else [guess]. Stop and wait for my OK.",
      promptPreview: "Interview me, then turn my four files into a five-minute run of show, each beat mapped to one judging criterion.",
    },
    {
      title: "Numbers you can defend",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ 41 signups, 27 first dinners (scripts/numbers.ts)" }, { who: "claude", text: "\"10,000 users by June\" has no source." }, { who: "you", text: "Cut it." }, { who: "out", text: "✓ Numbers table: 6 claims, 6 sources" }] },
      promptLabel: "Copy · the numbers",
      prompt: "Read PITCH.md and RESEARCH.md. Run scripts/numbers.ts if it exists.\n\n1. List every number in the run of show.\n2. For each one, find its source: a file and section, or the script output. Fill in the Numbers we can defend table in PITCH.md.\n3. Flag every number with no source. For each, suggest cutting it or saying it as a labeled guess. Never invent a number or round one up.\n4. If traction is small, say so plainly and suggest the most honest way to show it: real counts next to last week, not percentages of tiny numbers.\n\nShow me the table and the flags, and wait.",
      promptPreview: "Trace every number in the pitch to a file or the numbers script, and flag anything with no source.",
    },
    {
      title: "Six slides, one idea each",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "out", text: "✓ pitch/index.html, 6 slides" }, { who: "out", text: "✓ Arrow keys, works offline" }, { who: "claude", text: "Slide 2 plays demo.mp4 if Wi-Fi drops." }] },
      promptLabel: "Copy · the deck",
      prompt: "Read PITCH.md and SITE-BRIEF.md.\n\n1. Build pitch/index.html: one self-contained file, six slides from the Six slides section, arrow keys to move, in the app's own colors and fonts. No CDN links, so it opens with no Wi-Fi.\n2. One idea per slide, under 15 words each, big type. The demo slide shows the live URL and plays pitch/demo.mp4 if I click it.\n3. Tell me how to record a 30-second screen recording of the demo on my phone and save it as pitch/demo.mp4. Wait until I tell you it's there.\n4. Open the file and tell me what to check at projector size.",
      promptPreview: "Build a six-slide offline deck in one HTML file, with the demo recording as a backup.",
    },
    {
      title: "Rehearse against the clock",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "you", text: "Pasted my rehearsal transcript. 6:10." }, { who: "claude", text: "Over by 1:10. The problem beat ran 1:20." }, { who: "out", text: "Scores: pitch 5, craftsmanship 8, GTM 6" }, { who: "claude", text: "Cut the history. Lead with the quote." }] },
      promptLabel: "Copy · the judge",
      prompt: "Read PITCH.md. I'm pasting a transcript of my rehearsal below, with the total time.\n\nAct as a Founder Weekend judge:\n1. Compare the time for each beat with the Run of show and say where I ran long.\n2. Score me 1 to 10 on each criterion: craftsmanship, opportunity size, market fit, scalability, the pitch, go-to-market. One line of reasoning each, quoting what I said.\n3. Name the one change that would raise my lowest score the most.\n4. If I'm over five minutes, mark exactly which lines to cut.\n\nDon't rewrite the pitch for me. Then wait for the next take.",
      promptPreview: "Paste a rehearsal transcript; Claude Code times each beat, scores the six criteria and names the one fix.",
      promptDestination: "Claude Code, with your transcript",
      takeaway: "Record on your phone. Granola or your phone's voice memos can transcribe it.",
    },
    {
      title: "Ten hard questions",
      layout: "checklist",
      diagram: "demo",
      demo: { label: DEMO_LABEL, lines: [{ who: "claude", text: "\"What stops a free recipe app from adding this?\"" }, { who: "you", text: "We own the 6pm moment, not recipes." }, { who: "out", text: "✓ 10 questions, answers in your words" }] },
      promptLabel: "Copy · hard questions",
      prompt: "Read PITCH.md, RESEARCH.md and GTM-PLAN.md.\n\n1. Write the ten questions a judge or investor is most likely to ask after this pitch, hardest first. Cover competition, why now, retention, unit economics, the channel, and the team.\n2. Ask me each one, one at a time, and wait for my answer.\n3. After each answer, tighten it to one or two sentences using my words, not yours, and flag anything I said that the files don't back up.\n\nAdd them to the Hard questions section of PITCH.md.",
      promptPreview: "Claude Code asks the ten likeliest judge questions one at a time and tightens my answers in my own words.",
    },
    {
      title: "",
      layout: "checklist",
      diagram: "stage",
      stage: { scene: "fleet", dark: true, kicker: "YOUR TURN", lines: ["Five minutes each."], em: "The room scores you." },
    },
    {
      title: "The scorecard",
      layout: "checklist",
      diagram: "doc",
      doc: {
        file: "SCORECARD · 1 TO 10",
        sections: [
          { h: "Craftsmanship", lines: ["It works when we click it."] },
          { h: "Opportunity size", lines: ["How big, how painful."] },
          { h: "Market fit", lit: true, lines: ["Why you, and any traction."] },
          { h: "Scalability", lines: ["Unit economics, stack, bootstrap."] },
          { h: "The pitch", lines: ["Under five minutes, clear, with energy."] },
          { h: "Go-to-market", lines: ["The page, the socials, the plan."] },
        ],
      },
      takeaway: "The same six criteria the judges use on Sunday.",
    },
    takeHomeSlide(SLUG),
    FOUNDER_WEEKEND_SLIDE,
    COMMUNITY_CLOSE_SLIDE,
  ],
};

export const TALK = {
  slug: SLUG,
  series: 5,
  eventTitle: "Pitch Night",
  key: "Pitch",
  summary: "Five minutes, six criteria, numbers you can defend.",
  copy: "Tonight Claude Code turns What's for Dinner's research, spec, site brief and go-to-market plan into a five-minute pitch, with a deck that works offline and a judge that scores your rehearsal. Then teams from the room pitch and get scored on the six Founder Weekend criteria.",
  ...WORKUITY,
  startISO: "2027-01-19T17:00:00-07:00",
  endISO: "2027-01-19T19:00:00-07:00",
  dateLabel: "Tue Jan 19, 2027",
  timeLabel: "5:00 - 7:00 PM MST",
  rsvp: [
    { label: "RSVP on Luma", href: "https://luma.com/th31yqbc" },
    { label: "RSVP on Meetup", href: "https://www.meetup.com/shipai/events/317558906/" },
  ],
  steps: [
    { title: "Story", body: "A five-minute run of show, each beat mapped to a judging criterion." },
    { title: "Proof", body: "Every number traced to a file. Anything else gets cut." },
    { title: "Deck", body: "Six slides in one file that opens with no Wi-Fi." },
    { title: "Reps", body: "Rehearse, get scored, fix the lowest score, repeat." },
  ],
  stepsLede: "We build What's for Dinner's pitch on screen, then teams from the room take the stage for five minutes each and get scored on the weekend's six criteria.",
  closing: ["Bring your files.", "Leave with five minutes."],
  example: {
    name: "What's for Dinner",
    heading: ["Tonight's", "pitch."],
    lede: "The pitch plan we write on the night for What's for Dinner. Copy it, swap in your own numbers and sources, and rehearse it three times before Founder Weekend.",
    file: "PITCH.md",
    pitch: "Type what's in your fridge. Get three dinners you can make tonight.",
    jobLabel: "The goal",
    job: "A five-minute pitch that scores on all six criteria, with every number traced to a file.",
    stack: ["Claude Code", "RESEARCH.md", "SPEC.md", "SITE-BRIEF.md", "GTM-PLAN.md"],
    doneLabel: "Done when",
    done: [
      "Under five minutes out loud, three times in a row",
      "Every number traces to a file",
      "The demo works live, and the recording works offline",
      "Ten hard questions answered in your own words",
      "Scored on all six criteria, lowest score fixed",
    ],
    spec: PITCH_MD,
    specLabel: "The full pitch plan",
    specDestination: "a PITCH.md file in your repo",
  },
  toolsLede: "What we use to build and rehearse the pitch, one job each.",
  tools: [
    { name: "Claude Code", job: "Writes the run of show, checks every number, builds the deck and scores rehearsals", cmd: "curl -fsSL https://claude.ai/install.sh | bash", href: "https://code.claude.com/docs" },
    { name: "Founder Weekend criteria", job: "The six criteria the judges score, 1 to 10", cmd: "shipai.club/hackathons/founder-weekend#judging", href: "/hackathons/founder-weekend#judging" },
    { name: "Granola", job: "Transcribes a rehearsal so Claude Code can time and score it", cmd: "granola.ai", href: "https://www.granola.ai" },
    { name: "Phone screen recording", job: "The 30-second demo backup for when Wi-Fi drops", cmd: "Control Center · Screen Recording", href: "https://support.apple.com/en-us/102653" },
  ],
  deck: DECK,
};
