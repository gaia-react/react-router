/**
 * Lockstep guard for the maintainer-only marker strip (#1742).
 *
 * `stripMarkerBlocks` is the parser the release scrub actually runs, and the
 * bats suites `MODEL_SUITES` names carry hand-written awk models of it so they
 * can strip a script and then RUN the stripped copy without taking a
 * dependency on the maintainer CLI. Nothing held those models to the parser:
 * a change to the TypeScript
 * state machine left every model behind with nothing red, and the suites would
 * go on certifying a stripped copy the release scrub does not produce.
 *
 * # Which direction the dependency runs, and why
 *
 * This guard follows `exclude-parser-parity.test.ts`: TypeScript reaches for
 * the shell text, rather than a bats suite reaching for the CLI. The models
 * stay dependency-free standalone bash, which is what they are for, and the
 * binding lives here where the parser lives.
 *
 * # What it asserts
 *
 * 1. `stripMarkerBlocks` and `AWK_PROGRAM` agree byte-for-byte over a fixture
 *    corpus covering every branch of the state machine.
 * 2. Every suite carries `BATS_AWK_BLOCK` verbatim, so a model that drifts
 *    from the program this file just proved faithful goes red here.
 * 3. Each suite's marker constants equal the delimiters of the one
 *    marker-strip transform that governs shell files, read out of
 *    `.gaia/release-scrub.yml` through the scrub's own loader, so a suite
 *    cannot strip and pass against a retired spelling.
 *
 * Assertion 3 is why the suites keep their own constants rather than gaining a
 * shell helper that reads the config: a copy of that YAML walk in every one of
 * them would recreate, in the fix, exactly the drifting-duplicate class this
 * issue is about.
 *
 * Maintainer-only by construction: `.gaia/cli/src` is release-excluded, so an
 * adopter clone carries neither `marker-strip.ts` nor this test.
 */
import {describe, expect, test} from 'vitest';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {resolveRepoRootFromImportMeta} from '../util/repo-root-fixture.js';
import {stripMarkerBlocks} from './marker-strip.js';
import {loadConfig} from './scrub.js';

const REPO_ROOT = resolveRepoRootFromImportMeta(import.meta.url);

/**
 * The reference model, byte-identical to the awk each suite carries. Held here
 * rather than extracted from a suite: extracting it would prove two copies of a
 * model match each other, which is the state this guard exists to end.
 */
const AWK_PROGRAM = `
    {
      has_s = index($0, s) > 0
      has_e = index($0, e) > 0
      if (!skip && has_s) { if (!has_e) skip = 1; next }
      if (skip) { if (has_e) skip = 0; next }
      print
    }
  `;

/**
 * The whole invocation as it is written in each suite, built from
 * `AWK_PROGRAM` so the text this file proves faithful and the text it pins into
 * the suites cannot become two different things.
 */
const BATS_AWK_BLOCK = `awk -v s="$MAINTAINER_START" -v e="$MAINTAINER_END" '${AWK_PROGRAM}'`;

/** The suites carrying a model of the strip, each read once. */
const MODEL_SUITES = [
  '.gaia/scripts/tests/verify-audit-roster.bats',
  '.gaia/scripts/tests/audit-write-clearance.bats',
  '.gaia/tests/hooks/audit-scope-lib.bats',
].map((suite) => ({
  suite,
  text: readFileSync(path.join(REPO_ROOT, suite), 'utf8'),
}));

/**
 * The glob selecting the marker-strip transform that governs shell files. A
 * sibling transform carries the same two delimiter spellings and covers
 * markdown instead, so the transform has to be picked by what it governs
 * rather than by being the first one that declares a `start`.
 */
const SH_TRANSFORM_GLOB = '**/*.sh';

/**
 * The delimiters that transform declares, read through the scrub's own
 * `loadConfig` so this guard sees the config the release sees rather than
 * through a second, indentation-sensitive parser written here.
 */
const readShMarkerDelimiters = (): {end: string; start: string} => {
  const transform = loadConfig(path.join(REPO_ROOT, '.gaia/release-scrub.yml'))
    .transforms.filter((candidate) => candidate.type === 'marker-strip')
    .find((candidate) => candidate.paths.includes(SH_TRANSFORM_GLOB));

  if (!transform) {
    throw new Error(
      `no marker-strip transform covering ${SH_TRANSFORM_GLOB} in .gaia/release-scrub.yml; that config moved, not the strip`
    );
  }

  return {end: transform.end, start: transform.start};
};

