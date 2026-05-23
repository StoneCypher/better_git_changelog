const test   = require('node:test');
const assert = require('node:assert');
const fc     = require('fast-check');

const { parse_rl } = require('../../index.js');



/**
 * Property-based tests for the reflog parser.
 *
 * The example-based suite in ../parser.test.js asserts behavior on a single
 * captured `git log --reflog` fixture. That style depends on the fixture
 * containing the shapes worth testing — the octopus-merge bug (May 2026) is
 * the canonical proof it does not. These tests instead generate plausible
 * reflog inputs at runtime and assert structural invariants that must hold
 * for every well-formed input the parser is expected to accept.
 */



// fast-check defaults to 100 runs per property — fast for local iteration,
// thin for the kind of input-space exploration this suite exists to do. In
// CI we have slack budget and want bugs that hide in 1-in-N input shapes to
// fail more often than never. GitHub Actions sets process.env.CI to 'true'
// automatically, so the higher count kicks in only when the suite runs there.
fc.configureGlobal({
  numRuns: process.env.CI ? 1000 : 100
});



// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

// fast-check 4.x removed `hexaString`; build it from `string` + unit.
const hexChar = fc.constantFrom(
  '0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'
);

const shortHash = fc.string({ unit: hexChar, minLength: 7,  maxLength: 7  });
const fullHash  = fc.string({ unit: hexChar, minLength: 40, maxLength: 40 });

// Any single-line string. Production `git log` is LF-only; the fixture
// loader normalizes CR via .replace(/\r\n/g, '\n'), so we likewise strip
// CR/LF from generated single-line fields rather than rejecting them.
const lineText = fc.string().map(s => s.replace(/[\r\n]/g, ' '));

// A date string the grammar's `new Date(s).getTime()` returns a finite
// number for. ISO 8601 is always parseable in V8.
const parseableDate = fc.date({
  min:            new Date('1990-01-01T00:00:00Z'),
  max:            new Date('2100-01-01T00:00:00Z'),
  noInvalidDate:  true
}).map(d => d.toISOString());

// A merge commit has 2 or more parents. The bug surface starts at 3.
const mergeParents = fc.array(shortHash, { minLength: 2, maxLength: 6 });

// One body paragraph: a run of zero or more text lines.
const paragraph = fc.array(lineText, { minLength: 0, maxLength: 4 });

// Body: zero or more paragraphs, blank-line separated on render.
const body = fc.array(paragraph, { minLength: 0, maxLength: 3 });

const commit = fc.record({
  hash:    fullHash,
  parents: fc.option(mergeParents, { nil: undefined }),
  author:  lineText,
  date:    parseableDate,
  body:    body
});

const reflog = fc.array(commit, { minLength: 1, maxLength: 8 });



// ---------------------------------------------------------------------------
// Renderer: structured commit list -> raw reflog text the parser accepts.
//
// Mirrors `git --no-pager log` output, plus the `.trim() + '\n\n'` framing
// applied by get_reflog_data() before handing the text to the parser.
// ---------------------------------------------------------------------------

function renderCommit({ hash, parents, author, date, body }) {

  const headers =
    `commit ${hash}\n` +
    (parents ? `Merge: ${parents.join(' ')}\n` : '') +
    `Author: ${author}\n` +
    `Date:   ${date}\n` +
    `\n`;

  const renderedBody = body
    .map(para => para.map(line => '    ' + line).join('\n'))
    .filter(s => s.length > 0)
    .join('\n\n');

  return headers + (renderedBody.length ? renderedBody + '\n' : '');

}

function renderReflog(commits) {
  return commits.map(renderCommit).join('\n').trim() + '\n\n';
}



// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

test('parse_rl never throws on any well-formed reflog', () => {
  fc.assert(fc.property(reflog, commits => {
    parse_rl(renderReflog(commits));
  }));
});


test('parse_rl preserves the commit count', () => {
  fc.assert(fc.property(reflog, commits => {
    const parsed = parse_rl(renderReflog(commits));
    assert.strictEqual(parsed.length, commits.length);
  }));
});


test('parse_rl preserves commit hashes in order', () => {
  fc.assert(fc.property(reflog, commits => {
    const parsed = parse_rl(renderReflog(commits));
    assert.deepStrictEqual(
      parsed.map(p => p.commit_hash),
      commits.map(c => c.hash)
    );
  }));
});


test('parse_rl preserves the parent list of every merge commit', () => {
  fc.assert(fc.property(reflog, commits => {
    const parsed = parse_rl(renderReflog(commits));
    parsed.forEach((p, i) => {
      if (commits[i].parents) {
        assert.deepStrictEqual(p.merge, commits[i].parents);
      }
    });
  }));
});


test('parse_rl omits the merge property for non-merge commits', () => {
  fc.assert(fc.property(reflog, commits => {
    const parsed = parse_rl(renderReflog(commits));
    parsed.forEach((p, i) => {
      if (!commits[i].parents) {
        assert.strictEqual('merge' in p, false);
      }
    });
  }));
});


test('parse_rl returns a finite millisecond timestamp for every commit', () => {
  fc.assert(fc.property(reflog, commits => {
    const parsed = parse_rl(renderReflog(commits));
    parsed.forEach(p => {
      assert.ok(Number.isFinite(p.date));
    });
  }));
});


test('parse_rl preserves author lines verbatim', () => {
  fc.assert(fc.property(reflog, commits => {
    const parsed = parse_rl(renderReflog(commits));
    parsed.forEach((p, i) => {
      assert.strictEqual(p.author, commits[i].author);
    });
  }));
});


// Focused regression: bias generation toward the parent-count dimension so a
// hard-coded parent count fails fast and shrinks to a minimal counter-example.
test('parse_rl handles merges with two through twelve parents', () => {

  const widerMergeCommit = fc.record({
    hash:    fullHash,
    parents: fc.integer({ min: 2, max: 12 })
              .chain(n => fc.array(shortHash, { minLength: n, maxLength: n })),
    author:  lineText,
    date:    parseableDate,
    body:    body
  });

  fc.assert(fc.property(widerMergeCommit, c => {
    const parsed = parse_rl(renderReflog([c]));
    assert.strictEqual(parsed.length, 1);
    assert.deepStrictEqual(parsed[0].merge, c.parents);
  }));

});
