import test from 'node:test';
import assert from 'node:assert/strict';
import { UPCOMING_WORKSHOPS } from '../lib/workshops.js';
import { AI_ORGANIZATION_EVENT } from '../lib/ai-organization-event.js';
import { workshopPrice } from '../lib/vibe-gtm-workshop.js';
import { ROI_SCENARIOS, ROI_GUIDANCE, calculateWorkshopRoi } from '../lib/workshop-roi.js';

test('all 18 paid workshops have source-priced, specific, editable hypotheses', () => {
  const expected = [...UPCOMING_WORKSHOPS.map(w => w.slug), 'vibe-coding-gtm', 'build-your-ai-organization'];
  assert.deepEqual(Object.keys(ROI_SCENARIOS).sort(), expected.sort());
  for (const workshop of UPCOMING_WORKSHOPS) assert.equal(ROI_SCENARIOS[workshop.slug].assumptions.fee, workshop.price);
  assert.equal(new Set(Object.values(ROI_SCENARIOS).map(s => s.lever)).size, 18);
  for (const scenario of Object.values(ROI_SCENARIOS)) {
    assert.match(scenario.justification, /Illustrative editable hypothesis/);
    for (const key of ['baseline','measurement','limits','timingNote']) assert.ok(scenario[key].length > 40);
    assert.match(scenario.limits, /not cash savings/);
    const result = calculateWorkshopRoi(scenario, { fee: typeof scenario.assumptions.fee === 'number' ? scenario.assumptions.fee : 499 });
    const a = scenario.assumptions;
    assert.equal(result.upfrontCost, result.fee + (a.setupHours + a.attendanceHours) * a.hourValue);
    assert.equal(result.potentialMonthlyValue, (scenario.unit === 'capacity' ? a.hoursFreedPerMonth * a.hourValue : a.incrementalCustomersPerMonth * a.grossProfitPerCustomer) * a.realizationFactor);
    assert.equal(result.monthlyOngoingCost, a.monthlyTools + a.maintenanceHoursPerMonth * a.hourValue);
    assert.equal(result.yearOneActiveMonths, 11);
    assert.equal(result.yearOneNetValue, result.netMonthlyValue * 11 - result.upfrontCost);
  }
  assert.match(ROI_GUIDANCE.validate, /accepted outputs/);
});

test('email scenario includes admission, attendance, implementation, tools and review', () => {
  const r = calculateWorkshopRoi(ROI_SCENARIOS['your-first-agent']);
  assert.equal(r.upfrontCost, 544);
  assert.equal(r.potentialMonthlyValue, 26.25);
  assert.equal(r.monthlyOngoingCost, 27.5);
  assert.equal(r.netMonthlyValue, -1.25);
  assert.equal(r.paybackMonths, null);
  assert.equal(r.totalPaybackMonths, null);
  assert.equal(r.yearOneNetValue, -557.75);
});

test('dynamic website fee requires the runtime price and respects promotion changes', () => {
  const s = ROI_SCENARIOS['vibe-coding-gtm'];
  assert.equal(s.assumptions.fee, 'dynamicwebsite');
  const unresolved = calculateWorkshopRoi(s);
  assert.equal(unresolved.feeRequired, true);
  assert.equal(unresolved.upfrontCost, null);
  assert.equal(unresolved.paybackMonths, null);
  assert.equal(unresolved.yearOneNetValue, null);
  const before = workshopPrice(new Date('2026-10-07T12:00:00-07:00')).amount;
  const after = workshopPrice(new Date('2026-10-09T12:00:00-07:00')).amount;
  assert.equal(calculateWorkshopRoi(s, { fee: before }).upfrontCost, before + 480);
  assert.equal(calculateWorkshopRoi(s, { fee: after }).upfrontCost, after + 480);
});

test('organization tier prices and included entitlements match source exactly', () => {
  const s = ROI_SCENARIOS['build-your-ai-organization'];
  assert.equal(s.defaultTier, 'Build Pass');
  for (const [i,tier] of s.tiers.entries()) {
    assert.equal(tier.name, AI_ORGANIZATION_EVENT.tiers[i].name);
    assert.equal(tier.fee, AI_ORGANIZATION_EVENT.tiers[i].price);
    assert.deepEqual(tier.benefits, AI_ORGANIZATION_EVENT.tiers[i].benefits);
    const r = calculateWorkshopRoi(s, { fee: tier.fee });
    assert.equal(r.upfrontCost, tier.fee + 2200);
    assert.equal(r.netMonthlyValue, -5);
    assert.equal(r.paybackMonths, null);
  }
  assert.equal(s.tiers[0].fee, 2499);
  assert.equal(s.tiers[1].fee, 9999);
});

test('zero and negative net benefit have no finite payback', () => {
  for (const tools of [100, 101]) {
    const r = calculateWorkshopRoi({ fee: 100, hourValue: 50, hoursFreedPerMonth: 2, monthlyTools: tools });
    assert.equal(r.paybackMonths, null);
    assert.equal(r.status, 'no-finite-payback');
  }
});

