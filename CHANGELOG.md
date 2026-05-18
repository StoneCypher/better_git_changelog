# Changelog

All notable changes to this project will be documented in this file.

8 merges; 11 releases; Changelogging the last 10 commits; Full changelog at [CHANGELOG.long.md](CHANGELOG.long.md)



&nbsp;

&nbsp;

Published tags:

<a href="#1__6__15">1.6.15</a>, <a href="#1__6__6">1.6.6</a>, <a href="#1__6__5">1.6.5</a>, <a href="#1__6__4">1.6.4</a>, <a href="#1__6__3">1.6.3</a>, <a href="#1__6__2">1.6.2</a>, <a href="#1__6__1">1.6.1</a>, <a href="#1__6__0">1.6.0</a>, <a href="#1__5__0">1.5.0</a>, <a href="#1__4__1">1.4.1</a>, <a href="#1__0__0">1.0.0</a>





&nbsp;

&nbsp;

## [Untagged] - May 18, 2026 3:41:17 PM

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