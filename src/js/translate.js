'use strict';

const cp = require('node:child_process');

const SEP = '\n<<<==BGC-SEP==>>>\n';

/**
 * Build the argv array for the built-in `claude` CLI preset.
 *
 * The prompt instructs Claude to translate stdin, preserving every
 * `<<<==BGC-SEP==>>>` separator line so the section count stays intact.
 *
 * @param {string} lang  BCP-47 language code for the target language (e.g. 'fr').
 * @returns {string[]}   An array `[program, ...args]` suitable for execFileSync.
 *
 * @example
 *   claude_argv('fr');
 *   // => ['claude', '-p', 'Translate the text on stdin to fr...']
 */
function claude_argv(lang) {
  return ['claude', '-p',
    `Translate the text on stdin to ${lang}. It contains changelog sections ` +
    `separated by lines reading <<<==BGC-SEP==>>>. Preserve every separator ` +
    `line exactly and keep the same number of sections. Output only the ` +
    `translation, nothing else.`];
}

/**
 * Resolve a translator specifier to a `[program, ...args]` argv array.
 *
 * The string `'claude'` expands to the built-in Claude CLI preset via
 * `claude_argv`.  Any other value is treated as the name of an executable
 * that accepts a language code as its sole argument and reads text on stdin.
 *
 * @param {string} translator  Either `'claude'` or an executable name.
 * @param {string} lang        BCP-47 target language code (e.g. 'fr').
 * @returns {string[]}         An array `[program, ...args]` ready for execFileSync.
 *
 * @example
 *   resolve_argv('claude', 'fr');   // => ['claude', '-p', '...prompt...']
 *   resolve_argv('mytool', 'fr');   // => ['mytool', 'fr']
 */
function resolve_argv(translator, lang) {
  if (translator === 'claude') { return claude_argv(lang); }
  return [translator, lang];
}

/**
 * Default subprocess runner — wraps `execFileSync` with no-shell semantics.
 *
 * Commit text is passed on stdin, never interpolated into a command string,
 * so arbitrary content cannot cause shell injection.  `execFileSync` is the
 * intentional, security-relevant choice here; do not replace it with `exec`.
 *
 * @param {string} file   Executable name or path (passed directly to execFileSync).
 * @param {string[]} args Command-line arguments for the executable.
 * @param {string} input  Text to write to the process's stdin.
 * @returns {string}      The stdout of the subprocess as a UTF-8 string.
 *
 * @example
 *   default_runner('mytool', ['fr'], 'hello world');
 *   // runs: mytool fr  (with 'hello world' on stdin)
 *   // returns: stdout as a string
 */
function default_runner(file, args, input) {
  return cp.execFileSync(file, args, {
    input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']
  });
}

/**
 * Translate an array of text blocks via an external translator program.
 *
 * Blocks are joined with `SEP` separators, sent to the translator on stdin,
 * then split back apart.  If the translator returns a different number of
 * sections than were sent, a localized error is thrown.  Blocks are joined
 * for a single translator call by a sentinel separator line; a commit message
 * that itself contains that exact sentinel line will produce a section-count
 * mismatch and throw — there is no escaping mechanism.
 *
 * @param {string[]} blocks      Array of text blocks to translate (one per commit).
 * @param {string}   lang        BCP-47 target language code (e.g. 'fr').
 * @param {string}   translator  Either `'claude'` or an executable name.
 * @param {Function} t           Locale lookup function `t(ns, key, params)` used
 *                               to produce localized error messages.
 * @param {Function} [runner]    Optional injectable runner; defaults to
 *                               `default_runner`.  Tests pass a fake here.
 * @returns {string[]}           Array of translated blocks in the same order.
 * @throws {Error}               If the executable is not found (ENOENT) or the
 *                               returned section count does not match.
 *
 * @example
 *   const blocks = ['feat: add login', 'fix: correct typo'];
 *   translate_blocks(blocks, 'fr', 'claude', t);
 *   // => ['feat: ajouter connexion', 'fix: corriger faute de frappe']
 */
function translate_blocks(blocks, lang, translator, t, runner) {
  if (blocks.length === 0) { return []; }

  const [file, ...args] = resolve_argv(translator, lang);
  const effective_runner = runner ?? default_runner;

  let result;
  try {
    result = effective_runner(file, args, blocks.join(SEP));
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error(t('ui', 'errTranslatorNotFound', { command: file }));
    }
    throw new Error(t('ui', 'errTranslatorFailed', { detail: e.message }));
  }

  const parts = String(result).split(/\n?<<<==BGC-SEP==>>>\n?/);
  if (parts.length !== blocks.length) {
    throw new Error(t('ui', 'errTranslatorFailed', {
      detail: `expected ${blocks.length} section(s), got ${parts.length}`
    }));
  }
  return parts.map(p => p.trim());
}

/**
 * Translate every commit's text in a parsed reflog in place.
 *
 * Each entry's `commit_text` array is joined, translated, then replaced with a
 * single-element array containing the translated string.  The reflog array is
 * mutated and also returned for convenience.
 *
 * @param {object[]} reflog      Array of reflog entry objects, each with at least
 *                               `commit_hash` (string) and `commit_text` (string[]).
 * @param {string}   lang        BCP-47 target language code (e.g. 'fr').
 * @param {string}   translator  Either `'claude'` or an executable name.
 * @param {Function} t           Locale lookup function `t(ns, key, params)`.
 * @param {Function} [runner]    Optional injectable runner; defaults to
 *                               `default_runner`.
 * @returns {object[]}           The same (mutated) reflog array.
 *
 * @example
 *   const reflog = [{ commit_hash: 'abc', commit_text: ['feat: add login'] }];
 *   translate_reflog(reflog, 'fr', 'claude', t);
 *   reflog[0].commit_text;  // => ['feat: ajouter connexion']
 */
function translate_reflog(reflog, lang, translator, t, runner) {
  const blocks     = reflog.map(r => r.commit_text.join('\n\n'));
  const translated = translate_blocks(blocks, lang, translator, t, runner);
  reflog.forEach((r, i) => { r.commit_text = [translated[i]]; });
  return reflog;
}

module.exports = { SEP, claude_argv, resolve_argv, default_runner, translate_blocks, translate_reflog };
