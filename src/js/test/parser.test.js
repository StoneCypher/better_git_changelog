const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('node:fs');
const path   = require('node:path');

const { parse_rl } = require('../index.js');

// Mirror get_reflog_data(): git log output is LF-only, but the checked-out
// fixture may be CRLF on Windows, and the grammar accepts only '\n'. The
// trailing '\n\n' is required because the grammar's CommitTextRow needs a
// terminating newline on the final commit.
const fixture = fs.readFileSync(path.join(__dirname, 'example_data.txt'), 'utf8')
  .replace(/\r\n/g, '\n')
  .trim() + '\n\n';
const reflog  = parse_rl(fixture);

test('parse_rl returns an array with every commit in the fixture', () => {
  assert.ok(Array.isArray(reflog));
  assert.strictEqual(reflog.length, 441);
});

test('each parsed entry has the documented shape', () => {
  for (const entry of reflog) {
    assert.match(entry.commit_hash, /^[a-fA-F0-9]{40}$/);
    assert.strictEqual(typeof entry.author, 'string');
    assert.strictEqual(typeof entry.date, 'number');
    assert.ok(Array.isArray(entry.commit_text));
  }
});

test('the top fixture commit is a merge and exposes its parent hashes', () => {
  const top = reflog[0];
  assert.strictEqual(top.commit_hash, '6a6f1c8a256f2f943c3230ec32dd32d2c2344927');
  assert.deepStrictEqual(top.merge, ['e084bf4', 'f0f3961']);
});

test('non-merge commits omit the merge property entirely', () => {
  const plain = reflog.find(e => e.merge === undefined);
  assert.ok(plain, 'expected at least one non-merge commit');
  assert.strictEqual('merge' in plain, false);
});

test('exactly the fixture\'s 92 merge commits carry a merge array', () => {
  const merges = reflog.filter(e => e.merge !== undefined);
  assert.strictEqual(merges.length, 92);
});

test('parse_rl handles an octopus merge (three or more parents)', () => {
  const octopus =
    'commit 1111111111111111111111111111111111111111\n' +
    'Merge: aaaaaaa bbbbbbb ccccccc\n' +
    'Author: A <a@example.com>\n' +
    'Date:   Sun May 18 12:00:00 2026 -0700\n' +
    '\n' +
    '    octopus merge\n' +
    '\n';
  let parsed;
  assert.doesNotThrow(() => { parsed = parse_rl(octopus); });
  assert.strictEqual(parsed.length, 1);
  assert.deepStrictEqual(parsed[0].merge, ['aaaaaaa', 'bbbbbbb', 'ccccccc']);
});

// Regression: this is the exact input shape that failed in
// better_git_changelog@1.6.3, reported on 2026-05-22 from the issue_tree
// project after the user ran `git stash push -u`. A stash-with-untracked
// creates a three-parent merge commit (tip-of-HEAD, index tree, untracked
// tree) which the pre-fix MergeRow rejected, having accepted exactly two
// parent hashes. Fixed in e23fbdc, first released in 1.6.6.
test('parse_rl handles a 3-parent stash-with-untracked commit (bug-report shape)', () => {
  const stashed =
    'commit 222c2b61bfa58ee82b1d5e2f525cfab3b45bd325\n' +
    'Merge: 232e461 beef2bb e979fe1\n' +
    'Author: John Haugeland <stonecypher@gmail.com>\n' +
    'Date:   Fri May 22 01:51:14 2026 -0700\n' +
    '\n' +
    '    WIP on main: 232e461 add a\n' +
    '\n';
  const parsed = parse_rl(stashed);
  assert.strictEqual(parsed.length, 1);
  assert.deepStrictEqual(parsed[0].merge, ['232e461', 'beef2bb', 'e979fe1']);
});

// Regression for issue #30 (reported 2026-05-23 against 1.6.16): git's
// auto-abbrev grows the short-hash length past 7 once a repository's
// object set requires more characters for unique-prefix disambiguation.
// The pre-fix ShortHash production accepted exactly 7 hex chars and
// threw on the 8th. Grammar widened to `Hex Hex Hex Hex Hex*` (4+).
test('parse_rl handles short hashes longer than 7 chars (auto-abbrev grew)', () => {
  const widened =
    'commit 2222222222222222222222222222222222222222\n' +
    'Merge: b0eda7bf c1f2e3d4\n' +
    'Author: A <a@example.com>\n' +
    'Date:   Sat May 23 09:00:00 2026 -0700\n' +
    '\n' +
    '    merge with 8-char short hashes\n' +
    '\n';
  const parsed = parse_rl(widened);
  assert.strictEqual(parsed.length, 1);
  assert.deepStrictEqual(parsed[0].merge, ['b0eda7bf', 'c1f2e3d4']);
});

// Cover the documented minimum (--abbrev=4) and a longer auto-abbrev value,
// to lock the new range explicitly rather than leaving "7 vs 8" as the only
// known boundary.
test('parse_rl handles short hashes from 4 to 12 characters', () => {
  const sample =
    'commit 3333333333333333333333333333333333333333\n' +
    'Merge: abcd 12345 abcdef0 0123456789ab\n' +
    'Author: A <a@example.com>\n' +
    'Date:   Sat May 23 09:00:00 2026 -0700\n' +
    '\n' +
    '    mixed short-hash lengths\n' +
    '\n';
  const parsed = parse_rl(sample);
  assert.strictEqual(parsed.length, 1);
  assert.deepStrictEqual(parsed[0].merge, ['abcd', '12345', 'abcdef0', '0123456789ab']);
});
