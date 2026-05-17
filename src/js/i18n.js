'use strict';

const fs   = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'locales');
const FALLBACK    = 'en';
const SUPPORTED   = ['en', 'es', 'fr', 'de', 'pt', 'zh-CN', 'ja', 'ru', 'ar', 'hi', 'it', 'ko'];

function load_locale(code) {
  try {
    return JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${code}.json`), 'utf8'));
  } catch (e) {
    return null;
  }
}

function resolve_code(requested) {
  if (!requested) { return null; }
  const norm  = String(requested).replace(/_/g, '-');
  const exact = SUPPORTED.find(c => c.toLowerCase() === norm.toLowerCase());
  if (exact) { return exact; }
  const base = norm.split('-')[0].toLowerCase();
  return SUPPORTED.find(c => c.split('-')[0].toLowerCase() === base) || null;
}

function interpolate(str, params) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

function make_translator(requested) {
  const resolved = resolve_code(requested);
  const code     = resolved || FALLBACK;
  const data     = load_locale(code) || {};
  const fallback = code === FALLBACK ? data : (load_locale(FALLBACK) || {});
  const plural   = new Intl.PluralRules(code);

  function lookup(ns, key) {
    if (data[ns]     && key in data[ns])     { return data[ns][key]; }
    if (fallback[ns] && key in fallback[ns]) { return fallback[ns][key]; }
    return undefined;
  }

  function t(ns, key, params) {
    params = params || {};
    const entry = lookup(ns, key);
    if (entry === undefined) { return `${ns}.${key}`; }
    let str;
    if (entry && typeof entry === 'object') {
      const cat = plural.select(Number(params.n));
      str = (cat in entry) ? entry[cat]
          : (entry.other !== undefined ? entry.other : Object.values(entry)[0]);
    } else {
      str = entry;
    }
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
