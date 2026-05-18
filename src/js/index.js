
const cp = require('child_process'),
      fs = require('fs');

const sv = require('semver');

const reflog_parser = require('./reflog_parser.js'),
      parse_rl      = reflog_parser.parse;

const i18n = require('./i18n.js');





/**
 * Build the default changelog preface (the heading and intro sentence).
 *
 * @param t  A translator's `t(namespace, key)` lookup function.
 * @returns The Markdown preface string, ending in a blank line.
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
 * @param l  A tag name.
 * @param r  A tag name.
 * @returns  -1, 0, or 1, suitable for Array.prototype.sort.
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
 * @param tag  A git tag name.
 * @returns The commit hash the tag resolves to.
 *
 * @example
 *   tag_to_hash('1.6.8');   // 'a1b2c3d4...'
 */
function tag_to_hash(tag) {

  return cp.execFileSync('git', [ 'rev-list', '-n', '1', tag ])
    .toString()
    .trim();

}





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





function get_tags_as_hashes() {

  return tags_to_hashes( get_tag_list() );

}





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
 * @returns The `origin` remote URL as a trimmed string, or `null` when there
 *          is no `origin` remote (or git cannot be run).
 *
 * @example
 *   get_remote_url();   // 'git@github.com:owner/repo.git'
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
 * @param remote  A git remote URL, or `null`.
 * @returns The `https://host/owner/repo` web base, or `null` when the remote
 *          is missing or is not a hosted URL.
 *
 * @example
 *   remote_to_web_url('git@github.com:o/r.git');  // 'https://github.com/o/r'
 *   remote_to_web_url('/home/u/r.git');           // null
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





function scan_all() {

  const tag_list   = get_tag_list(),
        tag_hashes = tags_to_hashes(tag_list),
        reflog     = parse_rl( get_reflog_data() );

  return { tag_list, tag_hashes, reflog };

}






/**
 * Scan the current repository: gather its tags, reflog, and remote URL.
 *
 * @returns `{ tag_list, tag_hashes, reflog, not_found, repo_url }` — the tag
 *          names, a tag-to-commit Map, the parsed reflog (each entry stamped
 *          with its `tag` when one matches a tag's commit), the tags whose
 *          commit was not found in the reflog, and the repository's web URL
 *          (or `null` when no hosted `origin` remote exists).
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
 * @param text  The tag name to convert.
 * @returns The anchor-safe slug.
 *
 * @example
 *   slug('v1.0/beta');   // 'v1__0__beta'
 *   slug('versión-2');   // 'versión-2'
 */
function slug(text) {
  return text.replace( /[^\p{L}\p{N}_-]/gu, '__' );
}





/**
 * Render one parsed reflog entry as a Markdown changelog section.
 *
 * @param item      A reflog entry: `commit_hash` and `commit_text`, plus the
 *                  optional `tag` (a tag name, or an array of tag names when a
 *                  commit carries several), `date`, `author`, and `merge`.
 * @param tr        A translator from i18n.make_translator; defaults to English.
 * @param repo_url  The repository's web base URL. When given, the commit hash
 *                  is linked to `<repo_url>/commit/<hash>`; when absent, the
 *                  hash is rendered as plain inline code with no link.
 * @returns The entry rendered as Markdown.
 *
 * @example
 *   default_formatter({ commit_hash: 'abc', commit_text: ['Fix a bug'] });
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





function default_separator(item) {
  return "\n\n\n\n\n&nbsp;\n\n&nbsp;\n\n";
}





function to_link(tag) {
  return `<a href="#${slug(tag)}">${tag}</a>`;
}





/**
 * Render scanned changelog data as a complete Markdown document.
 *
 * @param target          Output path; informational only, nothing is written here.
 * @param data            A scan result: `{ reflog, tag_list, tag_hashes }`.
 * @param item_formatter  Optional per-entry renderer; defaults to default_formatter.
 * @param item_separator  Optional separator renderer; defaults to default_separator.
 * @param preface         Optional preface string; defaults to the localized preface.
 * @param short           When true, include only the most recent `short_length` entries.
 * @param short_length    Entry count for the short form (default 10).
 * @param has_both        When true (and `short`), append a link to the long-form file.
 * @param longname        Long-form filename, used by the `has_both` link.
 * @param translator      A translator for the changelog language; defaults to English.
 * @returns The complete changelog as a Markdown string.
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

  const merge_ct = data.reflog.length,
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
 * @param target        Output path; defaults to './CHANGELOG.md'.
 * @param has_both      When true, append a link to the long-form file.
 * @param short_length  Number of recent entries to include.
 * @param longname      Long-form filename, used by the `has_both` link.
 * @param data          Optional pre-computed scan result; the repo is scanned if omitted.
 * @param translator    A translator for the changelog language; defaults to English.
 */
function write_short_md(target, has_both, short_length, longname, data, translator) {

  const u_data   = data || scan(),
        u_target = target || './CHANGELOG.md';

  fs.writeFileSync( u_target, convert_to_md({ u_target, data: u_data, short: true, has_both, short_length, longname, translator }), { flag: 'w' } );

}





/**
 * Scan the repository (or use supplied data) and write the full-history changelog.
 *
 * @param target      Output path; defaults to './CHANGELOG.long.md'.
 * @param data        Optional pre-computed scan result; the repo is scanned if omitted.
 * @param translator  A translator for the changelog language; defaults to English.
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
