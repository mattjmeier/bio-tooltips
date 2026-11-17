import { readFile, writeFile } from 'node:fs/promises';
import { createPublishedSnapshot } from './snapshot.mjs';

const read = async name => JSON.parse(await readFile(new URL(`./results/${name}.json`, import.meta.url), 'utf8'));
const snapshot = createPublishedSnapshot(await read('latest'), await read('browser-live-latest'), await read('browser-fixture-latest'));
await writeFile(new URL('./published/latest.json', import.meta.url), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log('Updated benchmark/published/latest.json from completed benchmark runs.');
