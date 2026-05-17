const test   = require('node:test');
const assert = require('node:assert');

const i18n = require('../i18n.js');

test('make_translator looks up a key in the requested locale', () => {
  const tr = i18n.make_translator('fr');
  assert.strictEqual(tr.code, 'fr');
  assert.strictEqual(tr.t('ui', 'greet'), 'Bonjour');
});

test('a missing key falls back to the English string', () => {
  const tr = i18n.make_translator('fr');
  assert.strictEqual(tr.t('ui', 'missingInFr'), 'only in english');
});

test('an unknown key returns the namespaced key name', () => {
  const tr = i18n.make_translator('en');
  assert.strictEqual(tr.t('ui', 'nope'), 'ui.nope');
});

test('interpolation substitutes named placeholders', () => {
  assert.strictEqual(i18n.interpolate('hi {name}', { name: 'Sam' }), 'hi Sam');
});

test('interpolate leaves unmatched placeholders intact', () => {
  assert.strictEqual(i18n.interpolate('{x} {y}', { x: 'a' }), 'a {y}');
});

test('plural selection picks the correct form', () => {
  const tr = i18n.make_translator('en');
  assert.strictEqual(tr.t('changelog', 'merges', { n: 1 }), '1 merge');
  assert.strictEqual(tr.t('changelog', 'merges', { n: 5 }), '5 merges');
});

test('resolve_code maps a regional code to its base language', () => {
  assert.strictEqual(i18n.resolve_code('pt-BR'), 'pt');
  assert.strictEqual(i18n.resolve_code('fr_FR'), 'fr');
  assert.strictEqual(i18n.resolve_code('xx'), null);
});

test('an unsupported requested locale resolves to English and reports itself', () => {
  const tr = i18n.make_translator('xx');
  assert.strictEqual(tr.code, 'en');
  assert.strictEqual(tr.unsupported, 'xx');
});

test('detect_ui_locale prefers the flag, then env, then OS', () => {
  assert.strictEqual(i18n.detect_ui_locale('de', {}), 'de');
  assert.strictEqual(i18n.detect_ui_locale(null, { LANG: 'es_ES.UTF-8' }), 'es-ES');
  assert.strictEqual(typeof i18n.detect_ui_locale(null, {}), 'string');
});

test('Intl helpers format dates and numbers for the locale', () => {
  const tr = i18n.make_translator('en');
  assert.strictEqual(typeof tr.date(new Date(0)), 'string');
  assert.strictEqual(typeof tr.number(1234), 'string');
});
