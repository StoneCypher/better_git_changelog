# Changelog

All notable changes to this project will be documented in this file.

12 merges; 13 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__17">1.6.17</a>, <a href="#1__6__16">1.6.16</a>, <a href="#1__6__15">1.6.15</a>, <a href="#1__6__6">1.6.6</a>, <a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:07:54 AM

Commit [b20d6dbf61e1dad9bdc7f5ab419a10cc26af485c](https://github.com/StoneCypher/better_git_changelog/commit/b20d6dbf61e1dad9bdc7f5ab419a10cc26af485c)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: pin setup-node to 24 across the matrix
  * The setup-node step was reading matrix.node-version, so each matrix
row provisioned the Node version it declared. Replace both references
with the literal 24 so every row uses Node 24 regardless of the
matrix entry's node-version field.




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:16:18 AM

Commit [39b77234b2a6083dfb5871e7aea5604a84e90b26](https://github.com/StoneCypher/better_git_changelog/commit/39b77234b2a6083dfb5871e7aea5604a84e90b26)

Author: `John Haugeland <stonecypher@gmail.com>`

  * test: raise fast-check iteration count in CI runs
  * Configure fast-check globally to use 1000 numRuns per property when
process.env.CI is set, and the default 100 otherwise. GitHub Actions
sets CI=true automatically; local invocations stay fast.
  * Observed timing on this branch: ~670ms local (100 runs/prop) vs.
~2.3s in CI mode (1000 runs/prop). Trade-off is well inside the slack
budget of an existing CI job.
  * Closes #25




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:16:18 AM

Commit [d637482aa02c1758af558ccb431bf1cc844532b2](https://github.com/StoneCypher/better_git_changelog/commit/d637482aa02c1758af558ccb431bf1cc844532b2)

Author: `John Haugeland <stonecypher@gmail.com>`

  * test: raise fast-check iteration count in CI runs
  * Configure fast-check globally to use 1000 numRuns per property when
process.env.CI is set, and the default 100 otherwise. GitHub Actions
sets CI=true automatically; local invocations stay fast.
  * Observed timing on this branch: ~670ms local (100 runs/prop) vs.
~2.3s in CI mode (1000 runs/prop). Trade-off is well inside the slack
budget of an existing CI job.
  * Closes #25




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:13:03 AM

Commit [1b25002dd1f7d5d6e444fbe6cdb898e9567fdc60](https://github.com/StoneCypher/better_git_changelog/commit/1b25002dd1f7d5d6e444fbe6cdb898e9567fdc60)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: split test execution into unit and property steps
  * Replace the bundled "npm install, build, and test" step with three
distinct steps: install+build, then `npm run test:unit`, then
`npm run test:property`. Each test suite now produces its own check
entry in the GitHub PR UI and its own clearly-bounded log section, so
a property-test shrink output doesn't get buried among unit assertions.
  * Supersedes #23 / PR #27 (which added a single bundled `npm test`).
  * Closes #24




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 1:55:54 AM

Commit [94d66c7b9a052c2ab3c3736b1124e519891b95ad](https://github.com/StoneCypher/better_git_changelog/commit/94d66c7b9a052c2ab3c3736b1124e519891b95ad)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [2f14edb, 4ccc9b0]

  * Merge pull request #31 from StoneCypher/fix_26-05-23_short-hash-variable-length_30
  * fix: accept short hashes longer than 7 chars in Merge: rows




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:13:03 AM

Commit [642e16ad5919125cdb2d655dfd59ba72e3e53016](https://github.com/StoneCypher/better_git_changelog/commit/642e16ad5919125cdb2d655dfd59ba72e3e53016)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: split test execution into unit and property steps
  * Replace the bundled "npm install, build, and test" step with three
distinct steps: install+build, then `npm run test:unit`, then
`npm run test:property`. Each test suite now produces its own check
entry in the GitHub PR UI and its own clearly-bounded log section, so
a property-test shrink output doesn't get buried among unit assertions.
  * Supersedes #23 / PR #27 (which added a single bundled `npm test`).
  * Closes #24




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:24:49 AM

Commit [4ccc9b073b4dfb9527e75067134c40962ae10a97](https://github.com/StoneCypher/better_git_changelog/commit/4ccc9b073b4dfb9527e75067134c40962ae10a97)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: accept short hashes longer than 7 chars in Merge: rows
  * The PEG grammar's ShortHash production hardcoded exactly seven hex
characters. Once a repository's object set crosses git's auto-abbrev
threshold (typically mid-thousands of commits, shape-dependent), git
log emits 8+ character short hashes and the parser dies at the 8th
character with "expected newline". Reported against 1.6.16 with a
b0eda7bf shape; users worked around it with core.abbrev=7.
  * Widen ShortHash to `Hex Hex Hex Hex Hex*` — four mandatory hex
characters (git's documented --abbrev minimum) plus zero-or-more
additional. PEG's greedy match plus the existing space/newline
terminator in MergeRow keeps it unambiguous in context. The
regenerated reflog_parser.js is included.
  * This is the second bug in the same MergeRow area; the first
(3+ parents) was fixed in e23fbdc / 1.6.6. The property suite added
in PR #22 is mis-scoped against this class of bug (generator
hardcoded to seven chars, matching the parser) and will be addressed
in a follow-up.
  * Closes #30




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:24:49 AM

Commit [bfb13e576e848578d739cb54c9dd6973c0d2f0a3](https://github.com/StoneCypher/better_git_changelog/commit/bfb13e576e848578d739cb54c9dd6973c0d2f0a3)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: accept short hashes longer than 7 chars in Merge: rows
  * The PEG grammar's ShortHash production hardcoded exactly seven hex
characters. Once a repository's object set crosses git's auto-abbrev
threshold (typically mid-thousands of commits, shape-dependent), git
log emits 8+ character short hashes and the parser dies at the 8th
character with "expected newline". Reported against 1.6.16 with a
b0eda7bf shape; users worked around it with core.abbrev=7.
  * Widen ShortHash to `Hex Hex Hex Hex Hex*` — four mandatory hex
characters (git's documented --abbrev minimum) plus zero-or-more
additional. PEG's greedy match plus the existing space/newline
terminator in MergeRow keeps it unambiguous in context. The
regenerated reflog_parser.js is included.
  * This is the second bug in the same MergeRow area; the first
(3+ parents) was fixed in e23fbdc / 1.6.6. The property suite added
in PR #22 is mis-scoped against this class of bug (generator
hardcoded to seven chars, matching the parser) and will be addressed
in a follow-up.
  * Closes #30




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:10:24 AM

Commit [c4c09fa48ff7776de6999091a31c10d012a0323a](https://github.com/StoneCypher/better_git_changelog/commit/c4c09fa48ff7776de6999091a31c10d012a0323a)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: run the test suite in CI
  * The build step was named "npm install, build, and test" but its body
only ran `npm install && npm run build`, so assertions never executed
on push. This is the root pattern that let the 3+ parent Merge: row
bug ship in 1.6.3 without local catch.
  * Append `&& npm test` to the run line so the full node:test suite
runs on every push across the existing node/OS matrix. The step
name is now accurate.
  * Closes #23




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:10:24 AM

Commit [57d7f49f02a9e614f5b50ae7a0211f0eee5f4ea7](https://github.com/StoneCypher/better_git_changelog/commit/57d7f49f02a9e614f5b50ae7a0211f0eee5f4ea7)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: run the test suite in CI
  * The build step was named "npm install, build, and test" but its body
only ran `npm install && npm run build`, so assertions never executed
on push. This is the root pattern that let the 3+ parent Merge: row
bug ship in 1.6.3 without local catch.
  * Append `&& npm test` to the run line so the full node:test suite
runs on every push across the existing node/OS matrix. The step
name is now accurate.
  * Closes #23