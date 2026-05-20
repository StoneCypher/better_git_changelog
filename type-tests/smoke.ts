/**
 * Type smoke test for the published declarations of better_git_changelog.
 *
 * Compiled with `--noEmit` by `npm run check-dts`. It imports the package by
 * name — resolving through the `exports` map exactly as an external consumer
 * would — so any regression in the shipped `.d.ts` files fails the build here.
 * The typed locals are deliberate: each assignment asserts the declared type,
 * and the `@ts-expect-error` blocks assert that misuse is still rejected (a
 * regression to `any` would make those errors disappear and fail compilation).
 */

import {
  scan,
  convert_to_md,
  write_short_md,
  write_long_md,
  get_tag_list,
  tag_to_hash,
  slug,
  parse_rl,
} from "better_git_changelog";

import type { ScanResult, ReflogEntry } from "better_git_changelog";

const result: ScanResult = scan();

const tags: string[] = result.tag_list;
const repoUrl: string | null = result.repo_url;
const entries: ReflogEntry[] = result.reflog;

const md: string = convert_to_md({ data: result });
const shortMd: string = convert_to_md({ data: result, short: true, short_length: 5 });

write_short_md("CHANGELOG.md", false, 10);
write_long_md("CHANGELOG.long.md");

const names: string[] = get_tag_list();
const hash: string = tag_to_hash("1.0.0");
const anchor: string = slug("v1.0/beta");

const parsed: ReflogEntry[] = parse_rl("commit ...");
const firstHash: string = parsed[0].commit_hash;
const body: string[] = parsed[0].commit_text;

// scan takes no arguments.
// @ts-expect-error
scan("unexpected");

// slug requires a string argument.
// @ts-expect-error
slug(123);

// convert_to_md requires the `data` property.
// @ts-expect-error
convert_to_md({});

void [tags, repoUrl, entries, md, shortMd, names, hash, anchor, firstHash, body];
