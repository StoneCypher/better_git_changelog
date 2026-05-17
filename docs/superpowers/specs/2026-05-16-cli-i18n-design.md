# CLI Internationalization — Design

- **Date:** 2026-05-16
- **Status:** Approved (user waived section-by-section approval and spec review)

## Goal

Add internationalization to `better_git_changelog` so that:

1. The tool's **UI** — help text, console output, error messages — can be rendered in a chosen language.
2. The generated changelog's **boilerplate** can be rendered in a chosen language, **independently** of the UI language.
3. There is an **opt-in** path to translate the changelog's **content** (commit messages) via an external translator command.

## Languages

Twelve locales ship in v1: English (`en`, base), Spanish (`es`), French (`fr`), German (`de`), Portuguese (`pt`), Chinese Simplified (`zh-CN`), Japanese (`ja`), Russian (`ru`), Arabic (`ar`), Hindi (`hi`), Italian (`it`), Korean (`ko`).

## Two string categories

- **UI strings** — console logs, commander option descriptions, commander chrome, error messages. Rendered in the *UI language*.
- **Changelog strings** — boilerplate written into the CHANGELOG file: the preface, "Published tags:", "N merges", "N releases", "Changelogging the last N commits", "Full changelog at", "Untagged", "Author:", "Merges". Rendered in the *changelog language*.

Each locale JSON holds both, namespaced: `{ "ui": { ... }, "changelog": { ... } }`.

## Selection mechanism

- **UI language:** `--ui-lang <code>` → else `LC_ALL` / `LC_MESSAGES` / `LANG` env (POSIX; parsed off any `.encoding` suffix) → else `Intl.DateTimeFormat().resolvedOptions().locale` (the OS-resolved default locale; cross-platform, and the only one of these that detects on Windows, where the POSIX variables are normally unset) → else `en`.
- **Changelog language:** `--changelog-lang <code>` → else the resolved UI language.
- **Unknown / unsupported code:** warn to stderr, fall back to `en`.

## Changelog content translation (opt-in)

- `--translator <preset|program>`. `claude` is a recognized built-in preset; any other value is the name of an executable.
- Content translation runs only when `--translator` is given **and** `--changelog-lang` is set. Default: off — boilerplate is localized, commit text is left as authored.
- The translator is spawned with `execFileSync` (no shell): the program receives the target language code as its single argument and the text to translate on stdin, and emits the translation on stdout. Commit text is never interpolated into a command, so it cannot cause shell injection.
- The `claude` preset invokes the `claude` CLI with a translation prompt to the target language; source language is auto-detected by the model.
- Commits are translated in a single batched call; their text sections are joined by a sentinel separator the translator is asked to preserve.
- Translation caching is explicitly **out of scope** for v1.

## Components

### New files

- `src/js/i18n.js` — locale loader + translator factory. `makeTranslator(localeCode)` returns `t(namespace, key, params)` with English fallback, `{placeholder}` interpolation, and plural selection via `Intl.PluralRules`. Also exposes locale-bound date/number formatting helpers wrapping `Intl.DateTimeFormat` / `Intl.NumberFormat`.
- `src/js/locales/<code>.json` — 12 locale files.
- `src/js/translate.js` — changelog-content translator: resolves the preset/command, batches input, shells text through it.
- `scripts/check-locales.js` — build-time check: verifies every locale file contains every key (including plural sub-keys) present in `en.json`. Missing keys → prints a report and exits non-zero.

### Modified files

- `src/js/cli.js` — new options (`--ui-lang`, `--changelog-lang`, `--translator`); resolves locales; localizes console logs; configures commander help/output (`configureHelp`, `configureOutput`) for the UI locale; option descriptions sourced from the UI locale.
- `src/js/index.js` — `default_preface` becomes a function of the changelog translator; `convert_to_md` and `default_formatter` accept and use the changelog translator + locale; dates/numbers formatted via `Intl`; `slug()` made Unicode-aware (`/[^\p{L}\p{N}_-]/gu`).
- `package.json` — the `build` script runs `check-locales.js`.

## Plurals

Plural-bearing keys store an object of CLDR plural categories, e.g. `"merges": { "one": "{n} merge", "other": "{n} merges" }`. `Intl.PluralRules(locale).select(n)` chooses the category; Arabic uses `zero` / `one` / `two` / `few` / `many` / `other`. Non-plural keys are plain strings.

## Data flow

1. `cli.js` parses flags and resolves `uiLang` and `changelogLang`.
2. It builds a UI translator and a changelog translator via `i18n.js`.
3. It configures commander help/output and emits console logs in the UI language.
4. `scan()` is unchanged.
5. `convert_to_md` / `default_formatter` render boilerplate via the changelog translator and format dates/numbers with `Intl` bound to `changelogLang`.
6. If content translation is enabled, parsed commit text is routed through `translate.js` before rendering.
7. `slug()` preserves non-ASCII letters and digits so localized tags keep valid anchors.

## Error handling

- Unknown locale code → stderr warning, fall back to `en`.
- Missing key in a locale at runtime → fall back to the `en` string for that key (silent; the build-check is the early-warning system).
- Translator command missing or non-zero exit → fail loudly with a localized error (content translation is explicit opt-in; silent failure would be wrong here).
- Build-check finds missing keys → non-zero exit, failing `npm run build` and CI.

## Testing

- `i18n.test.js` — key lookup, English fallback, `{placeholder}` interpolation, plural selection (including Arabic's six forms), unknown-locale fallback.
- `locales.test.js` — every shipped locale contains every `en.json` key (mirrors the build-check inside `npm test`).
- `translate.test.js` — BYO command path exercised with a stub command (no network); preset resolution; batching; failure handling.
- A Unicode `slug()` test.
- Extended `formatter.test.js` — `convert_to_md` / `default_formatter` rendered in a non-English locale; `Intl` date/number formatting.
- All existing 19 tests must still pass: English is the default, and behavior is unchanged when no i18n flags are given.

## Backward compatibility

With no i18n flags and no env locale, the tool behaves exactly as it does today (English, current output). The 12 locale files and the new options are purely additive.
