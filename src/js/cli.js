#!/usr/bin/env node

const api = require('./index.js');

console.log('Generating CHANGELOG.md...');

api.write_md();

console.log('  finished!');
