import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const gene = JSON.parse(await readFile(root + 'benchmark/fixtures/mygene-tp53.json', 'utf8')).data;
const chemical = JSON.parse(await readFile(root + 'benchmark/fixtures/mychem-aspirin.json', 'utf8')).data;
const browser = await chromium.launch();
try {
  for (const provider of ['gene', 'chemical']) {
    const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.abort());
    await page.setContent(`<html lang="en"><head><title>Visual accessibility fixture</title></head><body><main><button id="before">Before</button><span id="trigger" class="${provider}-tooltip" data-species="human" data-query="2244" data-scope="pubchem">${provider === 'gene' ? 'TP53' : 'aspirin'}</span><button id="after">After</button></main></body></html>`);
    await page.addStyleTag({ path: root + 'dist/bio-tooltips.css' });
    await page.addScriptTag({ path: root + 'node_modules/d3/dist/d3.min.js' });
    await page.addScriptTag({ path: root + 'dist/bio-tooltips.global.js' });
    await page.evaluate(({ provider, gene, chemical }) => {
      if (provider === 'gene') document.querySelector('#trigger').removeAttribute('data-query');
      window.fetch = async () => ({ ok: true, json: async () => [provider === 'gene' ? gene : chemical] });
      const options = { prefetch: 'none', visualPreload: 'none', ideogram: { enabled: false },
        tooltipOptions: { showDuration: 0, hideDuration: 0 }, display: { collapsedByDefault: false },
        structureRenderer: () => '<div role="img" aria-label="Chemical structure fixture"></div>' };
      window.cleanup = (provider === 'gene' ? GeneTooltip : ChemicalTooltip).init(options);
    }, { provider, gene, chemical });
    await page.locator('#trigger').focus();
    await page.keyboard.press('Enter');
    await page.locator(provider === 'gene' ? '.gt-gene-text-alternative-toggle, .gt-gene-text-alternative:not([hidden])' : '.gt-chem-id-table').waitFor();
    const panel = page.getByRole('dialog');
    await page.evaluate(() => document.querySelectorAll('details').forEach(el => { el.open = true; }));
    for (const mode of ['320px', 'text-spacing', '200-percent-text']) {
      if (mode === 'text-spacing') await page.addStyleTag({ content: '.gt-tooltip-box, .gt-tooltip-box * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } .gt-tooltip-box p { margin-bottom: 2em !important; }' });
      if (mode === '200-percent-text') await panel.evaluate(el => {
        const sizes = [el, ...el.querySelectorAll('*')].filter(node => node instanceof HTMLElement).map(node => [node, parseFloat(getComputedStyle(node).fontSize)]);
        sizes.forEach(([node, size]) => node.style.setProperty('font-size', `${size * 2}px`, 'important'));
      });
      await page.waitForTimeout(350);
      const layout = await panel.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: innerWidth,
          pageWidth: document.documentElement.scrollWidth, panelWidth: el.clientWidth, panelScroll: el.scrollWidth };
      });
      assert.ok(layout.left >= -1 && layout.right <= layout.width + 1, `${provider} ${mode}: panel outside viewport ${JSON.stringify(layout)}`);
      assert.ok(layout.pageWidth <= layout.width + 1, `${provider} ${mode}: horizontal page overflow`);
      assert.ok(layout.panelScroll <= layout.panelWidth + 1, `${provider} ${mode}: horizontal panel overflow ${JSON.stringify(layout)}`);
      const close = panel.locator('.gt-close-button').first();
      await close.focus();
      const bounds = await close.boundingBox();
      assert.ok(bounds && bounds.width >= 24 && bounds.height >= 24, `${provider} ${mode}: close target below 24px`);
      assert.ok(await close.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Focused close button must have a visible outline');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await panel.evaluate(el => getComputedStyle(el).transitionDuration), '0s', 'Reduced motion removes panel transitions');
    await page.emulateMedia({ forcedColors: 'active' });
    assert.ok(await panel.evaluate(el => getComputedStyle(el).borderTopStyle !== 'none'), 'Forced colors preserves the panel boundary');
    const close = panel.locator('.gt-close-button').first();
    await close.focus();
    assert.ok(await close.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Forced colors preserves keyboard focus');
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger');
    await page.evaluate(() => window.cleanup());
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(`Visual accessibility checks passed (Chromium ${browser.version()}; both providers, 320px, text spacing, doubled text, reduced motion, forced colors). Actual desktop zoom and screen readers require manual verification.`);
} finally { await browser.close(); }
