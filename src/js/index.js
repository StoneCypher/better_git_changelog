
const cp = require('child_process');

const reflog_parser = require('./reflog_parser.js'),
      parse_rl      = reflog_parser.parse;





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

  return tags_to_hashes(get_tag_list());

}





function get_reflog_data() {

  return cp.execSync('git --no-pager log --reflog')
    .toString()
    .trim() + '\n\n';

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

  reflog.forEach( rli => rli['title'] = get_commit_message_for_hash(rli.commit_hash) );

  return { tag_list, tag_hashes, reflog, not_found };

}





module.exports = {

  scan,

  get_reflog_data,
  get_tag_list,
  tag_to_hash,
  tags_to_hashes,
  get_tags_as_hashes,

  parse_rl

};
