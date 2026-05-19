
const cp = require('child_process'),
      fs = require('fs');

const sv = require('semver');

const reflog_parser = require('./reflog_parser.js'),
      /**
       * Parse raw `git log --reflog` text into structured commit entries.
       *
       * A re-export of the parser generated from `src/peg/reflog_parser.peg`.
       * Each `commit ...` block becomes one {@link ReflogEntry}.
       *
       * @param {string} input  The raw reflog text to parse.
       * @returns {ReflogEntry[]}  The parsed commit entries in reflog order.
       * @throws {Error}  A peggy `SyntaxError` when the input does not match
       *                  the reflog grammar.
       *
       * @example
       *   parse_rl(get_reflog_data());   // [{ commit_hash: 'a1b2...', ... }]
       *
       * @see get_reflog_data
       */
      parse_rl      = reflog_parser.parse;

const i18n = require('./i18n.js');


/**
 * One parsed commit entry from the git reflog.
 *
 * Produced by the generated PEG parser (`parse_rl`) and consumed by the
 * formatters.  `scan` additionally stamps matching entries with `tag`.
 *
 * @typedef {object} ReflogEntry
 * @property {string}   commit_hash  The full 40-character commit hash.
 * @property {string[]} commit_text  The commit message body, one element per
 *                                   blank-line-separated block.
 * @property {string}   [author]     The commit author line, when present.
 * @property {number}   [date]       Commit timestamp as epoch milliseconds.
 * @property {string[]} [merge]      Short hashes of the merge parents, for a
 *                                   merge commit.
 * @property {string[]} [tag]        Tag names whose commit matches this entry;
 *                                   added by `scan`.
 */

/**
 * The subset of a scan returned by `scan_all` — tags and reflog only, with no
 * tag/reflog cross-referencing or remote-URL resolution performed yet.
 *
 * @typedef {object} ScanAllResult
 * @property {string[]}             tag_list    Every tag name in the repository.
 * @property {Map<string, string>}  tag_hashes  Map of tag name to commit hash.
 * @property {ReflogEntry[]}        reflog      The parsed reflog entries.
 */

/**
 * The complete result of scanning a repository, returned by `scan`.
 *
 * @typedef {object} ScanResult
 * @property {string[]}             tag_list    Every tag name in the repository.
 * @property {Map<string, string>}  tag_hashes  Map of tag name to commit hash.
 * @property {ReflogEntry[]}        reflog      The parsed reflog entries, with
 *                                              `tag` stamped onto matches.
 * @property {string[]}             not_found   Tag names whose commit was not
 *                                              found in the reflog.
 * @property {string | null}        repo_url    The repository's web base URL,
 *                                              or `null` when no hosted
 *                                              `origin` remote exists.
 */



/**
 * Build the default changelog preface (the heading and intro sentence).
 *
 * @param {(ns: string, key: string, params?: object) => string} t
 *        A translator's `t(namespace, key)` lookup function — the `t` member
 *        of a {@link import('./i18n.js').Translator}.
 * @returns {string}  The Markdown preface string, ending in a blank line.
 *
 * @example
 *   default_preface(make_translator('en').t);
 *   // '# Changelog\n\n...intro...\n\n'
 *
 * @see {@link import('./i18n.js').Translator}
 */
function default_preface(t) {
  return `# ${t('changelog', 'changelogHeading')}\n\n${t('changelog', 'prefaceSentence')}\n\n`;
}





/**
 * Comparator that orders tag names, tolerating non-semver tags.
 *
 * Two valid semver tags are compared by version precedence. A valid semver
 * tag sorts before a non-semver one, and two non-semver tags are compared
 * lexically — so a tag like `nightly` or `release-1` never throws.
 *
 * @param {string} l  A tag name.
 * @param {string} r  A tag name.
 * @returns {number}  -1, 0, or 1, suitable for Array.prototype.sort.
 *
 * @example
 *   ['2.0.0', 'nightly', '1.0.0'].sort(sem_sort);  // ['1.0.0','2.0.0','nightly']
 */
function sem_sort(l, r) {

  const lv = sv.valid(l),
        rv = sv.valid(r);

  if (lv && rv) { return sv.lt(l, r) ? -1 : (sv.gt(l, r) ? 1 : 0); }
  if (lv)       { return -1; }
  if (rv)       { return 1; }

  return (l < r) ? -1 : ((l > r) ? 1 : 0);

}





/**
 * List every tag name in the current repository.
 *
 * Runs `git tag -l`, trimming blank lines so the result contains only real
 * tag names.
 *
 * @returns {string[]}  The tag names, in git's listing order.
 * @throws {Error}  When git cannot be run or the command fails.
 *
 * @example
 *   get_tag_list();   // ['1.0.0', '1.1.0', 'nightly']
 *
 * @see tags_to_hashes
 */
