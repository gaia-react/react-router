import {describe, expect, test} from 'vitest';
import path from 'node:path';
import {
  CLI_SRC,
  testDeclaredOnce,
} from '../../util/uniqueness-guard-fixture.js';
import {
  GENERATED_CONTENT_EXEMPT_PATHS,
  isGeneratedContentExempt,
  isWikiScanExempt,
  WIKI_SCAN_EXEMPT_PREFIXES,
} from './markdown-corpus.js';

describe('the shared wiki exemption vocabulary', () => {
  test('the base tier matches a directory by prefix', () => {
    expect(isWikiScanExempt('wiki/meta/lint-report.md')).toBe(true);
    expect(isWikiScanExempt('wiki/concepts/Design System.md')).toBe(false);
  });

  test('the base tier holds only the exemption every scan shares', () => {
    expect([...WIKI_SCAN_EXEMPT_PREFIXES]).toEqual(['wiki/meta/']);
  });

  // The two tiers are separate because their warrants are, so neither
  // predicate may answer for the other: a scan that takes the base must not
  // pick up the generated-content pages through it.
  test('the base tier does not carry the generated-content pages', () => {
    expect(isWikiScanExempt('wiki/hot.md')).toBe(false);
    expect(isWikiScanExempt('wiki/log.md')).toBe(false);
  });

  test('the generated-content tier matches its two pages exactly', () => {
    expect(isGeneratedContentExempt('wiki/hot.md')).toBe(true);
    expect(isGeneratedContentExempt('wiki/log.md')).toBe(true);
    // A Set iterates in insertion order, so this is the declaration order.
    expect([...GENERATED_CONTENT_EXEMPT_PATHS]).toEqual([
      'wiki/hot.md',
      'wiki/log.md',
    ]);
  });

  // Exact, not prefix. `dead-paths` prefix-matched these two before the
  // vocabulary was shared, which also swallowed any page whose path merely
  // started with one of them; `empty-sections` matched them exactly. Taking
  // the exact form narrows the exemption rather than widening it.
  test('the generated-content tier does not match a page that merely starts with one', () => {
    expect(isGeneratedContentExempt('wiki/log.md-archive.md')).toBe(false);
    expect(isGeneratedContentExempt('wiki/hot.md.bak')).toBe(false);
  });
});

/**
 * The drift this issue names is a private copy of one of these literals
 * reappearing in a scanner, which is how the four sets diverged in the first
 * place. A type error cannot catch that: a new private array compiles.
 */
describe('the exemption literals are declared once', () => {
  const EXEMPTION_LITERAL = /'wiki\/(?:hot\.md|log\.md|meta\/)'/u;

  const findExemptionLiteral = (source: string): null | number => {
    const line = source
      .split('\n')
      .findIndex((text) => EXEMPTION_LITERAL.test(text));

    return line === -1 ? null : line + 1;
  };

  testDeclaredOnce({
    corpusFloor: 20,
    corpusRoot: path.join(CLI_SRC, 'wiki'),
    // Spelled the way `collectTreeFiles` reports an entry: POSIX separators, so
    // the comparison cannot miss and read the declaration as a copy of itself.
    declaringModule: 'util/markdown-corpus.ts',
    findOffense: findExemptionLiteral,
    /*
     * Two classes are spared, and neither spares the drift this guard catches.
     *
     * `orphans.ts` is the deliberate non-adopter: it consumes `computePageIndex`
     * rather than this corpus, and its predicate asks whether a page may be
     * unlinked rather than whether its content is worth reading, so its
     * `wiki/meta/` literal is a different claim carrying its own warrant at its
     * own site. Every other scanner is covered by default.
     *
     * A test file names these paths as fixture content, writing a `wiki/hot.md`
     * into a sandbox to prove a scanner skips it. That is the guard's subject
     * being exercised rather than restated, and a scanner is never implemented
     * in one.
     */
    isExempt: (relative) =>
      relative === 'orphans.ts' || relative.endsWith('.test.ts'),
    offense: 'restates a shared wiki exemption literal',
  });
});
