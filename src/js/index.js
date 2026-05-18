
const cp = require('child_process');
      fs = require('fs');

const sv = require('semver');

const reflog_parser = require('./reflog_parser.js'),
      parse_rl      = reflog_parser.parse;





const default_preface = "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n";





function sem_sort(l, r) {
  return sv.lt(l, r)
    ? -1
    : (sv.gt(l, r)
      ? 1
      : 0);
}





function get_tag_list() {

  return cp.execSync('git tag -l')
    .toString()
    .trim()
    .split('\n')
    .map(row => row.trim())
    .filter(r => r.length > 0);

}





function tag_to_hash(tag) {

  return cp.execSync(`git rev-list -n 1 ${tag}`)
    .toString()
    .trim();

}





function tags_to_hashes(tags) {

  return tags.reduce(

    (acc, cur) =>
      acc.has(cur)
        ? acc
        : (acc.set(cur, tag_to_hash(cur)), acc),

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





function get_commit_message_for_hash(hash) {

  return cp.execSync(`git log -n 1 --pretty=format:%s ${hash}`)
    .toString()
    .trim();

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
      reflog[idx].tag = tag;
    }

  } );

  // reflog.forEach( rli => rli['title'] = get_branch_name_for_hash(rli.commit_hash) );

  const repo_url = remote_to_web_url( get_remote_url() );

  return { tag_list, tag_hashes, reflog, not_found, repo_url };

}





function convert_to_json({ target, data }) {

  fs.writeFileSync( target, JSON.stringify( data ) );

}





function slug(text) {
  return text.replace( /[^a-zA-Z0-9-_]/g, '__' );
}





/**
 * Render one parsed reflog entry as a Markdown changelog section.
 *
 * @param item      A reflog entry: `commit_hash` and `commit_text`, plus the
 *                  optional `tag`, `date`, `author`, and `merge` fields.
 * @param repo_url  The repository's web base URL. When given, the commit hash
 *                  is linked to `<repo_url>/commit/<hash>`; when absent, the
 *                  hash is rendered as plain inline code with no link.
 * @returns The entry rendered as Markdown.
 */
function default_formatter(item, repo_url) {

  return `${

    item.tag
      ? `<a name="${slug(item.tag)}" />\n\n`
      : ''

  }##${

    item.tag
      ? ` [${item.tag}]`
      : ' [Untagged]'

  }${

    item.date
      ? ` - ${new Date(item.date).toLocaleDateString()} ${new Date(item.date).toLocaleTimeString()}`
      : ''

  }${

    item.commit_hash
      ? (repo_url
          ? `\n\nCommit [${item.commit_hash}](${repo_url}/commit/${item.commit_hash})`
          : `\n\nCommit \`${item.commit_hash}\``)
      : ''

  }${

    item.author
      ? `\n\nAuthor: \`${item.author}\``
      : ''

  }${

    item.merge
      ? `\n\nMerges [${item.merge.join(', ')}]`
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





function convert_to_md({ target, data, item_formatter, item_separator, preface, short, short_length, has_both, longname }) {

  const formatter = item_formatter || default_formatter,
        separator = item_separator || default_separator,
        prefix    = preface        || default_preface,
        is_short  = short          ?? false,
        use_sl    = short_length   ?? 10,
        use_both  = has_both       ?? false;

  let md = prefix;

  const merge_ct = data.reflog.length,
        rel_ct   = data.tag_list.length,
        notes    = [];

  if (merge_ct)             { notes.push(`${merge_ct} merges`); }
  if (rel_ct)               { notes.push(`${rel_ct} releases`); }
  if (is_short)             { notes.push(`Changlogging the last ${use_sl} commits`); }
  if (is_short && has_both) { notes.push(`Full changelog at [${longname}](${longname})`)}

  md += notes.join('; ');

  if (data.tag_list) {
    const sorted = data.tag_list.sort(sem_sort).reverse();
    md += '\n\n\n\n&nbsp;\n\n&nbsp;\n\nPublished tags:\n\n' + sorted.map(to_link).join(', ') + '\n';
  }

  const urefs = is_short? data.reflog.slice(0, use_sl) : data.reflog;

  urefs.map( (rli, i) => {
    md += default_separator(rli);
    md += formatter(rli, data.repo_url);
  } );

  return md;

}





function write_short_md(target, has_both, short_length, longname) {

  const data     = scan(),
        u_target = target || './CHANGELOG.md';

  fs.writeFileSync( u_target, convert_to_md({ u_target, data, short: true, has_both, short_length, longname }), { flag: 'w' } );

}





function write_long_md(target) {

  const data     = scan(),
        u_target = target || './CHANGELOG.long.md';

  fs.writeFileSync( u_target, convert_to_md({ u_target, data }), { flag: 'w' } );

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

  default_formatter,
  default_separator,

  write_short_md,
  write_long_md,

  parse_rl

};
