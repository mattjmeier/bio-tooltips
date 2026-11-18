import { readFile, writeFile } from 'node:fs/promises';
import { createPublishedSnapshot } from './snapshot.mjs';

const read = async name => JSON.parse(await readFile(new URL(`./results/${name}.json`, import.meta.url), 'utf8'));
const renderer = await read('latest');
const live = await read('browser-live-latest');
const fixture = await read('browser-fixture-latest');
const extra = [];
if (!live.settings.pageSizes.includes(1000)) {
  const optional = async name => { try { return await read(name); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
  const stressLive = await optional('browser-live-stress-latest');
  const stressFixture = await optional('browser-fixture-stress-latest');
  if (stressLive || stressFixture) {
    if (!stressLive || !stressFixture) throw new Error('Both live and fixture stress runs are required.');
    // A previously measured pair keeps its provenance when the routine suite is refreshed.
    extra.push(...[stressLive, stressFixture].map(run =>
      run.gitCommit === live.gitCommit && run.packageVersion === live.packageVersion
        ? run : { ...run, retained: true }));
  }
}
if (!extra.length && !live.settings.pageSizes.includes(1000)) {
  // Weekly refreshes keep the most recent opt-in stress observations, with their own provenance.
  const previous = JSON.parse(await readFile(new URL('./published/latest.json', import.meta.url), 'utf8'));
  for (const run of previous.browser) {
    const summaries = run.summaries.filter(row => row.annotatedElements === 1000);
    if (summaries.length && run.measurementVersion === 3) extra.push({ ...run, retained: true,
      settings: { ...run.settings, pageSizes: [1000] }, summaries });
  }
}
const snapshot = createPublishedSnapshot(renderer, live, fixture, ...extra);
await writeFile(new URL('./published/latest.json', import.meta.url), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log('Updated benchmark/published/latest.json from completed benchmark runs.');
