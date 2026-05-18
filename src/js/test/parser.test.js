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
