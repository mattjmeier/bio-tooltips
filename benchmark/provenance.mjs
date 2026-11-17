import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export async function captureProvenance(root, files) {
  const inputSha256 = Object.fromEntries(await Promise.all(files.map(async file => [
    file, createHash('sha256').update(await readFile(path.join(root, file))).digest('hex'),
  ])));
  const git = args => {
    try {
      return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch { return null; }
  };
  const status = git(['status', '--porcelain']);
  return {
    gitCommit: git(['rev-parse', 'HEAD']),
    gitWorkingTreeDirty: status === null ? null : Boolean(status),
    inputSha256,
  };
}
