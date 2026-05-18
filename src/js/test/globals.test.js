const test   = require('node:test');
const assert = require('node:assert');

test('loading index.js does not leak an `fs` global', () => {
  // `fs` was assigned without a declarator, which created a global in
  // sloppy mode. Loading the module must not touch global scope.
  delete global.fs;
  delete require.cache[require.resolve('../index.js')];
  require('../index.js');
  assert.strictEqual(global.fs, undefined);
});
