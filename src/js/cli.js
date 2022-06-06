#!/usr/bin/env node

const api = require('./index.js');

const { program } = require('commander');



program
  .option('-l, --long-form',             'Include all commits in the changelog')
  .option('-s, --short-form',            'Include only the previous ten commits (adjustable) in the changelog')
  .option('-S, --short-length <count>',  'Set the count of commits to include in the short form')
  .option('-b, --both-forms [filename]', 'Write both forms.  Optionally, include the long form filename as an argument', 'CHANGELOG.long.md')
  .option('-f, --filename <filename>',   'Set the filename for output', 'CHANGELOG.md');

program.parse();

const opts = program.opts();





let long  = false,
    short = false,
    fn    = opts.filename,
    fn2   = opts.bothForms,
    ulen  = opts.shortLength ?? 10;

if (fn2 === true) { fn2 = 'CHANGELOG.long.md'; }

if (opts.longForm)  { long  = true; }
if (opts.shortForm) { short = true; }
if (opts.bothForms) { short = true; long = true; }

if ( (!(long)) && (!(short)) ) { long = true; }



if (long && short) {

  console.log(`Generating ${fn} with ${ulen} entries...`);
  api.write_short_md(fn, true, ulen);

  console.log(`Generating ${fn2}...`);
  api.write_long_md(fn2);

} else if (long) {
  console.log(`Generating ${fn}...`);
  api.write_long_md(fn);

} else if (short) {
  console.log(`Generating ${fn} with ${ulen} entries...`);
  api.write_short_md(fn, false, ulen);
}



console.log('  finished!');
