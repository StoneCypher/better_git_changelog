/**
 * Hand-authored type declarations for the PEG-generated reflog parser.
 *
 * `reflog_parser.js` is generated from `src/peg/reflog_parser.peg` by the
 * `peg` build step and carries no types of its own. This sibling declaration
 * gives the generated module a real signature, so `parse_rl` in `index.js`
 * (a re-export of `parse`) resolves to a typed function rather than `any`.
 * It is authored by hand and is not overwritten when the parser is regenerated.
 */

/** One parsed commit entry, as produced by {@link parse}. */
export type ReflogEntry = import("./index.js").ReflogEntry;

/**
 * Parse raw `git log --reflog` text into structured commit entries.
 *
 * @param input The raw reflog text to parse.
 * @returns The parsed commit entries, in reflog order. Entries carry
 *          `commit_hash`, `commit_text`, `author`, and `date`, plus `merge`
 *          for merge commits; the optional `tag` field is left unset (it is
 *          stamped on later by `scan`).
 * @throws A {@link SyntaxError} when the input does not match the grammar.
 */
export function parse(input: string): ReflogEntry[];

/** The error thrown by {@link parse} when its input does not match the grammar. */
export class SyntaxError extends Error {
  expected: unknown;
  found: unknown;
  location: unknown;
}
