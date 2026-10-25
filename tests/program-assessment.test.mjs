import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProgramAnswers, guidedProgramMatch, validateProgramMatch, eligiblePrograms } from '../lib/program-assessment.js';
const answers = { experience: 'regular', stage: 'idea', goal: 'build', context: '' };
test('invalid and excessive profiles are rejected before model use', () => {
  assert.equal(validateProgramAnswers(answers), null);
  for (const value of [null, [], {}, {...answers, experience: 'fake'}, {...answers, context: 'x'.repeat(401)}]) assert.ok(validateProgramAnswers(value));
});
test('matches immediate goals without forcing experienced people through basics', () => {
  for (const [goal, stage, expected] of [['tools','exploring','day-zero'],['build','idea','the-first-build'],['launch','prototype','zero-to-launch'],['grow','live','growth-loops']]) assert.equal(guidedProgramMatch({...answers,goal,stage}).program,expected);
  assert.equal(guidedProgramMatch({...answers,experience:'new'}).program,'the-first-build');
  assert.ok(guidedProgramMatch({...answers,experience:'new'}).foundation);
});
test('growth requires a live product in fallback and model validation', () => {
  assert.ok(!eligiblePrograms(answers).includes('growth-loops'));
  assert.equal(guidedProgramMatch({...answers,goal:'grow'}).program,'the-first-build');
  assert.throws(() => validateProgramMatch({program:'growth-loops',reason:'Grow.',prepare:'Bring your product.'}, answers));
});
test('unknown programs and malformed model output cannot become recommendations', () => {
  const result = {program:'the-first-build',reason:' Build a product. ',prepare:' Bring a laptop. '};
  assert.equal(validateProgramMatch(result,answers).reason,'Build a product.');
  for (const output of [{...result,program:'invented'},{...result,reason:''},{...result,prepare:'x'.repeat(251)}]) assert.throws(() => validateProgramMatch(output,answers));
});
