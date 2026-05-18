# Changelog

All notable changes to this project will be documented in this file.

4 merges; 9 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 9:55:25 AM

Commit [c5e90a724cdf065a41b7a08b6db20755d8b7a3f4](https://github.com/StoneCypher/better_git_changelog/commit/c5e90a724cdf065a41b7a08b6db20755d8b7a3f4)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: count merge commits, not all commits, in the summary line
  * The changelog summary rendered data.reflog.length through the 'merges' string, so it reported every commit as a merge (e.g. '441 merges' when 441 was the total entry count). It now counts only entries that actually carry a merge field.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 9:48:07 AM

Commit [1025797c006f88bb9f724467a9c636729cd22254](https://github.com/StoneCypher/better_git_changelog/commit/1025797c006f88bb9f724467a9c636729cd22254)

Author: `John Haugeland <stonecypher@gmail.com>`

  * refactor: remove dead get_commit_message_for_hash
  * get_commit_message_for_hash was never called and never exported, so it was unreachable code — and it carried the same string-interpolated execSync injection pattern that was fixed in tag_to_hash. Removing it eliminates both. No test accompanies this change because there was nothing reachable to test; the existing suite still passes, confirming nothing depended on it.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 9:45:29 AM

Commit [fce0d5b67f5895be5bbb180cfaaed32f885eeb5e](https://github.com/StoneCypher/better_git_changelog/commit/fce0d5b67f5895be5bbb180cfaaed32f885eeb5e)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: keep every tag when a commit has more than one
  * scan() did reflog[idx].tag = tag, so when several tags pointed at the same commit each assignment overwrote the previous and only the last survived. scan() now collects them into an array. default_formatter accepts either a single tag or an array, emitting an anchor per tag and listing them all in the heading, so every tag's index link still resolves.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 9:01:30 AM

Commit [02861f9b9ed1dacccb59c87338dc9f53077e6838](https://github.com/StoneCypher/better_git_changelog/commit/02861f9b9ed1dacccb59c87338dc9f53077e6838)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: stop convert_to_md from mutating the caller's tag_list
  * convert_to_md sorted data.tag_list with Array.prototype.sort, which sorts in place — so it reordered the caller's array (the scan() result) as a side effect. It now sorts a copy.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 8:57:57 AM

Commit [472d3b4556fd667deb2f5f4c7fd7b0f278a79092](https://github.com/StoneCypher/better_git_changelog/commit/472d3b4556fd667deb2f5f4c7fd7b0f278a79092)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: declare fs instead of leaking it as a global
  * index.js assigned fs = require('fs') with no const/let/var, which created an implicit global in sloppy mode and would throw a ReferenceError under strict mode. It is now part of the adjacent const declaration.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 7:12:46 AM

Commit [70f1c013dcc7120b3565b4ca1ba4691cf9c7cedf](https://github.com/StoneCypher/better_git_changelog/commit/70f1c013dcc7120b3565b4ca1ba4691cf9c7cedf)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: remove shell-injection risk in tag_to_hash
  * tag_to_hash interpolated the tag name into a shell command string passed to execSync. Git tag names may legally contain shell metacharacters, so a hostile tag could execute arbitrary commands. It now uses execFileSync with an argument array — no shell, the tag is a single literal argument. (get_commit_message_for_hash has the same pattern but is dead code; it is removed in a later PR in this series.)




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 7:05:59 AM

Commit [6e689419cfad9725f255c8b3a69506bbfdb53557](https://github.com/StoneCypher/better_git_changelog/commit/6e689419cfad9725f255c8b3a69506bbfdb53557)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: honor the item_separator option in convert_to_md
  * convert_to_md resolved separator = item_separator || default_separator but the render loop then called default_separator directly, so a caller-supplied item_separator was silently ignored. The loop now calls the resolved separator.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 7:00:47 AM

Commit [e23fbdc457ca77fbfdab56de1fc25c346f1067d8](https://github.com/StoneCypher/better_git_changelog/commit/e23fbdc457ca77fbfdab56de1fc25c346f1067d8)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: parse octopus merges with three or more parents
  * The PEG grammar's MergeRow accepted exactly two parent hashes, so a merge commit with 3+ parents (an octopus merge) failed to parse and crashed parse_rl. MergeRow now accepts one parent followed by one or more additional parents, returning the full list. The regenerated reflog_parser.js is included.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 12:56:53 AM

Commit [6673f2edea33d8298027baabc0c3403a15ee24a9](https://github.com/StoneCypher/better_git_changelog/commit/6673f2edea33d8298027baabc0c3403a15ee24a9)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: tolerate non-semver tags in changelog generation
  * sem_sort called semver.lt/gt directly, which throw on any tag that is not valid semver; convert_to_md sorts the tag list with it, so a single tag like 'nightly' crashed the whole run. sem_sort now validates first: valid semver tags compare by precedence, non-semver tags compare lexically and sort after, and nothing throws.




&nbsp;

&nbsp;

<a name="1__6__5" />

## [1.6.5] - May 17, 2026 10:11:37 PM

Commit [bf0422f736a08de7fb3aaa04a5010076d854d0c5](https://github.com/StoneCypher/better_git_changelog/commit/bf0422f736a08de7fb3aaa04a5010076d854d0c5)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [83f760f, 56638f0]

  * Merge pull request #5 from StoneCypher/fix_26-05-17_commit-url_2
  * fix: derive commit URLs from the git remote