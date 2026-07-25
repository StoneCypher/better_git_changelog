const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('node:fs');
const os     = require('node:os');
const path   = require('node:path');

const api = require('../index.js');

function tempPath(label, ext) {
  return path.join(os.tmpdir(), `bgc-${label}-${process.pid}-${Date.now()}.${ext}`);
}

test('get_tag_list returns an array of non-empty strings', () => {
  const tags = api.get_tag_list();
  assert.ok(Array.isArray(tags));
  for (const t of tags) {
    assert.strictEqual(typeof t, 'string');
    assert.ok(t.length > 0);
  }
});

test('get_reflog_data returns a non-empty string', () => {
  const data = api.get_reflog_data();
  assert.strictEqual(typeof data, 'string');
  assert.ok(data.length > 0);
});

test('scan returns the documented shape', () => {
  const result = api.scan();
  assert.ok(Array.isArray(result.tag_list));
  assert.ok(result.tag_hashes instanceof Map);
  assert.ok(Array.isArray(result.reflog));
  assert.ok(Array.isArray(result.not_found));
  assert.ok(result.repo_url === null || typeof result.repo_url === 'string');
});

test('tag_to_hash resolves a real tag to a 40-char hash, when tags exist', () => {
  const tags = api.get_tag_list();
  if (tags.length === 0) { return; } // fresh clone with no tags
  assert.match(api.tag_to_hash(tags[0]), /^[a-fA-F0-9]{40}$/);
});

test('tag_to_hash does not let a tag name reach the shell', () => {
  // With execFileSync the whole string is a single git argument (an unknown
  // ref), so git fails and execFileSync throws. The old shell form would have
  // run the trailing `; echo ...` and returned its output instead of throwing.
  assert.throws(() => api.tag_to_hash('no-such-ref; echo shell-injection'));
});

test('tags_to_hashes maps every distinct tag to a hash', () => {
  const tags   = api.get_tag_list();
  const hashes = api.tags_to_hashes(tags);
  assert.ok(hashes instanceof Map);
  assert.strictEqual(hashes.size, new Set(tags).size);
});

test('get_reflog_data survives a reflog larger than node\'s default 1 MiB buffer', () => {

  // Regression: get_reflog_data used execSync's default maxBuffer, so once a
  // repository's `git log --reflog` output crossed 1 MiB node killed git with
  // SIGTERM and threw ENOBUFS -- turning "your project got big" into a hard
  // changelog failure. jssm hit this at ~7,000 commits.
  //
  // Rather than build thousands of commits, one commit carries an oversized
  // message: the failure depends on total output bytes, not commit count, so
  // this reproduces the exact condition in well under a second.

  const child = require('node:child_process');
  const repo  = fs.mkdtempSync(path.join(os.tmpdir(), 'bgc-bigreflog-'));
  const cwd   = process.cwd();

  const git = (...args) => child.execFileSync('git', args, { cwd: repo, stdio: 'pipe' });

  try {

    git('init', '--quiet');
    git('config', 'user.email', 'test@example.invalid');
    git('config', 'user.name',  'Buffer Test');
    git('config', 'commit.gpgsign', 'false');

    const message_path = path.join(repo, 'message.txt');
    fs.writeFileSync(message_path, 'x'.repeat(1200 * 1024));      // > 1 MiB on its own
    git('commit', '--allow-empty', '--quiet', '-F', message_path);

    process.chdir(repo);
    const data = api.get_reflog_data();

    assert.ok(data.length > 1024 * 1024,
      `expected over 1 MiB of reflog text, got ${data.length} bytes`);

  } finally {
    process.chdir(cwd);
    fs.rmSync(repo, { recursive: true, force: true });
  }

});

test('GIT_MAX_BUFFER is finite, so a pathological repository still fails loudly', () => {
  assert.strictEqual(typeof api.GIT_MAX_BUFFER, 'number');
  assert.ok(api.GIT_MAX_BUFFER > 1024 * 1024, 'must exceed the default it exists to replace');
  assert.ok(Number.isFinite(api.GIT_MAX_BUFFER), 'an infinite cap would trade ENOBUFS for OOM');
});

test('write_long_md writes a non-empty changelog file', () => {
  const target = tempPath('long', 'md');
  try {
    api.write_long_md(target);
    assert.ok(fs.readFileSync(target, 'utf8').startsWith('# Changelog'));
  } finally {
    fs.rmSync(target, { force: true });
  }
});

test('write_short_md writes a truncated changelog file', () => {
  const target = tempPath('short', 'md');
  try {
    api.write_short_md(target, false, 3);
    const out = fs.readFileSync(target, 'utf8');
    assert.ok(out.startsWith('# Changelog'));
    assert.match(out, /Changelogging the last 3 commits/);
  } finally {
    fs.rmSync(target, { force: true });
  }
});

test('the CLI rejects a non-numeric --short-length instead of emptying the changelog', () => {
  const child = require('node:child_process');
  const cli   = path.join(__dirname, '..', 'cli.js');
  const r     = child.spawnSync('node', [cli, '-S', 'abc'], { encoding: 'utf8' });
  assert.notStrictEqual(r.status, 0);   // exits non-zero rather than silently succeeding
});

test('convert_to_json writes parseable JSON', () => {
  const target = tempPath('json', 'json');
  try {
    api.convert_to_json({ target, data: api.scan() });
    const parsed = JSON.parse(fs.readFileSync(target, 'utf8'));
    assert.ok(Array.isArray(parsed.reflog));
  } finally {
    fs.rmSync(target, { force: true });
  }
});
