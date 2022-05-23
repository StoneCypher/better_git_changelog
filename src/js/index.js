
const cp = require('child_process');
      fs = require('fs');

const reflog_parser = require('./reflog_parser.js'),
      parse_rl      = reflog_parser.parse;





const default_preface = "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n";





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





// function get_branch_name_for_hash(hash) {

//   return cp.execSync(`git name-rev ${hash}`)
//     .toString()
//     .trim();

// }





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

  // reflog.forEach( rli => rli['title'] = get_branch_name_for_hash(rli.commit_hash) );

  return { tag_list, tag_hashes, reflog, not_found };

}





function convert_to_json({ target, data }) {

  fs.writeFileSync( target, JSON.stringify( data ) );

}





function slug(text) {
  return text.replace( /[^a-zA-Z0-9-_]/g, '__' );
}





function default_formatter(item) {

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
      ? `\n\nCommit \`${item.commit_hash}\``
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





function convert_to_md({ target, data, item_formatter, item_separator, preface }) {

  const formatter = item_formatter || default_formatter,
        separator = item_separator || default_separator,
        prefix    = preface        || default_preface;

  let md = prefix;

  if (data.tags) {
    prefix += '\n\n' + data.tags.join(', ') + '\n\n';
  }

  data.reflog.map( (rli, i) => {
    md += default_separator(rli);
    md += formatter(rli);
  } );

  return md;

}





function write_md(target) {

  const data     = scan(),
        u_target = target || './CHANGELOG.md';

  fs.writeFileSync( u_target, convert_to_md({ u_target, data }), { flag: 'w' } );

}





module.exports = {

  scan,

  get_reflog_data,
  get_tag_list,
  tag_to_hash,
  tags_to_hashes,
  get_tags_as_hashes,
  // get_branch_name_for_hash,

  convert_to_json,
  convert_to_md,

  default_formatter,
  default_separator,

  write_md,

  parse_rl

};
