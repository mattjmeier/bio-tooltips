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
    const drawerRoot = page.locator('[data-gt-tooltip-root][data-presentation="drawer"]');
    assert.equal(await drawerRoot.count(), 1, `${provider}: 320px presentation must use the drawer`);
    assert.equal(await panel.getAttribute('aria-modal'), null, `${provider}: drawer must remain non-modal`);
    assert.equal(await page.locator('.gt-pin-button').first().isHidden(), true, `${provider}: pinning is hidden in drawer mode`);
    const handle = panel.locator('.gt-drawer-handle');
    assert.equal(await handle.getAttribute('aria-label'), 'Close', `${provider}: drawer handle has an accessible Close name`);
    assert.equal(await handle.isVisible(), true, `${provider}: drawer handle is visible`);
    assert.equal(await page.locator('.gt-tooltip-content .gt-close-button').first().isHidden(), true,
      `${provider}: the popover close button is hidden inside a drawer`);
    const drawerBounds = await panel.boundingBox();
    const drawerContentBounds = await page.locator('.gt-tooltip-content').boundingBox();
    assert.ok(drawerBounds && drawerBounds.x >= -1 && drawerBounds.y >= -1
      && drawerBounds.width <= 320 + 1 && drawerBounds.height <= 720 * 0.75 + 1,
    `${provider}: drawer must fit the viewport and 75vh cap`);
    assert.ok(drawerContentBounds && drawerContentBounds.height <= 720 * 0.75 + 1,
      `${provider}: drawer content must scroll within the 75vh cap`);
    assert.notEqual(await page.evaluate(() => document.documentElement.style.overflow), 'hidden', `${provider}: drawer must not lock page scrolling`);
    await page.locator('.gt-tooltip-content').click({ position: { x: 5, y: 5 } });
    assert.equal(await drawerRoot.count(), 1, `${provider}: clicking inside drawer must not close it`);
    await page.mouse.click(2, 2);
    await page.waitForFunction(() => !document.querySelector('[data-gt-tooltip-root]'));
    await page.locator('#trigger').focus();
    await page.keyboard.press('Enter');
    await page.locator(provider === 'gene' ? '.gt-gene-text-alternative-toggle, .gt-gene-text-alternative:not([hidden])' : '.gt-chem-id-table').waitFor();
    await page.evaluate(() => document.querySelectorAll('details').forEach(el => { el.open = true; }));
    const sectionHeader = page.locator('.gt-collapsible-header.gt-is-collapsible').first();
    const headerDefaults = await sectionHeader.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        fontFamily: style.fontFamily,
        inheritedFontFamily: getComputedStyle(el.parentElement).fontFamily,
      };
    });
    assert.equal(headerDefaults.backgroundColor, 'rgba(0, 0, 0, 0)', `${provider}: section buttons have no native button background`);
    assert.equal(headerDefaults.borderTopWidth, '0px', `${provider}: section buttons have no native button border`);
    assert.equal(headerDefaults.fontFamily, headerDefaults.inheritedFontFamily,
      `${provider}: section buttons inherit the tooltip font instead of native button typography`);
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
      await handle.focus();
      const bounds = await handle.boundingBox();
      assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, `${provider} ${mode}: drawer close target below 44px`);
      assert.ok(await handle.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Focused drawer handle must have a visible outline');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await panel.evaluate(el => getComputedStyle(el).transitionDuration), '0s', 'Reduced motion removes panel transitions');
    await page.emulateMedia({ forcedColors: 'active' });
    assert.ok(await panel.evaluate(el => getComputedStyle(el).borderTopStyle !== 'none'), 'Forced colors preserves the panel boundary');
    await handle.focus();
    assert.ok(await handle.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Forced colors preserves keyboard focus');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('[data-gt-tooltip-root]'));
    assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger', `${provider}: activating the handle closes and returns focus`);

    await page.keyboard.press('Enter');
    await page.getByRole('dialog').waitFor();
    await handle.waitFor({ state: 'visible' });
    const drag = async (distance, expectedDismissal) => {
      const bounds = await handle.boundingBox();
      assert.ok(bounds, `${provider}: drawer handle must have a drag target`);
      const x = bounds.x + bounds.width / 2;
      const y = bounds.y + bounds.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x, y + distance, { steps: 4 });
      const offset = await panel.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
      assert.ok(offset >= distance - 2 && offset <= distance + 2, `${provider}: handle follows downward drag (${offset}px)`);
      await page.mouse.up();
      if (expectedDismissal) {
        await page.waitForFunction(() => !document.querySelector('[data-gt-tooltip-root]'));
      } else {
        assert.equal(await drawerRoot.count(), 1, `${provider}: short drag snaps back without dismissing`);
        await page.waitForFunction(() => {
          const box = document.querySelector('[data-gt-tooltip-root] > .gt-tooltip-box');
          return box && new DOMMatrixReadOnly(getComputedStyle(box).transform).m42 === 0;
        });
      }
    };
    await drag(40, false);
    await drag(105, true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger', `${provider}: drag dismissal returns focus`);

    await page.setViewportSize({ width: 800, height: 720 });
    await page.keyboard.press('Enter');
    await page.getByRole('dialog').waitFor();
    const popoverRoot = page.locator('[data-gt-tooltip-root]');
    await page.waitForFunction(() => document.querySelector('[data-gt-tooltip-root]')?.getAttribute('data-presentation') === 'popover');
    assert.equal(await handle.isHidden(), true, `${provider}: wide popovers hide the drawer handle`);
    assert.equal(await page.locator('.gt-tooltip-content .gt-close-button').first().isVisible(), true,
      `${provider}: wide popovers retain their existing close button`);
    assert.notEqual(await popoverRoot.evaluate(el => getComputedStyle(el).position), 'fixed',
      `${provider}: wide popovers retain anchored positioning`);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger');
    await page.evaluate(() => window.cleanup());
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(`Visual accessibility checks passed (Chromium ${browser.version()}; both providers, 320px drawer handle and drag, wide popover, text spacing, doubled text, reduced motion, forced colors). Actual desktop zoom and screen readers require manual verification.`);
} finally { await browser.close(); }
