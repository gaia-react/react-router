/**
 * Maintainer guard: the recursive tree walk is declared once.
 *
 * `util/tree-walk.ts` holds the CLI's one `collectTreeFiles`, and every
 * whole-tree guard suite scans with it. Nothing noticed when the five copies it
 * replaced arrived, and nothing would notice a sixth: the next author who needs
 * a corpus reaches for the `recursive` option on `readdirSync` inline rather
 * than finding the module. `sonarjs/no-identical-functions` stayed silent
 * through every copy, because near-identical functions are not identical ones,
 * and the shell-side scanners reach no TypeScript.
 *
 * The failure a sixth copy produces is invisible at the call site. A guard's
 * corpus is exactly the set it is trusted to have scanned, so a private walk
 * that stops normalizing separators, or that skips a directory the shared one
 * reports, still returns a plausible list and still greens. It just quietly
 * reaches less than the maintainer reading the pass believes, and an exclusion
 * or filter added to one walk reaches none of the others. The five copies the
 * consolidation removed had already diverged that way: two shared a name, a
 * signature and a body but differed on separator normalization, a third inlined
 * the walk against a module-level root, a fourth carried a try/catch variant,
 * and a fifth was a fresh recursion with its own `node_modules`/`dist`
 * exclusions, written by someone who had never seen the others.
 *
 * # What counts as an offense
 *
 * A call to `readdirSync` that passes the `recursive` option as a true literal,
 * in any `.ts` file under `.gaia/cli/src` outside the declaring module.
 *
 * That is the shape four of the five removed copies took, and the one the
 * shared module's own docblock names as what the next author writes. It is also
 * the only recursive-walk shape in this tree with no live instance outside
 * `util/tree-walk.ts`, which is what lets this guard ship with no allowlist
 * beside the declaring-module exemption.
 *
 * # Scope boundary (v1), and it is a floor rather than a clean bill of health
 *
 * A hand-rolled walk that recurses into its own function is deliberately NOT
 * reported, and that boundary is measured rather than chosen. The live
 * constructs in this tree taking that shape are `wiki/dead-paths.ts`,
 * `wiki/empty-sections.ts` and `wiki/frontmatter.ts`, collecting `.md` under a
 * wiki root; `release/scrub.ts` and `release/runtime-deps.ts`, walking a
 * staging tree; `update/regen-regions.ts`, walking by hand precisely so an
 * adopter's own tree sets the depth; and the `automation/__tests__` suites
 * recursing over workflow templates. Not one is a copy of the shared walk:
 * every one filters or prunes per directory as it descends, which is the need
 * `collectTreeFiles` deliberately does not serve. Reporting the shape would red
 * on all of them and buy an allowlist the size of that list; separating them
 * from a genuine copy means deciding where a function body starts and ends in
 * arbitrary source, which is a tokenizer, and a tokenizer is the argument for
 * reading this from the TypeScript AST rather than from lines at all.
 *
 * `update/regen-regions.ts` is therefore not an exemption and carries no entry
 * here. It was measured against the match and falls outside it on the merits,
 * which is what settling the fork on this guard was meant to establish.
 *
 * Further shapes are unreached, and a copy taking any of them slips: the
 * `recursive` option reached through a variable or a spread rather than written
 * as a literal; the promise-based `readdir` or `opendir`, neither of which this
 * tree uses today; and an option list long enough to push `recursive` past the
 * bounded gap the match allows after the call. That gap has to be bounded, for
 * the reason the match's own comment gives, and its ceiling sits far above the
 * option list this API accepts, so the last of those is a miss no call anyone
 * writes can reach.
 *
 * Nothing is exempted by path except the declaring module itself, which is the
 * one place the declaration belongs. There is deliberately no allowlist beside
 * it, on the convention `command-reachability.test.ts` states and
 * `escape-regexp-uniqueness.test.ts` shipped: if something turns out to need to
 * be unlisted, design the allowlist then.
 *
 * Repair, when this goes red: delete the private walk and
 * `import {collectTreeFiles, TS_SOURCE_EXTENSIONS} from '…/util/tree-walk.js'`.
 * If the new walk genuinely needs something the shared one does not give, say
 * so where it is declared and give it the per-directory shape this guard does
 * not read as a copy.
 *
 * Because this file sits inside the surface it scans, its fixtures are
 * assembled at runtime rather than written as literals: a fixture spelled out
 * as a call would be reported as the very copy it plants.
 *
 * Maintainer-only by construction: `.gaia/cli/src` is release-excluded, so an
 * adopter clone carries neither these sources nor this test, and the corpus
 * scan skips there. Mirrors `escape-regexp-uniqueness.test.ts`.
 */
import {describe, expect, test} from 'vitest';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {resolveRepoRootFromImportMeta} from './util/repo-root-fixture.js';
import {collectTreeFiles, TS_SOURCE_EXTENSIONS} from './util/tree-walk.js';

/**
 * A directory read carrying the `recursive` option as a true literal.
 *
 * Matched over the whole source rather than line by line, so a call Prettier
 * has broken across several lines still reads as one. The gap is bounded and
 * admits no `;`, which keeps a match inside a single statement: without that,
 * an option object declared further down the file could be picked up and
 * reported against this call's line.
 */