function get_tag_list() {

  return cp.execSync('git tag -l')
    .toString()
    .trim()
    .split('\n')
    .map(row => row.trim())
    .filter(r => r.length > 0);

}





/**
 * Resolve a tag name to the hash of the commit it points at.
 *
 * Spawned shell-free with execFileSync, so a tag name containing shell
 * metacharacters cannot be reinterpreted by a shell.
 *
 * @param {string} tag  A git tag name.
 * @returns {string}  The commit hash the tag resolves to.
 * @throws {Error}  When the tag does not exist or git cannot be run.
 *
 * @example
 *   tag_to_hash('1.6.8');   // 'a1b2c3d4...'
 */
function tag_to_hash(tag) {

  return cp.execFileSync('git', [ 'rev-list', '-n', '1', tag ])
    .toString()
    .trim();

}





/**
 * Resolve a set of tag names to their commit hashes in a single git call.
 *
 * Uses `git for-each-ref` once for the whole repository — far cheaper than
 * one `git rev-list` per tag.  Tags not present in the repository are simply
 * omitted from the result.
 *
 * @param {string[]} tags  Tag names to resolve.
 * @returns {Map<string, string>}  Map of tag name to commit hash, containing
 *                                 only the tags that exist.
 * @throws {Error}  When git cannot be run or the command fails.
 *
 * @example
 *   tags_to_hashes(['1.0.0', 'nope']);   // Map { '1.0.0' => 'a1b2...' }
 *
 * @see get_tag_list
 * @see get_tags_as_hashes
 */
function tags_to_hashes(tags) {

  // Resolve every tag to its commit in a single git call.  Spawning one
  // `git rev-list` per tag costs ~130ms of process-creation time each on
  // Windows; for-each-ref returns the whole set at once.  For annotated
  // tags the commit is the dereferenced `*objectname`; for lightweight
  // tags it is `objectname` directly.
  const resolved = new Map();

  cp.execFileSync('git', [ 'for-each-ref',
                           '--format=%(refname:short) %(objectname) %(objecttype) %(*objectname)',
                           'refs/tags' ])
    .toString()
    .trim()
    .split('\n')
    .filter(row => row.length > 0)
    .forEach(row => {
      const [name, objectname, objecttype, deref] = row.trim().split(' ');
      resolved.set(name, objecttype === 'tag' ? deref : objectname);
    });

  return tags.reduce(

    (acc, cur) =>
      (acc.has(cur) || !resolved.has(cur))
        ? acc
        : (acc.set(cur, resolved.get(cur)), acc),

    new Map()

  );

}





/**
 * List every tag in the repository and resolve each to its commit hash.
 *
 * A convenience composition of `get_tag_list` and `tags_to_hashes`.
 *
 * @returns {Map<string, string>}  Map of tag name to commit hash.
 * @throws {Error}  When git cannot be run or a command fails.
 *
 * @example
 *   get_tags_as_hashes();   // Map { '1.0.0' => 'a1b2...', ... }
 *
 * @see get_tag_list
 * @see tags_to_hashes
 */
function get_tags_as_hashes() {

  return tags_to_hashes( get_tag_list() );

}





/**
 * Read the raw reflog text for the current repository.
 *
 * Runs `git --no-pager log --reflog` and appends a trailing blank line so the
 * output satisfies the reflog grammar consumed by `parse_rl`.
 *
 * @returns {string}  The raw reflog text, ready to hand to `parse_rl`.
 * @throws {Error}  When git cannot be run or the command fails.
 *
 * @example
 *   parse_rl(get_reflog_data());   // structured ReflogEntry[]
 *
 * @see parse_rl
 */
function get_reflog_data() {

  return cp.execSync('git --no-pager log --reflog')
    .toString()
    .trim() + '\n\n';

}





/**
 * Read the URL of the `origin` remote.
 *
 * Spawned shell-free with execFileSync, so the fixed git argument list
 * cannot be reinterpreted by a shell.
 *
 * @returns {string | null}  The `origin` remote URL as a trimmed string, or
 *          `null` when there is no `origin` remote (or git cannot be run).
 *
 * @example
 *   get_remote_url();   // 'git@github.com:owner/repo.git'
 *
 * @see remote_to_web_url
 */
function get_remote_url() {

  try {
    return cp.execFileSync('git', [ 'remote', 'get-url', 'origin' ]).toString().trim();
  } catch (e) {
    return null;
  }

}





