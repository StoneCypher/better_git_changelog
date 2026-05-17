const test   = require('node:test');
const assert = require('node:assert');

const { default_formatter, default_separator, convert_to_md, slug } = require('../index.js');

test('default_separator returns the fixed spacer block', () => {
  assert.strictEqual(default_separator({}), '\n\n\n\n\n&nbsp;\n\n&nbsp;\n\n');
});

test('default_formatter renders a tagged commit with an anchor and heading', () => {
  const md = default_formatter({
    tag:         '1.2.0',
    date:        Date.parse('2022-05-22T12:00:00Z'),
    commit_hash: 'abc123',
    author:      'John Haugeland <john@example.com>',
    commit_text: ['First change\n\nSecond change'],
  });

  // slug() rewrites every non-alphanumeric char to '__', so the anchor
  // form of "1.2.0" is "1__2__0" while the heading keeps the raw tag.
  assert.match(md, /<a name="1__2__0" \/>/);
  assert.match(md, /## \[1\.2\.0\]/);
  assert.match(md, /Commit \[abc123\]/);
  assert.match(md, /Author: `John Haugeland/);
  assert.match(md, /  \* First change/);
  assert.match(md, /  \* Second change/);
});

test('default_formatter labels an untagged commit and omits the anchor', () => {
  const md = default_formatter({
    commit_hash: 'def456',
    author:      'A',
    commit_text: ['msg'],
  });

  assert.match(md, /## \[Untagged\]/);
  assert.doesNotMatch(md, /<a name=/);
});

test('default_formatter lists merge parents for a merge commit', () => {
  const md = default_formatter({
    commit_hash: 'fff000',
    author:      'A',
    merge:       ['aaa', 'bbb'],
    commit_text: ['merge msg'],
  });

  assert.match(md, /Merges \[aaa, bbb\]/);
});

function sampleData() {
  return {
    reflog: [
      { commit_hash: 'a'.repeat(40), author: 'A', date: 0, commit_text: ['one'] },
      { commit_hash: 'b'.repeat(40), author: 'B', date: 0, commit_text: ['two'] },
    ],
    tag_list:   ['1.0.0', '1.1.0'],
    tag_hashes: new Map(),
  };
}

test('convert_to_md emits the default preface, counts, and tag index', () => {
  const md = convert_to_md({ data: sampleData() });

  assert.ok(md.startsWith('# Changelog'));
  assert.match(md, /2 merges/);
  assert.match(md, /2 releases/);
  assert.match(md, /Published tags:/);
  assert.match(md, /  \* one/);
  assert.match(md, /  \* two/);
});

test('slug preserves non-ASCII letters and digits', () => {
  assert.strictEqual(slug('versión-2'), 'versión-2');
  assert.strictEqual(slug('リリース'), 'リリース');
  assert.strictEqual(slug('v1.0/beta'), 'v1__0__beta');
  assert.strictEqual(slug('build-١٢'), 'build-١٢');   // Arabic-Indic digits survive
});

test('convert_to_md in short form truncates to short_length commits', () => {
  const md = convert_to_md({ data: sampleData(), short: true, short_length: 1 });

  assert.match(md, /Changlogging the last 1 commits/);
  assert.match(md, /  \* one/);
  assert.doesNotMatch(md, /  \* two/);
});