test('income alternative counts gross profit only, without capacity double counting', () => {
  const s = ROI_SCENARIOS['your-first-agent'];
  const r = calculateWorkshopRoi(s, { unit: 'gross-profit', incrementalCustomersPerMonth: .5, grossProfitPerCustomer: 200, hoursFreedPerMonth: 100 });
  assert.equal(r.potentialMonthlyValue, 50);
  assert.equal(r.netMonthlyValue, 22.5);
  assert.equal(r.netCapacityHours, null);
  assert.match(r.valueLabel, /not revenue/);
  const capacity = calculateWorkshopRoi(s, { incrementalCustomersPerMonth: 100, grossProfitPerCustomer: 1000 });
  assert.equal(capacity.potentialMonthlyValue, 26.25);
});

test('calculation is pure, validates numeric inputs, and handles zero upfront cost', () => {
  const s = structuredClone(ROI_SCENARIOS['your-first-agent']);
  const before = structuredClone(s);
  calculateWorkshopRoi(s, { monthlyTools: 0 });
  assert.deepEqual(s, before);
  for (const value of [-1, Infinity, NaN, '50']) assert.throws(() => calculateWorkshopRoi(s, { hourValue: value }), RangeError);
  assert.throws(() => calculateWorkshopRoi(s, { fee: 'unknown-vendor-price' }), RangeError);
  assert.throws(() => calculateWorkshopRoi(s, { unit: 'revenue' }), RangeError);
  const r = calculateWorkshopRoi({ fee: 0, hourValue: 10, hoursFreedPerMonth: 1 });
  assert.equal(r.paybackMonths, 0);
  assert.equal(r.yearOneRoiPercent, null);
});


test('sales, lead magnet and website defaults use hypothetical contribution, not conversion lift', () => {
  for (const slug of ['ai-sales-gtm-team', 'ai-lead-magnets', 'vibe-coding-gtm']) {
    const s = ROI_SCENARIOS[slug];
    assert.equal(s.unit, 'gross-profit');
    assert.equal(s.assumptions.incrementalCustomersPerMonth, 1);
    assert.equal(s.assumptions.grossProfitPerCustomer, 500);
    const r = calculateWorkshopRoi(s, { fee: 499 });
    assert.equal(r.unadjustedMonthlyValue, 500);
    assert.equal(r.potentialMonthlyValue, 250);
    assert.ok(r.netMonthlyValue > 0);
    assert.ok(r.paybackMonths > 0);
    assert.equal(r.totalPaybackMonths, r.paybackMonths + 1);
  }
  assert.equal(ROI_SCENARIOS['agentic-lead-generation'].unit, 'capacity');
  assert.equal(ROI_SCENARIOS['ai-customer-support-team'].assumptions.hoursFreedPerMonth, 3);
});

test('zero adoption removes benefit while ongoing costs remain payable', () => {
  for (const unit of ['capacity','gross-profit']) {
    const r = calculateWorkshopRoi(ROI_SCENARIOS['ai-sales-gtm-team'], { unit, realizationFactor: 0 });
    assert.equal(r.potentialMonthlyValue, 0);
    assert.equal(r.netMonthlyValue, -r.monthlyOngoingCost);
    assert.equal(r.paybackMonths, null);
    assert.equal(r.totalPaybackMonths, null);
  }
  for (const value of [-.1, 1.1, Infinity, NaN, '0.5']) assert.throws(() => calculateWorkshopRoi(ROI_SCENARIOS['your-first-agent'], {realizationFactor: value}), RangeError);
});

test('rollout delay separates operating payback from time since purchase and limits year one', () => {
  const base = {unit:'capacity', fee:100, setupHours:1, attendanceHours:1, hourValue:50, hoursFreedPerMonth:4, monthlyTools:10, maintenanceHoursPerMonth:1, realizationFactor:.5, rolloutDelayMonths:1};
  const r = calculateWorkshopRoi(base);
  assert.equal(r.upfrontCost, 200);
  assert.equal(r.netMonthlyValue, 40);
  assert.equal(r.paybackMonths, 5);
  assert.equal(r.totalPaybackMonths, 6);
  assert.equal(r.yearOneActiveMonths, 11);
  assert.equal(r.yearOneBenefit, 1100);
  assert.equal(r.yearOneCost, 860);
  assert.equal(r.yearOneNetValue, 240);
  const immediate = calculateWorkshopRoi(base, {rolloutDelayMonths:0});
  assert.equal(immediate.yearOneActiveMonths, 12);
  assert.equal(immediate.totalPaybackMonths, 5);
  const late = calculateWorkshopRoi(base, {rolloutDelayMonths:13});
  assert.equal(late.yearOneActiveMonths, 0);
  assert.equal(late.yearOneBenefit, 0);
  assert.equal(late.yearOneNetValue, -200);
  assert.throws(() => calculateWorkshopRoi(base, {rolloutDelayMonths:-1}), RangeError);
});

test('task review is in measured hours; extra maintenance is charged once and not adoption-discounted', () => {
  const s = ROI_SCENARIOS['ai-customer-support-team'];
  const r = calculateWorkshopRoi(s);
  assert.match(s.justification, /3 net minutes/);
  assert.match(s.reviewAccounting, /Do not subtract that same task review again/);
  assert.equal(r.unadjustedMonthlyValue, 120);
  assert.equal(r.potentialMonthlyValue, 60);
  assert.equal(r.monthlyReviewCost, 80);
  assert.equal(r.netCapacityHours, -.5);
  assert.equal(r.monthlyOngoingCost, 115);
  assert.equal(r.netMonthlyValue, -55);
});
