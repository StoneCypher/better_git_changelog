const test   = require('node:test');
const assert = require('node:assert');

const { remote_to_web_url, get_remote_url } = require('../index.js');

test('remote_to_web_url converts an SSH (scp-style) remote', () => {
  assert.strictEqual(
    remote_to_web_url('git@github.com:StoneCypher/better_git_changelog.git'),
    'https://github.com/StoneCypher/better_git_changelog'
  );
});

test('remote_to_web_url converts an HTTPS remote and strips the .git suffix', () => {
  assert.strictEqual(
    remote_to_web_url('https://github.com/StoneCypher/better_git_changelog.git'),
    'https://github.com/StoneCypher/better_git_changelog'
  );
});

test('remote_to_web_url accepts an HTTPS remote with no .git suffix', () => {
  assert.strictEqual(remote_to_web_url('https://github.com/o/r'), 'https://github.com/o/r');
});

test('remote_to_web_url strips embedded credentials', () => {
  assert.strictEqual(
    remote_to_web_url('https://user:token@github.com/o/r.git'),
    'https://github.com/o/r'
  );
});

test('remote_to_web_url handles the ssh:// scheme, including a port', () => {
  assert.strictEqual(remote_to_web_url('ssh://git@github.com/o/r.git'), 'https://github.com/o/r');
  assert.strictEqual(
    remote_to_web_url('ssh://git@git.example.com:2222/o/r.git'),
    'https://git.example.com/o/r'
  );
});

test('remote_to_web_url keeps multi-segment (subgroup) paths', () => {
  assert.strictEqual(
    remote_to_web_url('git@gitlab.com:group/sub/repo.git'),
    'https://gitlab.com/group/sub/repo'
  );
});

test('remote_to_web_url returns null for a missing or empty remote', () => {
  assert.strictEqual(remote_to_web_url(null), null);
  assert.strictEqual(remote_to_web_url(''), null);
  assert.strictEqual(remote_to_web_url('   '), null);
});

test('remote_to_web_url returns null for a local-path remote', () => {
  assert.strictEqual(remote_to_web_url('/home/user/repo.git'), null);
  assert.strictEqual(remote_to_web_url('C:/Users/john/repo'), null);
});

test('get_remote_url returns this repository\'s origin URL', () => {
  const url = get_remote_url();
  assert.strictEqual(typeof url, 'string');
  assert.match(url, /better_git_changelog/);
});
