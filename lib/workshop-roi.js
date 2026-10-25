import { UPCOMING_WORKSHOPS } from './workshops.js';
import { AI_ORGANIZATION_EVENT } from './ai-organization-event.js';

// All operating assumptions are editable hypotheses. Fees come from repository pricing.
// The website fee is resolved by the caller with workshopPrice() at calculation time.
const scenarios = {
  "your-first-agent": {
    "lever": "Reviewed email summaries and reply drafts",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 4,
      "attendanceHours": 3,
      "hourValue": 35,
      "hoursFreedPerMonth": 1.5,
      "monthlyTools": 10,
      "maintenanceHoursPerMonth": 0.5,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: 30 eligible threads/month × 3 minutes less drafting per thread = 1.5 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time 10 representative threads, including source checks and rewrite time.",
    "measurement": "Monthly: compare the same thread categories after two weeks; count only threads actually processed.",
    "limits": "Drafts remain reviewed. Sending access, reply quality, and account permissions are not assumed. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "agentic-engineering": {
    "lever": "Reusable build briefs, tests, and browser review",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 8,
      "attendanceHours": 3,
      "hourValue": 50,
      "hoursFreedPerMonth": 4,
      "monthlyTools": 25,
      "maintenanceHoursPerMonth": 1,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Four bounded changes/month × 1 hour less repeated setup and reproduction work = 4 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Record investigation, implementation, tests, and review time for four comparable changes.",
    "measurement": "Monthly: compare completed changes of similar scope; include failed builds and regression fixes.",
    "limits": "No assumed faster release, incident reduction, or headcount reduction. Keep required review and tests. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "automate-social-media": {
    "lever": "Source-to-reviewed-post queue",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 8,
      "attendanceHours": 3,
      "hourValue": 40,
      "hoursFreedPerMonth": 3,
      "monthlyTools": 25,
      "maintenanceHoursPerMonth": 1,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Six channel drafts/month × 30 minutes less manual formatting and assembly = 3 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Record drafting, adaptation, media preparation, approvals, and publishing-status checks for six posts.",
    "measurement": "Monthly: compare the same formats and count accepted, scheduled drafts; include rejected drafts and retries.",
    "limits": "No reach, follower, conversion, or revenue lift is assumed. Credits and scheduler spend are placeholders. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "agentic-lead-generation": {
    "lever": "Sourced, deduplicated prospect handoff",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 10,
      "attendanceHours": 3,
      "hourValue": 45,
      "hoursFreedPerMonth": 4,
      "monthlyTools": 40,
      "maintenanceHoursPerMonth": 1,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Twenty checked records/month × 12 minutes less research and field assembly = 4 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time 20 records at the required source quality; record duplicates, unknowns, and lookup credit usage.",
    "measurement": "Monthly: inspect a sample for identity and fact accuracy; compare time per accepted record, not generated row.",
    "limits": "No new customer value is counted. Tool credits, CRM fees, and research checks remain costs. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "creatives-agentic-workflow": {
    "lever": "Brief-to-image-and-short draft pipeline",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 10,
      "attendanceHours": 3,
      "hourValue": 45,
      "hoursFreedPerMonth": 4,
      "monthlyTools": 40,
      "maintenanceHoursPerMonth": 1.5,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Two small asset packs/month × 2 hours less repeated briefing, assembly, and file organization = 4 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Track concepting, generations, failed attempts, editing, approvals, and exports for two comparable packs.",
    "measurement": "Monthly: compare accepted formats and revision counts; include generation charges and editor time.",
    "limits": "No improved campaign performance is assumed. Review, rights checks, and final editing still take time. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "ai-sales-gtm-team": {
    "lever": "Reviewed opportunity follow-up and next-action handoffs",
    "unit": "gross-profit",
    "assumptions": {
      "fee": null,
      "setupHours": 12,
      "attendanceHours": 3,
      "hourValue": 50,
      "hoursFreedPerMonth": 0,
      "monthlyTools": 35,
      "maintenanceHoursPerMonth": 1.5,
      "incrementalCustomersPerMonth": 1,
      "grossProfitPerCustomer": 500,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: 1 incremental attributable customer/month × $500 contribution after delivery costs × 0.5 realization = $250 potential monthly gross profit before workflow tools and maintenance. This is a scenario to test, not an assumed conversion lift. Replace customer count with zero unless baseline and post-adoption evidence support attribution. Tool amounts are planning allowances, not vendor prices.",
    "baseline": "Compare one coherent opportunity cohort before and after adoption. Record completed follow-ups, won customers, delivery costs, and alternative causes of the win.",
    "measurement": "Monthly: inspect attribution for any incremental customer. Use contribution after fulfillment costs, returns, and incremental selling expense; set customer count to zero when evidence is absent.",
    "limits": "A follow-up workflow may help advance a deal, but the workshop does not establish that it creates an additional customer. The $500 is an editable contribution hypothesis, not revenue or a quoted customer value. Do not also count saved capacity, payroll savings, or the same customer profit from another workshop. Capacity alternatives are not cash savings.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "Gross profit per customer is contribution after delivery and incremental selling costs. maintenanceHoursPerMonth adds workflow-level review and upkeep outside those customer costs. Do not subtract the same labor twice. Capacity benefits are excluded from this income basis.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "ai-customer-support-team": {
    "lever": "Grounded response drafts and ticket triage",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 12,
      "attendanceHours": 3,
      "hourValue": 40,
      "hoursFreedPerMonth": 3,
      "monthlyTools": 35,
      "maintenanceHoursPerMonth": 2,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: 60 eligible tickets/month × 3 net minutes less total handling time after routine source checks, escalation, and rework = 3 hours before the 0.5 realization haircut. Additional knowledge refresh and operational oversight are subtracted separately. Replace volume and net minutes with a measured baseline. Tool amounts are planning allowances, not vendor prices.",
    "baseline": "Time 60 representative eligible tickets, including source checking, escalation, and correction.",
    "measurement": "Monthly: compare ticket categories, draft acceptance, escalation accuracy, and total handling time.",
    "limits": "No support headcount reduction or avoided incidents is priced. Review, knowledge refresh, and tickets outside scope remain. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "ai-lead-magnets": {
    "lever": "Useful visitor results and consented lead handoffs",
    "unit": "gross-profit",
    "assumptions": {
      "fee": null,
      "setupHours": 8,
      "attendanceHours": 3,
      "hourValue": 40,
      "hoursFreedPerMonth": 0,
      "monthlyTools": 20,
      "maintenanceHoursPerMonth": 0.75,
      "incrementalCustomersPerMonth": 1,
      "grossProfitPerCustomer": 500,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: 1 incremental attributable customer/month × $500 contribution after delivery costs × 0.5 realization = $250 potential monthly gross profit before workflow tools and maintenance. This is a scenario to test, not an assumed conversion lift. Replace customer count with zero unless baseline and post-adoption evidence support attribution. Tool amounts are planning allowances, not vendor prices.",
    "baseline": "Record eligible visitors, requested results, consented leads, eventual customers, delivery costs, and other marketing changes before launch.",
    "measurement": "Monthly: follow comparable visitor cohorts through to paying customers. Attribute only incremental customers with defensible evidence; replace the scenario with zero when evidence is absent.",
    "limits": "Lead capture is not a sale. No conversion rate, traffic growth, or customer increase is known from this prototype. The $500 is an editable contribution hypothesis, not revenue or a quoted customer value. Do not also count saved capacity, payroll savings, or the same customer profit from another workshop. Capacity alternatives are not cash savings.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "Gross profit per customer is contribution after delivery and incremental selling costs. maintenanceHoursPerMonth adds workflow-level review and upkeep outside those customer costs. Do not subtract the same labor twice. Capacity benefits are excluded from this income basis.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "ai-lead-qualification": {
    "lever": "Explained fit assessment and reviewed routing",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 8,
      "attendanceHours": 3,
      "hourValue": 45,
      "hoursFreedPerMonth": 3,
      "monthlyTools": 20,
      "maintenanceHoursPerMonth": 0.75,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Twelve eligible assessments/month × 15 minutes less manual intake and rubric assembly = 3 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Record intake, scoring, explanation, review, and CRM entry time for twelve assessments.",
    "measurement": "Monthly: compare like-for-like assessments and check disagreements with a human reviewer.",
    "limits": "No improvement in close rate or purchase intent is assumed. Scores require tested rules and periodic review. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "build-your-brand": {
    "lever": "Reusable voice kit and draft templates",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 6,
      "attendanceHours": 3,
      "hourValue": 40,
      "hoursFreedPerMonth": 2,
      "monthlyTools": 10,
      "maintenanceHoursPerMonth": 0.5,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Four copy tasks/month × 30 minutes less repeated brand explanation and template setup = 2 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time four similar email/site/social tasks, including review and corrections.",
    "measurement": "Monthly: compare accepted drafts using the same brand checklist; subtract ongoing kit maintenance.",
    "limits": "No brand-driven sales or conversion lift is assumed. A new business with little recurring copy may gain less. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "company-knowledge-engine": {
    "lever": "Source-linked answers over approved documents",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 20,
      "attendanceHours": 16,
      "hourValue": 50,
      "hoursFreedPerMonth": 6,
      "monthlyTools": 50,
      "maintenanceHoursPerMonth": 2,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Twenty-four eligible questions/month × 15 minutes less document search and answer assembly = 6 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time representative questions; count search, access checks, answer verification, and escalation.",
    "measurement": "Monthly: compare source-linked accepted answers; measure stale results, restricted-data failures, and refresh labor.",
    "limits": "No value assigned to prevented leaks or errors. Access controls, document ownership, and source verification remain required. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "ai-prototype-to-production": {
    "lever": "Reusable evaluations and trace-based diagnosis",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 20,
      "attendanceHours": 16,
      "hourValue": 60,
      "hoursFreedPerMonth": 6,
      "monthlyTools": 60,
      "maintenanceHoursPerMonth": 2,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Four review/diagnosis cycles/month × 1.5 hours less repeated evaluation setup and trace assembly = 6 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Record four comparable regression or incident-review cycles, including setup, diagnosis, and sign-off.",
    "measurement": "Monthly: compare completed evaluation cycles and trace-review time; include false alarms and fixes.",
    "limits": "Avoided incidents and hypothetical outage losses are excluded. Reliability is a measured constraint, not priced certainty. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "ai-client-delivery-system": {
    "lever": "Scoped intake, review, and client handoff pack",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 16,
      "attendanceHours": 16,
      "hourValue": 50,
      "hoursFreedPerMonth": 5,
      "monthlyTools": 30,
      "maintenanceHoursPerMonth": 1.5,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Two client projects/month × 2.5 hours less repeated intake, status drafting, and handoff assembly = 5 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time two similar project scopes; record intake, task planning, reviews, updates, and final file preparation.",
    "measurement": "Monthly: compare accepted handoffs by scope and revision count; keep implementation and client review time visible.",
    "limits": "No extra clients or reduced refunds are assumed. Do not add billable revenue to the same time value. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "ai-business-intelligence-team": {
    "lever": "Checked reporting model and recurring decision brief",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 16,
      "attendanceHours": 16,
      "hourValue": 50,
      "hoursFreedPerMonth": 4,
      "monthlyTools": 25,
      "maintenanceHoursPerMonth": 1,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Four weekly reports/month × 1 hour less repeated data assembly and first-draft explanation = 4 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time four reports with the same metric definitions; include cleaning, verification, and review.",
    "measurement": "Monthly: compare accepted reports; record freshness failures and metric-definition changes.",
    "limits": "No improved business decision outcome is priced. Data quality and ownership may limit adoption. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "build-your-ai-software-factory": {
    "lever": "Bounded ticket-to-tested-draft-PR pipeline",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 24,
      "attendanceHours": 16,
      "hourValue": 60,
      "hoursFreedPerMonth": 8,
      "monthlyTools": 80,
      "maintenanceHoursPerMonth": 3,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Four bounded tickets/month × 2 hours less repeated intake, isolation, and review-packet assembly = 8 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time four comparable ticket-to-PR runs, including failed builds, tests, browser checks, and human review.",
    "measurement": "Monthly: compare accepted draft PRs of similar scope; record retries, compute/model spend, and operator maintenance.",
    "limits": "No autonomous merge, release, headcount reduction, or avoided defect value is assumed. Linear/Vercel/model costs remain separate. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "build-your-first-agentic-workflow": {
    "lever": "One tested request-to-reviewed-result app",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 8,
      "attendanceHours": 8,
      "hourValue": 40,
      "hoursFreedPerMonth": 2,
      "monthlyTools": 15,
      "maintenanceHoursPerMonth": 0.75,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Eight eligible runs/month × 15 minutes less manual extraction and result assembly = 2 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Time eight matching manual jobs; include result checks and missing-input handling.",
    "measurement": "Monthly: compare successful accepted runs; count failed tools, repeat requests, and maintenance time.",
    "limits": "No production certification or automatic external sending is assumed. Preview and provider access remain conditional. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/workshops.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "vibe-coding-gtm": {
    "lever": "Clear website offer and reviewed marketing presence",
    "unit": "gross-profit",
    "assumptions": {
      "fee": "dynamicwebsite",
      "setupHours": 8,
      "attendanceHours": 4,
      "hourValue": 40,
      "hoursFreedPerMonth": 0,
      "monthlyTools": 20,
      "maintenanceHoursPerMonth": 0.75,
      "incrementalCustomersPerMonth": 1,
      "grossProfitPerCustomer": 500,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: 1 incremental attributable customer/month × $500 contribution after delivery costs × 0.5 realization = $250 potential monthly gross profit before workflow tools and maintenance. This is a scenario to test, not an assumed conversion lift. Replace customer count with zero unless baseline and post-adoption evidence support attribution. Tool amounts are planning allowances, not vendor prices.",
    "baseline": "Record qualified site visits, inquiries, won customers, gross contribution, and simultaneous channel or offer changes before the update.",
    "measurement": "Monthly: compare comparable periods and lead sources through to won customers. Account for seasonality and other campaigns; use zero incremental customers unless the attribution is defensible.",
    "limits": "A clearer site is not proof of a sale. No traffic, conversion lift, or customer increase is established by this workshop. The $500 is an editable contribution hypothesis, not revenue or a quoted customer value. Do not also count saved capacity, payroll savings, or the same customer profit from another workshop. Capacity alternatives are not cash savings.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/vibe-gtm-workshop.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "Gross profit per customer is contribution after delivery and incremental selling costs. maintenanceHoursPerMonth adds workflow-level review and upkeep outside those customer costs. Do not subtract the same labor twice. Capacity benefits are excluded from this income basis.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  },
  "build-your-ai-organization": {
    "lever": "Two bounded team workflows and reviewed handoffs",
    "unit": "capacity",
    "assumptions": {
      "fee": null,
      "setupHours": 24,
      "attendanceHours": 16,
      "hourValue": 55,
      "hoursFreedPerMonth": 8,
      "monthlyTools": 60,
      "maintenanceHoursPerMonth": 3,
      "incrementalCustomersPerMonth": 0,
      "grossProfitPerCustomer": 0,
      "realizationFactor": 0.5,
      "rolloutDelayMonths": 1
    },
    "justification": "Illustrative editable hypothesis, not a measured result or benchmark: Two distinct adopted workflows × 4 hours/month less repeated context and handoff assembly = 8 hours. Replace volume and time reduction with your own evidence. Tool amounts are planning allowances, not vendor prices. The task-time reduction must include routine checks and rework. The calculator then applies the editable 0.5 realization factor.",
    "baseline": "Choose two nonoverlapping jobs and measure each team’s total time, review, failures, and handoff effort.",
    "measurement": "Monthly for the first 90 days: compare accepted jobs and adoption, then review quarterly; avoid counting the same handoff twice.",
    "limits": "Two prototypes are not a complete business rollout. No headcount, revenue, or value from all six blueprints is assumed. Freed capacity is not cash savings; it has value only when useful work actually uses the time. Do not count payroll savings, billable revenue, or customer profit again for the same hours.",
    "cadence": "monthly",
    "timingNote": "Attendance hours use the proposed three-hour plan where no duration is published; one-day and two-day inputs assume eight hours/day and must be edited to actual attendance. Setup hours are additional implementation time after class.",
    "sources": [
      "lib/ai-organization-event.js"
    ],
    "adoptionNote": "The 0.5 realization factor is an illustrative planning haircut, not a research benchmark or a success probability. It combines partial adoption and benefit realization; replace it with observed usage and accepted-output evidence. Keep baseline volume before this haircut to avoid discounting adoption twice.",
    "reviewAccounting": "hoursFreedPerMonth is the reduction in total task time after routine output checks and rework. Do not subtract that same task review again. maintenanceHoursPerMonth covers additional recurring source refresh, rule updates, status reconciliation, and operational oversight outside the per-task measurement.",
    "delayNote": "The one-month rollout delay is an editable planning hypothesis. Benefits and ongoing operating costs begin after rollout. Put tool spend incurred during setup into upfrontTools; do not omit pre-rollout charges. Year-one benefit uses only months remaining after the delay."
  }
};
const catalogFees = new Map(UPCOMING_WORKSHOPS.map(workshop => [workshop.slug, workshop.price]));
for (const [slug, scenario] of Object.entries(scenarios)) {
  if (catalogFees.has(slug)) scenario.assumptions.fee = catalogFees.get(slug);
}
const organization = scenarios['build-your-ai-organization'];
organization.assumptions.fee = AI_ORGANIZATION_EVENT.price;
organization.tiers = AI_ORGANIZATION_EVENT.tiers.map(tier => ({
  name: tier.name, fee: tier.price, summary: tier.summary, benefits: [...tier.benefits],
}));
organization.defaultTier = 'Build Pass';
organization.tierNote = 'Select the actual pass. Executive preparation and implementation-review hours are included in that fee; do not add a second consulting charge for those same included hours. Your participation time and additional implementation remain costs. Do not assume Executive support increases the benefit.';
export const ROI_SCENARIOS = scenarios;

export const ROI_GUIDANCE = {
  interpretation: 'These are potential economic scenarios, not guarantees, measured results, cash savings, or tax advice. All default operating values are editable hypotheses.',
  upfront: 'Upfront economic cost = actual admission fee + (attendance hours + additional implementation hours) × your hourly opportunity value + any upfront tool cost.',
  monthly: 'Capacity scenario: hours freed after routine task review × hourly opportunity value × realization factor. Gross-profit scenario: incremental attributable customers × contribution per customer after delivery costs × realization factor. Choose one benefit basis; never add payroll savings, capacity, or revenue to the same customer profit.',
  ongoing: 'Subtract incremental monthly tool/API/credit spend and additional workflow maintenance hours × hourly value. Baseline task-time reductions already include routine output review and rework; do not charge those same minutes twice. Additional source refresh, rule updates, status reconciliation, and administration remain costs. Include pre-rollout tools in upfrontTools.',
  validate: 'Measure a representative manual baseline. Run the workflow at the same quality and scope, including review and rework. Compare accepted outputs and actual usage monthly. Use observed adoption and sustainable frequency; quarterly work can be divided by three and annual work by twelve.',
  payback: 'Economic payback after rollout = upfront economic cost ÷ net monthly potential value. Total months from ticket purchase adds the rollout delay. Year one uses max(0, 12 minus delay) operating months. There is no finite payback when net monthly value is zero or negative. Unknown fees need the actual fee.',
  income: 'Capacity value is not additional income. Income cases are hypothetical incremental gross profit after delivery costs and require evidence of attribution. The editable one-customer and $500 contribution scenarios do not establish a conversion lift.',
  realization: 'Default realization 0.5 and rollout delay one month are illustrative planning assumptions, not benchmarks. Test zero realization and longer delays as downside cases. Apply the haircut once to baseline benefit volume; operating costs remain payable even when adoption is low.',
};

/** Pure calculation. Pass a scenario or assumptions object, and optional numeric overrides.
 * unit may be overridden to gross-profit; that basis excludes capacity benefits.
 * Dynamic fees stay unresolved until a numeric fee is provided by the caller.
 * Null payback means no finite result, never Infinity or a guaranteed return.
 */
export function calculateWorkshopRoi(scenarioOrAssumptions, overrides = {}) {
  if (!scenarioOrAssumptions || typeof scenarioOrAssumptions !== 'object') throw new TypeError('Provide an ROI scenario or assumptions.');
  const assumptions = { ...(scenarioOrAssumptions.assumptions || scenarioOrAssumptions), ...overrides };
  const unit = overrides.unit || scenarioOrAssumptions.unit || 'capacity';
  if (!['capacity', 'gross-profit'].includes(unit)) throw new RangeError('Use capacity or gross-profit.');
  const read = (key, fallback = 0) => {
    const value = assumptions[key] ?? fallback;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new RangeError(key + ' must be a finite nonnegative number.');
    return value;
  };
  const hourValue = read('hourValue');
  const setupHours = read('setupHours');
  const attendanceHours = read('attendanceHours');
  const monthlyTools = read('monthlyTools');
  const maintenanceHours = read('maintenanceHoursPerMonth');
  const hoursFreed = read('hoursFreedPerMonth');
  const customers = read('incrementalCustomersPerMonth');
  const customerProfit = read('grossProfitPerCustomer');
  const upfrontTools = read('upfrontTools');
  const realizationFactor = read('realizationFactor', 0.5);
  if (realizationFactor > 1) throw new RangeError('realizationFactor must be between zero and one.');
  const rolloutDelayMonths = read('rolloutDelayMonths', 1);
  const feeRequired = assumptions.fee == null || assumptions.fee === 'dynamicwebsite';
  const fee = feeRequired ? null : read('fee');
  const implementationCost = setupHours * hourValue;
  const attendanceCost = attendanceHours * hourValue;
  const upfrontCost = feeRequired ? null : fee + implementationCost + attendanceCost + upfrontTools;
  const unadjustedMonthlyValue = unit === 'capacity' ? hoursFreed * hourValue : customers * customerProfit;
  const potentialMonthlyValue = unadjustedMonthlyValue * realizationFactor;
  const monthlyReviewCost = maintenanceHours * hourValue;
  const monthlyOngoingCost = monthlyTools + monthlyReviewCost;
  const netMonthlyValue = potentialMonthlyValue - monthlyOngoingCost;
  const paybackMonths = upfrontCost === null || netMonthlyValue <= 0 ? null : upfrontCost / netMonthlyValue;
  const totalPaybackMonths = paybackMonths === null ? null : rolloutDelayMonths + paybackMonths;
  const yearOneActiveMonths = Math.max(0, 12 - rolloutDelayMonths);
  const yearOneBenefit = potentialMonthlyValue * yearOneActiveMonths;
  const yearOneCost = upfrontCost === null ? null : upfrontCost + monthlyOngoingCost * yearOneActiveMonths;
  const yearOneNetValue = yearOneCost === null ? null : yearOneBenefit - yearOneCost;
  const yearOneRoiPercent = yearOneCost === null || yearOneCost === 0 ? null : yearOneNetValue / yearOneCost * 100;
  return {
    unit, fee, feeRequired, implementationCost, attendanceCost, upfrontCost,
    realizationFactor, rolloutDelayMonths, unadjustedMonthlyValue,
    potentialMonthlyValue, monthlyReviewCost, monthlyOngoingCost, netMonthlyValue,
    netCapacityHours: unit === 'capacity' ? hoursFreed * realizationFactor - maintenanceHours : null,
    paybackMonths, totalPaybackMonths, yearOneActiveMonths, yearOneBenefit, yearOneCost, yearOneNetValue, yearOneRoiPercent,
    valueLabel: unit === 'capacity' ? 'Potential capacity value; not cash savings' : 'Potential incremental gross profit; not revenue',
    status: feeRequired ? 'fee-required' : netMonthlyValue <= 0 ? 'no-finite-payback' : 'potential-payback',
  };
}
