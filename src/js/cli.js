#!/usr/bin/env node

const api = require('./index.js');

const { program } = require('commander');



program
  .option('-l, --long-form',             'Include all commits in the changelog')
  .option('-s, --short-form',            'Include only the current and previous commit in the changelog')
  .option('-b, --both-forms <filename>', 'Write both forms.  Optionally, include the long form filename as an argument', 'CHANGELOG.long.md')
  .option('-f, --filename <filename>',   'Set the filename for output', 'CHANGELOG.md');

program.parse();

const opts = program.opts();





console.log('Generating CHANGELOG.md...');

let long  = false,
    short = false,
    fn    = opts.filename,
    fn2   = opts.bothForms;

if (opts.longForm)  { long  = true; }
if (opts.shortForm) { short = true; }
if (opts.bothForms) { short = true; long = true; }

if ( (!(long)) && (!(short)) ) { long = true; }



if (long && short) {
  api.write_short_md(fn);
  api.write_long_md(fn2);

} else if (long) {
  api.write_long_md(fn);

} else if (short) {
  api.write_short_md(fn);
}



console.log('  finished!');
