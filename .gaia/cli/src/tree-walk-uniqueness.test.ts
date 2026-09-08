/**
 * Maintainer guard: the recursive tree walk is declared once.
 *
 * `util/tree-walk.ts` holds the CLI's one `collectTreeFiles`, and every
 * whole-tree guard suite scans with it. Nothing noticed when the five copies it
 * replaced arrived, and nothing would notice a sixth: the next author who needs
 * a corpus reaches for the `recursive` option on `readdirSync` inline rather
 * than finding the module. `sonarjs/no-identical-functions` stayed silent
 * through every copy, and no threshold on it would have closed the class:
 * ESLint rules run per file, so that rule never compares functions across
 * files at all. Byte-identical walks live in this tree today with
 * `pnpm lint:cli` green. The shell-side scanners reach no TypeScript.
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
 * reported. Reporting the shape would red on every live construct that takes
 * it, and those split two ways rather than one.
 *
 * Some are walks the shared module genuinely does not serve.
 * `release/scrub.ts`'s `walkFiles` and `audit-template-dogfood.test.ts`'s
 * `collect` take every file whatever its extension, a mode `collectTreeFiles`
 * deliberately has no parameter for, and `adopter-ci-action-pins.test.ts`'s
 * `collectPins` threads a path prefix down the descent and reads each file as
 * it goes.
 *
 * The rest are not. `wiki/dead-paths.ts`, `wiki/empty-sections.ts` and
 * `wiki/frontmatter.ts` hold byte-identical `walkMarkdown` copies, and
 * `release/runtime-deps.ts` holds `walkSh`. Each filters by extension per
 * entry, prunes no directory, and applies its own skip filter after the walk
 * returns, which is exactly the `collectTreeFiles(root, extensions)` contract.
 * Those sit outside this guard because the match shape does not read them, not
 * because they were measured and found to differ, and consolidating them is
 * real work this guard does not do.
 *
 * So reaching that shape would owe an allowlist for the first group while the
 * second group ought to go red, and telling the two apart means deciding where
 * a function body starts and ends in arbitrary source, which is a tokenizer,
 * and a tokenizer is the argument for reading this from the TypeScript AST
 * rather than from lines at all.
 *
 * `update/regen-regions.ts` sits outside both shapes rather than inside either.
 * It walks iteratively, draining an explicit pending list with no self-call, so
 * the self-recursion shape would never match it however that shape were spelled,
 * and it reaches for neither the option nor a recursive call because `lstat`
 * has to refuse to descend a symlinked subdirectory that the `recursive`
 * option would walk straight through. It is therefore not an exemption and
 * carries no entry here: it was measured against the match and falls outside it
 * on the merits, which is what settling the fork on this guard was meant to
 * establish.
 *
 * Further shapes are unreached, and a copy taking any of them slips: the
 * `recursive` option reached through a variable or a spread rather than written
 * as a literal; the promise-based `readdir` or `opendir`, neither of which this
 * tree uses today; an option list long enough to push `recursive` past the
 * bounded gap the match allows after the call; and a read whose own argument
 * list carries a `…Sync(` call ahead of the option, as in
 * `readdirSync(realpathSync(root), …)`, which the neighbouring-call bound
 * cannot tell from the nested `fs` call it exists to skip.
 *
 * The last two are the price of the two bounds rather than oversights, and
 * neither is reachable by a call anyone writes here today: the gap's ceiling
 * sits far above the option list this API accepts, and no live `readdirSync`
 * call in this tree takes a `…Sync(` argument. Both stay documented rather than
 * closed, because closing either means parsing the call rather than bounding
 * the text around it, which is the tokenizer this guard declines to be.
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
 * has broken across several lines still reads as one.
 *
 * Two bounds keep the match on the call it started from. It admits no `;`, so
 * it cannot reach an option object declared in a later statement. And it
 * admits no further `…Sync(` call, so it cannot cross out of the listing into
 * a neighbouring `fs` call inside the same statement: `readdirSync(dir)` whose
 * loop or callback body calls `mkdirSync` or `rmSync` with a recursive option
 * is an ordinary shape here, and without this bound every one of them would be
 * reported as a private tree walk, under repair text that cannot fix it.
 */
const RECURSIVE_DIRECTORY_READ =
  /readdirSync\s*\((?:(?!Sync\s*\()[^;]){0,200}?recursive\s*:\s*true/u;

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

// A plain single-directory listing, and a second `fs` call carrying a
// recursive option, for the fixtures that pin the neighbouring-call bound.
const LIST_CALL = 'readdirSync(dir)';

const nestedRecursiveCall = (helper: string): string =>
  [helper, '(path.join(dir, name), {', RECURSIVE_OPTION, '});'].join('');

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

  // The documented v1 floor: the guard stays green on this shape, which live
  // constructs in this tree take for reasons the scope-boundary section above
  // splits two ways.
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

  // What the statement bound buys: a match cannot reach out of the call's own
  // statement into an unrelated option object below it.
  test('accepts an option that sits past the end of the call statement', () => {
    const source = [
      `const entries = ${asDirectoryRead([FILE_TYPES_OPTION])};`,
      `const options = {${RECURSIVE_OPTION}};`,
    ].join('\n');

    expect(findRecursiveWalk(source)).toBeNull();
  });

  // What the neighbouring-call bound buys, in the shape with the largest live
  // collision surface: suites all over this tree list a directory and remove
  // its entries recursively in teardown, inside one statement. Without the
  // bound each one reports as a private tree walk, under repair text that
  // cannot fix it.
  test('accepts a listing whose loop body removes entries recursively', () => {
    const source = [
      `for (const name of ${LIST_CALL}) {`,
      `  ${nestedRecursiveCall('rmSync')}`,
      '}',
    ].join('\n');

    expect(findRecursiveWalk(source)).toBeNull();
  });

  // The same bound, reached through a callback rather than a loop body.
  test('accepts a listing whose callback creates directories recursively', () => {
    const source = [
      `const names = ${LIST_CALL}.map((name) => {`,
      `  ${nestedRecursiveCall('mkdirSync')}`,
      '  return name;',
      '});',
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
