import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureProvenance } from './provenance.mjs';
import { chromium } from 'playwright';
import { summarize, toCsv } from './report.mjs';
import { identifiersForPage, liveGeneSymbols } from './live-genes.mjs';
import { browserCsvRows, combineBrowserReports, renderLiveSection, renderFieldSelectionSection } from './browser-report.mjs';
import { applyFieldSelection, fieldsForVariant, fieldVariantOrder, fieldVariants } from './field-selection.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const provenance = await captureProvenance(root, [
  'package.json', 'package-lock.json', 'esbuild.config.js',
  'benchmark/browser.mjs', 'benchmark/browser-report.mjs', 'benchmark/report.mjs',
  'benchmark/live-genes.mjs', 'benchmark/field-selection.mjs', 'benchmark/provenance.mjs',
  'benchmark/fixtures/mygene-tp53.json', 'dist/bio-tooltips.mygene.esm.js', 'dist/bio-tooltips.css',
]);
const fixture = JSON.parse(await readFile(path.join(root, 'benchmark/fixtures/mygene-tp53.json'), 'utf8')).data;
const fieldSelection = process.argv.includes('--field-selection');
const live = !process.argv.includes('--fixtures');
if (!live && (fieldSelection || process.argv.includes('--live'))) throw new Error('--fixtures cannot be combined with --live or --field-selection.');
if (process.argv.slice(2).some(argument => !['--live', '--fixtures', '--field-selection'].includes(argument))) throw new Error('Usage: node benchmark/browser.mjs [--live | --fixtures | --field-selection]');
const repetitions = positiveInteger(live ? 'BENCH_BROWSER_LIVE_TRIALS' : 'BENCH_BROWSER_TRIALS', 30);
const warmups = nonNegativeInteger(live ? 'BENCH_BROWSER_LIVE_WARMUPS' : 'BENCH_BROWSER_WARMUPS', 2);
const pageSizes = process.env.BENCH_BROWSER_PAGE_SIZES
  ? process.env.BENCH_BROWSER_PAGE_SIZES.split(',').map(Number)
  : [10, 100];
