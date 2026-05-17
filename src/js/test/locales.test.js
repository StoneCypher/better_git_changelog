const test   = require('node:test');
const assert = require('node:assert');

const { check } = require('../../../scripts/check-locales.js');

test('every shipped locale is complete', () => {
  const report = check();
  assert.deepStrictEqual(report, [],
    'incomplete locales: ' + JSON.stringify(report, null, 2));
});
