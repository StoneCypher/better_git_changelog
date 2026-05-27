# better_git_changelog

Make a changelog from your git commits, tags, and releases — zero config.

[![Node.js CI](https://github.com/StoneCypher/better_git_changelog/actions/workflows/node.js.yml/badge.svg)](https://github.com/StoneCypher/better_git_changelog/actions/workflows/node.js.yml)
[![npm](https://img.shields.io/npm/v/better_git_changelog.svg)](https://www.npmjs.com/package/better_git_changelog)
[![types included](https://img.shields.io/badge/types-included-blue)](#programmatic-use)
[![license: MIT](https://img.shields.io/badge/license-MIT-green)](#license)

```sh
npm install --save-dev better_git_changelog
# or:
#   pnpm add -D better_git_changelog
#   yarn add -D better_git_changelog
#   bun  add -d better_git_changelog

better_git_changelog
```

Run it inside any git repository and it writes a `CHANGELOG.md` from your
project history — the full history by default, or pass `-b` to additionally
emit a short summary alongside a complete `CHANGELOG.long.md`.

&nbsp; 

&nbsp; 

# Contents

- [What's this, then?](#whats-this-then)
- [Usage](#usage)
- [Languages](#languages)
- [Programmatic use](#programmatic-use)
- [How it works](#how-it-works)
- [Requirements](#requirements)
- [What does it look like?](#what-does-it-look-like)
- [Development](#development)
- [License](#license)

&nbsp; 

&nbsp; 

# What's this, then?

Other changelog tools were too complex and didn't do what I want.  One was
close, but didn't cleanly handle the mix of `1.0.0` and `v1.0.0` in the
history, and didn't give links to relevant branches.

So I made a zero-config CHANGELOG tool.

It's generally meant to run at the end of a build chain.  The author uses it by
adding a `changelog` entry to the `scripts` block of a project's
`package.json`:

```json
"scripts": {
  "changelog": "better_git_changelog"
}
```

...and can now run `npm run changelog` to receive bacon.

&nbsp; 

&nbsp; 

# Usage

| Flag | Description | Default |
|------|-------------|---------|
| `-l, --long-form`           | Write the complete history (this is the default) |                     |
| `-s, --short-form`          | Write only the most recent commits               |                     |
| `-S, --short-length <count>`| How many commits the short form keeps             | `10`                |
| `-b, --both-forms [name]`   | Write both forms; optional long-form filename     | `CHANGELOG.long.md` |
| `-f, --filename <name>`     | Filename for the main output                      | `CHANGELOG.md`      |

```
# write CHANGELOG.md with the full history (the default)
better_git_changelog

# write CHANGELOG.md with only the 10 most recent commits
better_git_changelog -s

# short form, but keep the last 25 commits
better_git_changelog -s -S 25

# write both a short CHANGELOG.md and a full CHANGELOG.long.md
better_git_changelog -b

# choose your own filenames
better_git_changelog -f RECENT.md -b HISTORY.md
```

&nbsp; 

&nbsp; 

# Languages

The CLI's interface and the generated changelog can each be rendered in a
different language. Twelve languages ship, shown here with the locale code you
pass to the flags: English (`en`), Spanish (`es`), French (`fr`), German
(`de`), Portuguese (`pt`), Chinese Simplified (`zh-CN`), Japanese (`ja`),
Russian (`ru`), Arabic (`ar`), Hindi (`hi`), Italian (`it`), and Korean
(`ko`).

| Flag | Description | Default |
|------|-------------|---------|
| `-u, --ui-lang <code>`        | Language for help text and console output | OS locale, else English |
| `-c, --changelog-lang <code>` | Language for the generated changelog       | the UI language          |
| `-t, --translator <name>`     | Translator for changelog *content*         | off; needs `--changelog-lang` |

The UI language is detected from `--ui-lang`, then the `LC_ALL` / `LC_MESSAGES`
/ `LANG` environment variables, then the operating system's locale.

```
# generate a French changelog; the UI stays in your system language
better_git_changelog --changelog-lang fr

# a French changelog with a French UI as well
better_git_changelog --changelog-lang fr --ui-lang fr

# also machine-translate the commit text, using the Claude CLI
better_git_changelog --changelog-lang fr --translator claude
```

By default only the changelog's boilerplate is localized; commit messages are
left as written. Passing `--translator` (together with `--changelog-lang`) also
translates the commit text. `claude` is a built-in preset that shells out to
the [Claude CLI](https://docs.anthropic.com/en/docs/claude-code) — install it
and make sure `claude` is on your `PATH` before using the preset. Any other
value is the name of an executable, which is run with the target language code
as its argument and receives the text to translate on standard input.

&nbsp; 

&nbsp; 

# Programmatic use

The package also exports its internals, so you can drive it from code. Use
whichever import style your project prefers:

```js
// CommonJS
const changelog = require('better_git_changelog');

// ESM
import * as changelog from 'better_git_changelog';
```

Write the standard files directly:

```js
changelog.write_short_md('CHANGELOG.md', false, 10);
changelog.write_long_md('CHANGELOG.long.md');
```

…or work with the data yourself:

```js
const data     = changelog.scan();
// { tag_list, tag_hashes, reflog, not_found, repo_url }

const markdown = changelog.convert_to_md({ data });
```

## TypeScript

Type declarations ship with the package at `dist/types/index.d.ts`. No separate
`@types/*` install is required — types resolve automatically when you import
from the package:

```ts
import {
  scan,
  convert_to_md,
  type ReflogEntry,
  type ScanResult,
} from 'better_git_changelog';

const data:   ScanResult     = scan();
const md:     string         = convert_to_md({ data });
const merges: ReflogEntry[]  = data.reflog.filter(e => e.merge);
```

## Public exports

| Export | Description |
|--------|-------------|
| `scan()` | Scan the current repository; returns `{ tag_list, tag_hashes, reflog, not_found, repo_url }`. |
| `write_short_md(target, has_both, short_length, longname, data?, translator?)` | Scan and write the short-form `CHANGELOG.md`. |
| `write_long_md(target, data?, translator?)` | Scan and write the full-history `CHANGELOG.long.md`. |
| `convert_to_md({ data, … })` | Render a `ScanResult` as a Markdown changelog string. |
| `convert_to_json({ target, data })` | Serialize a `ScanResult` to a JSON file. |
| `default_formatter(item, tr?, repo_url?)` | Default per-entry Markdown renderer; pass a replacement via `convert_to_md`. |
| `default_separator()` | Default inter-entry separator; pass a replacement via `convert_to_md`. |
| `parse_rl(input)` | Parse raw `git log --reflog` text into `ReflogEntry[]`. |
| `get_reflog_data()` | Run `git log --reflog` and return the raw output ready for `parse_rl`. |
| `get_tag_list()` | List every tag name in the repository. |
| `tag_to_hash(tag)` | Resolve one tag name to its commit hash. |
| `tags_to_hashes(tags)` | Resolve a set of tag names to a `Map<name, hash>` in a single git call. |
| `get_tags_as_hashes()` | List every tag and resolve all of them to hashes. |
| `get_remote_url()` | Read the `origin` remote URL, or `null`. |
| `remote_to_web_url(remote)` | Convert a git remote URL into a `https://host/owner/repo` web base, or `null`. |
| `slug(text)` | Turn a tag name into an HTML-anchor-safe slug. |
| `ReflogEntry` *(type)* | One parsed commit entry from the reflog. |
| `ScanResult` *(type)* | Complete scan result (the value `scan()` returns). |
| `ScanAllResult` *(type)* | Subset returned by the internal `scan_all`. |

&nbsp; 

&nbsp; 

# How it works

1. It reads every tag with `git for-each-ref` and resolves each one to its commit.
2. It reads the commit and merge history with `git log --reflog`.
3. A PEG grammar parses that history into structured entries.
4. Tags are matched onto their commits, semver-sorted (handling both `1.0.0`
   and `v1.0.0`), and rendered to Markdown.

&nbsp; 

&nbsp; 

# Requirements

- **Node.js 14 or newer**
- **git** available on your `PATH` — the tool shells out to it
- Run it from inside a git repository
- **TypeScript users:** type declarations ship at `dist/types/index.d.ts`; no `@types/*` package is required

&nbsp; 

&nbsp; 

# What does it look like?

A tagged release in the generated `CHANGELOG.md` looks like this:

```markdown
<a name="1__6__18" />

## [1.6.18] - May 23, 2026 1:55:54 AM

Commit [94d66c7b9a052c2ab3c3736b1124e519891b95ad](https://github.com/StoneCypher/better_git_changelog/commit/94d66c7b9a052c2ab3c3736b1124e519891b95ad)

Author: `John Haugeland <stonecypher@gmail.com>`

Merges [2f14edb, 4ccc9b0]

  * Merge pull request #31 from StoneCypher/fix_26-05-23_short-hash-variable-length_30
  * fix: accept short hashes longer than 7 chars in Merge: rows
```

For a longer real-world example, see [jssm's CHANGELOG.md](https://github.com/StoneCypher/jssm/blob/main/CHANGELOG.md).

&nbsp; 

&nbsp; 

# Development

```sh
npm install            # install dev dependencies
npm run build          # regenerate the PEG parser, run tsc, self-emit CHANGELOG.md
npm test               # all tests
npm run test:unit      # unit tests only
npm run test:property  # fast-check property tests only
npm run coverage       # test run with V8 coverage
```

The reflog parser is generated from
[`src/peg/reflog_parser.peg`](src/peg/reflog_parser.peg) into
`src/js/reflog_parser.js` by `npm run peg`. The generated `.js` is committed
and stays in sync with the `.peg` source via the `build` script.

&nbsp; 

&nbsp; 

# License

MIT