/**
 * Convert a git remote URL into the repository's web base URL.
 *
 * Handles the SSH scp-style form (`git@host:owner/repo.git`), the
 * `scheme://` forms (`https://`, `ssh://`, `git://`), embedded credentials,
 * a port, and a trailing `.git`. A local-path remote, or any remote whose
 * host is not a dotted hostname, yields `null` — no web URL can be built
 * from it.
 *
 * @param {string | null} remote  A git remote URL, or `null`.
 * @returns {string | null}  The `https://host/owner/repo` web base, or `null`
 *          when the remote is missing or is not a hosted URL.
 *
 * @example
 *   remote_to_web_url('git@github.com:o/r.git');  // 'https://github.com/o/r'
 *   remote_to_web_url('/home/u/r.git');           // null
 *
 * @see get_remote_url
 */
function remote_to_web_url(remote) {

  if (!remote) { return null; }

  const s = String(remote).trim();

  const url = s.match(/^[a-z][a-z0-9+.-]*:\/\/(?:[^@/]+@)?([^/:]+)(?::\d+)?\/(.+)$/i),
        scp = s.match(/^(?:[^@/]+@)?([^/:]+):(.+)$/);

  const host = url ? url[1] : (scp ? scp[1] : null),
        raw  = url ? url[2] : (scp ? scp[2] : null);

  if ((!host) || (!raw))                               { return null; }
  if ((!host.includes('.')) && (host !== 'localhost')) { return null; }

  const path = raw.replace(/\.git$/, '').replace(/^\/+/, '').replace(/\/+$/, '');

  if (path.length === 0) { return null; }

  return `https://${host}/${path}`;

}





/**
 * Gather the raw building blocks of a scan: tag list, tag hashes, and reflog.
 *
 * Internal helper for `scan`; performs no tag/reflog cross-referencing and
 * does not resolve the remote URL.
 *
 * @returns {ScanAllResult}  The tag list, tag-to-hash Map, and parsed reflog.
 * @throws {Error}  When git cannot be run or a command fails.
 *
 * @example
 *   const { tag_list, tag_hashes, reflog } = scan_all();
 *
 * @see scan
 */
function scan_all() {

  const tag_list   = get_tag_list(),
        tag_hashes = tags_to_hashes(tag_list),
        reflog     = parse_rl( get_reflog_data() );

  return { tag_list, tag_hashes, reflog };

}






/**
 * Scan the current repository: gather its tags, reflog, and remote URL.
 *
 * @returns {ScanResult}  `{ tag_list, tag_hashes, reflog, not_found, repo_url }`
 *          — the tag names, a tag-to-commit Map, the parsed reflog (each entry
 *          stamped with its `tag` when one matches a tag's commit), the tags
 *          whose commit was not found in the reflog, and the repository's web
 *          URL (or `null` when no hosted `origin` remote exists).
 * @throws {Error}  When git cannot be run or a command fails.
 *
 * @example
 *   const { reflog, repo_url } = scan();
 *
 * @see scan_all
 * @see convert_to_md
 */
function scan() {

  const found     = [],
        not_found = [];

  const { tag_list, tag_hashes, reflog } = scan_all();

  tag_hashes.forEach( (hash, tag) => {

    const idx = reflog.findIndex( rli => rli.commit_hash === hash );

    if (idx === -1) {
      not_found.push(tag);
    } else {
      found.push(tag);
      ( reflog[idx].tag || (reflog[idx].tag = []) ).push(tag);
    }

  } );

  // reflog.forEach( rli => rli['title'] = get_branch_name_for_hash(rli.commit_hash) );

  const repo_url = remote_to_web_url( get_remote_url() );

  return { tag_list, tag_hashes, reflog, not_found, repo_url };

}





/**
 * Serialize scanned changelog data to a JSON file.
 *
 * @param {object} options         Destructured options bag.
 * @param {string} options.target  Output path the JSON is written to.
 * @param {ScanResult} options.data  The scan result to serialize.
 * @returns {void}
 * @throws {Error}  When the target path cannot be written.
 *
 * @example
 *   convert_to_json({ target: './changelog.json', data: scan() });
 *
 * @see scan
 * @see convert_to_md
 */
function convert_to_json({ target, data }) {

  fs.writeFileSync( target, JSON.stringify( data ) );

}





/**
 * Turn a tag name into an HTML-anchor-safe slug.
 *
 * Every character that is not a Unicode letter, a Unicode digit, an
 * underscore, or a hyphen is replaced with `__`, so non-Latin tag names
 * survive while punctuation is escaped. Input is assumed to be NFC-normalized;
 * a decomposed combining mark would be stripped.
 *
 * @param {string} text  The tag name to convert.
 * @returns {string}  The anchor-safe slug.
 *
 * @example
 *   slug('v1.0/beta');   // 'v1__0__beta'
 *   slug('versión-2');   // 'versión-2'
 *
 * @see to_link
 */
