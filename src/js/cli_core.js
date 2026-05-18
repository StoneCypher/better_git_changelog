'use strict';

const { InvalidArgumentError } = require('commander');



/**
 * Find the requested UI language in raw argv, before commander parses.
 *
 * The help text and option descriptions are built eagerly, so the UI locale
 * has to be known before `program.parse()` runs. This scans the raw argument
 * vector for `--ui-lang=<code>`, then for the space-separated `--ui-lang`/`-u`
 * forms, guarding against reading a following flag as the value.
 *
 * @param argv  The process argument vector (e.g. `process.argv`).
 * @returns The requested language code, or `null` when none was given.
 *
 * @example
 *   prescan_ui_lang(['node', 'cli.js', '--ui-lang=de']);  // 'de'
 *   prescan_ui_lang(['node', 'cli.js', '-u', 'fr']);      // 'fr'
 *   prescan_ui_lang(['node', 'cli.js', '-l']);            // null
 */
function prescan_ui_lang(argv) {

  for (const a of argv) {
    if (a.startsWith('--ui-lang=')) { return a.slice('--ui-lang='.length); }
  }

  const i = argv.findIndex(a => a === '--ui-lang' || a === '-u');

  return (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('-'))
    ? argv[i + 1]
    : null;

}



/**
 * Coerce and validate the `-S`/`--short-length` option value.
 *
 * @param value  The raw option string from commander.
 * @returns The value as a positive integer.
 * @throws {InvalidArgumentError} When the value is not a positive integer, so
 *         commander rejects the run rather than silently producing an empty
 *         changelog from `slice(0, NaN)`.
 *
 * @example
 *   parse_short_length('25');   // 25
 *   parse_short_length('abc');  // throws InvalidArgumentError
 */
function parse_short_length(value) {

  const n = Number(value);

  if (!Number.isInteger(n) || n < 1) {
    throw new InvalidArgumentError('must be a positive integer.');
  }

  return n;

}



/**
 * Decide which changelog forms to write from the parsed options.
 *
 * `-l`/`-s` select the long or short form, `-b` selects both, and with no
 * form flag the long form is the default.
 *
 * @param opts  Commander's parsed options: `longForm`, `shortForm`,
 *              `bothForms`, `filename`, `shortLength`.
 * @returns `{ long, short, fn, fn2, ulen }` — whether to write each form, the
 *          main output filename, the long-form filename (`bothForms` as given,
 *          or the default when it was passed as a bare flag), and the
 *          short-form entry count.
 *
 * @example
 *   resolve_output_plan({ filename: 'CHANGELOG.md' });
 *   // { long: true, short: false, fn: 'CHANGELOG.md', fn2: undefined, ulen: 10 }
 *
 *   resolve_output_plan({ bothForms: true, filename: 'CHANGELOG.md' });
 *   // { long: true, short: true, fn: 'CHANGELOG.md', fn2: 'CHANGELOG.long.md', ulen: 10 }
 */
function resolve_output_plan(opts) {

  let long  = Boolean(opts.longForm  || opts.bothForms),
      short = Boolean(opts.shortForm || opts.bothForms);

  if ((!long) && (!short)) { long = true; }

  return {
    long,
    short,
    fn:   opts.filename,
    fn2:  opts.bothForms === true ? 'CHANGELOG.long.md' : opts.bothForms,
    ulen: opts.shortLength ?? 10
  };

}



module.exports = { prescan_ui_lang, parse_short_length, resolve_output_plan };
