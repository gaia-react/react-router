import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {collectTreeFiles, TS_SOURCE_EXTENSIONS} from './tree-walk.js';

const seed = (root: string, relative: string): void => {
  const abs = path.join(root, relative);
  mkdirSync(path.dirname(abs), {recursive: true});
  writeFileSync(abs, '', 'utf8');
};

describe('collectTreeFiles', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'gaia-collect-'));
  });

  afterEach(() => {
    rmSync(dir, {force: true, recursive: true});
  });

  test('keeps only the entries whose extension is in the set', () => {
    seed(dir, 'kept.ts');
    seed(dir, 'skipped.md');
    seed(dir, 'skipped');

    expect(collectTreeFiles(dir, TS_SOURCE_EXTENSIONS)).toEqual(['kept.ts']);
  });

  test('reaches nested entries and reports them relative to the root', () => {
    seed(dir, 'nested/deep/leaf.ts');

    expect(collectTreeFiles(dir, TS_SOURCE_EXTENSIONS)).toEqual([
      'nested/deep/leaf.ts',
    ]);
  });

  test('normalizes separators to POSIX', () => {
    seed(dir, path.join('nested', 'leaf.ts'));

    const [entry] = collectTreeFiles(dir, TS_SOURCE_EXTENSIONS);

    expect(entry).toBe('nested/leaf.ts');
    expect(entry).not.toContain(path.sep === '/' ? '\\' : path.sep);
  });

  test('sorts the entries', () => {
    seed(dir, 'b.ts');
    seed(dir, 'a.ts');
    seed(dir, 'nested/a.ts');

    expect(collectTreeFiles(dir, TS_SOURCE_EXTENSIONS)).toEqual([
      'a.ts',
      'b.ts',
      'nested/a.ts',
    ]);
  });

  test('matches the extension case-insensitively', () => {
    seed(dir, 'shouty.TS');

    expect(collectTreeFiles(dir, TS_SOURCE_EXTENSIONS)).toEqual(['shouty.TS']);
  });

  test('honors a caller-supplied extension set', () => {
    seed(dir, 'prose.md');
    seed(dir, 'code.ts');

    expect(collectTreeFiles(dir, new Set(['.md']))).toEqual(['prose.md']);
  });

  test('does not exclude a directory whose name carries a matching extension', () => {
    mkdirSync(path.join(dir, 'looks-like-a-file.ts'));

    expect(collectTreeFiles(dir, TS_SOURCE_EXTENSIONS)).toEqual([
      'looks-like-a-file.ts',
    ]);
  });

  test('throws when the root does not exist', () => {
    expect(() =>
      collectTreeFiles(path.join(dir, 'absent'), TS_SOURCE_EXTENSIONS)
    ).toThrow(/ENOENT/);
  });
});
