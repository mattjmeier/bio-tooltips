import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const gene = JSON.parse(await readFile(root + 'benchmark/fixtures/mygene-tp53.json', 'utf8')).data;
const chemical = JSON.parse(await readFile(root + 'benchmark/fixtures/mychem-aspirin.json', 'utf8')).data;
const browser = await chromium.launch();
async function fixture(provider, mode = 'ready', tag = 'span', presentation = 'auto') {
  const page = await browser.newPage();
  await page.route('**/*', route => route.abort());
  const attrs = tag === 'a' ? 'href="#destination"' : tag === 'button' ? 'type="button"' : '';
  await page.setContent(`<html lang="en"><head><title>Keyboard fixture</title></head><body><main><button id="before">Before</button><${tag} id="trigger" ${attrs} class="${provider}-tooltip" data-species="human" ${provider === 'chemical' ? 'data-scope="pubchem" data-query="2244"' : ''} aria-controls="author-details" aria-describedby="description">${provider === 'gene' ? 'TP53' : 'aspirin'}</${tag}><button id="after">After</button><p id="description">Biological details</p><div id="author-details"></div><div id="destination"></div></main></body></html>`);
  await page.addStyleTag({ path: root + 'dist/bio-tooltips.css' });
  await page.addScriptTag({ path: root + 'dist/bio-tooltips.global.js' });
  await page.evaluate(({ provider, mode, gene, chemical, presentation }) => {
    window.fetch = async () => {
      if (mode === 'delayed') await new Promise(resolve => { window.releaseResponse = resolve; });
      if (mode === 'error') throw new Error('Local fixture failure');
      return { ok: true, json: async () => mode === 'empty' ? [] : [{ ...(provider === 'gene' ? gene : chemical), query: provider === 'gene' ? 'TP53' : '2244' }] };
    };
    const options = { prefetch: 'none', visualPreload: 'none', ideogram: { enabled: false },
      display: { geneTrack: false }, tooltipOptions: { showDuration: 0, hideDuration: 0 },
      presentation,
      structureRenderer: () => '<div role="img" aria-label="Chemical fixture"></div>' };
    window.initialize = () => (provider === 'gene' ? GeneTooltip : ChemicalTooltip).init(options);
    window.cleanup = window.initialize();
  }, { provider, mode, gene, chemical, presentation });
  return page;
}
try {
  for (const provider of ['gene', 'chemical']) {
    for (const tag of ['span', 'button', 'a']) {
      const page = await fixture(provider, 'ready', tag);
      const trigger = page.locator('#trigger');
      await page.locator('#before').focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger');
      if (tag === 'a') {
        await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => location.hash), '#destination', 'Link Enter must retain navigation');
        await trigger.focus();
      }
      await page.keyboard.press(tag === 'a' ? 'ArrowDown' : 'Space');
      const panel = page.getByRole('dialog');
      await panel.waitFor();
      assert.equal(await panel.evaluate(el => document.activeElement === el), true, `${provider} ${tag}: activation focuses dialog`);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger');
      await page.keyboard.press(tag === 'a' ? 'ArrowDown' : 'Enter');
      await page.keyboard.press('Tab');
      assert.equal(await panel.evaluate(el => el.contains(document.activeElement) && el !== document.activeElement), true);
      await page.mouse.move(1200, 700);
      assert.equal(await panel.isVisible(), true, 'Pointer departure preserves keyboard-owned content');
      // Traverse the actual browser tab sequence through every visible panel control.
      let exited = false;
      for (let i = 0; i < 150; i++) {
        await page.keyboard.press('Tab');
        if (await page.evaluate(() => document.activeElement.id === 'after')) { exited = true; break; }
      }
      assert.ok(exited, `${provider} ${tag}: forward exit resumes after trigger`);
      await page.waitForFunction(() => !document.querySelector('[data-gt-tooltip-root]:not([inert])'));
      await trigger.focus();
      await page.keyboard.press(tag === 'a' ? 'ArrowDown' : 'Enter');
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger');
      await page.waitForTimeout(80);
      assert.equal(await page.getByRole('dialog').count(), 0, 'Escape must not reopen from restored focus');
      await page.evaluate(() => window.cleanup());
      assert.equal(await trigger.getAttribute('aria-controls'), 'author-details');
      assert.equal(await trigger.getAttribute('aria-describedby'), 'description');
      assert.equal(await trigger.getAttribute('tabindex'), null);
      assert.equal(await trigger.getAttribute('role'), null);
      await page.evaluate(() => { window.cleanup = window.initialize(); });
      await trigger.focus();
      await page.keyboard.press(tag === 'a' ? 'ArrowDown' : 'Enter');
      assert.equal(await page.getByRole('dialog').count(), 1, 'Reinitialization creates one panel');
      await page.evaluate(() => { window.cleanup(); window.cleanup(); });
      assert.equal(await page.locator('[data-gt-tooltip-root]').count(), 0);
      await page.close();
    }
    const drawerPage = await fixture(provider, 'ready', 'span', 'drawer');
    const drawerTrigger = drawerPage.locator('#trigger');
    await drawerTrigger.focus();
    await drawerPage.keyboard.press('Enter');
    const drawer = drawerPage.getByRole('dialog');
    await drawer.waitFor();
    assert.equal(await drawer.evaluate(el => el.closest('[data-presentation="drawer"]')?.getAttribute('data-presentation')), 'drawer');
    assert.equal(await drawer.getAttribute('aria-modal'), null, `${provider}: forced drawer remains non-modal`);
    await drawer.focus();
    await drawerPage.keyboard.press('Tab');
    assert.equal(await drawer.evaluate(el => el.contains(document.activeElement) && el !== document.activeElement), true,
      `${provider}: drawer Tab enters its controls without trapping the page`);
    await drawerPage.keyboard.press('Escape');
    assert.equal(await drawerPage.evaluate(() => document.activeElement.id), 'trigger');
    await drawerPage.locator('#trigger').focus();
    await drawerPage.keyboard.press('Enter');
    await drawer.waitFor();
    await drawerPage.mouse.click(2, 2);
    await drawerPage.waitForFunction(() => !document.querySelector('[data-gt-tooltip-root]'));
    await drawerPage.evaluate(() => window.cleanup());
    await drawerPage.close();
    for (const mode of ['delayed', 'error', 'empty']) {
      const page = await fixture(provider, mode);
      await page.locator('#trigger').focus();
      await page.keyboard.press('Enter');
      const panel = page.getByRole('dialog');
      assert.equal(await panel.evaluate(el => document.activeElement === el), true, `${provider} ${mode}: immediate focus`);
      if (mode === 'delayed') {
        await page.waitForFunction(() => typeof window.releaseResponse === 'function');
        assert.equal(await panel.locator('.gt-tooltip-content').getAttribute('aria-busy'), 'true');
        assert.match(await panel.locator('[role="status"]').textContent(), /Loading/);
        await page.evaluate(() => window.releaseResponse());
      }
      await page.waitForFunction(() => document.querySelector('.gt-tooltip-content')?.getAttribute('aria-busy') === 'false');
      const status = await panel.locator('.gt-panel-status').textContent();
      assert.match(status, mode === 'delayed' ? /loaded/ : mode === 'error' ? /Error/ : /not found/);
      assert.equal(await panel.evaluate(el => document.activeElement === el), true, 'Async rendering retains entry focus');
      await panel.locator('.gt-tooltip-content .gt-close-button').first().focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger');
      await page.close();
    }
  }
  console.log(`Keyboard and async accessibility checks passed (Chromium ${browser.version()}; both providers, span/button/link, logical Tab exit, delayed/error/empty responses, cleanup/reinitialization).`);
} finally { await browser.close(); }
