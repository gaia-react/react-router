/**
 * Maintainer guard: the regex-metacharacter escape set is declared once.
 *
 * `util/escape-regexp.ts` holds the CLI's one `escapeRegExp`, and every caller
 * imports it. Nothing noticed when the copies it replaced arrived, and nothing
 * would notice a fifth: the next author who needs to escape a token into a
 * `new RegExp(...)` writes the one-line arrow function they already know rather
 * than finding the module. `sonarjs/no-identical-functions` stayed silent
 * through every copy, because a single-line arrow sits below that rule's
 * minimum-lines threshold, and the shell-side scanners reach no TypeScript.
 *
 * The failure a second copy produces is invisible at the call site: a
 * metacharacter added to one set and not the other still compiles to a *valid*
 * regex, so nothing throws and no suite reds. It just changes which strings a
 * guard matches, and most of the callers are guards.
 *
 * # What counts as an offense
 *
 * A JavaScript regex literal that OPENS with a character class carrying `*` and
 * at least six distinct regex metacharacters, in any `.ts` file under
 * `.gaia/cli/src` outside the declaring module. Each condition is a measured
 * boundary rather than a taste, and each one is what spares a live construct in
 * this tree:
 *
 * - **`*` must be in the class.** It is what separates a regex-literal escaper
 *   from a glob escaper. `release/scrub.ts`'s `REGEX_SPECIAL` deliberately
 *   omits `*` because `globToRegex` expands the wildcard after escaping, and
 *   the shared module's own docblock states the converse: `*` is escaped there
 *   precisely so a caller compiling a literal path does not have it silently
 *   rewritten into a glob. A set without `*` is not a substitute for
 *   `escapeRegExp` and never becomes the fifth copy.
 * - **Six distinct metacharacters.** An escape set has to cover essentially all
 *   of them to be correct (the shared one carries fourteen), while a
 *   metacharacter *detector* names the handful it cares about. Measured, the
 *   two live detectors carry four (`wiki/dead-paths.ts`'s
 *   `PLACEHOLDER_PATTERN`) and five (`release/runtime-deps.ts`'s
 *   `PATH_TRUNCATING_METACHAR`); six is the first floor clear of both.
 * - **The literal must open with the class.** A bracket expression carried
 *   inside a string is not a JavaScript regex literal, and reading one as such
 *   would report `release/exclude-parser-parity.test.ts`, whose hardcoded
 *   `sed` reference pipeline is a byte-for-byte oracle that must not be
 *   touched.
 *
 * # Scope boundary (v1), and it is a floor rather than a clean bill of health
 *
 * These shapes are deliberately unreached, and a copy taking any of them slips:
 * a class that is not the literal's first token (`/^[…]/`), a set assembled
 * through `new RegExp(...)` from string pieces, a pattern imported from another
 * module, and a set spelled across several lines. Reaching them means deciding
 * where a regex literal starts and ends in arbitrary source, which is a
 * tokenizer, and a tokenizer is the argument for reading this from the
 * TypeScript AST rather than from lines at all. What this floor does cover is
 * the shape every copy the consolidation removed actually took, and the one the
 * next author would reach for.
 *
 * The corpus is `.ts` only, so the `.tmpl` scaffold templates sharing this root
 * are never opened. They render into an adopter's app rather than into the CLI,
 * and none carries an escape set today, so this is a boundary rather than a
 * known miss: a template that grew one would be a copy in the adopter's tree,
 * which is not what the shared module's callers are.
 *
 * Nothing is exempted by path except the declaring module itself, which is the
 * one place the declaration belongs. There is deliberately no allowlist beside
 * it: `#1831` is open because three hand-rolled allowlists have already
 * diverged, and a fourth would be volunteered here for a case the conditions
 * above already answer on the merits.
 *
 * Repair, when this goes red: delete the private copy and
 * `import {escapeRegExp} from '…/util/escape-regexp.js'`. If the new set is
 * genuinely different rather than a copy, say so where it is declared and give
 * it a set this guard does not read as the shared one.
 *
 * Because this file sits inside the surface it scans, its fixtures are
 * assembled at runtime rather than written as literals: a fixture spelled out
 * as a regex literal would be reported as the very declaration it plants.
 *
 * Maintainer-only by construction: `.gaia/cli/src` is release-excluded, so an
 * adopter clone carries neither these sources nor this test, and the corpus
 * scan skips there. Mirrors `module-docblock-placement.test.ts`.
 */
import {describe, expect, test} from 'vitest';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {resolveRepoRootFromImportMeta} from './util/repo-root-fixture.js';
import {collectTreeFiles, TS_SOURCE_EXTENSIONS} from './util/tree-walk.js';

const REGEX_METACHARACTERS = new Set([
  '$',
  '(',
  ')',
  '*',
  '+',
  '.',
  '?',
  '[',
  '\\',
  ']',
  '^',
  '{',
  '|',
  '}',
]);

/**
 * The smallest metacharacter count this guard reads as an escape SET rather
 * than as a detector naming the few metacharacters it cares about.
 */
const ESCAPE_SET_FLOOR = 6;

// Counted from the metacharacter side rather than by walking the class body:
// every metacharacter is a single UTF-16 unit, so this needs no view on how the
// body decomposes.
const distinctMetacharacters = (classBody: string): number =>
  [...REGEX_METACHARACTERS].filter((character) => classBody.includes(character))
    .length;

/**
 * A regex literal opening with a character class, up to that class's first
 * closing bracket.
 *
 * The bracket it stops at is the first one, escaped or not, so the shared set's
 * own `\]` truncates the captured body. That is deliberate: the body is counted
 * rather than parsed, and a truncated escape set still carries far more than
 * the floor. Recovering the true end means tracking escapes, which is the
 * tokenizer this guard declines to be.
 */
