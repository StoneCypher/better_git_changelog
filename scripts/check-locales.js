'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'js', 'locales');
const REFERENCE   = 'en';

/**
 * Map every "namespace.key" in a locale to whether its value is a plain
 * string or a plural object.
 *
 * @param locale  A parsed locale object, shaped namespace -> key -> value.
 * @returns A Map from each "ns.key" string to either 'string' or 'plural'.
 */
function message_kinds(locale) {
  const out = new Map();
  for (const ns of Object.keys(locale)) {
    for (const key of Object.keys(locale[ns])) {
      const v = locale[ns][key];
      out.set(`${ns}.${key}`, (v && typeof v === 'object') ? 'plural' : 'string');
    }
  }
  return out;
}

/**
 * Check every non-English locale file against en.json for completeness.
 *
 * Each locale must carry every key en.json has, and every plural-typed key
 * must provide exactly the plural categories Intl.PluralRules requires for
 * that locale. Unknown extra keys are reported too.
 *
 * @returns An array of { file, probs } problem reports — empty when every
 *          locale is complete.
 *
 * @example
 *   check();   // [] when all locales are complete
 */
function check() {
  const ref     = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${REFERENCE}.json`), 'utf8'));
  const refKind = message_kinds(ref);
  const files   = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
  const report  = [];

  for (const file of files) {
    const code = file.replace(/\.json$/, '');
    if (code === REFERENCE) { continue; }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'));
    } catch (e) {
      report.push({ file, probs: [`could not read or parse: ${e.message}`] });
      continue;
    }
    const kinds = message_kinds(data);
    const cats  = new Intl.PluralRules(code).resolvedOptions().pluralCategories;
    const probs = [];

    for (const [k, kind] of refKind) {
      if (!kinds.has(k)) { probs.push(`missing key '${k}'`); continue; }
      if (kind === 'plural') {
        const [ns, key] = k.split('.');
        const entry = data[ns][key];
        if (!entry || typeof entry !== 'object') {
          probs.push(`'${k}' must be a plural object`);
          continue;
        }
        for (const c of cats) {
          if (!(c in entry)) { probs.push(`'${k}' missing plural form '${c}'`); }
        }
      }
    }
    for (const k of kinds.keys()) {
      if (!refKind.has(k)) { probs.push(`unknown key '${k}'`); }
    }
    if (probs.length) { report.push({ file, probs }); }
  }

  return report;
}

/**
 * Run the locale check as a CLI: print the report and exit with a non-zero
 * status if any locale is incomplete.
 */
function main() {
  const report = check();
  if (report.length) {
    for (const { file, probs } of report) {
      console.error(`${file}:`);
      probs.forEach(p => console.error(`  - ${p}`));
    }
    console.error('\nLocale check FAILED.');
    process.exit(1);
  }
  console.log('Locale check passed.');
}

if (require.main === module) { main(); }

module.exports = { check };
