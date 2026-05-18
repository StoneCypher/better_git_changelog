# Changelog

All notable changes to this project will be documented in this file.

48 merges; 8 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





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