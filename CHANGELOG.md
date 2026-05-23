# Changelog

All notable changes to this project will be documented in this file.

11 merges; 13 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__17">1.6.17</a>, <a href="#1__6__16">1.6.16</a>, <a href="#1__6__15">1.6.15</a>, <a href="#1__6__6">1.6.6</a>, <a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





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




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:07:54 AM

Commit [45fa5c87fd867f2451048ba2194689bcc896971c](https://github.com/StoneCypher/better_git_changelog/commit/45fa5c87fd867f2451048ba2194689bcc896971c)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: pin setup-node to 24 across the matrix
  * The setup-node step was reading matrix.node-version, so each matrix
row provisioned the Node version it declared. Replace both references
with the literal 24 so every row uses Node 24 regardless of the
matrix entry's node-version field.




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:07:54 AM

Commit [ff0f0f332586563f21dd5d3868066eab10e5c244](https://github.com/StoneCypher/better_git_changelog/commit/ff0f0f332586563f21dd5d3868066eab10e5c244)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: pin setup-node to 24 across the matrix
  * The setup-node step was reading matrix.node-version, so each matrix
row provisioned the Node version it declared. Replace both references
with the literal 24 so every row uses Node 24 regardless of the
matrix entry's node-version field.




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:24:49 AM

Commit [b74c349b9f6f989447376d2128e29f0ac5000c8c](https://github.com/StoneCypher/better_git_changelog/commit/b74c349b9f6f989447376d2128e29f0ac5000c8c)

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

## [Untagged] - May 23, 2026 12:16:18 AM

Commit [a9e089bd06969253f9e7a202a305566e2843b66c](https://github.com/StoneCypher/better_git_changelog/commit/a9e089bd06969253f9e7a202a305566e2843b66c)

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

Commit [b3ab0a55cbdaed33c271f82106e0dbec2988fe5a](https://github.com/StoneCypher/better_git_changelog/commit/b3ab0a55cbdaed33c271f82106e0dbec2988fe5a)

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

## [Untagged] - May 23, 2026 12:10:24 AM

Commit [153d3b542152b1daa162d213fce6363e25b8aa98](https://github.com/StoneCypher/better_git_changelog/commit/153d3b542152b1daa162d213fce6363e25b8aa98)

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

## [Untagged] - May 23, 2026 12:07:54 AM

Commit [e01caaea01ad77d5188767355fb1eec8487bf9fa](https://github.com/StoneCypher/better_git_changelog/commit/e01caaea01ad77d5188767355fb1eec8487bf9fa)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: pin setup-node to 24 across the matrix
  * The setup-node step was reading matrix.node-version, so each matrix
row provisioned the Node version it declared. Replace both references
with the literal 24 so every row uses Node 24 regardless of the
matrix entry's node-version field.