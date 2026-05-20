'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const LOCALES_DIR = path.join(__dirname, 'locales');
const FALLBACK    = 'en';
const SUPPORTED   = ['en', 'es', 'fr', 'de', 'pt', 'zh-CN', 'ja', 'ru', 'ar', 'hi', 'it', 'ko'];

/**
 * A translator bound to a single locale, as returned by `make_translator`.
 *
 * @typedef {object} Translator
 * @property {string} code  The resolved BCP-47 locale code actually in use
 *                          (English when the request could not be resolved).
 * @property {string | null} unsupported  The originally requested code when it
 *                          was unsupported and fell back to English; otherwise
 *                          `null`.
 * @property {(ns: string, key: string, params?: object) => string} t
 *                          Look up a localized string by namespace and key,
 *                          interpolating `{name}` placeholders from `params`.
 *                          Returns `"ns.key"` when the key is unknown.
 * @property {(d: Date) => string} date  Format a date in the locale's medium
 *                          date style.
 * @property {(d: Date) => string} time  Format a time in the locale's medium
 *                          time style.
 * @property {(n: number) => string} number  Format a number for the locale.
 */

/**
 * Load and parse a locale's JSON string table from disk.
 *
 * @param {string} code  A locale code naming a file in the locales directory.
 * @returns {object | null}  The parsed locale object, or `null` when the file
 *                           is missing or cannot be parsed.
 *
 * @example
 *   load_locale('fr');   // { changelog: { ... }, ui: { ... } }
 *   load_locale('xx');   // null
 *
 * @see make_translator
 */
function load_locale(code) {
  try {
    return JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${code}.json`), 'utf8'));
  } catch (e) {
    return null;
  }
}

/**
 * Resolve a requested language code to a supported locale code.
 *
 * Matches case-insensitively, treats `_` and `-` as equivalent, and falls
 * back to a base-language match (so `pt-BR` resolves to `pt`).
 *
 * @param {string | null | undefined} requested  The requested language code.
 * @returns {string | null}  A supported locale code, or `null` when nothing
 *                            matches (or no code was requested).
 *
 * @example
 *   resolve_code('pt_BR');   // 'pt'
 *   resolve_code('xx');      // null
 *
 * @see make_translator
 */
function resolve_code(requested) {
  if (!requested) { return null; }
  const norm  = String(requested).replace(/_/g, '-');
  const exact = SUPPORTED.find(c => c.toLowerCase() === norm.toLowerCase());
  if (exact) { return exact; }
  const base = norm.split('-')[0].toLowerCase();
  return SUPPORTED.find(c => c.split('-')[0].toLowerCase() === base) || null;
}

/**
 * Substitute `{name}` placeholders in a string with values from a params bag.
 *
 * A placeholder whose name is absent from `params` is left untouched.
 *
 * @param {string} str  The template string containing `{name}` placeholders.
 * @param {object} params  Map of placeholder name to substitution value.
 * @returns {string}  The string with every known placeholder replaced.
 *
 * @example
 *   interpolate('Hello {who}', { who: 'world' });   // 'Hello world'
 *   interpolate('Hello {who}', {});                 // 'Hello {who}'
 */
function interpolate(str, params) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

/**
 * Build a translator bound to a single locale.
 *
 * @param {string | null | undefined} requested  A language code such as 'fr'
 *                   or 'pt-BR'. An unknown code resolves to English and is
 *                   reported back via `unsupported`.
 * @param {object} [localeData]  Optional pre-loaded locale object used instead
 *                   of reading the locale file from disk. Intended for tests;
 *                   production callers omit it.
 * @returns {Translator}  A translator object whose members are: `code` (the
 *                   resolved locale code), `unsupported` (the originally
 *                   requested code when it fell back to English, else `null`),
 *                   `t` (the `t(ns, key, params?)` string-lookup function),
 *                   `date` and `time` (locale-aware `Date` formatters), and
 *                   `number` (a locale-aware number formatter).
 *
 * @example
 *   const tr = make_translator('fr');
 *   tr.t('changelog', 'untagged');   // the French string, or English if absent
 *
 * @see Translator
 * @see resolve_code
 */
function make_translator(requested, localeData) {
  const resolved = resolve_code(requested);
  const code     = resolved || FALLBACK;
  const data     = localeData || load_locale(code) || {};
  const fallback = (code === FALLBACK && !localeData) ? data : (load_locale(FALLBACK) || {});
  const plural   = new Intl.PluralRules(code);

  function lookup(ns, key) {
    if (data[ns]     && key in data[ns])     { return data[ns][key]; }
    if (fallback[ns] && key in fallback[ns]) { return fallback[ns][key]; }
    return undefined;
  }

  function select_plural(entry, n) {
    const cat = plural.select(Number(n));
    if (cat in entry)              { return entry[cat]; }
    if (entry.other !== undefined) { return entry.other; }
    return Object.values(entry)[0];
  }

  function t(ns, key, params = {}) {
    const entry = lookup(ns, key);
    if (entry === undefined) { return `${ns}.${key}`; }
    const str = (entry !== null && typeof entry === 'object')
      ? select_plural(entry, params.n)
      : entry;
    return interpolate(str, params);
  }

  return {
    code,
    unsupported: (requested && !resolved) ? requested : null,
    t,
    date:   d => new Intl.DateTimeFormat(code, { dateStyle: 'medium' }).format(d),
    time:   d => new Intl.DateTimeFormat(code, { timeStyle: 'medium' }).format(d),
    number: n => new Intl.NumberFormat(code).format(n)
  };
}

/**
 * Determine which locale to use for the CLI's own user-interface strings.
 *
 * An explicit `argLang` wins outright.  Otherwise the `LC_ALL`, `LC_MESSAGES`,
 * and `LANG` environment variables are consulted (ignoring the `C`/`POSIX`
 * locales), then the host's resolved `Intl` locale, then English.
 *
 * @param {string | null | undefined} argLang  An explicit language code (e.g.
 *                   from a `--lang` flag), or a falsy value to auto-detect.
 * @param {Record<string, string>} [env]  Environment variables to read;
 *                   defaults to `process.env`. Intended for tests.
 * @returns {string}  The detected locale code (never empty; falls back to 'en').
 *
 * @example
 *   detect_ui_locale('fr');                              // 'fr'
 *   detect_ui_locale(null, { LANG: 'de_DE.UTF-8' });     // 'de-DE'
 *
 * @see make_translator
 */
function detect_ui_locale(argLang, env) {
  env = env || process.env;
  if (argLang) { return argLang; }
  const fromEnv = env.LC_ALL || env.LC_MESSAGES || env.LANG;
  if (fromEnv && fromEnv !== 'C' && fromEnv !== 'POSIX') {
    return fromEnv.split('.')[0].replace(/_/g, '-');
  }
  try {
    return new Intl.DateTimeFormat().resolvedOptions().locale;
  } catch (e) {
    return FALLBACK;
  }
}

module.exports = {
  SUPPORTED, FALLBACK,
  load_locale, resolve_code, interpolate, make_translator, detect_ui_locale
};