const RECURSIVE_DIRECTORY_READ =
  /readdirSync\s*\([^;]{0,200}?recursive\s*:\s*true/u;

/**
 * Reports the 1-based line of the first recursive directory read, or `null`
 * when the source contains none.
 */
const findRecursiveWalk = (source: string): null | number => {
  const match = RECURSIVE_DIRECTORY_READ.exec(source);

  return match === null ? null : (
      source.slice(0, match.index).split('\n').length
    );
};

/**
 * The declaring module, relative to `.gaia/cli/src` and spelled the way
 * `collectTreeFiles` reports an entry. Any other spelling makes the comparison
 * below miss, and the miss reports the shared walk itself as a copy of itself,
 * which reads as the guard working.
 */
const DECLARING_MODULE = 'util/tree-walk.ts';

const repoRoot = resolveRepoRootFromImportMeta(import.meta.url);
const cliSrc = path.join(repoRoot, '.gaia', 'cli', 'src');
const sourcesPresent = existsSync(cliSrc);

// Assembled rather than written out, for the reason the docblock gives: a
// literal fixture would be an offense in this very file. This is the only place
// the call's own text appears, and it carries no option of its own.
const READ_CALL_HEAD = 'readdirSync(root, {';
const RECURSIVE_OPTION = 'recursive: true';
const FILE_TYPES_OPTION = 'withFileTypes: true';

const asDirectoryRead = (options: readonly string[]): string =>
  [READ_CALL_HEAD, options.join(', '), '})'].join('');

describe('tree walk uniqueness', () => {
  // Maintainer-only guard: `sourcesPresent` is false on an adopter clone,
  // where `.gaia/cli/src` is release-excluded.
  test.skipIf(!sourcesPresent)(
    'no file outside the declaring module walks a tree recursively',
    () => {
      const sources = collectTreeFiles(cliSrc, TS_SOURCE_EXTENSIONS);

      // A scan that reaches nothing reports nothing, so the empty result below
      // would read as a clean corpus. `.gaia/cli/src` has held hundreds of
      // `.ts` files for the life of the CLI; a count this low means the walk or
      // the extension filter broke, not that the tree shrank.
      expect(sources.length).toBeGreaterThan(50);

      const copies = sources
        .filter((relative) => relative !== DECLARING_MODULE)
        .flatMap((relative) => {
          const line = findRecursiveWalk(
            readFileSync(path.join(cliSrc, relative), 'utf8')
          );

          return line === null ? [] : [`.gaia/cli/src/${relative}:${line}`];
        });

      expect(copies).toEqual([]);
    }
  );

  // The corpus above is expected to be empty, so on its own it would green just
  // as loudly with a detector that matches nothing. This is the one assertion
  // driven against the live declaration the guard is written for.
  test.skipIf(!sourcesPresent)('the declaring module itself matches', () => {
    const source = readFileSync(path.join(cliSrc, DECLARING_MODULE), 'utf8');

    expect(findRecursiveWalk(source)).not.toBeNull();
  });

  // No `skipIf`: these run against assembled strings, so they hold on any clone
  // and they are what establish that the detector can report at all.
  test('reports an inline recursive read', () => {
    const source = [
      'const collect = (root: string): string[] =>',
      `  ${asDirectoryRead([RECURSIVE_OPTION])} as string[];`,
    ].join('\n');

    expect(findRecursiveWalk(source)).toBe(2);
  });

  // Prettier breaks a long option object across lines, and a line-by-line scan
  // would read the call and its option as unrelated.
  test('reports a read whose option object is broken across lines', () => {
    const source = [
      `const entries = ${READ_CALL_HEAD}`,
      `  ${FILE_TYPES_OPTION},`,
      `  ${RECURSIVE_OPTION},`,
      '});',
    ].join('\n');

    expect(findRecursiveWalk(source)).toBe(1);
  });

  // The option is not always written first, and a match anchored to the first
  // key would miss every call that puts `withFileTypes` ahead of it.
  test('reports a read whose recursive option is not the first key', () => {
    const source = `const entries = ${asDirectoryRead([
      FILE_TYPES_OPTION,
      RECURSIVE_OPTION,
    ])};`;

    expect(findRecursiveWalk(source)).toBe(1);
  });

  // The boundary between a tree walk and an ordinary single-directory read.
  // Reporting this would red on every live caller that lists one directory.
  test('accepts a single-directory read', () => {
    const source = `const entries = ${asDirectoryRead([FILE_TYPES_OPTION])};`;

    expect(findRecursiveWalk(source)).toBeNull();
  });

  // The documented v1 floor. Eight live constructs in this tree take this shape
  // and none is a copy of the shared walk, so the guard has to stay green on
  // it; the scope-boundary section above names them.
  test('accepts a hand-rolled walk that recurses per directory', () => {
    const source = [
      'const walk = (dir: string): string[] => {',
      `  const entries = ${asDirectoryRead([FILE_TYPES_OPTION])};`,
      '',
      '  return entries.flatMap((entry) =>',
      '    entry.isDirectory() ? walk(join(dir, entry.name)) : [entry.name]',
      '  );',
      '};',
    ].join('\n');

    expect(findRecursiveWalk(source)).toBeNull();
  });

  // What the bound on the gap buys: a match cannot reach out of the call's own
  // statement into an unrelated option object below it.
  test('accepts an option that sits past the end of the call statement', () => {
    const source = [
      `const entries = ${asDirectoryRead([FILE_TYPES_OPTION])};`,
      `const options = {${RECURSIVE_OPTION}};`,
    ].join('\n');

    expect(findRecursiveWalk(source)).toBeNull();
  });

  test('accepts a file that reads no directory at all', () => {
    const source = [
      'import path from "node:path";',
      'export const x = 1;',
    ].join('\n');

    expect(findRecursiveWalk(source)).toBeNull();
  });
});
