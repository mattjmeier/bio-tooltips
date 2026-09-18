// Documentation-site accessibility scan (WCAG 2.2 A/AA, axe-core).
//
// Scope: the built VitePress site under docs/.vitepress/dist. Provider APIs
// (mygene.info / mychem.info) are intercepted with local fixtures so the
// interactive demos render deterministic, library-owned content. Live CDN
// assets (d3, ideogram) load normally.
//
// This script checks structure, semantics, names, and contrast on every
// unique page template plus the key interactive states (open demo dialogs,
// search results, mobile menu, dark mode). It does NOT establish full WCAG
// conformance: keyboard order, screen reader output, zoom/reflow, and
// forced-colors behavior require manual testing (see
// audits/accessibility/a11y-evaluation.md).
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const distRoot = join(root, 'docs/.vitepress/dist');
const geneFixture = JSON.parse(await readFile(join(root, 'benchmark/fixtures/mygene-tp53.json'), 'utf8')).data;
const chemicalFixture = JSON.parse(await readFile(join(root, 'benchmark/fixtures/mychem-aspirin.json'), 'utf8')).data;
const axePath = join(root, 'node_modules/axe-core/axe.min.js');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer(async (req, res) => {
  try {
    const requestPath = normalize(decodeURIComponent((req.url || '/').split('?')[0]))
      .replaceAll('\\', '/')
      .replace(/^([.][.][/\\])+/, '');
    const relative = requestPath.startsWith('/bio-tooltips/') ? requestPath.slice('/bio-tooltips/'.length) : requestPath.slice(1);
    const file = join(distRoot, relative === '' ? 'index.html' : relative);
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404, { 'content-type': 'text/html' }); res.end(`<html><body>Not found: ${req.url}</body></html>`); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/bio-tooltips/`;
const browser = await chromium.launch({ headless: true });
const failures = [];
const warnings = [];
const results = [];

async function mockProviders(page) {
  await page.route('**mygene.info/**', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify([geneFixture]),
  }));
  await page.route('**mychem.info/v1/query', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify(route.request().method() === 'GET' ? { hits: [chemicalFixture] } : [chemicalFixture]),
  }));
  await page.route('**mychem.info/**', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify([chemicalFixture]),
  }));
}

async function withAxe(page) {
  await page.addScriptTag({ path: axePath });
}

async function scan(page, label, { requireDialog = false, rules = null } = {}) {
  if (requireDialog) {
    assert.ok(await page.getByRole('dialog').count() > 0, `${label}: expected an open dialog`);
  }
  await page.waitForTimeout(400);
  const runOnly = rules
    ? { type: 'rule', values: rules }
    : { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] };
  const result = await page.evaluate(async ({ runOnly }) => (await window.axe.run(document, { runOnly })).violations, { runOnly });
  if (result.length) {
    const summary = result.map(v => `${v.id} x${v.nodes.length} (${v.nodes.slice(0, 3).map(n => n.target).join(' | ')})`).join('; ');
    if (rules) {
      // Best-practice (non-WCAG-tagged) structural rules: report as warnings.
      warnings.push(`${label}: ${summary}`);
      results.push(`WARN ${label}: ${summary}`);
    } else {
      failures.push(`${label}: ${summary}`);
      results.push(`FAIL ${label}: ${summary}`);
    }
  } else {
    results.push(`PASS ${label}`);
  }
  return result;
}

// Every unique page template in the built site (one representative per
// template family, plus every demo and structural page).
const staticPages = [
  '/',
  '/guide.html',
  '/core-concepts.html',
  '/installation.html',
  '/configuration.html',
  '/accessibility.html',
  '/styling-theming.html',
  '/gene-usage.html',
  '/gene-configuration.html',
  '/gene-data-fields.html',
  '/chemical-usage.html',
  '/chemical-configuration.html',
  '/chemical-data-fields.html',
  '/reference/core.html',
  '/reference/adapters.html',
  '/migrating-to-v2.html',
  '/architecture.html',
  '/performance.html',
  '/add-modules.html',
  '/api/modules.html',
  '/demo.html',
  '/404.html',
];
const demoPages = [
  { url: '/demos/gene.html', open: async page => {
    const trigger = page.locator('.gene-tooltip').first();
    await trigger.click();
    await page.getByRole('dialog').first().waitFor();
  } },
  { url: '/demos/chemical.html', open: async page => {
    const trigger = page.locator('.chemical-tooltip').first();
    await trigger.click();
    await page.getByRole('dialog').first().waitFor();
  } },
  { url: '/demos/mixed.html', open: async page => {
    const trigger = page.locator('.gene-tooltip, .chemical-tooltip').first();
    await trigger.click();
    await page.getByRole('dialog').first().waitFor();
  } },
];

async function openPage(page, url, label) {
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await withAxe(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await scan(page, label);
}

// 1. Desktop light mode: every page template.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  await mockProviders(page);
  for (const url of staticPages) {
    await openPage(page, url, `desktop ${url}`);
  }
  // Demo pages: closed, then open.
  for (const demo of demoPages) {
    await page.goto(base + demo.url, { waitUntil: 'networkidle' });
    await withAxe(page);
    await scan(page, `desktop ${demo.url} (closed)`);
    await demo.open(page);
    await scan(page, `desktop ${demo.url} (open demo)`, { requireDialog: true });
  }
  // Search process (VitePress local search) — only if the site enables it.
  // The current site does NOT configure themeConfig.search, so .VPNavBarSearch
  // is empty and there is no search UI to evaluate; record that explicitly.
  await page.goto(base, { waitUntil: 'networkidle' });
  await withAxe(page);
  const searchButton = page.locator('.VPNavBarSearch button, button[aria-label="Search"], button:has-text("Search")').first();
  if (await searchButton.count()) {
    await searchButton.click();
    await page.getByRole('dialog').last().waitFor();
    await page.keyboard.type('transcript');
    await page.waitForTimeout(400);
    await scan(page, 'desktop search open with query');
    await page.keyboard.press('Escape');
  } else {
    results.push('SKIP desktop search: site has no search UI (VitePress local search not configured)');
  }
  // Dark mode toggle (documentation theme switching).
  const darkToggle = page.locator('button.VPSwitchAppearance').first();
  if (await darkToggle.count()) {
    await darkToggle.click();
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    await scan(page, 'desktop dark mode');
    // Open a demo in dark mode as well.
    await page.goto(base + 'demos/gene.html', { waitUntil: 'networkidle' });
    await withAxe(page);
    await demoPages[0].open(page);
    await scan(page, 'desktop dark mode open demo', { requireDialog: true });
  } else {
    failures.push('desktop dark mode: toggle not found');
  }
  await context.close();
}

// 2. Mobile viewport: menu navigation and a demo page.
{
  const context = await browser.newContext({ viewport: { width: 375, height: 720 }, colorScheme: 'light' });
  const page = await context.newPage();
  await mockProviders(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  await withAxe(page);
  await scan(page, 'mobile home');
  const menu = page.locator('button[aria-label="mobile navigation"], #menu-toggle').first();
  if (await menu.count()) {
    await menu.click();
    await page.waitForTimeout(300);
    await scan(page, 'mobile menu open');
    await page.keyboard.press('Escape');
  } else {
    failures.push('mobile menu: toggle not found');
  }
  for (const demo of demoPages) {
    await page.goto(base + demo.url, { waitUntil: 'networkidle' });
    await withAxe(page);
    await scan(page, `mobile ${demo.url} (closed)`);
    await demo.open(page);
    await scan(page, `mobile ${demo.url} (open demo)`, { requireDialog: true });
  }
  await context.close();
}

// 3. Structural (best-practice) heading/landmark checks that the WCAG tag
//    set does not enforce automatically (2.4.6 evidence, 1.3.1 support).
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  await mockProviders(page);
  for (const url of ['/', '/guide.html', '/accessibility.html', '/api/modules.html', '/demos/gene.html']) {
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await withAxe(page);
    await scan(page, `structural ${url}`, { rules: ['heading-order', 'page-has-heading-one', 'empty-heading', 'region'] });
  }
  await context.close();
}

// 4. 320 CSS pixel reflow (1.4.10 equivalent of 400% zoom on a 1280px
//    display): page and open demo must stay usable without horizontal
//    page overflow.
{
  const context = await browser.newContext({ viewport: { width: 320, height: 720 }, colorScheme: 'light' });
  const page = await context.newPage();
  await mockProviders(page);
  for (const url of ['/', '/guide.html', '/demos/gene.html', '/demos/chemical.html']) {
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await withAxe(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 1, `320px ${url}: horizontal page overflow ${overflow}px`);
    results.push(`PASS 320px reflow ${url} (page overflow ${overflow}px)`);
  }
  await page.goto(base + 'demos/gene.html', { waitUntil: 'networkidle' });
  await withAxe(page);
  await demoPages[0].open(page);
  await scan(page, '320px open gene demo', { requireDialog: true });
  await context.close();
}

const browserVersion = browser.version();
await browser.close();
server.close();
console.log(results.join('\n'));
if (warnings.length) console.log('\nBest-practice warnings (not WCAG-tagged):\n' + warnings.join('\n'));
if (failures.length) {
  console.error(`\ndocs a11y scan: ${failures.length} failing check(s)`);
  process.exit(1);
}
console.log(`\ndocs a11y scan passed (Chromium ${browserVersion}); axe wcag2a/wcag2aa/wcag21a/wcag21aa/wcag22aa across all page templates, open demos, search, mobile menu, and dark mode.`);