if (!pageSizes.length || new Set(pageSizes).size !== pageSizes.length || pageSizes.some(size => ![10, 100].includes(size))) {
  throw new Error('BENCH_BROWSER_PAGE_SIZES must list unique sizes from 10,100.');
}
pageSizes.forEach(elements => identifiersForPage(elements));
const trialPauseMs = live ? nonNegativeNumber('BENCH_BROWSER_LIVE_PAUSE_MS', 250) : 0;
const timeoutMs = live ? positiveInteger('BENCH_BROWSER_LIVE_TIMEOUT_MS', 15000) : 10000;
const networkLabel = process.env.BENCH_BROWSER_NETWORK_LABEL || 'Not specified (runner network)';
const strategies = ['none', 'smart', 'all'];
const observations = [];
const warmupFailures = [];
const startedAt = new Date().toISOString();

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (url.pathname === '/') {
    const size = Number(url.searchParams.get('elements'));
    const selector = '.gene-tooltip';
    const markup = identifiersForPage(size).map(identifier =>
      `<span class="gene-tooltip bench-element" data-species="human">${identifier}</span>`
    ).join('\n');
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/dist/bio-tooltips.css"><style>.bench-element{display:block;width:max-content;min-height:24px}</style></head><body><main>${markup}</main><script type="module">
      import { GeneTooltip } from '/dist/bio-tooltips.mygene.esm.js';
      const params = new URLSearchParams(location.search);
      window.__bench = { events: [], readyAt: 0, initMs: 0, cleanup: null };
      const fieldVariant = params.get('fieldVariant');
      if (fieldVariant) {
        const nativeFetch = window.fetch.bind(window);
        window.__bench.fieldValidation = { responses: 0, records: 0, recordsWithGenerif: 0 };
        window.fetch = async (...args) => {
          const response = await nativeFetch(...args);
          if (!String(args[0]).startsWith('https://mygene.info/')) return response;
          const nativeJson = response.json.bind(response);
          response.json = async () => {
            const records = await nativeJson();
            if (!Array.isArray(records)) throw new Error('Expected a batch array for field validation');
            const stats = window.__bench.fieldValidation;
            stats.responses++;
            for (const record of records) {
              if (record.notfound) continue;
              stats.records++;
              if (Object.hasOwn(record, 'generif')) {
                stats.recordsWithGenerif++;
                if (fieldVariant === 'without-generif') throw new Error('Provider returned excluded generif field');
              }
            }
            return records;
          };
          return response;
        };
      }
      // Start the library clock at the real DOM event, after Playwright's
      // locator resolution, actionability checks, scrolling and input delivery.
      document.addEventListener('mouseenter', event => {
        const interaction = window.__bench.interaction;
        if (interaction && event.target === interaction.reference && interaction.eventAt === null) {
          interaction.eventAt = performance.now();
        }
      }, true);
      const checkVisible = () => {
        const interaction = window.__bench.interaction;
        if (!interaction || interaction.contentAt === null || interaction.visibleAt !== null) return;
        const box = document.getElementById(interaction.reference.getAttribute('aria-controls'));
        if (box?.dataset.state === 'visible' && box.querySelector('.gene-tooltip-name')) {
          interaction.visibleAt = performance.now();
        }
      };
      new MutationObserver(checkVisible).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-state'] });
      const start = performance.now();
      window.__bench.cleanup = GeneTooltip.init({
        selector: '${selector}', prefetch: params.get('strategy'), prefetchThreshold: 15,
        visualPreload: 'none', ideogram: { enabled: false },
        display: { ideogram: false, geneTrack: false, pathways: false, domains: false, transcripts: false, structures: false, generifs: false },
        tooltipOptions: { showDuration: 0, hideDuration: 0 },
        onTiming(event) {
          window.__bench.events.push(event);
          const interaction = window.__bench.interaction;
          if (!interaction || interaction.eventAt === null) return;
          interaction.events.push(event);
          if (event.label === 'content set') interaction.contentAt = event.timestampMs;
        }
      });
      window.__bench.initMs = performance.now() - start;
      window.__bench.readyAt = performance.now();
      window.__bench.prefetchPromise = GeneTooltip.whenPrefetchReady();
      window.__bench.cacheSize = () => GeneTooltip.cacheSize();
      window.__bench.clearCache = () => GeneTooltip.clearCache();
      window.__bench.ready = true;
    </script></body></html>`);
    return;
  }
  const relative = decodeURIComponent(url.pathname.replace(/^\//, ''));
  const target = path.resolve(root, relative);
  if (!target.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(target);
    const ext = path.extname(target);
    response.writeHead(200, { 'content-type': ext === '.css' ? 'text/css' : 'text/javascript' });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
let browser;
let context;
let browserVersion;
try {
  browser = await chromium.launch({ headless: true });
  browserVersion = browser.version();
  context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  for (const elements of pageSizes) {
    for (const strategy of strategies) {
      for (let trial = 0; trial < warmups + repetitions; trial += 1) {
        const warmup = trial < warmups;
        // Match variants by scenario/trial and alternate their order to reduce drift.
        for (const fieldVariant of fieldSelection ? fieldVariantOrder(trial) : [undefined]) {
          const observation = await runTrial({ page, baseUrl, elements, strategy, warmup, fieldVariant });
          observation.trial = warmup ? trial + 1 : trial - warmups + 1;
          if (!warmup) observations.push(observation);
          else if (observation.error) warmupFailures.push(observation);
          if (observation.error) console.warn(`Failed ${fieldVariant ?? ''}/${strategy}/${elements}, ${warmup ? 'warm-up' : 'trial'} ${observation.trial}: ${observation.error}`);
          if (!warmup && (trial - warmups + 1) % 10 === 0) {
            console.log(`Completed ${fieldVariant ?? ''}/${strategy}/${elements}: ${trial - warmups + 1}/${repetitions}`);
          }
          if (trialPauseMs) await page.waitForTimeout(trialPauseMs);
        }
      }
    }
  }
} finally {
  try {
    await context?.close();
  } finally {
    try { await browser?.close(); }
    finally { await new Promise(resolve => server.close(resolve)); }
  }
}

const groups = new Map();
for (const observation of observations) {
  const key = `${observation.fieldVariant ?? "default"}:${observation.strategy}:${observation.annotatedElements}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(observation);
}

