/**
 * The recursive tree walk every whole-tree guard suite scans with.
 *
 * A guard's corpus is exactly the set it is trusted to have scanned, and a
 * per-suite copy of the walk drifts out from under that trust in silence:
 * near-identical functions are not identical ones, so no lint rule reports a
 * copy that stops normalizing separators, and an exclusion or a filter added
 * to one copy reaches none of the others.
 */
import {readdirSync} from 'node:fs';
import path from 'node:path';

/** The extension set the TypeScript-only guard suites scan with. */
export const TS_SOURCE_EXTENSIONS: ReadonlySet<string> = new Set(['.ts']);

/**
 * Every entry under `root` whose extension is in `extensions`, relative to
 * `root`, separators normalized to POSIX, sorted.
 *
 * The extension set is a required parameter rather than a default, because a
 * default is how a caller that meant "everything" silently gets a narrower
 * corpus and reads the resulting empty answer as a clean pass.
 *
 * Normalization is unconditional: a POSIX-separated entry is correct for every
 * caller, and a caller that compares an entry against a repo-relative module
 * path breaks without it. Entries are names, not proven files, so a directory
 * whose own name carries a matching extension is reported like any other
 * entry; a caller that reads each entry stats it.
 *
 * A `root` that does not exist throws, the way `readdirSync` does. Silence
 * there would be the discovery-stage fail-open this walk exists to close.
 */
export const collectTreeFiles = (
  root: string,
  extensions: ReadonlySet<string>
): readonly string[] =>
  (readdirSync(root, {recursive: true}) as string[])
    .filter((entry) => extensions.has(path.extname(entry).toLowerCase()))
    .map((entry) => entry.split(path.sep).join('/'))
    .toSorted((a, b) => a.localeCompare(b));
