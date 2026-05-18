const test   = require('node:test');
const assert = require('node:assert');

const { prescan_ui_lang, parse_short_length, resolve_output_plan } = require('../cli_core.js');

test('prescan_ui_lang reads the --ui-lang=code form', () => {
  assert.strictEqual(prescan_ui_lang(['node', 'cli.js', '--ui-lang=de']), 'de');
});

test('prescan_ui_lang reads the space-separated --ui-lang and -u forms', () => {
  assert.strictEqual(prescan_ui_lang(['node', 'cli.js', '--ui-lang', 'fr']), 'fr');
  assert.strictEqual(prescan_ui_lang(['node', 'cli.js', '-u', 'ja']), 'ja');
});

test('prescan_ui_lang returns null when no ui-lang flag is present', () => {
  assert.strictEqual(prescan_ui_lang(['node', 'cli.js', '-l']), null);
});

test('prescan_ui_lang does not read a following flag, or a missing value, as the code', () => {
  assert.strictEqual(prescan_ui_lang(['node', 'cli.js', '-u', '-l']), null);
  assert.strictEqual(prescan_ui_lang(['node', 'cli.js', '--ui-lang']), null);
});

test('parse_short_length accepts a positive integer', () => {
  assert.strictEqual(parse_short_length('25'), 25);
  assert.strictEqual(parse_short_length('1'), 1);
});

test('parse_short_length rejects non-positive-integer values', () => {
  assert.throws(() => parse_short_length('0'));
  assert.throws(() => parse_short_length('-3'));
  assert.throws(() => parse_short_length('2.5'));
  assert.throws(() => parse_short_length('abc'));
});

test('resolve_output_plan defaults to the long form when no flag is given', () => {
  const p = resolve_output_plan({ filename: 'CHANGELOG.md' });
  assert.strictEqual(p.long,  true);
  assert.strictEqual(p.short, false);
  assert.strictEqual(p.fn,    'CHANGELOG.md');
  assert.strictEqual(p.fn2,   undefined);
  assert.strictEqual(p.ulen,  10);
});

test('resolve_output_plan honors -l and -s individually', () => {
  const l = resolve_output_plan({ longForm: true });
  assert.deepStrictEqual([l.long, l.short], [true, false]);

  const s = resolve_output_plan({ shortForm: true });
  assert.deepStrictEqual([s.long, s.short], [false, true]);
});

test('resolve_output_plan with -b selects both forms', () => {
  const p = resolve_output_plan({ bothForms: true, filename: 'CHANGELOG.md' });
  assert.strictEqual(p.long,  true);
  assert.strictEqual(p.short, true);
  assert.strictEqual(p.fn2,   'CHANGELOG.long.md');
});

test('resolve_output_plan keeps an explicit -b filename', () => {
  assert.strictEqual(resolve_output_plan({ bothForms: 'HISTORY.md' }).fn2, 'HISTORY.md');
});

test('resolve_output_plan passes short_length through as ulen', () => {
  assert.strictEqual(resolve_output_plan({ shortLength: 25 }).ulen, 25);
});
