# Changelog

All notable changes to this project will be documented in this file.

15 merges; 13 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__17">1.6.17</a>, <a href="#1__6__16">1.6.16</a>, <a href="#1__6__15">1.6.15</a>, <a href="#1__6__6">1.6.6</a>, <a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:16:18 AM

Commit [60ff29b9fef201263dd6373480f299fe18f0f83a](https://github.com/StoneCypher/better_git_changelog/commit/60ff29b9fef201263dd6373480f299fe18f0f83a)

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

## [Untagged] - May 23, 2026 2:20:45 AM

Commit [b6985f8169e6326fa524d79c84e0ed293a97280c](https://github.com/StoneCypher/better_git_changelog/commit/b6985f8169e6326fa524d79c84e0ed293a97280c)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [7c424bd, dfbe360]

  * Merge pull request #28 from StoneCypher/ci_26-05-23_split-unit-property-tests_24
  * ci: split test execution into unit and property steps




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:13:03 AM

Commit [dfbe3601b219cb5dafb825678999eb50a28b6aa6](https://github.com/StoneCypher/better_git_changelog/commit/dfbe3601b219cb5dafb825678999eb50a28b6aa6)

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

## [Untagged] - May 23, 2026 12:13:03 AM

Commit [23038e7a0fe16a3bf50994c27dde550b71b00ce1](https://github.com/StoneCypher/better_git_changelog/commit/23038e7a0fe16a3bf50994c27dde550b71b00ce1)

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

## [Untagged] - May 23, 2026 2:17:02 AM

Commit [7c424bd9609de210008ef32f28b4961bc16da507](https://github.com/StoneCypher/better_git_changelog/commit/7c424bd9609de210008ef32f28b4961bc16da507)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [a208c36, 7eeaf14]

  * Merge pull request #27 from StoneCypher/ci_26-05-22_npm-test-in-ci_23
  * ci: run the test suite in CI




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:10:24 AM

Commit [7eeaf148a1087d688b00f9007f7937a41cd3a71f](https://github.com/StoneCypher/better_git_changelog/commit/7eeaf148a1087d688b00f9007f7937a41cd3a71f)

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

Commit [8af57bc0e39055c7c31833ff24ba78cf3792d25f](https://github.com/StoneCypher/better_git_changelog/commit/8af57bc0e39055c7c31833ff24ba78cf3792d25f)

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

## [Untagged] - May 23, 2026 2:10:17 AM

Commit [a208c36ab119fd3cbd8efde74e7840740de434ee](https://github.com/StoneCypher/better_git_changelog/commit/a208c36ab119fd3cbd8efde74e7840740de434ee)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [94d66c7, 42fd16a]

  * Merge pull request #26 from StoneCypher/ci_26-05-23_pin-node-24
  * ci: pin setup-node to 24 across the matrix




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:07:54 AM

Commit [42fd16a2b374ba8e81447e5b3c476039b328b8a8](https://github.com/StoneCypher/better_git_changelog/commit/42fd16a2b374ba8e81447e5b3c476039b328b8a8)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: pin setup-node to 24 across the matrix
  * The setup-node step was reading matrix.node-version, so each matrix
row provisioned the Node version it declared. Replace both references
with the literal 24 so every row uses Node 24 regardless of the
matrix entry's node-version field.




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