const summaries = [...groups.values()].map(attempts => {
  const first = attempts[0];
  const rows = attempts.filter(row => !row.error);
  const timings = key => rows.length ? nullableSummary(rows.map(row => row[key])) : null;
  const counts = key => {
    const values = rows.map(row => row[key]).filter(value => value !== null);
    return values.length ? summarizeCount(values) : null;
  };
  return {
    ...(first.fieldVariant ? { fieldVariant: first.fieldVariant } : {}),
    strategy: first.strategy,
    annotatedElements: first.annotatedElements,
    uniqueIdentifiers: first.uniqueIdentifiers,
    trials: rows.length,
    attemptedTrials: attempts.length,
    failedTrials: attempts.length - rows.length,
    pageLoad: timings('pageLoadMs'),
    initialization: timings('initMs'),
    readiness: timings('readyMs'),
    prefetchCompletion: timings('prefetchCompletionMs'),
    initializationRequests: counts('initializationRequests'),
    totalRequests: counts('apiRequests'),
    prefetchRequests: counts('prefetchRequests'),
    distinctRecordsFetched: counts('distinctRecordsFetched'),
    transferredBytes: counts('transferredBytes'),
    interactionRequests: counts('interactionRequests'),
    repeatInteractionRequests: counts('repeatInteractionRequests'),
    cacheHits: counts('cacheHits'),
    interactionToContent: timings('interactionToContentMs'),
    interactionToVisible: timings('interactionToVisibleMs'),
    warmCacheInteraction: timings('warmCacheInteractionMs'),
    ...(live ? { providerRequest: timings('providerRequestMs') } : {}),
  };
});

if (fieldSelection) summaries.sort((left, right) =>
  left.annotatedElements - right.annotatedElements
  || strategies.indexOf(left.strategy) - strategies.indexOf(right.strategy)
  || fieldVariants.indexOf(left.fieldVariant) - fieldVariants.indexOf(right.fieldVariant));

