const test   = require('node:test');
const assert = require('node:assert');

const translate = require('../translate.js');
const i18n      = require('../i18n.js');

const t = i18n.make_translator('en').t;

// Fake runner: echoes the stdin payload straight back.
const echo_runner = (file, args, input) => input;

test('resolve_argv expands the claude preset to a program + args array', () => {
  const argv = translate.resolve_argv('claude', 'fr');
  assert.strictEqual(argv[0], 'claude');
  assert.ok(argv.join(' ').includes('fr'));
});

test('resolve_argv treats a non-preset value as the program name', () => {
  assert.deepStrictEqual(translate.resolve_argv('mytool', 'fr'), ['mytool', 'fr']);
});

test('translate_blocks round-trips through an echoing runner', () => {
  const blocks = ['first commit', 'second commit'];
  const out = translate.translate_blocks(blocks, 'fr', 'mytool', t, echo_runner);
  assert.deepStrictEqual(out, blocks);
});

test('translate_blocks throws a localized error when the program is missing', () => {
  const enoent = () => { const e = new Error('nope'); e.code = 'ENOENT'; throw e; };
  assert.throws(
    () => translate.translate_blocks(['x'], 'fr', 'mytool', t, enoent),
    /Translator command not found/
  );
});

test('translate_blocks throws when the section count is wrong', () => {
  const drop = () => 'only one section';
  assert.throws(
    () => translate.translate_blocks(['a', 'b'], 'fr', 'mytool', t, drop),
    /Translator command failed/
  );
});

test('translate_reflog replaces each commit_text with its translation', () => {
  const reflog = [
    { commit_hash: 'a', commit_text: ['one'] },
    { commit_hash: 'b', commit_text: ['two'] }
  ];
  translate.translate_reflog(reflog, 'fr', 'mytool', t, echo_runner);
  assert.deepStrictEqual(reflog[0].commit_text, ['one']);
  assert.deepStrictEqual(reflog[1].commit_text, ['two']);
});
