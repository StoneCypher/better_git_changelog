# better_git_changelog

Make a changelog from your git commits, tags, and releases — zero config.

[![Node.js CI](https://github.com/StoneCypher/better_git_changelog/actions/workflows/node.js.yml/badge.svg)](https://github.com/StoneCypher/better_git_changelog/actions/workflows/node.js.yml)
[![npm](https://img.shields.io/npm/v/better_git_changelog.svg)](https://www.npmjs.com/package/better_git_changelog)

```
npm install --save-dev better_git_changelog
better_git_changelog
```

Run it inside any git repository and it writes a `CHANGELOG.md` from your
project history — the full history by default, or pass `-b` to additionally
emit a short summary alongside a complete `CHANGELOG.long.md`.

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
different language. Twelve languages ship: English, Spanish, French, German,
Portuguese, Chinese (Simplified), Japanese, Russian, Arabic, Hindi, Italian,
and Korean.

| Flag | Description | Default |
|------|-------------|---------|
| `-u, --ui-lang <code>`        | Language for help text and console output | OS locale, else English |
| `-c, --changelog-lang <code>` | Language for the generated changelog       | the UI language          |
| `-t, --translator <name>`     | Translator for changelog *content*         | off                      |

The UI language is detected from `--ui-lang`, then the `LC_ALL` / `LC_MESSAGES`
/ `LANG` environment variables, then the operating system's locale.

```
# generate a French changelog with an English UI
better_git_changelog --changelog-lang fr

# also machine-translate the commit text, using the Claude CLI
better_git_changelog --changelog-lang fr --translator claude
```

By default only the changelog's boilerplate is localized; commit messages are
left as written. Passing `--translator` (together with `--changelog-lang`) also
translates the commit text. `claude` is a built-in preset; any other value is
the name of an executable, which is run with the target language code as its
argument and receives the text to translate on standard input.

&nbsp; 

&nbsp; 

# Programmatic use

The package also exports its internals, so you can drive it from code:

```js
const changelog = require('better_git_changelog');

// write the files directly
changelog.write_short_md('CHANGELOG.md', false, 10);
changelog.write_long_md('CHANGELOG.long.md');

// or work with the data yourself
const data     = changelog.scan();              // { tag_list, tag_hashes, reflog, not_found }
const markdown = changelog.convert_to_md({ data });
```

Other exports include `parse_rl`, `get_tag_list`, `tag_to_hash`,
`tags_to_hashes`, `convert_to_json`, and the `default_formatter` /
`default_separator` hooks used to customize the rendered output.

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

&nbsp; 

&nbsp; 

# What does it look like?

[There's an example here](https://github.com/StoneCypher/jssm/blob/main/CHANGELOG.md).

&nbsp; 

&nbsp; 

# License

MIT