function slug(text) {
  return text.replace( /[^\p{L}\p{N}_-]/gu, '__' );
}





/**
 * Render one parsed reflog entry as a Markdown changelog section.
 *
 * @param {ReflogEntry} item  A reflog entry: `commit_hash` and `commit_text`,
 *                  plus the optional `tag` (a tag name, or an array of tag
 *                  names when a commit carries several), `date`, `author`,
 *                  and `merge`.
 * @param {import('./i18n.js').Translator} [tr]  A translator from
 *                  i18n.make_translator; defaults to English.
 * @param {string | null} [repo_url]  The repository's web base URL. When
 *                  given, the commit hash is linked to
 *                  `<repo_url>/commit/<hash>`; when absent, the hash is
 *                  rendered as plain inline code with no link.
 * @returns {string}  The entry rendered as Markdown.
 *
 * @example
 *   default_formatter({ commit_hash: 'abc', commit_text: ['Fix a bug'] });
 *
 * @see convert_to_md
 * @see default_separator
 */
function default_formatter(item, tr, repo_url) {
  tr = tr || i18n.make_translator('en');
  const t = tr.t;
  const d = item.date ? new Date(item.date) : null;

  const tags = item.tag
    ? (Array.isArray(item.tag) ? item.tag : [item.tag])
    : [];

  return `${

    tags.length
      ? tags.map(tg => `<a name="${slug(tg)}" />`).join('\n\n') + '\n\n'
      : ''

  }##${

    tags.length
      ? tags.map(tg => ` [${tg}]`).join('')
      : ` [${t('changelog', 'untagged')}]`

  }${

    d
      ? ` - ${tr.date(d)} ${tr.time(d)}`
      : ''

  }${

    item.commit_hash
      ? (repo_url
          ? `\n\nCommit [${item.commit_hash}](${repo_url}/commit/${item.commit_hash})`
          : `\n\nCommit \`${item.commit_hash}\``)
      : ''

  }${

    item.author
      ? `\n\n${t('changelog', 'author')} \`${item.author}\``
      : ''

  }${

    item.merge
      ? `\n\n${t('changelog', 'mergesLabel', { list: `[${item.merge.join(', ')}]` })}`
      : ''

  }\n\n${

    item.commit_text.join('').split('\n\n').map(sp => `  * ${sp}`).join('\n')

  }`;
}





/**
 * Produce the Markdown separator placed between changelog entries.
 *
 * A fixed run of blank lines and non-breaking spaces; the entry argument is
 * accepted for interface symmetry with custom separators but is unused.
 *
 * @param {ReflogEntry} [item]  The reflog entry following the separator; unused.
 * @returns {string}  The separator Markdown.
 *
 * @example
 *   default_separator();   // '\n\n\n\n\n&nbsp;\n\n&nbsp;\n\n'
 *
 * @see default_formatter
 * @see convert_to_md
 */
function default_separator(item) {
  return "\n\n\n\n\n&nbsp;\n\n&nbsp;\n\n";
}





/**
 * Render a tag name as an in-document HTML anchor link.
 *
 * Internal helper used to build the published-tags index; the link target is
 * the anchor produced by `slug`.
 *
 * @param {string} tag  The tag name to link.
 * @returns {string}  An `<a href="#slug">tag</a>` HTML fragment.
 *
 * @example
 *   to_link('1.0.0');   // '<a href="#1__0__0">1.0.0</a>'
 *
 * @see slug
 */
function to_link(tag) {
  return `<a href="#${slug(tag)}">${tag}</a>`;
}





/**
 * Render scanned changelog data as a complete Markdown document.
 *
 * @param {object} options  Destructured options bag.
 * @param {string} [options.target]  Output path; informational only, nothing
 *                  is written here.
 * @param {ScanResult} options.data  A scan result: `{ reflog, tag_list,
 *                  tag_hashes, repo_url }`.
 * @param {(item: ReflogEntry, tr: import('./i18n.js').Translator, repo_url: (string | null)) => string} [options.item_formatter]
 *                  Optional per-entry renderer; defaults to default_formatter.
 * @param {(item: ReflogEntry) => string} [options.item_separator]
 *                  Optional separator renderer; defaults to default_separator.
 * @param {string} [options.preface]  Optional preface string; defaults to the
 *                  localized preface.
 * @param {boolean} [options.short]  When true, include only the most recent
 *                  `short_length` entries.
 * @param {number} [options.short_length]  Entry count for the short form
 *                  (default 10).
 * @param {boolean} [options.has_both]  When true (and `short`), append a link
 *                  to the long-form file.
 * @param {string} [options.longname]  Long-form filename, used by the
 *                  `has_both` link.
 * @param {import('./i18n.js').Translator} [options.translator]  A translator
 *                  for the changelog language; defaults to English.
 * @returns {string}  The complete changelog as a Markdown string.
 *
 * @example
 *   convert_to_md({ data: scan() });
 *
 * @see scan
 * @see default_formatter
 */
function convert_to_md({ target, data, item_formatter, item_separator, preface, short, short_length, has_both, longname, translator }) {

  const tr        = translator      || i18n.make_translator('en'),
        t         = tr.t,
        formatter = item_formatter  || default_formatter,
        separator = item_separator  || default_separator,
        prefix    = preface         || default_preface(t),
        is_short  = short           ?? false,
        use_sl    = short_length    ?? 10;

  let md = prefix;

  const merge_ct = data.reflog.filter(r => r.merge).length,
        rel_ct   = data.tag_list.length,
        notes    = [];

  if (merge_ct)             { notes.push(t('changelog', 'merges',   { n: merge_ct })); }
  if (rel_ct)               { notes.push(t('changelog', 'releases', { n: rel_ct   })); }
  if (is_short)             { notes.push(t('changelog', 'shortNote', { n: use_sl  })); }
  if (is_short && has_both) { notes.push(t('changelog', 'fullChangelogAt', { link: `[${longname}](${longname})` })); }

  md += notes.join('; ');

  if (data.tag_list) {
    const sorted = [...data.tag_list].sort(sem_sort).reverse();
    md += '\n\n\n\n&nbsp;\n\n&nbsp;\n\n' + t('changelog', 'publishedTags') + '\n\n' + sorted.map(to_link).join(', ') + '\n';
  }

  const urefs = is_short ? data.reflog.slice(0, use_sl) : data.reflog;

  urefs.forEach( (rli) => {
    md += separator(rli);
    md += formatter(rli, tr, data.repo_url);
  } );

  return md;

}





/**
 * Scan the repository (or use supplied data) and write the short-form changelog.
 *
 * @param {string} [target]        Output path; defaults to './CHANGELOG.md'.
 * @param {boolean} [has_both]     When true, append a link to the long-form file.
 * @param {number} [short_length]  Number of recent entries to include.
 * @param {string} [longname]      Long-form filename, used by the `has_both` link.
 * @param {ScanResult} [data]      Optional pre-computed scan result; the repo
 *                                 is scanned if omitted.
 * @param {import('./i18n.js').Translator} [translator]  A translator for the
 *                                 changelog language; defaults to English.
 * @returns {void}
 * @throws {Error}  When the target path cannot be written or git fails.
 *
 * @example
 *   write_short_md('./CHANGELOG.md', true, 10, 'CHANGELOG.long.md');
 *
 * @see write_long_md
 * @see convert_to_md
 */
function write_short_md(target, has_both, short_length, longname, data, translator) {

  const u_data   = data || scan(),
        u_target = target || './CHANGELOG.md';

  fs.writeFileSync( u_target, convert_to_md({ u_target, data: u_data, short: true, has_both, short_length, longname, translator }), { flag: 'w' } );

}





/**
 * Scan the repository (or use supplied data) and write the full-history changelog.
 *
 * @param {string} [target]  Output path; defaults to './CHANGELOG.long.md'.
 * @param {ScanResult} [data]  Optional pre-computed scan result; the repo is
 *                             scanned if omitted.
 * @param {import('./i18n.js').Translator} [translator]  A translator for the
 *                             changelog language; defaults to English.
 * @returns {void}
 * @throws {Error}  When the target path cannot be written or git fails.
 *
 * @example
 *   write_long_md('./CHANGELOG.long.md');
 *
 * @see write_short_md
 * @see convert_to_md
 */
function write_long_md(target, data, translator) {

  const u_data   = data || scan(),
        u_target = target || './CHANGELOG.long.md';

  fs.writeFileSync( u_target, convert_to_md({ u_target, data: u_data, translator }), { flag: 'w' } );

}





module.exports = {

  scan,

  get_reflog_data,
  get_tag_list,
  tag_to_hash,
  tags_to_hashes,
  get_tags_as_hashes,
  get_remote_url,
  remote_to_web_url,
  // get_branch_name_for_hash,

  convert_to_json,
  convert_to_md,

  slug,

  default_formatter,
  default_separator,

  write_short_md,
  write_long_md,

  parse_rl

};
