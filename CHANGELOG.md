# Changelog

All notable changes to this project will be documented in this file.

10 merges; 12 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__16">1.6.16</a>, <a href="#1__6__15">1.6.15</a>, <a href="#1__6__6">1.6.6</a>, <a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





&nbsp;

&nbsp;

## [Untagged] - May 20, 2026 4:50:13 PM

Commit [5555714d943d48f9a4afb51609f7aed4a4c92191](https://github.com/StoneCypher/better_git_changelog/commit/5555714d943d48f9a4afb51609f7aed4a4c92191)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [dad8713, 539ecbb]

  * Merge pull request #21 from StoneCypher/feat_26-05-18_ship-type-declarations_20
  * Ship verified TypeScript type declarations




&nbsp;

&nbsp;

## [Untagged] - May 20, 2026 4:45:08 PM

Commit [539ecbb1f59b9bca371568bfa9c9cf14da41964a](https://github.com/StoneCypher/better_git_changelog/commit/539ecbb1f59b9bca371568bfa9c9cf14da41964a)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: temporarily disable attw type-correctness gate
  * The published @arethetypeswrong/cli@0.18.2 crashes with 'Cannot read properties of undefined (reading filename)' when invoked after 'npm install -g' in CI, on every matrix combo. The same version installed via 'npx' passes locally — so it appears to be a published-artifact / global-install bug, not our package's types. Disabling the gate to unblock builds. The .d.ts files are still generated and shipped; check-dts smoke test still gates the build; the check-types npm script is retained for manual local use against the linked attw fork.




&nbsp;

&nbsp;

## [Untagged] - May 20, 2026 4:00:47 PM

Commit [a6aee18330c2b03903a7448400ff6f11bc268ce2](https://github.com/StoneCypher/better_git_changelog/commit/a6aee18330c2b03903a7448400ff6f11bc268ce2)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: pin attw to 0.18.2 (the published @latest crashes despite same version)
  * @arethetypeswrong/cli@latest currently resolves to 0.18.2 but the install of the @latest tag crashes with 'Cannot read properties of undefined (reading filename)' on every matrix combo. Invoking @0.18.2 explicitly works (verified locally). Pin to that exact version until the published @latest is stable.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 10:50:04 PM

Commit [4704025482be3c61e6a28e02bdc49005eb491a1e](https://github.com/StoneCypher/better_git_changelog/commit/4704025482be3c61e6a28e02bdc49005eb491a1e)

Author: `John Haugeland <stonecypher@gmail.com>`

  * test: add a TypeScript smoke test for the published declarations
  * type-tests/smoke.ts imports the package by name (through the exports map, as a consumer would) and asserts the shipped .d.ts signatures, with @ts-expect-error blocks guarding against silent regression to any. Wired into build via the check-dts script.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 10:44:30 PM

Commit [d53f342e6bec67b1156f92895b2b753f1df19fb9](https://github.com/StoneCypher/better_git_changelog/commit/d53f342e6bec67b1156f92895b2b753f1df19fb9)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: provision attw and build before publishing
  * The build job installs the published @arethetypeswrong/cli so build's new attw type-check can run. The release job now installs deps and runs the build before npm publish, so the generated dist/types declarations are present in the published tarball (the job previously published from a raw checkout).




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 10:41:30 PM

Commit [2c338a7bc9b0fcc0a74735422faa572181fbcb42](https://github.com/StoneCypher/better_git_changelog/commit/2c338a7bc9b0fcc0a74735422faa572181fbcb42)

Author: `John Haugeland <stonecypher@gmail.com>`

  * build: ship type declarations and trim the published package
  * Adds types/exports pointing at the generated declarations, an engines field matching the documented Node requirement, and a files allowlist so the tarball no longer publishes test fixtures or grammar sources. build now generates declarations and gates on an attw check.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 10:39:10 PM

Commit [c58746d55e1a3badc058fa005c9658bbf3acd7af](https://github.com/StoneCypher/better_git_changelog/commit/c58746d55e1a3badc058fa005c9658bbf3acd7af)

Author: `John Haugeland <stonecypher@gmail.com>`

  * build: add declaration-emit tsconfig and PEG parser typings
  * tsconfig.json emits .d.ts from the JSDoc-annotated CommonJS sources into dist/types. reflog_parser.d.ts types the generated PEG parser; parse_rl is given an explicit @type so the emitted index.d.ts is self-contained.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 6:07:47 PM

Commit [566c1a4227188598d6905ecf4c5ae1b852761353](https://github.com/StoneCypher/better_git_changelog/commit/566c1a4227188598d6905ecf4c5ae1b852761353)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: add typed JSDoc and shared typedefs to index.js and i18n.js
  * Completes the JSDoc type surface so tsc can emit accurate .d.ts files. Introduces ReflogEntry, ScanResult, ScanAllResult, and Translator typedefs and types every exported function's params and returns.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 3:57:36 PM

Commit [dad87139fece628a2c19ade36659f0a04a68556d](https://github.com/StoneCypher/better_git_changelog/commit/dad87139fece628a2c19ade36659f0a04a68556d)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [8031880, 4f34e23]

  * Merge pull request #19 from StoneCypher/refactor_26-05-18_extract-cli-core
  * refactor: extract testable CLI logic into cli_core.js for coverage




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 3:51:30 PM

Commit [4f34e23888e539fe67add3305fe223bd43a25e0e](https://github.com/StoneCypher/better_git_changelog/commit/4f34e23888e539fe67add3305fe223bd43a25e0e)

Author: `John Haugeland <stonecypher@gmail.com>`

  * refactor: extract testable CLI logic into cli_core.js
  * cli.js was a procedural entry-point script with no testable surface — its argv pre-scan, the -S validator, and the long/short/both decision logic were not reachable by the coverage instrumentation. Those three pure functions now live in cli_core.js with full unit tests (cli_core.test.js, 100% covered); cli.js requires them. No behavior change — the build's self-run confirms the CLI still works. Overall line coverage rises 93.0% to 94.1%, branch 85.0% to 88.9%.