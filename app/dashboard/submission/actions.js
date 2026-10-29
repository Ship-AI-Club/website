"use server";

import { revalidatePath } from "next/cache";

import { requireOnboarded } from "../../../lib/auth";
import { sql } from "../../../lib/db";
import { text } from "../../../lib/accounts";
import { FOUNDER_WEEKEND as FW } from "../../../lib/founder-weekend";
import { hackathonById } from "../../../lib/hackathons";
import { hackathonSubmissionsOpen } from "../../../lib/settings";
import { submissionForTeam, teamFor } from "../../../lib/store";
import { invalidFounderUrls, missingFounderFields, readFounderSubmission } from "../../../lib/founder-weekend-submissions";
import { adminNotice, submissionReceiptEmail } from "../../../lib/email";

export async function saveFounderSubmissionAction(prev, formData) {
  const user = await requireOnboarded("/dashboard/submission");
  const hackathon = hackathonById(FW.id);
  const teamId = text(formData.get("team_id"), 40);
  if (!teamId) return { error: "Select your Founder Weekend team first." };
  const team = await teamFor(user.id, teamId, FW.id);
  if (!team) return { error: "You can only edit a submission for a team you belong to." };

  const entry = readFounderSubmission(formData);
  if (!(await hackathonSubmissionsOpen(hackathon))) {
    return { ...entry, error: `Submissions closed at ${FW.deadline}. No late submissions.` };
  }

  const invalid = invalidFounderUrls(formData);
  if (invalid.length) {
    return { ...entry, error: `Check ${invalid.map((f) => f.name.toLowerCase()).join(" and ")}. Use a complete public http or https address.` };
  }

  const finalize = String(formData.get("intent")) === "submit";
  const existing = await submissionForTeam(team.id);
  if (finalize || existing?.status === "submitted") {
    const missing = missingFounderFields(entry);
    if (missing.length) return { ...entry, error: `Still needs ${missing.join(", ")}.` };
  }

  const status = finalize ? "submitted" : existing?.status ?? "draft";
  let saved;
  try {
    [saved] = await sql`
      insert into submissions
        (team_id, project, category, live_url, repo_url, summary, pitch, status, submitted_at)
      values
        (${team.id}, ${entry.project}, ${entry.category}, ${entry.live_url}, ${entry.repo_url},
         ${entry.summary}, ${JSON.stringify(entry.pitch)}::jsonb, ${status},
         ${finalize ? new Date().toISOString() : null})
      on conflict (team_id) do update set
        project = excluded.project,
        category = excluded.category,
        live_url = excluded.live_url,
        repo_url = excluded.repo_url,
        summary = excluded.summary,
        pitch = submissions.pitch || excluded.pitch,
        status = case when submissions.status = 'submitted' then 'submitted' else excluded.status end,
        submitted_at = coalesce(submissions.submitted_at, excluded.submitted_at),
        updated_at = now()
      where submissions.status <> 'submitted'
         or ${Boolean(entry.project && entry.live_url && entry.summary)}::boolean
      returning status, submitted_at`;
  } catch (error) {
    console.error("founder submission: save failed", error);
    return { ...entry, error: "Your entry could not be saved. Your answers are still here. Try saving again." };
  }
  if (!saved) return { ...entry, error: "A teammate submitted this entry. Add a company name, live product URL and pitch before saving changes." };

  revalidatePath("/dashboard", "layout");
  revalidatePath(FW.path);

  if (finalize && !existing?.submitted_at) {
    try {
      await sql`
        insert into audit_log (actor_id, action, target, meta)
        values (${user.id}, 'submit', ${team.id}, ${JSON.stringify({ project: entry.project, hackathon: FW.id })}::jsonb)`;
    } catch {}
    for (const member of team.members) {
      await submissionReceiptEmail({ to: member.email, project: entry.project, category: FW.name, deadline: FW.deadline });
    }
    await adminNotice({
      subject: `${FW.name} submission: ${entry.project} (${team.name})`,
      lines: [`Team: ${team.name}`, `Live URL: ${entry.live_url}`, "", entry.summary],
      cta: { href: "https://www.shipai.club/admin/submissions", label: "Open the admin" },
      replyTo: team.members.find((m) => m.is_owner)?.email ?? team.members[0]?.email,
    });
    return { ...entry, status: saved.status, ok: `Submitted. You can keep editing until ${FW.deadline}.` };
  }

  return { ...entry, status: saved.status, ok: saved.status === "submitted" ? "Submission updated." : "Draft saved. Submit when it's ready." };
}
