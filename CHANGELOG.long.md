# Changelog

All notable changes to this project will be documented in this file.

51 merges; 9 releases



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





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