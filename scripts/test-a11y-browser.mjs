import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const geneFixture = JSON.parse(await readFile(join(root, 'benchmark/fixtures/mygene-tp53.json'), 'utf8')).data;
const chemicalFixture = JSON.parse(await readFile(join(root, 'benchmark/fixtures/mychem-aspirin.json'), 'utf8')).data;
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' };
const server = http.createServer(async (req, res) => {
  try {
    const requestPath = normalize(decodeURIComponent((req.url || '/').split('?')[0])).replace(/^([.][.][/\\])+/, '');
    const file = join(root, requestPath === '/' ? 'test/browser-a11y.html' : requestPath.slice(1));
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ colorScheme:'light', reducedMotion:'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
try {
  const waitFor = async (predicate, timeout = 3000) => {
    const deadline = Date.now() + timeout;
    while (!(await predicate())) {
      if (Date.now() > deadline) throw new Error('Timed out waiting for browser state');
      await new Promise(resolve => setTimeout(resolve, 25));
    }
  };
  await page.addInitScript(({ gene, chemical }) => {
    window.__fixtureGene = gene;
    window.__fixtureChemical = chemical;
  }, { gene: geneFixture, chemical: chemicalFixture });
  await page.goto(`http://127.0.0.1:${port}/test/browser-a11y.html`);
  const gene = page.locator('#gene');
  await gene.hover();
  const dialog = page.getByRole('dialog').first();
  await waitFor(() => dialog.isVisible());
  assert.equal(await dialog.getAttribute('role'), 'dialog');
  assert.ok(await page.locator('.gt-panel-status').count());
  await dialog.focus();
  await page.keyboard.press('Tab');
  assert.ok(await dialog.evaluate(el => el === document.activeElement || el.contains(document.activeElement)), 'Tab must enter the dialog focus path');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'gene', 'Shift+Tab must return to the trigger');
  await page.keyboard.press('Enter');
  assert.ok(await page.locator('[data-gt-tooltip-root]').count());
  const pin = page.locator('.gt-pin-button').first();
  if (await pin.count()) { await pin.click(); await page.keyboard.press('Escape'); await waitFor(() => page.locator('[data-gt-tooltip-root]').count().then(count => count === 0)); }
  await gene.focus(); await page.keyboard.press('Enter');
  const rootPanel = page.locator('[data-gt-tooltip-root]').first();
  await waitFor(() => rootPanel.isVisible());
  const summaryToggle = rootPanel.locator('.gt-summary-toggle');
  assert.equal(await summaryToggle.count(), 1, 'gene summary toggle must render');
  await summaryToggle.click();
  assert.equal(await rootPanel.locator('.gt-summary-copy-btn').count(), 1, 'gene summary copy control must render');
  await rootPanel.locator('.gt-summary-copy-btn').click();
  await waitFor(() => page.locator('.gt-copy-status').first().textContent().then(text => Boolean(text)));
  assert.match(await page.locator('.gt-copy-status').first().textContent(), /copied/i);
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('fixture clipboard failure'); }; });
  await rootPanel.locator('.gt-summary-copy-btn').click();
  await waitFor(() => page.locator('.gt-copy-status').first().textContent().then(text => /Unable/.test(text)));
  const more = rootPanel.locator('.gene-tooltip-more-btn').first();
  assert.equal(await more.count(), 1, 'gene nested child entry must render');
  await more.evaluate(button => button.click());
  const child = page.locator('.gt-tooltip-box[role="dialog"]').nth(1);
  await waitFor(() => child.isVisible());
  assert.match(await child.getAttribute('aria-label'), /Pathways|Transcripts|Domains|Gene/);
  await child.focus();
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('role')), 'dialog', 'nested dialog must receive focus');
  const nestedSearch = child.locator('.gene-tooltip-nested-search');
  assert.equal(await nestedSearch.count(), 1, 'nested child search must render');
  await nestedSearch.fill('zzzznonexistent');
  assert.match(await child.locator('.gt-nested-status').textContent(), /0 results/);
  await child.locator('.gt-close-button').click();
  await waitFor(() => page.locator('.gt-tooltip-box[role="dialog"]').count().then(count => count === 1));
  assert.equal(await page.locator('.gt-tooltip-box[role="dialog"]').count(), 1, 'child close must preserve parent');
  const parentPin = rootPanel.locator('.gt-pin-button');
  assert.equal(await parentPin.count(), 1, 'parent pin control must render');
  await parentPin.click();
  assert.equal(await parentPin.getAttribute('aria-pressed'), 'true', 'pin must expose pressed state');
  await page.keyboard.press('Escape');
  await waitFor(() => page.locator('[data-gt-tooltip-root]').count().then(count => count === 0));
  const collapsible = page.locator('.gt-collapsible-header').first();
  if (await collapsible.count()) { await collapsible.click(); assert.equal(await collapsible.getAttribute('aria-expanded'),'false'); assert.ok(await page.locator('.gt-collapsible-content').first().getAttribute('inert') !== null); await collapsible.click(); }
  const axePath = join(root, 'node_modules/axe-core/axe.min.js');
  await page.addScriptTag({ path:axePath });
  for (const theme of ['light','dark','material','translucent','light-border']) {
    await page.evaluate(value => {
      document.documentElement.classList.toggle('dark', value === 'dark');
      document.querySelectorAll('.gt-tooltip-box').forEach(box => { box.dataset.theme = value; });
    }, theme);
    await page.waitForTimeout(500);
    const result = await page.evaluate(async () => window.axe.run(document, { runOnly:{ type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } }));
    assert.deepEqual(result.violations, [], `gene ${theme} axe violations: ${result.violations.map(v => `${v.id} (${v.nodes.map(n=>n.target).join(',')})`).join('; ')}`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
  assert.equal(await page.evaluate(() => matchMedia('(forced-colors: active)').matches), true);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'none' });
  await page.keyboard.press('Escape');
  await page.locator('#chemical').click();
  await waitFor(() => page.getByRole('dialog').count().then(count => count > 0));
  for (const theme of ['light','dark','material','translucent','light-border']) {
    await page.evaluate(value => {
      document.documentElement.classList.toggle('dark', value === 'dark');
      document.querySelectorAll('.gt-tooltip-box').forEach(box => { box.dataset.theme = value; });
    }, theme);
    await page.waitForTimeout(500);
    const result = await page.evaluate(async () => window.axe.run(document, { runOnly:{ type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } }));
    assert.deepEqual(result.violations, [], `chemical ${theme} axe violations: ${result.violations.map(v => `${v.id} (${v.nodes.map(n=>n.target).join(',')})`).join('; ')}`);
  }
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.__a11y.cleanups.forEach(cleanup => cleanup()));
  assert.equal(await page.locator('[data-gt-tooltip-root]').count(), 0);
  assert.deepEqual(errors, [], `browser console errors: ${errors.join('; ')}`);
  console.log(`a11y browser checks passed (Chromium ${browser.version()}, gene/chemical scans across five themes)`);
} finally {
  await browser.close(); server.close();
}
