/**
 * Scans `wiki/**` markdown files for backticked repo-relative paths that
 * reference files no longer present on disk. Detects rot like a wiki page
 * citing a hook script after that hook has been deleted or renamed. Also
 * flags any reference to sibling-monorepo paths
 * (`studio/`, `website/`); those reach outside the GAIA repo and never
 * resolve on a single-repo clone.
 *
 * Output: newline-separated `wiki/path:line  dead-path` entries. Exit 0
 * always; finding rot is informational, not a failure.
 */
import {readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {EXIT_CODES} from '../exit.js';
import {structuredError} from '../stderr.js';
import {collectWikiMarkdown} from './util/markdown-corpus.js';

export const HELP_TEXT = `Usage: gaia wiki dead-paths [--json]

  Scan wiki/**/*.md for backticked repo-relative paths under .claude/, .gaia/,
  app/, test/, wiki/ that no longer exist on disk, plus any reference to
  sibling-monorepo paths (studio/, website/) which reach outside the GAIA
  tarball and never resolve on a single-repo clone. Excludes wiki/log.md,
  wiki/hot.md and wiki/meta/** (generated or append-only files that
  legitimately reference historical paths).
`;

const HELP_TOKENS = new Set(['--help', '-h', 'help']);

const TRACKED_PREFIXES = [
  '.claude/',
  '.gaia/',
  'app/',
  'test/',
  'wiki/',
] as const;

/**
 * Sibling-monorepo segments that the maintainer's working tree contains
 * (`gaia/`, `studio/`, `website/` are siblings) but the GAIA tarball does
 * not. Any wiki citation containing one of these segments is dead on every
 * clone except the maintainer's. The pattern matches both bare prefixes
 * (`studio/foo.md`) and relative escapes (`../../../studio/foo.md`).
 */
const SIBLING_REPO_PATTERN = /(?:^|\/)(studio|website)\//;

/**
 * Wiki files whose own citations are exempt from the scan. The three markdown
 * members match the Exceptions list in `.claude/rules/wiki-style.md`, and keep
 * those in step: none of the three is hand-edited prose, so a dead citation in
 * one is not rot a human can act on, and that rule owns the reasoning.
 *
 * `wiki/.state.json` is outside that correspondence and has no counterpart in
 * the rule. It is a defensive non-markdown entry the markdown corpus can never
 * yield, so neither adding it to that prose rule nor deleting it here follows
 * from the sentence above.
 *
 * `HELP_TEXT` above restates the markdown members in prose. Nothing in the
 * language couples the two, so a test asserts it in both directions.
 */
export const SKIP_PATH_FRAGMENTS = [
  'wiki/log.md',
  'wiki/hot.md',
  'wiki/meta/',
  'wiki/.state.json',
] as const;

/**
 * Repo-relative prefixes that resolve to gitignored runtime artifacts. Wiki
 * references to these paths describe shapes, not files we expect to exist.
 */
const RUNTIME_PREFIXES = ['.gaia/local/'] as const;

/**
 * Exact repo-relative paths that are real, gitignored, machine-local files:
 * present only on a checkout where a human or `/setup-gaia` wrote one, and so
 * absent on every fresh clone, every CI checkout, and every linked worktree.
 * Their presence is a property of the checkout rather than of the repository,
 * which makes a wiki citation of one correct even where the file is missing.
 *
 * `RUNTIME_PREFIXES` exempts `.gaia/local/` for the same reason and is the
 * closest precedent; these are exact paths rather than a prefix, so they want a
 * sibling set rather than an entry there.
 *
 * Kept distinct from `ADOPTER_OWNED_SENTINELS` rather than folded into it: that
 * set is pinned by equality to the runtime-only entries of
 * `release/runtime-deps.ts`'s same-named set, so an entry added here alone reds
 * that test, and one added on both sides would assert that a machine-local
 * settings file is a release runtime dependency, which it is not.
 *
 * `release/runtime-deps.ts`'s `PROSE_PATH_ALLOWLIST` names this same file on
 * the same underlying fact, and is deliberately not shared with: it answers a
 * different question (whether a path token in a shell script is a runtime
 * dependency), and that module is maintainer-only, so importing it would pull
 * release tooling into the adopter `gaia` bundle.
 */
const GITIGNORED_LOCAL_FILES: ReadonlySet<string> = new Set([
  '.claude/settings.local.json',
]);

/**
 * Exact repo-relative paths that are adopter-owned and legitimately absent
 * on a checkout that hasn't opted in: `.gaia/automation.json` is written by
 * `/setup-gaia`, not shipped by GAIA itself, so it is correctly missing here
 * on the GAIA source repo.
 *
 * `release/runtime-deps.ts` keeps its own `ADOPTER_OWNED_SENTINELS` naming the
 * same file. The two sets intersect on the runtime-created entries only: that
 * one also spreads `manifest.ts`'s git-tracked sentinels, which are present on
 * disk here and so must NOT be exempted from this scan. Kept separate rather
 * than shared because this module ships in the adopter `gaia` bundle and that
 * one is maintainer-only, so importing across would pull release tooling into
 * the adopter binary and reverse the established `release/` → `wiki/` import
 * direction. A new runtime-created sentinel belongs in both; a git-tracked one
 * belongs only in the release-side set.
 */
export const ADOPTER_OWNED_SENTINELS: ReadonlySet<string> = new Set([
  '.gaia/automation.json',
]);

/**
 * Exact repo-relative paths that wiki prose names as illustrations of a file
 * that does not exist and is not meant to. Each entry is a well-formed path
 * whose surrounding sentence depends on it being absent, so without an
 * exemption it is reported as dead on every run forever, putting a permanent
 * floor under the count this scan exists to move.
 *
 * Kept distinct from `ADOPTER_OWNED_SENTINELS` rather than folded into it:
 * that set means "absent on this checkout, present on others", which is a
 * different fact these entries would make incoherent.
 *
 * An entry that later becomes a real file is harmless: a path that exists is
 * not dead and the scan would pass it anyway.
 *
 * Both sides of the lookup are normalized to NFC because an accented path has
 * two legal spellings and `Set.has` compares code points: macOS filesystems
 * and some editors hand back NFD (`e` + U+0301) where the entry below is NFC
 * (U+00E9). Without it, re-encoding a wiki page silently returns that page's
 * permanent floor. A fixture typed naturally in an editor arrives as NFC and
 * would not show that, which is why the test carries a deliberate NFD spelling.
 *
 * - `.claude/commands/tool.sh` reasons about how an unqualified glob would
 *   route a *future* file to the wrong Code Audit Team member.
 * - `app/components/café.test.ts` is a worked example of C-quoting under the
 *   default `core.quotePath`; creating the file would be absurd.
 */
const HYPOTHETICAL_EXAMPLE_PATHS: ReadonlySet<string> = new Set(
  ['.claude/commands/tool.sh', 'app/components/café.test.ts'].map((entry) =>
    entry.normalize('NFC')
  )
);

const PATH_TOKEN_PATTERN = /`([^`\n]+?)`/g;

/**
 * Placeholder markers in wiki examples: `<name>`, `${VAR}`, `*.ts`, and
 * convention-marker runs like `SPEC-NNN.md` / `XXX-XXX`.
 */
const PLACEHOLDER_PATTERN = /[<>*${}]|N{3,}|X{3,}/;

/**
 * Decision-record bullets explicitly documenting that a path was removed or
 * renamed. Decision pages legitimately reference paths that no longer exist;
 * the bullet itself is the explanation. Match the canonical bullet form:
 *
 *   - **Removed** `path/that/was/removed.ts`
 *   - **Deleted** `...`
 *   - **Renamed** `...`
 *   - **Migrated** `...`
 */
const HISTORICAL_BULLET_PATTERN =
  /^\s*-\s+\*\*(Removed|Deleted|Renamed|Migrated|Replaced)\*\*/i;

type DeadRef = {
  filePath: string;
  line: number;
  path: string;
};

type RunOptions = {
  cwd?: string;
};

const isTrackedPath = (token: string): boolean => {
  if (PLACEHOLDER_PATTERN.test(token)) return false;
  if (!token.includes('/')) return false;
  if (!/\.[a-z0-9]{1,8}$/i.test(token)) return false;
  if (ADOPTER_OWNED_SENTINELS.has(token)) return false;
  if (HYPOTHETICAL_EXAMPLE_PATHS.has(token.normalize('NFC'))) return false;
  if (GITIGNORED_LOCAL_FILES.has(token)) return false;
  if (RUNTIME_PREFIXES.some((prefix) => token.startsWith(prefix))) return false;
  if (SIBLING_REPO_PATTERN.test(token)) return true;

  return TRACKED_PREFIXES.some((prefix) => token.startsWith(prefix));
};

const shouldSkipFile = (relPath: string): boolean =>
  SKIP_PATH_FRAGMENTS.some((fragment) => relPath.startsWith(fragment));

const pathExists = (root: string, candidate: string): boolean => {
  try {
    statSync(path.join(root, candidate));

    return true;
  } catch {
    return false;
  }
};

// A tracked token is dead when it points outside this repo (sibling-monorepo
// segments never resolve on a single-repo clone) or when it simply doesn't
// exist on disk.
const isDeadToken = (cwd: string, token: string): boolean =>
  SIBLING_REPO_PATTERN.test(token) || !pathExists(cwd, token);

type FileContext = {
  cwd: string;
  filePath: string;
};

const collectDeadPathsInLine = (
  ctx: FileContext,
  lineNumber: number,
  line: string
): readonly DeadRef[] => {
  if (HISTORICAL_BULLET_PATTERN.test(line)) return [];

  const refs: DeadRef[] = [];

  for (const match of line.matchAll(PATH_TOKEN_PATTERN)) {
    const token = match[1];

    if (
      token !== undefined &&
      isTrackedPath(token) &&
      isDeadToken(ctx.cwd, token)
    ) {
      refs.push({filePath: ctx.filePath, line: lineNumber, path: token});
    }
  }

  return refs;
};

const collectDeadPathsInFile = (ctx: FileContext): readonly DeadRef[] => {
  const content = readFileSync(path.join(ctx.cwd, ctx.filePath), 'utf8');
  const lines = content.split('\n');

  return lines.flatMap((line, index) =>
    collectDeadPathsInLine(ctx, index + 1, line)
  );
};

export const findDeadPaths = (cwd: string): readonly DeadRef[] =>
  collectWikiMarkdown(cwd)
    .filter((filePath) => !shouldSkipFile(filePath))
    .flatMap((filePath) => collectDeadPathsInFile({cwd, filePath}));

export const run = (
  argv: readonly string[],
  options: RunOptions = {}
): number => {
  let json = false;

  for (const token of argv) {
    if (HELP_TOKENS.has(token)) {
      process.stdout.write(HELP_TEXT);

      return EXIT_CODES.OK;
    }

    if (token === '--json') {
      json = true;
    } else {
      structuredError({
        code: 'invalid_arguments',
        message: `unknown flag: ${token}`,
        subcommand: 'wiki dead-paths',
      });

      return EXIT_CODES.UNKNOWN_SUBCOMMAND;
    }
  }

  try {
    const cwd = options.cwd ?? process.cwd();
    const dead = findDeadPaths(cwd);

    if (json) {
      process.stdout.write(`${JSON.stringify({dead}, null, 2)}\n`);

      return EXIT_CODES.OK;
    }

    if (dead.length === 0) return EXIT_CODES.OK;

    const lines = dead.map((ref) => `${ref.filePath}:${ref.line}  ${ref.path}`);
    process.stdout.write(`${lines.join('\n')}\n`);

    return EXIT_CODES.OK;
  } catch (error) {
    structuredError({
      code: 'dead_paths_failed',
      message: error instanceof Error ? error.message : String(error),
      subcommand: 'wiki dead-paths',
    });

    return EXIT_CODES.UNKNOWN_SUBCOMMAND;
  }
};
