# Changelog

All notable changes to this project will be documented in this file.

17 merges; 14 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__18">1.6.18</a>, <a href="#1__6__17">1.6.17</a>, <a href="#1__6__16">1.6.16</a>, <a href="#1__6__15">1.6.15</a>, <a href="#1__6__6">1.6.6</a>, <a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





&nbsp;

&nbsp;

## [Untagged] - May 27, 2026 12:07:31 AM

Commit [9fbe24af2eaea6cf93b8bdb06e40e336e6928c6f](https://github.com/StoneCypher/better_git_changelog/commit/9fbe24af2eaea6cf93b8bdb06e40e336e6928c6f)

Author: `John Haugeland <stonecypher@gmail.com>`

  * chore(release): 1.6.19
  * Versions 1.6.17 and 1.6.18 reached GitHub (tag + release) but never
landed on npm; latest published is still 1.6.16. The release job
pushes the git tag before it attempts `npm publish`, so when publish
failed the tag was already on the remote and the "tag exists" gate
short-circuited every subsequent run. Bumping past 1.6.18 gives the
workflow a fresh version the gate has not seen, so it will attempt
to publish 1.6.19 (succeeds once a Trusted Publisher is registered
for the package on npmjs.com).
  * Regenerates CHANGELOG.md and CHANGELOG.long.md from the build; no
source changes.




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 2:27:03 AM

Commit [c198ba682da2ecaa8fa448efdddbe9a9e9d5beed](https://github.com/StoneCypher/better_git_changelog/commit/c198ba682da2ecaa8fa448efdddbe9a9e9d5beed)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [87635e1, 6b35624]

  * Merge pull request #33 from StoneCypher/test_26-05-23_widen-property-generator_32
  * test: widen property-suite shortHash generator to git's real range




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 2:26:17 AM

Commit [6b356244cd9fd705bba2b1637104210aadffc696](https://github.com/StoneCypher/better_git_changelog/commit/6b356244cd9fd705bba2b1637104210aadffc696)

Author: `John Haugeland <stonecypher@gmail.com>`

  * test: widen property-suite shortHash generator to git's real range
  * The shortHash generator was coupled to the parser's pre-#31 hardcode
(exactly 7 hex chars), so the round-trip properties confirmed only
that "the parser handles what the parser handles." The 8-char
auto-abbrev bug (issue #30, fixed in #31) is the canonical proof:
the property suite was written expressly to catch that class of
parser bug and would not have caught the actual instance.
  * Widen the generator to 4..12 chars — git's documented --abbrev
minimum through a comfortable upper bound for large-repo auto-abbrev.
Now the property tests bite if the grammar ever re-narrows.
  * Also adds a header comment documenting the methodology lesson for
future contributors: generators should track the contract of the
input source (what `git log --reflog` actually emits), not the
implementation's accepted range.
  * Closes #32




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 2:23:59 AM

Commit [87635e1b7aac14e22505fe68c269c91fdf369d23](https://github.com/StoneCypher/better_git_changelog/commit/87635e1b7aac14e22505fe68c269c91fdf369d23)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [b6985f8, ed8b265]

  * Merge pull request #29 from StoneCypher/test_26-05-23_property-test-numruns_25
  * test: raise fast-check iteration count in CI runs




&nbsp;

&nbsp;

## [Untagged] - May 23, 2026 12:16:18 AM

Commit [ed8b2658418c2c43962d768a9416a4dbd33a135b](https://github.com/StoneCypher/better_git_changelog/commit/ed8b2658418c2c43962d768a9416a4dbd33a135b)

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