const {end: END_MARKER, start: START_MARKER} = readShMarkerDelimiters();

/**
 * awk terminates its final record with a newline; `stripMarkerBlocks` preserves
 * whatever trailing byte the source had. That is awk's I/O contract rather than
 * the state machine, and it is reachable only on a source with no trailing
 * newline, so it is normalized here instead of being asserted on. Every other
 * byte is compared exactly.
 */
const normalizeTrailer = (text: string): string =>
  text === '' || text.endsWith('\n') ? text : `${text}\n`;

const runReferenceModel = (fixture: string): string =>
  execFileSync(
    'awk',
    ['-v', `s=${START_MARKER}`, '-v', `e=${END_MARKER}`, AWK_PROGRAM],
    {encoding: 'utf8', input: fixture}
  );

/**
 * Every branch of the state machine, plus the two shapes that made a real
 * model diverge: a start and end on one line, and an end with no open block
 * (which the shipped parser deliberately KEEPS, `marker-strip.ts:55-57`).
 */
const FIXTURES: {name: string; source: string}[] = [
  {
    name: 'plain pair',
    source: `a\n${START_MARKER}\nsecret\n${END_MARKER}\nb\n`,
  },
  {
    name: 'indented pair',
    source: `a\n  ${START_MARKER}\n  secret\n  ${END_MARKER}\nb\n`,
  },
  {
    name: 'start and end on one line',
    source: `a\n${START_MARKER} ${END_MARKER}\nb\n`,
  },
  {name: 'end without start', source: `a\n${END_MARKER}\nb\n`},
  {
    name: 'end without start, then a real block',
    source: `a\n${END_MARKER}\nb\n${START_MARKER}\nsecret\n${END_MARKER}\nc\n`,
  },
  {
    name: 'nested start',
    source: `a\n${START_MARKER}\nb\n${START_MARKER}\nc\n${END_MARKER}\nd\n`,
  },
  {name: 'unterminated start', source: `a\n${START_MARKER}\nb\n`},
  {
    name: 'marker inside a quoted string',
    source: `a\necho "${START_MARKER}"\nb\n${END_MARKER}\nc\n`,
  },
  {
    name: 'marker with trailing text',
    source: `a\n${START_MARKER} rationale\nsecret\n${END_MARKER} .\nb\n`,
  },
  {
    name: 'two blocks',
    source: `a\n${START_MARKER}\nx\n${END_MARKER}\nb\n${START_MARKER}\ny\n${END_MARKER}\nc\n`,
  },
  {name: 'no markers at all', source: 'a\nb\nc\n'},
];

/** The fixtures that legitimately close no block, by name. */
const NON_STRIPPING_FIXTURES = new Set([
  'end without start',
  'no markers at all',
  'unterminated start',
]);

describe('marker-strip lockstep (#1742)', () => {
  test('AWK_PROGRAM is the real model text, not a vacuous constant', () => {
    expect(AWK_PROGRAM).toContain(
      'if (!skip && has_s) { if (!has_e) skip = 1; next }'
    );
    expect(BATS_AWK_BLOCK).toContain(
      'awk -v s="$MAINTAINER_START" -v e="$MAINTAINER_END"'
    );
  });

  // Non-vacuity, per fixture rather than sampled: a source with no start
  // marker closes no block, and neither does one whose start is never
  // terminated. Every other fixture has to report a stripped block, or the two
  // sides below agree on output nobody transformed.
  test.each(FIXTURES)(
    'strips exactly as its shape says: $name',
    ({name, source}) => {
      expect(
        stripMarkerBlocks(source, START_MARKER, END_MARKER).blocks > 0
      ).toBe(!NON_STRIPPING_FIXTURES.has(name));
    }
  );

  test.each(FIXTURES)(
    'stripMarkerBlocks matches the reference model: $name',
    ({source}) => {
      const parsed = stripMarkerBlocks(source, START_MARKER, END_MARKER);

      expect(normalizeTrailer(parsed.output)).toBe(
        normalizeTrailer(runReferenceModel(source))
      );
    }
  );

  test.each(MODEL_SUITES)(
    '$suite carries the reference model verbatim',
    ({text}) => {
      expect(text).toContain(BATS_AWK_BLOCK);
    }
  );

  test.each(MODEL_SUITES)(
    '$suite takes its markers from the shipped scrub config',
    ({text}) => {
      expect(text).toContain(`MAINTAINER_START='${START_MARKER}'`);
      expect(text).toContain(`MAINTAINER_END='${END_MARKER}'`);
    }
  );
});
