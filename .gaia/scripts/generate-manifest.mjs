#!/usr/bin/env node
// Generate .gaia/manifest.json for the current GAIA release.
//
// Walks `git ls-files`, subtracts paths matched by `.gaia/release-exclude`
// and adopter-owned sentinels, classifies each remaining path, and emits a
// deterministic (alphabetically sorted) JSON manifest to stdout.
//
// Run from repo root: `node .gaia/scripts/generate-manifest.mjs`.
// Usually invoked by `/gaia-release`.

/* eslint-disable sonarjs/no-os-command-from-path --
 * Maintainer-only release tooling invoked from `/gaia-release`. Resolving
 * `git` via PATH is intentional so the script is portable across a Linux CI
 * runner and a macOS workstation; pinning an absolute path would be brittle.
 */

import {execSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';

const repoRoot = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8',
}).trim();
const versionPath = path.resolve(repoRoot, '.gaia/VERSION');
const excludePath = path.resolve(repoRoot, '.gaia/release-exclude');

const version = readFileSync(versionPath, 'utf8').trim();

const ADOPTER_OWNED_SENTINELS = new Set([
  '.gaia/manifest.json',
  '.gaia/VERSION',
  'CHANGELOG.md',
  'wiki/hot.md',
  'wiki/log.md',
]);

const SHARED = new Set([
  '.claude/settings.json',
  '.github/CODEOWNERS',
  '.github/FUNDING.yml',
  'CLAUDE.md',
  'package.json',
  'README.md',
  'wiki/index.md',
]);

const SHARED_PREFIXES = ['.github/workflows/'];

const WIKI_OWNED_PREFIXES = [
  'wiki/components/',
  'wiki/concepts/',
  'wiki/decisions/',
  'wiki/dependencies/',
  'wiki/flows/',
  'wiki/modules/',
  'wiki/sources/',
];

const WIKI_OWNED_EXACT = new Set(['wiki/overview.md', 'wiki/README.md']);

const parseExcludePatterns = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((pattern) => {
      const escaped = pattern
        .replaceAll('.', String.raw`\.`)
        .replaceAll('+', String.raw`\+`)
        .replaceAll('?', String.raw`\?`)
        .replaceAll('*', '[^/]*');

      return new RegExp(`^${escaped}(/|$)`);
    });

const excludePatterns = parseExcludePatterns(readFileSync(excludePath, 'utf8'));

const isExcluded = (p) => excludePatterns.some((re) => re.test(p));

const classify = (p) => {
  if (ADOPTER_OWNED_SENTINELS.has(p)) return null;
  if (SHARED.has(p)) return 'shared';
  if (SHARED_PREFIXES.some((prefix) => p.startsWith(prefix))) return 'shared';
  if (WIKI_OWNED_EXACT.has(p)) return 'wiki-owned';
  if (WIKI_OWNED_PREFIXES.some((prefix) => p.startsWith(prefix)))
    return 'wiki-owned';

  return 'owned';
};

const files = Object.fromEntries(
  execSync('git ls-files', {cwd: repoRoot, encoding: 'utf8'})
    .split('\n')
    .filter(Boolean)
    .filter((p) => !isExcluded(p))
    .map((p) => [p, classify(p)])
    .filter(([, cls]) => cls !== null)
    .toSorted(([a], [b]) => a.localeCompare(b))
);

const manifest = {
  files,
  generated: new Date().toISOString(),
  version,
};

process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
