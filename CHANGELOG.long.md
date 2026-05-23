# Changelog

All notable changes to this project will be documented in this file.

10 merges; 12 releases



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




&nbsp;

&nbsp;

<a name="1__6__16" />

## [1.6.16] - May 18, 2026 3:41:17 PM

Commit [80318800063d3480e736f1448c3e5cd89424d764](https://github.com/StoneCypher/better_git_changelog/commit/80318800063d3480e736f1448c3e5cd89424d764)

Author: `John Haugeland <stonecypher@gmail.com>`

  * tag under node 24




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 2:22:25 PM

Commit [5ae8f70f0dca34e29de777379e07db06ad3b884d](https://github.com/StoneCypher/better_git_changelog/commit/5ae8f70f0dca34e29de777379e07db06ad3b884d)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [086752a, 0e2a202]

  * Merge pull request #18 from StoneCypher/ci_26-05-18_release-guard
  * ci: skip release and publish when the version is unchanged




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 1:58:44 PM

Commit [0e2a2025d6fba342b2d06acbeffcc85456df6a97](https://github.com/StoneCypher/better_git_changelog/commit/0e2a2025d6fba342b2d06acbeffcc85456df6a97)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: skip release and publish when the version is unchanged
  * The release job ran on every owner push to main and unconditionally created a GitHub release for package.json's version. A push that does not bump the version (such as a CI-only change) re-ran it for an already-released version, and actions/create-release failed with 'tag_name already_exists' (npm publish would reject the duplicate too). A new step checks whether the version's tag already exists on origin; push-tags, create-release, upgrade-npm and publish now run only when the version is new.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 11:01:29 AM

Commit [086752a9aa8b91d27b334384c7a309c25e288941](https://github.com/StoneCypher/better_git_changelog/commit/086752a9aa8b91d27b334384c7a309c25e288941)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [b9de48f, 5353e38]

  * Merge pull request #17 from StoneCypher/ci_26-05-18_npm-trusted-publishing
  * ci: publish to npm via OIDC trusted publishing




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 11:00:01 AM

Commit [5353e38704c6d5dbf12af00931544c9af322e0c9](https://github.com/StoneCypher/better_git_changelog/commit/5353e38704c6d5dbf12af00931544c9af322e0c9)

Author: `John Haugeland <stonecypher@gmail.com>`

  * ci: publish to npm via OIDC trusted publishing
  * The release job published with a long-lived NODE_AUTH_TOKEN, which no longer works under npm's current auth model. It now uses trusted publishing: an id-token:write permission lets npm authenticate via GitHub's OIDC, an upgrade-npm step ensures npm is new enough (>= 11.5.1) to support it, and the NODE_AUTH_TOKEN secret reference is removed. Also bumps actions/checkout (v1 and v2) and actions/setup-node (v1) to v4. The package's trusted publisher must be registered on npmjs.com before the next release.




&nbsp;

&nbsp;

<a name="1__6__15" />

## [1.6.15] - May 18, 2026 10:47:50 AM

Commit [b9de48f2cc9ee560f9845589b2673a3a093c8161](https://github.com/StoneCypher/better_git_changelog/commit/b9de48f2cc9ee560f9845589b2673a3a093c8161)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [5883848, 42ac85b]

  * Merge pull request #16 from StoneCypher/fix_26-05-18_short-length
  * fix: land bug fixes 2-10 on main




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 10:08:03 AM

Commit [42ac85b8a5a22ffd1579210ada68ad6de517df6b](https://github.com/StoneCypher/better_git_changelog/commit/42ac85b8a5a22ffd1579210ada68ad6de517df6b)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: reject a non-numeric --short-length instead of emptying the changelog
  * opts.shortLength was an unvalidated string; -S abc became slice(0, NaN), silently producing an empty changelog with no error. -S now has a commander argument parser that coerces the value to a positive integer and raises InvalidArgumentError on anything else, so a bad value fails the run loudly.




&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 9:55:25 AM

Commit [c5e90a724cdf065a41b7a08b6db20755d8b7a3f4](https://github.com/StoneCypher/better_git_changelog/commit/c5e90a724cdf065a41b7a08b6db20755d8b7a3f4)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: count merge commits, not all commits, in the summary line
  * The changelog summary rendered data.reflog.length through the 'merges' string, so it reported every commit as a merge (e.g. '441 merges' when 441 was the total entry count). It now counts only entries that actually carry a merge field.




&nbsp;

&nbsp;

<a name="1__6__6" />

## [1.6.6] - May 18, 2026 9:49:04 AM

Commit [58838484bd9b901bb7cde398c854e67df3feb7d9](https://github.com/StoneCypher/better_git_changelog/commit/58838484bd9b901bb7cde398c854e67df3feb7d9)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [bf0422f, 6673f2e]

  * Merge pull request #6 from StoneCypher/fix_26-05-18_non-semver-tags
  * fix: tolerate non-semver tags in changelog generation




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




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 8:59:09 PM

Commit [80eecb624d3da4f17fbee01b9eb410042a0c2948](https://github.com/StoneCypher/better_git_changelog/commit/80eecb624d3da4f17fbee01b9eb410042a0c2948)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: clarify the Languages section with locale codes and accurate examples




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 5:09:40 PM

Commit [0f59cbe32c9564de264d5f83b963c01eb3181b3f](https://github.com/StoneCypher/better_git_changelog/commit/0f59cbe32c9564de264d5f83b963c01eb3181b3f)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: document CLI internationalization




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 5:07:03 PM

Commit [be7171150cdbbdd4c8d125b7cd65203fa5fd6306](https://github.com/StoneCypher/better_git_changelog/commit/be7171150cdbbdd4c8d125b7cd65203fa5fd6306)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: stop duplicate CLI error output and honor --ui-lang=fr form




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 4:51:07 PM

Commit [aa56d69ad100a30c23475144c0a8e01ca66dcaf7](https://github.com/StoneCypher/better_git_changelog/commit/aa56d69ad100a30c23475144c0a8e01ca66dcaf7)

Author: `John Haugeland <stonecypher@gmail.com>`

  * feat: wire i18n into the CLI




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 4:48:30 PM

Commit [2f99467d3c1d2b8edd857b3c4299eeb0a91b81f0](https://github.com/StoneCypher/better_git_changelog/commit/2f99467d3c1d2b8edd857b3c4299eeb0a91b81f0)

Author: `John Haugeland <stonecypher@gmail.com>`

  * refactor: tidy the content translator and document its separator limit




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 4:43:20 PM

Commit [ab792e40c877124f18986cb1a0559aac195a96ac](https://github.com/StoneCypher/better_git_changelog/commit/ab792e40c877124f18986cb1a0559aac195a96ac)

Author: `John Haugeland <stonecypher@gmail.com>`

  * feat: add changelog content translator




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 4:40:14 PM

Commit [566da299044cdc589ebdb488ef2ce78e234a1653](https://github.com/StoneCypher/better_git_changelog/commit/566da299044cdc589ebdb488ef2ce78e234a1653)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: document the localized rendering functions




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 4:09:57 PM

Commit [d17629c7e6ba18f4f1aa82795bfa8d8709ebad69](https://github.com/StoneCypher/better_git_changelog/commit/d17629c7e6ba18f4f1aa82795bfa8d8709ebad69)

Author: `John Haugeland <stonecypher@gmail.com>`

  * feat: localize generated changelog boilerplate




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 4:07:25 PM

Commit [4bc90ecb8cecf1be8d5a4dc3fd870b66053af466](https://github.com/StoneCypher/better_git_changelog/commit/4bc90ecb8cecf1be8d5a4dc3fd870b66053af466)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: document slug and cover non-ASCII digits




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 3:46:45 PM

Commit [727b2bff37d20b29c781dc3a6c68123c9e283381](https://github.com/StoneCypher/better_git_changelog/commit/727b2bff37d20b29c781dc3a6c68123c9e283381)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: make slug Unicode-aware




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 3:45:22 PM

Commit [a6592f9c8002ce18678c5f568eaa215813c000ce](https://github.com/StoneCypher/better_git_changelog/commit/a6592f9c8002ce18678c5f568eaa215813c000ce)

Author: `John Haugeland <stonecypher@gmail.com>`

  * refactor: harden locale check and document it




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 2:39:10 PM

Commit [f105895ecbc55d206a19431b0a4c523b6434c09f](https://github.com/StoneCypher/better_git_changelog/commit/f105895ecbc55d206a19431b0a4c523b6434c09f)

Author: `John Haugeland <stonecypher@gmail.com>`

  * feat: add locale completeness build-check




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 2:37:25 PM

Commit [ca2b652421851622b25da0fb6820dbafee263bba](https://github.com/StoneCypher/better_git_changelog/commit/ca2b652421851622b25da0fb6820dbafee263bba)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: correct Russian few-plural grammar and avoid a redundant locale read




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 2:30:18 PM

Commit [d4ffcf633e9ed2ddc7509b4a7391f46a12e02673](https://github.com/StoneCypher/better_git_changelog/commit/d4ffcf633e9ed2ddc7509b4a7391f46a12e02673)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: correct Spanish plural categories and restore the per-key fallback test




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 11:13:24 AM

Commit [7f6e1c7002dbb95b0de780138129369f4c948604](https://github.com/StoneCypher/better_git_changelog/commit/7f6e1c7002dbb95b0de780138129369f4c948604)

Author: `John Haugeland <stonecypher@gmail.com>`

  * feat: add twelve translated locale files




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 10:52:11 AM

Commit [2f97b049bae4a9a9fcff5d7568669faadb19cc67](https://github.com/StoneCypher/better_git_changelog/commit/2f97b049bae4a9a9fcff5d7568669faadb19cc67)

Author: `John Haugeland <stonecypher@gmail.com>`

  * feat: add full English reference locale




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 10:49:52 AM

Commit [497e06d3fc9a90e990a75ba6a72086d664405f2e](https://github.com/StoneCypher/better_git_changelog/commit/497e06d3fc9a90e990a75ba6a72086d664405f2e)

Author: `John Haugeland <stonecypher@gmail.com>`

  * refactor: address code review on the i18n module




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 1:30:09 AM

Commit [b58f14171972620350cd2a2169ea01a4e6e4c481](https://github.com/StoneCypher/better_git_changelog/commit/b58f14171972620350cd2a2169ea01a4e6e4c481)

Author: `John Haugeland <stonecypher@gmail.com>`

  * feat: add in-house i18n module




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 1:20:31 AM

Commit [42b32b6abe8c4548c206c3f359e9da5dd1cf02fe](https://github.com/StoneCypher/better_git_changelog/commit/42b32b6abe8c4548c206c3f359e9da5dd1cf02fe)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: rewrite README and refresh changelogs
  * Expand the README with a usage table, a programmatic-API section, a how-it-works walkthrough, requirements, and CI/npm badges. Regenerate CHANGELOG.md and CHANGELOG.long.md from current history.




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 1:20:23 AM

Commit [ae7d1bd30ca8e643df45bae8a5ee9a54fb912372](https://github.com/StoneCypher/better_git_changelog/commit/ae7d1bd30ca8e643df45bae8a5ee9a54fb912372)

Author: `John Haugeland <stonecypher@gmail.com>`

  * fix: make -l and -s flags restrict output
  * Remove the -b option default value that left bothForms always truthy, which forced the CLI to emit both forms regardless of -l/-s. Drop the spurious -- from the self build script, and name the program for help output. Also adds typescript and typescript-language-server dev tooling.




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 1:20:14 AM

Commit [962bbed32c0b4dd5f3240f80c26d5fd43ec6b256](https://github.com/StoneCypher/better_git_changelog/commit/962bbed32c0b4dd5f3240f80c26d5fd43ec6b256)

Author: `John Haugeland <stonecypher@gmail.com>`

  * perf: resolve all tags in a single git call
  * Replace the per-tag git rev-list loop in tags_to_hashes with one git for-each-ref. Each subprocess spawn costs ~130ms on Windows; on a 231-tag repository this cut changelog generation from ~81s to ~3s.




&nbsp;

&nbsp;

## [Untagged] - May 17, 2026 12:37:03 AM

Commit [25a60a7a7afbb9f2def12c7f204e1009fee98a8b](https://github.com/StoneCypher/better_git_changelog/commit/25a60a7a7afbb9f2def12c7f204e1009fee98a8b)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: add CLI i18n implementation plan
  * Nine-task TDD plan covering the i18n module, twelve locale files, the
locale build-check, a Unicode-aware slugger, localized rendering, and
the content translator. Refines the spec's translator design to a
shell-free execFileSync invocation.




&nbsp;

&nbsp;

## [Untagged] - May 16, 2026 10:23:11 PM

Commit [e8d9221775c6a08365d2818d088eb3443124190c](https://github.com/StoneCypher/better_git_changelog/commit/e8d9221775c6a08365d2818d088eb3443124190c)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: add OS-resolved locale to UI language detection chain
  * The POSIX LANG/LC_* variables are normally unset on Windows; fall back
to Intl.DateTimeFormat().resolvedOptions().locale so default detection
works cross-platform.




&nbsp;

&nbsp;

## [Untagged] - May 16, 2026 10:19:31 PM

Commit [56f85f206b42d0cb4197890eec8eb9b079015d4c](https://github.com/StoneCypher/better_git_changelog/commit/56f85f206b42d0cb4197890eec8eb9b079015d4c)

Author: `John Haugeland <stonecypher@gmail.com>`

  * docs: add CLI internationalization design spec
  * Design for independent UI and changelog locales, 12 shipped languages,
an in-house i18n module, opt-in changelog-content translation with a
claude preset, a Unicode-aware slugger, and a build-time locale check.




&nbsp;

&nbsp;

<a name="1__6__4" />

## [1.6.4] - May 16, 2026 9:34:30 PM

Commit [64587df21be113fdc5f3ebc1b3be3f96c2a275b7](https://github.com/StoneCypher/better_git_changelog/commit/64587df21be113fdc5f3ebc1b3be3f96c2a275b7)

Author: `John Haugeland <stonecypher@gmail.com>`

  * test: add node:test suite for parser, formatter, and integration paths
  * Replace the placeholder test script with a real suite of 19 tests
covering the PEG parser (against the example_data.txt fixture), the
pure markdown formatters, and the git-backed integration functions.
  * Add a coverage script that excludes the generated reflog_parser.js,
and install typescript and typescript-language-server as dev
dependencies for editor LSP support.




&nbsp;

&nbsp;

<a name="1__6__3" />

## [1.6.3] - Jan 25, 2024 11:54:44 AM

Commit [4fcab911dbaaba057a3dfd3e3f2f2d93500c5d36](https://github.com/StoneCypher/better_git_changelog/commit/4fcab911dbaaba057a3dfd3e3f2f2d93500c5d36)

Author: `John Haugeland <stonecypher@gmail.com>`

  * address sember bump




&nbsp;

&nbsp;

<a name="1__6__2" />

## [1.6.2] - Jun 18, 2022 7:29:38 AM

Commit [f51a3dc23ed3109ed13e6c4674cc97bd9edf1c39](https://github.com/StoneCypher/better_git_changelog/commit/f51a3dc23ed3109ed13e6c4674cc97bd9edf1c39)

Author: `John Haugeland <stonecypher@gmail.com>`

  * commander shouldn't be a devdep because we aren't bundling




&nbsp;

&nbsp;

<a name="1__6__1" />

## [1.6.1] - Jun 6, 2022 12:43:11 PM

Commit [67b161ca1272aaf3e04dcf7fa5b5978df587485c](https://github.com/StoneCypher/better_git_changelog/commit/67b161ca1272aaf3e04dcf7fa5b5978df587485c)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Link in short to long was wrong




&nbsp;

&nbsp;

<a name="1__6__0" />

## [1.6.0] - Jun 6, 2022 11:40:38 AM

Commit [ec266b5239fba0bca072e9e9a0e152c94b44fc1d](https://github.com/StoneCypher/better_git_changelog/commit/ec266b5239fba0bca072e9e9a0e152c94b44fc1d)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Add ability to set short length; better logging; bugfixes




&nbsp;

&nbsp;

<a name="1__5__0" />

## [1.5.0] - Jun 6, 2022 9:21:23 AM

Commit [95c6e63dd19e0739240e37367aa9468f77e4e137](https://github.com/StoneCypher/better_git_changelog/commit/95c6e63dd19e0739240e37367aa9468f77e4e137)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Self-run in build.  Fix various bugs.  Support for short length control.




&nbsp;

&nbsp;

<a name="1__4__1" />

## [1.4.1] - Jun 6, 2022 8:56:41 AM

Commit [b1bbc19ba7d9861ae506e0d3543de308ecaec80f](https://github.com/StoneCypher/better_git_changelog/commit/b1bbc19ba7d9861ae506e0d3543de308ecaec80f)

Author: `John Haugeland <stonecypher@gmail.com>`

  * not complex enough to need a distinct ci build




&nbsp;

&nbsp;

## [Untagged] - Jun 6, 2022 8:55:53 AM

Commit [0b8ae7decba920a34cb84cb963ef40975fccfe50](https://github.com/StoneCypher/better_git_changelog/commit/0b8ae7decba920a34cb84cb963ef40975fccfe50)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Improved logging, fixed non-required arg, set up automation in 1.3.0




&nbsp;

&nbsp;

## [Untagged] - Jun 6, 2022 8:53:41 AM

Commit [a6864bfbb7b91724ddd840084a5b231603b5f790](https://github.com/StoneCypher/better_git_changelog/commit/a6864bfbb7b91724ddd840084a5b231603b5f790)

Author: `John Haugeland <stonecypher@gmail.com>`

  * oh, didn't have an automation, whoops




&nbsp;

&nbsp;

## [Untagged] - Jun 6, 2022 8:38:32 AM

Commit [fecb3a62f47c439ef8ecb8d3a6eb87e98ea91aa7](https://github.com/StoneCypher/better_git_changelog/commit/fecb3a62f47c439ef8ecb8d3a6eb87e98ea91aa7)

Author: `John Haugeland <stonecypher@gmail.com>`

  * long and short mechanics




&nbsp;

&nbsp;

## [Untagged] - Jun 6, 2022 8:28:50 AM

Commit [b8270eab75af5a51ccdb2f31f2875c58e8bed527](https://github.com/StoneCypher/better_git_changelog/commit/b8270eab75af5a51ccdb2f31f2875c58e8bed527)

Author: `John Haugeland <stonecypher@gmail.com>`

  * long and short forms for jssm overlength




&nbsp;

&nbsp;

## [Untagged] - May 23, 2022 1:07:35 PM

Commit [f5438606eb671c5b29aba1033db701139dbb8369](https://github.com/StoneCypher/better_git_changelog/commit/f5438606eb671c5b29aba1033db701139dbb8369)

Author: `John Haugeland <stonecypher@gmail.com>`

  * changelog




&nbsp;

&nbsp;

<a name="1__0__0" />

## [1.0.0] - May 23, 2022 1:05:40 PM

Commit [dcd8246c7e8cb2181cc7a25d90d07f1e627105eb](https://github.com/StoneCypher/better_git_changelog/commit/dcd8246c7e8cb2181cc7a25d90d07f1e627105eb)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Initial release




&nbsp;

&nbsp;

## [Untagged] - May 23, 2022 12:52:03 PM

Commit [72cfe947c64edf1e4f61fa8a851aeac463246eee](https://github.com/StoneCypher/better_git_changelog/commit/72cfe947c64edf1e4f61fa8a851aeac463246eee)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [26b16b6, 00a0691]

  * Merge pull request #1 from StoneCypher/StoneCypher-patch-readme
  * Update README.md




&nbsp;

&nbsp;

## [Untagged] - May 23, 2022 12:51:55 PM

Commit [00a0691e5b260aa5ab8641b9ce9ef966567ad4cb](https://github.com/StoneCypher/better_git_changelog/commit/00a0691e5b260aa5ab8641b9ce9ef966567ad4cb)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Update README.md




&nbsp;

&nbsp;

## [Untagged] - May 23, 2022 12:50:14 PM

Commit [26b16b6c80d4f22f44ecf41ffe95edcb20084246](https://github.com/StoneCypher/better_git_changelog/commit/26b16b6c80d4f22f44ecf41ffe95edcb20084246)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Basic readme




&nbsp;

&nbsp;

## [Untagged] - May 23, 2022 12:40:41 PM

Commit [d57e1d4e459beee60f4d1de13e0d2f464e87baa0](https://github.com/StoneCypher/better_git_changelog/commit/d57e1d4e459beee60f4d1de13e0d2f464e87baa0)

Author: `John Haugeland <stonecypher@gmail.com>`

  * workable




&nbsp;

&nbsp;

## [Untagged] - May 22, 2022 11:42:45 PM

Commit [7b3a3dc5e3a1b582bc068ee6f2553d32b1bcb74f](https://github.com/StoneCypher/better_git_changelog/commit/7b3a3dc5e3a1b582bc068ee6f2553d32b1bcb74f)

Author: `John Haugeland <stonecypher@gmail.com>`

  * workable




&nbsp;

&nbsp;

## [Untagged] - May 22, 2022 11:23:56 PM

Commit [576bc5936492227936fea24aa6e94f0269dfb1cf](https://github.com/StoneCypher/better_git_changelog/commit/576bc5936492227936fea24aa6e94f0269dfb1cf)

Author: `John Haugeland <stonecypher@gmail.com>`

  * draft output




&nbsp;

&nbsp;

## [Untagged] - May 22, 2022 9:42:12 PM

Commit [358351ec22b615bf74fb8df90e999b64defd304f](https://github.com/StoneCypher/better_git_changelog/commit/358351ec22b615bf74fb8df90e999b64defd304f)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Able to produce appropriate datastructure from .scan()




&nbsp;

&nbsp;

## [Untagged] - May 22, 2022 7:34:01 PM

Commit [a2ea0ad7c24dd5fca235fabf7f270b71d346fded](https://github.com/StoneCypher/better_git_changelog/commit/a2ea0ad7c24dd5fca235fabf7f270b71d346fded)

Author: `John Haugeland <stonecypher@gmail.com>`

  * Initial commit