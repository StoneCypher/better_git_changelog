# Changelog

All notable changes to this project will be documented in this file.

55 merges; 9 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





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




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 10:08:44 PM

Commit [56638f08a775de1d034a63250a7b1f382ec80184](https://github.com/StoneCypher/better_git_changelog/commit/56638f08a775de1d034a63250a7b1f382ec80184)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [1e403b0, 83f760f]

  * Merge origin/main into fix_26-05-17_commit-url_2
  * PR #4 (CLI i18n) merged to main and also rewrote default_formatter. Conflict resolved: default_formatter is now (item, tr, repo_url) — both translator-aware (from the i18n work) and repo-URL-aware (this branch's issue #2 fix). Also untracks .claude/settings.local.json, a per-machine file committed by mistake, and adds it to .gitignore.




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 9:42:21 PM

Commit [1e403b0c35bd75c6b1cc09ec42a2acea7ccd1cbb](https://github.com/StoneCypher/better_git_changelog/commit/1e403b0c35bd75c6b1cc09ec42a2acea7ccd1cbb)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: derive commit URLs from the git remote
  * The changelog formatter hardcoded https://github.com/StoneCypher/jssm as the commit-link base, so every generated changelog linked its commits to an unrelated repository. Commit URLs are now built from the origin remote (parsed from git remote get-url), falling back to a plain unlinked hash when no hosted remote exists. Reported in #2.




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 9:23:28 PM

Commit [83f760f9eb8fc316b4d16a0650c42354a7b3af58](https://github.com/StoneCypher/better_git_changelog/commit/83f760f9eb8fc316b4d16a0650c42354a7b3af58)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [64587df, 297f6da]

  * Merge pull request #4 from StoneCypher/feat_26-05-17_cli-i18n
  * feat: internationalize the CLI with twelve languages




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 9:18:31 PM

Commit [297f6da977a247f7711b36165287511e4f57387c](https://github.com/StoneCypher/better_git_changelog/commit/297f6da977a247f7711b36165287511e4f57387c)

Author: `John Haugeland <stonecypher@gmail.com>`

  * change node versions supported in ci/cd