const result = {
  schemaVersion: 2,
  measurementVersion: 2,
  benchmark: fieldSelection ? 'browser-field-selection' : live ? 'browser-live-api' : 'browser-fixtures',
  condition: fieldSelection ? 'live-field-selection' : live ? 'live' : 'fixture',
  startedAt,
  generatedAt: new Date().toISOString(),
  packageVersion: JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version,
  ...provenance,
  settings: { ...(fieldSelection ? { fieldVariants, fieldsByVariant: Object.fromEntries(fieldVariants.map(variant => [variant, fieldsForVariant(variant)])), requestOverride: true, variantOrder: 'Alternates within matched scenario/trial, including warm-ups; not randomized.' } : {}), browser: 'Chromium', repetitions, warmups, pageSizes, strategies, interactionsPerTrial: 5, cacheState: 'Fresh document and JavaScript realm per trial; Chromium HTTP cache disabled; first five interactions use distinct identifiers; repeat interaction uses the in-memory annotation cache. Browser connections and provider caches may be reused.', visualPreload: 'none', viewport: { width: 1280, height: 900 }, uniqueRatio: 0.8, ...(live ? { networkLabel, trialPauseMs, timeoutMs, identifiers: liveGeneSymbols, endpoint: 'https://mygene.info/v3/query', species: 9606, scopes: 'symbol' } : {}) },
  environment: { node: process.version, platform: `${os.platform()} ${os.release()} ${os.arch()}`, cpu: os.cpus()[0]?.model ?? 'unknown', logicalCpus: os.cpus().length, totalMemoryBytes: os.totalmem(), browserVersion },
  definitions: {
    pageLoadMs: 'navigationStart to DOMContentLoaded; browser Navigation Timing API.',
    initMs: 'Synchronous duration of the real GeneTooltip.init() call.',
    readyMs: 'navigationStart to completion of the inline module initialization; optional background prefetch is excluded.',
    prefetchCompletionMs: 'From initialization endpoint until all distinct identifiers were fetched. For large smart pages, the runner scrolls the document to trigger viewport observers; this includes the deliberate scroll and 200 ms observer debounce.',
    interactionToContentMs: 'Median per trial across five sequential hovers on distinct identifiers, from capture of the real mouseenter event to its onTiming content set event. Summaries show the distribution of per-trial medians.',
    interactionToVisibleMs: 'Median per trial across the same five hovers, from mouseenter capture until that trigger\'s own tooltip has content and data-state=visible, timestamped by an in-page MutationObserver. This is a DOM state endpoint, not paint or animation completion.',
    warmCacheInteractionMs: 'Real mouseenter to content set on a second element with the first identifier, already in the annotation cache.',
    dataSource: live ? 'Normal MyGene.info browser POSTs.' : 'Intercepted requests fulfilled immediately from the stored TP53 fixture, relabeled with the same human gene symbols as live trials.',
    ...(live ? {
      providerRequestMs: 'Within-trial median of successful POST request start to complete response body, from browser request timing. Includes network/download; excludes application rendering. Summary is the distribution of per-trial medians.',
      failures: 'Failed measured trials are retained in rawObservations but excluded from latency summaries; failed warm-ups are retained in warmupFailures. No automatic retries.',
      transferredBytes: 'Encoded response body bytes from Playwright request.sizes(), excluding response headers. Full live bodies are parsed by the library, not copied into the runner.',
      distinctRecordsFetched: 'Application cache size after successful interactions; prefetched trials require all expected unique records to be cached, and every measured hover must display a valid record.',
    } : {}),
    ...(fieldSelection ? { fieldSelection: 'Benchmark-only POST fields override: reference field list versus exactly the same list without generif. All queries, display settings and prefetch strategies remain identical. This isolates field omission; it does not test the library field planner or expansion loading.' } : {}),
    apiRequests: 'Count of provider POST batch calls. One request may return multiple records; records fetched counts unique query identifiers in returned payloads.',
    prefetchRequests: 'Provider POST requests completed before the five measured tooltip hovers.',
    interactionRequests: 'Provider POST requests caused by the five measured hovers on distinct identifiers.',
  },
  summaries,
  rawObservations: observations,
  warmupFailures,
};

const resultsDirectory = path.join(root, 'benchmark/results');
await mkdir(resultsDirectory, { recursive: true });
const resultStem = fieldSelection ? 'browser-fields-latest' : live ? 'browser-live-latest' : 'browser-fixture-latest';
await writeFile(path.join(resultsDirectory, `${resultStem}.json`), `${JSON.stringify(result, null, 2)}\n`);
await writeFile(path.join(resultsDirectory, `${resultStem}.csv`), toCsv(browserCsvRows(summaries.map(row => ({ ...row, source: result.condition })))));
const fixtureResult = !live ? result : await readSavedResult('browser-fixture-latest.json');
const liveResult = live && !fieldSelection ? result : await readSavedResult('browser-live-latest.json');
const fieldSelectionResult = fieldSelection ? result : await readSavedResult('browser-fields-latest.json');
const markdown = combineBrowserReports(fixtureResult, liveResult, fieldSelectionResult);
await writeFile(path.join(resultsDirectory, 'browser-latest.md'), markdown);
if (!live) await writeFile(path.join(resultsDirectory, 'browser-fixture-latest.md'), combineBrowserReports(result, null));
if (live && !fieldSelection) await writeFile(path.join(resultsDirectory, 'browser-live-latest.md'), `# Live browser benchmark results\n\n${renderLiveSection(result)}`);
if (fieldSelection) await writeFile(path.join(resultsDirectory, 'browser-fields-latest.md'), `# Field selection browser benchmark results\n\n${renderFieldSelectionSection(result)}`);
console.log(markdown);
console.log(`Raw trials: ${path.join(resultsDirectory, `${resultStem}.json`)}`);
if (observations.some(row => row.error)) process.exitCode = 1;

