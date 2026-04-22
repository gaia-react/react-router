#!/usr/bin/env node
// Generate .gaia/manifest.json for the current GAIA release.
//
// Walks `git ls-files`, subtracts paths matched by `.gaia/release-exclude`
// and adopter-owned sentinels, classifies each remaining path, and emits a
// deterministic (alphabetically sorted) JSON manifest to stdout.
//
// Run from repo root: `node .gaia/scripts/generate-manifest.mjs`.
// Usually invoked by `/gaia-release`.

import {execSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const repoRoot = execSync('git rev-parse --show-toplevel', {encoding: 'utf8'}).trim();
const versionPath = resolve(repoRoot, '.gaia/VERSION');
const excludePath = resolve(repoRoot, '.gaia/release-exclude');

const version = readFileSync(versionPath, 'utf8').trim();

const ADOPTER_OWNED_SENTINELS = new Set([
  'wiki/hot.md',
  'wiki/log.md',
  'CHANGELOG.md',
  '.gaia/VERSION',
  '.gaia/manifest.json',
]);

const SHARED = new Set([
  '.claude/settings.json',
  '.github/CODEOWNERS',
  '.github/FUNDING.yml',
  'CLAUDE.md',
  'README.md',
  'package.json',
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
        .replaceAll('.', '\\.')
        .replaceAll('+', '\\+')
        .replaceAll('?', '\\?')
        .replaceAll('*', '[^/]*');
      return new RegExp(`^${escaped}(/|$)`);
    });

const excludePatterns = parseExcludePatterns(readFileSync(excludePath, 'utf8'));

const isExcluded = (path) => excludePatterns.some((re) => re.test(path));

const classify = (path) => {
  if (ADOPTER_OWNED_SENTINELS.has(path)) return null;
  if (SHARED.has(path)) return 'shared';
  if (SHARED_PREFIXES.some((prefix) => path.startsWith(prefix))) return 'shared';
  if (WIKI_OWNED_EXACT.has(path)) return 'wiki-owned';
  if (WIKI_OWNED_PREFIXES.some((prefix) => path.startsWith(prefix))) return 'wiki-owned';
  return 'owned';
};

const gitFiles = execSync('git ls-files', {cwd: repoRoot, encoding: 'utf8'})
  .split('\n')
  .filter(Boolean);

const files = {};
for (const path of gitFiles) {
  if (isExcluded(path)) continue;
  const cls = classify(path);
  if (cls === null) continue;
  files[path] = cls;
}

const sortedFiles = Object.fromEntries(
  Object.entries(files).sort(([a], [b]) => a.localeCompare(b)),
);

const manifest = {
  version,
  generated: new Date().toISOString(),
  files: sortedFiles,
};

process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