const CLASS_OPENED_REGEX_LITERAL = /\/\[[^\]\n]*\]/g;

/**
 * Reports the 1-based line of the first escape-set declaration, or `null` when
 * the source declares none.
 */
const findEscapeSetDeclaration = (source: string): null | number => {
  const lines = source.split('\n');

  for (const [index, line] of lines.entries()) {
    for (const match of line.matchAll(CLASS_OPENED_REGEX_LITERAL)) {
      const classBody = match[0].slice(2, -1);

      if (
        classBody.includes('*') &&
        distinctMetacharacters(classBody) >= ESCAPE_SET_FLOOR
      ) {
        return index + 1;
      }
    }
  }

  return null;
};

/**
 * The declaring module, relative to `.gaia/cli/src` and spelled the way
 * `collectTreeFiles` reports an entry. Any other spelling makes the comparison
 * below miss, and the miss reports the shared declaration itself as a copy of
 * itself, which reads as the guard working.
 */
const DECLARING_MODULE = 'util/escape-regexp.ts';

const repoRoot = resolveRepoRootFromImportMeta(import.meta.url);
const cliSrc = path.join(repoRoot, '.gaia', 'cli', 'src');
const sourcesPresent = existsSync(cliSrc);

// Assembled rather than written out, for the reason the docblock gives: a
// literal fixture would be an offense in this very file.
const asRegexLiteral = (classBody: string, flags: string): string =>
  ['/', '[', classBody, ']', '/', flags].join('');

/** The set the shared module declares: every metacharacter, `*` included. */
const SHARED_SET = '.*+?^${}()|[\\]\\\\';
/** `release/scrub.ts`'s glob escaper: the same idiom, deliberately without `*`. */
const GLOB_ESCAPER_SET = '.+^$()[\\]{}|\\\\';
/** `release/runtime-deps.ts`'s detector: five metacharacters, `*` among them. */
const PATH_METACHARACTER_DETECTOR_SET = '$*?[{';

describe('escapeRegExp uniqueness', () => {
  // Maintainer-only guard: `sourcesPresent` is false on an adopter clone,
  // where `.gaia/cli/src` is release-excluded.
  test.skipIf(!sourcesPresent)(
    'no file outside the declaring module declares an escape set',
    () => {
      const sources = collectTreeFiles(cliSrc, TS_SOURCE_EXTENSIONS);

      // A scan that reaches nothing reports nothing, so the empty result below
      // would read as a clean corpus. `.gaia/cli/src` has held hundreds of
      // `.ts` files for the life of the CLI; a count this low means the walk
      // or the extension filter broke, not that the tree shrank.
      expect(sources.length).toBeGreaterThan(50);

      const copies = sources
        .filter((relative) => relative !== DECLARING_MODULE)
        .flatMap((relative) => {
          const line = findEscapeSetDeclaration(
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

    expect(findEscapeSetDeclaration(source)).not.toBeNull();
  });

  // No `skipIf`: these run against assembled strings, so they hold on any clone
  // and they are what establish that the detector can report at all.
  test('reports a private copy of the shared set', () => {
    const source = [
      'const escape = (value: string): string =>',
      `  value.replaceAll(${asRegexLiteral(SHARED_SET, 'g')}, String.raw\`\\$&\`);`,
    ].join('\n');

    expect(findEscapeSetDeclaration(source)).toBe(2);
  });

  // The drift worth catching is a copy whose set is not byte-identical, which
  // is exactly what a literal match of the shared class would miss.
  test('reports a copy whose set has drifted', () => {
    const source = [
      'const escape = (value: string): string =>',
      String.raw`  value.replaceAll(${asRegexLiteral('.*+?^$(', 'gu')}, '\\$&');`,
    ].join('\n');

    expect(findEscapeSetDeclaration(source)).toBe(2);
  });

  test('reports the first offending line when a file carries several', () => {
    const source = [
      'const first = 1;',
      `const early = ${asRegexLiteral(SHARED_SET, 'g')};`,
      `const late = ${asRegexLiteral(SHARED_SET, 'gu')};`,
    ].join('\n');

    expect(findEscapeSetDeclaration(source)).toBe(2);
  });

  // The boundary between a regex-literal escaper and a glob escaper. Reporting
  // this would red on `release/scrub.ts`, whose set omits `*` deliberately.
  test('accepts a glob escaper, whose set omits the wildcard', () => {
    const source = `const REGEX_SPECIAL = ${asRegexLiteral(GLOB_ESCAPER_SET, 'g')};`;

    expect(findEscapeSetDeclaration(source)).toBeNull();
  });

  // Below the floor: a detector naming the metacharacters it cares about is not
  // an escape set, and `release/runtime-deps.ts` declares this one live.
  test('accepts a metacharacter detector below the floor', () => {
    const source = `const PATH_TRUNCATING_METACHAR = ${asRegexLiteral(
      PATH_METACHARACTER_DETECTOR_SET,
      ''
    )};`;

    expect(findEscapeSetDeclaration(source)).toBeNull();
  });

  // A bracket expression inside a string is not a JavaScript regex literal.
  // `release/exclude-parser-parity.test.ts` carries this exact text as a
  // byte-for-byte oracle of the retired shell pipeline.
  test('accepts a shell bracket expression carried in a string', () => {
    const source = String.raw`const STAGE2 = "sed 's|[][\\.*^$()+?{}|]|\\&|g'";`;

    expect(findEscapeSetDeclaration(source)).toBeNull();
  });

  test('accepts a file that declares no character class at all', () => {
    const source = [
      'import path from "node:path";',
      'export const x = 1;',
    ].join('\n');

    expect(findEscapeSetDeclaration(source)).toBeNull();
  });
});
