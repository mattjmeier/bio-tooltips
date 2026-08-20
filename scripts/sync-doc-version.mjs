import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, readPackageVersion } from './lib.mjs';

const CHECK_ONLY = process.argv.includes('--check');
const VERSION_PATTERN = /bio-tooltips@\d+\.\d+\.\d+/g;
const FILES = [
  'README.md',
  'docs/installation.md',
  'docs/integration.md',
  'docs/styling-theming.md',
];

const version = readPackageVersion();
const expected = `bio-tooltips@${version}`;
const stale = [];

for (const relativePath of FILES) {
  const filePath = path.join(REPO_ROOT, relativePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const matches = source.match(VERSION_PATTERN) ?? [];

  if (matches.length === 0) {
    console.error(`${relativePath}: no pinned bio-tooltips version found`);
    process.exitCode = 1;
    continue;
  }

  const updated = source.replace(VERSION_PATTERN, expected);
  if (updated === source) continue;

  stale.push(relativePath);
  if (!CHECK_ONLY) fs.writeFileSync(filePath, updated, 'utf8');
}

if (process.exitCode) process.exit();

if (CHECK_ONLY && stale.length > 0) {
  console.error(`Pinned documentation links do not match package.json (${version}):`);
  for (const relativePath of stale) console.error(`  ${relativePath}`);
  console.error('Run `npm run docs:versions:sync` to update them.');
  process.exit(1);
}

if (CHECK_ONLY) {
  console.log(`Pinned documentation links match package.json (${version}).`);
} else if (stale.length > 0) {
  console.log(`Updated pinned documentation links to ${version}:`);
  for (const relativePath of stale) console.log(`  ${relativePath}`);
} else {
  console.log(`Pinned documentation links already match package.json (${version}).`);
}