async function readSavedResult(name) {
  try { return JSON.parse(await readFile(path.join(resultsDirectory, name), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function runTrial({ page, baseUrl, elements, strategy, warmup, fieldVariant }) {
  const requestEvents = [];
  const responses = [];
  const requestLog = [];
  const requestRecords = new Map();
  const isProvider = request => request.url().startsWith('https://mygene.info/') && request.method() === 'POST';
  const onRequest = request => {
    if (!isProvider(request)) return;
    // Playwright has not necessarily populated timing().startTime at this
    // event. Read browser timing after completion; retain an observed fallback.
    requestEvents.push(request);
    const parameters = new URLSearchParams(fieldVariant ? applyFieldSelection(request.postData(), fieldVariant) : request.postData() ?? '');
    const record = {
      url: request.url(), method: request.method(), observedAt: new Date().toISOString(), startedAt: null,
      queries: (parameters.get('q') ?? '').split(',').filter(Boolean),
      fields: (parameters.get('fields') ?? '').split(',').filter(Boolean),
      species: parameters.get('species'), scopes: parameters.get('scopes'),
      status: null, durationMs: null, error: null,
    };
    requestLog.push(record);
    requestRecords.set(request, record);
  };
  const onResponse = response => {
    if (!isProvider(response.request())) return;
    responses.push(response);
    requestRecords.get(response.request()).status = response.status();
  };
  const onRequestFailed = request => {
    const record = requestRecords.get(request);
    if (record) record.error = request.failure()?.errorText ?? 'Request failed';
  };
  page.on('request', onRequest);
  page.on('response', onResponse);
  page.on('requestfailed', onRequestFailed);
  if (fieldVariant) await page.route('https://mygene.info/**', async route => {
    const request = route.request();
    if (!isProvider(request)) return route.continue();
    await route.continue({ postData: applyFieldSelection(request.postData(), fieldVariant) });
  });
  if (!live) await page.route('https://mygene.info/**', async route => {
    const body = new URLSearchParams(route.request().postData() ?? '');
    const queries = (body.get('q') ?? '').split(',').filter(Boolean);
    const payload = queries.map(query => ({ ...fixture, _id: String(7157 + liveGeneSymbols.indexOf(query)), query, symbol: query }));
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' }, body: JSON.stringify(payload) });
  });

  try {
    await page.goto(`${baseUrl}/?elements=${elements}&strategy=${strategy}&fieldVariant=${fieldVariant ?? ""}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__bench?.ready === true);
    const ready = await page.evaluate(() => ({ initMs: window.__bench.initMs, readyAt: window.__bench.readyAt, domContentLoadedMs: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd ?? null, timeOrigin: performance.timeOrigin }));
    const readyEpoch = ready.timeOrigin + ready.readyAt;
    const prefetchStart = ready.readyAt;

    const needsSmartScroll = strategy === 'smart' && elements > 15
      ? await page.evaluate(expected => {
        const visibleIdentifiers = new Set([...document.querySelectorAll('.gene-tooltip')]
          .filter(element => {
            const rect = element.getBoundingClientRect();
            return rect.bottom >= -200 && rect.top <= innerHeight + 200;
          })
          .map(element => element.textContent));
        return visibleIdentifiers.size < expected;
      }, uniqueCount(elements))
      : false;
    if (needsSmartScroll) {
      await page.evaluate(async () => {
        const step = Math.max(300, Math.floor(innerHeight * 0.8));
        for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
          scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 230));
        }
      });
    }
    if (strategy !== 'none') {
      await page.waitForFunction(expected => window.__bench.cacheSize() >= expected, uniqueCount(elements), { timeout: live ? timeoutMs : 30000 });
    }
    const prefetchCompletionMs = strategy === 'none' ? null : await page.evaluate(start => performance.now() - start, prefetchStart);
    const prefetchRequests = responses.length;
    const interactionCount = Math.min(5, uniqueCount(elements));
    const contentSamples = [];
    const visibleSamples = [];
    for (let index = 0; index < interactionCount; index += 1) {
      await page.mouse.move(1250, 850);
      await page.waitForTimeout(20);
      await page.evaluate(index => {
        window.__bench.interaction = {
          reference: document.querySelectorAll('.gene-tooltip')[index],
          eventAt: null,
          contentAt: null,
          visibleAt: null,
          events: [],
        };
      }, index);
      await page.locator('.gene-tooltip').nth(index).hover();
      await page.waitForFunction(() => window.__bench.interaction?.contentAt != null, null, { timeout: timeoutMs });
      await page.waitForFunction(() => window.__bench.interaction?.visibleAt != null, null, { timeout: timeoutMs });
      const sample = await page.evaluate(() => ({
        contentMs: window.__bench.interaction.contentAt - window.__bench.interaction.eventAt,
        visibleMs: window.__bench.interaction.visibleAt - window.__bench.interaction.eventAt,
      }));
      contentSamples.push(sample.contentMs);
      visibleSamples.push(sample.visibleMs);
    }
    const interactionRequests = responses.length - prefetchRequests;
    const interactionToContentMs = median(contentSamples);
    const interactionToVisibleMs = median(visibleSamples);
    await page.mouse.move(1250, 850);
    await page.waitForTimeout(20);
    const repeatedIdentifierIndex = 5;
    const duplicate = page.locator('.gene-tooltip').nth(repeatedIdentifierIndex);
    await page.evaluate(index => {
      window.__bench.interaction = {
        reference: document.querySelectorAll('.gene-tooltip')[index],
        eventAt: null,
        contentAt: null,
        visibleAt: null,
        events: [],
      };
    }, repeatedIdentifierIndex);
    await duplicate.hover();
    await page.waitForFunction(() => window.__bench.interaction?.contentAt != null, null, { timeout: timeoutMs });
    const warmCacheInteractionMs = await page.evaluate(() => window.__bench.interaction.contentAt - window.__bench.interaction.eventAt);
    const repeatInteractionRequests = responses.length - prefetchRequests - interactionRequests;
    await page.waitForTimeout(10);
    const responseInfo = await collectResponses();
    const initializationRequests = requestEvents.some(request => request.timing().startTime <= 0) ? null : requestEvents.filter(request => {
      const start = request.timing().startTime;
      return start > 0 && start <= readyEpoch;
    }).length;
    if (requestLog.some(request => request.error || request.status !== 200)) {
      throw new Error('Provider request, response or record validation failed; see requestLog.');
    }
    const fieldValidation = fieldVariant ? await page.evaluate(() => window.__bench.fieldValidation) : null;
    if (fieldVariant && (!fieldValidation.records || (fieldVariant === 'reference' && !fieldValidation.recordsWithGenerif))) {
      throw new Error('Field-selection response validation failed: expected matched records and reference GeneRIF annotations.');
    }
    const requests = responseInfo.length;
    const records = new Set(responseInfo.flatMap(item => item.data.filter(record => !record.notfound && record._id).map(record => record.query)));
    const result = {
      ...(fieldVariant ? { fieldVariant, fieldValidation } : {}),
      strategy, annotatedElements: elements, uniqueIdentifiers: uniqueCount(elements), warmup,
      pageLoadMs: ready.domContentLoadedMs,
      initMs: ready.initMs,
      readyMs: ready.readyAt,
      initializationRequests,
      prefetchCompletionMs,
      apiRequests: requests,
      prefetchRequests,
      distinctRecordsFetched: live ? await page.evaluate(() => window.__bench.cacheSize()) : records.size,
      transferredBytes: responseInfo.reduce((sum, item) => sum + item.bytes, 0),
      interactionToContentMs,
      interactionToVisibleMs,
      warmCacheInteractionMs,
      interactionSamples: contentSamples,
      interactionRequests,
      repeatInteractionRequests,
      cacheHits: await page.evaluate(() => window.__bench.events.filter(event => event.label === 'cache hit').length),
      ...(live ? {
        providerRequestMs: nullableMedian(requestLog.map(request => request.durationMs).filter(duration => duration !== null)),
        requestLog,
        identifiers: [...new Set(identifiersForPage(elements))],
      } : {}),
    };
    return result;
  } catch (error) {
    // A timed-out fetch may still be downloading. Abort it before awaiting its
    // completion metadata, so a stalled provider cannot strand the whole run.
    const fieldValidation = fieldVariant
      ? await page.evaluate(() => window.__bench?.fieldValidation ?? null).catch(() => null) : null;
    await page.goto('about:blank', { waitUntil: 'commit' });
    await collectResponses();
    return {
      ...(fieldVariant ? { fieldVariant, fieldValidation } : {}),
      strategy, annotatedElements: elements, uniqueIdentifiers: uniqueCount(elements), warmup,
      error: [error.message, ...requestLog.filter(request => request.error || (request.status !== null && request.status !== 200)).map(request => request.error || `HTTP ${request.status}`)].join('; '),
      requestLog,
    };
  } finally {
    // Abort any outstanding fetches before the next trial (and its listeners).
    await page.goto('about:blank');
    if (!live || fieldVariant) await page.unroute('https://mygene.info/**');
    page.off('request', onRequest);
    page.off('response', onResponse);
    page.off('requestfailed', onRequestFailed);
  }

  async function collectResponses() {
    return Promise.all(responses.map(async response => {
      const record = requestRecords.get(response.request());
      try {
        if (live) {
          // The normal library parses the complete live response. Read metadata
          // rather than duplicating multi-megabyte JSON through the inspector,
          // whose response-body cache can evict a large batch before inspection.
          const failure = await response.finished();
          if (failure) throw failure;
          const sizes = await response.request().sizes();
          const timing = response.request().timing();
          record.startedAt = timing.startTime > 0 ? new Date(timing.startTime).toISOString() : record.observedAt;
          record.timestampSource = timing.startTime > 0 ? 'browser-request-timing' : 'runner-request-event';
          const duration = timing.responseEnd;
          record.durationMs = duration >= 0 ? duration : null;
          record.responseBodyBytes = sizes.responseBodySize;
          record.responseHeadersBytes = sizes.responseHeadersSize;
          return { bytes: sizes.responseBodySize, data: [] };
        }
        const body = await response.body();
        const data = JSON.parse(body.toString('utf8'));
        if (!Array.isArray(data)) throw new Error('Provider did not return a batch array');
        const duration = response.request().timing().responseEnd;
        record.durationMs = duration >= 0 ? duration : null;
        record.bytes = body.byteLength;
        record.returnedIdentifiers = [...new Set(data.filter(item => !item.notfound && item._id).map(item => item.query))];
        record.missingIdentifiers = record.queries.filter(query => !record.returnedIdentifiers.includes(query));
        return { bytes: body.byteLength, data };
      } catch (error) {
        record.error = error.message;
        return { bytes: 0, data: [] };
      }
    }));
  }
}

function nullableSummary(values) { return values.every(value => value === null) ? null : summarize(values.filter(value => value !== null)); }
function summarizeCount(values) {
  const summary = summarize(values);
  return { observations: summary.observations, median: summary.medianMs, q1: summary.q1Ms, q3: summary.q3Ms, p95: summary.p95Ms, mean: summary.meanMs };
}
function median(values) { return summarize(values).medianMs; }
function nullableMedian(values) { return values.length ? median(values) : null; }
function uniqueCount(elements) { return Math.ceil(elements * 0.8); }
function positiveInteger(name, fallback) { const value = Number(process.env[name] ?? fallback); if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer.`); return value; }
function nonNegativeInteger(name, fallback) { const value = Number(process.env[name] ?? fallback); if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer.`); return value; }
function nonNegativeNumber(name, fallback) { const value = Number(process.env[name] ?? fallback); if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be non-negative.`); return value; }
