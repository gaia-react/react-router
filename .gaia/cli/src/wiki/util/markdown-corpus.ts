/**
 * The `wiki/**` markdown corpus the wiki scanner subcommands read.
 *
 * Each scanner asks the same question of the tree before it asks its own:
 * which markdown pages exist under `wiki/`, named the way the rest of the
 * repository names them. Answering it per subcommand is the drift the shared
 * walk exists to close one level down, reintroduced one level up: a scanner's
 * corpus is exactly the set it is trusted to have read, and a private answer
 * that stops normalizing a separator or misses a nested page still returns a
 * plausible list and still greens.
 *
 * An absent `wiki/` directory yields an empty corpus rather than throwing.
 * That is the scanners' own contract with their callers: `gaia wiki` runs on a
 * clone that has not seeded a wiki yet, and reporting nothing found is the
 * honest answer there. It is not the discovery-stage fail-open
 * `collectTreeFiles` refuses, because the condition is stated by a `statSync`
 * on the one root rather than inferred from a swallowed read error.
 */
import {statSync} from 'node:fs';
import path from 'node:path';
import {collectTreeFiles} from '../../util/tree-walk.js';

const WIKI_DIR = 'wiki';

const MARKDOWN_EXTENSIONS: ReadonlySet<string> = new Set(['.md']);

/**
 * Every `wiki/**` markdown page under `cwd`, as repo-relative POSIX paths
 * carrying the `wiki/` prefix, sorted. Empty when `cwd` holds no `wiki/`.
 */
export const collectWikiMarkdown = (cwd: string): readonly string[] => {
  const wikiDir = path.join(cwd, WIKI_DIR);

  try {
    statSync(wikiDir);
  } catch {
    return [];
  }

  return collectTreeFiles(wikiDir, MARKDOWN_EXTENSIONS).map((relativePath) =>
    path.posix.join(WIKI_DIR, relativePath)
  );
};
