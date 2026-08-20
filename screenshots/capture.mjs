import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const outputDir = path.join(projectRoot, 'assets');

const geneFixture = JSON.parse(
  await readFile(path.join(projectRoot, 'benchmark/fixtures/mygene-tp53.json'), 'utf8')
);
const chemFixture = JSON.parse(
  await readFile(path.join(projectRoot, 'benchmark/fixtures/mychem-aspirin.json'), 'utf8')
);

// Serve the project root over HTTP so relative paths work in the browser
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const urlPath = req.url?.split('?')[0] ?? '/';
  const filePath = path.join(projectRoot, urlPath);
  try {
    const content = readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] ?? 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}`;

// Render one screenshot for the given theme, driving both the page chrome and
// the tooltip theme via the ?theme query parameter.
async function captureScreenshot(browser, theme, outputFile) {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Log browser console for debugging
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[browser ${msg.type()}] ${msg.text()}`);
    }
  });

  // Mock MyGene.info batch query (POST /v3/query)
  await page.route('**/mygene.info/v3/query', route => {
    console.log(`[mock:${theme}] mygene.info/v3/query hit`);
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([geneFixture.data]),
    });
  });

  // Mock MyChem.info annotation lookup (POST /v1/chem)
  await page.route('**/mychem.info/v1/chem', route => {
    console.log(`[mock:${theme}] mychem.info/v1/chem hit`);
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([chemFixture.data]),
    });
  });

  // Mock MyChem.info general query (POST /v1/query) — fallback for name/best-guess lookups
  await page.route('**/mychem.info/v1/query**', route => {
    console.log(`[mock:${theme}] mychem.info/v1/query hit`);
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([chemFixture.data]),
    });
  });

  await page.goto(`${baseUrl}/screenshots/screenshot.html?theme=${theme}`, { waitUntil: 'networkidle' });

  // Wait for the engine to be ready
  await page.waitForTimeout(500);

  // 1. Open the chemical tooltip by dispatching mouseenter
  await page.evaluate(() => {
    const el = document.querySelector('.chemical-tooltip');
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  });

  // Wait for chemical tooltip to appear with content
  await page.waitForFunction(
    () => {
      const roots = document.querySelectorAll('[data-gt-tooltip-root]');
      return roots.length >= 1 && [...roots].some(r => r.textContent && r.textContent.length > 50);
    },
    { timeout: 15000 }
  );
  console.log(`[capture:${theme}] Chemical tooltip rendered`);

  // Wait for the PubChem structure image to load (it has loading="lazy")
  await page.waitForFunction(
    () => {
      const imgs = document.querySelectorAll('[data-gt-tooltip-root] img');
      return imgs.length === 0 || [...imgs].every(img => img.naturalWidth > 0);
    },
    { timeout: 10000 }
  ).catch(() => {
    // Structure image may not be present if rdkit renders it; that's fine
  });
  console.log(`[capture:${theme}] Chemical structure image ready`);

  // 2. Pin the chemical tooltip
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.gt-pin-button');
    if (btns.length > 0) btns[0].click();
  });
  await page.waitForTimeout(300);
  console.log(`[capture:${theme}] Chemical tooltip pinned`);

  // 3. Open the gene tooltip by dispatching mouseenter
  await page.evaluate(() => {
    const el = document.querySelector('.gene-tooltip');
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  });

  // Wait for the second tooltip to appear with content
  await page.waitForFunction(
    () => {
      const roots = document.querySelectorAll('[data-gt-tooltip-root]');
      return roots.length >= 2 && [...roots].every(r => r.textContent && r.textContent.length > 50);
    },
    { timeout: 20000 }
  );
  console.log(`[capture:${theme}] Gene tooltip rendered`);

  // Wait for ideogram and gene track visuals to finish rendering
  await page.waitForTimeout(3000);

  // Wait for fonts
  await page.evaluateHandle('document.fonts.ready');

  // The README image is a fixed composition, so fail rather than silently
  // accepting a collision-driven fallback that puts the panels out of line.
  await page.waitForFunction(
    () => {
      const boxes = [...document.querySelectorAll('.gt-tooltip-box')];
      const roots = [...document.querySelectorAll('[data-gt-tooltip-root]')];
      if (boxes.length !== 2 || roots.length !== 2) return false;
      if (!boxes.every(box => box.dataset.placement === 'bottom')) return false;
      return Math.abs(
        roots[0].getBoundingClientRect().top - roots[1].getBoundingClientRect().top
      ) <= 0.5;
    },
    { timeout: 5000 }
  );

  // Ensure asynchronous content/layout work has stopped moving either panel.
  await page.evaluate(async () => {
    const bounds = () => [...document.querySelectorAll('[data-gt-tooltip-root]')]
      .map(el => {
        const rect = el.getBoundingClientRect();
        return [rect.left, rect.top, rect.width, rect.height];
      });
    const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
    let previous = bounds();
    let stableFrames = 0;
    while (stableFrames < 3) {
      await nextFrame();
      const current = bounds();
      const stable = current.length === previous.length && current.every((rect, index) =>
        rect.every((value, coordinate) => Math.abs(value - previous[index][coordinate]) <= 0.25)
      );
      stableFrames = stable ? stableFrames + 1 : 0;
      previous = current;
    }
  });

  // Compute the union bounding box of all visible content (trigger cards + tooltip roots)
  const clip = await page.evaluate(() => {
    const els = [
      ...document.querySelectorAll('.trigger-card'),
      ...document.querySelectorAll('[data-gt-tooltip-root]'),
    ];
    if (els.length === 0) return null;
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      x1 = Math.min(x1, r.left);
      y1 = Math.min(y1, r.top);
      x2 = Math.max(x2, r.right);
      y2 = Math.max(y2, r.bottom);
    }
    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
  });

  // Add margin around content for breathing room
  const margin = 24;
  const clipRect = clip
    ? {
        x: Math.max(0, clip.x - margin),
        y: Math.max(0, clip.y - margin),
        width: Math.min(clip.width + margin * 2, 1400),
        height: Math.min(clip.height + margin * 2, 900),
      }
    : undefined;

  // Take the screenshot clipped to content bounds
  await page.screenshot({ path: outputFile, type: 'png', clip: clipRect });
  console.log(`[capture:${theme}] Screenshot saved to ${outputFile} (${clipRect ? `${Math.round(clipRect.width)}x${Math.round(clipRect.height)}` : 'full viewport'})`);

  await context.close();
}

// Headed by default: new-headless Chromium does not paint scrollbars, but the
// tooltip's overflow scrollbar is a key "there's more below" affordance we want
// in the README image. Headed renders it (CI wraps this in xvfb-run; on a dev
// machine a browser window briefly appears). Set SCREENSHOTS_HEADLESS=1 to force
// the old headless path (no scrollbars) when a display is unavailable.
const headless = process.env.SCREENSHOTS_HEADLESS === '1';
const browser = await chromium.launch({ headless });
try {
  await mkdir(outputDir, { recursive: true });
  await captureScreenshot(browser, 'light', path.join(outputDir, 'preview.png'));
  await captureScreenshot(browser, 'dark', path.join(outputDir, 'preview-dark.png'));
} finally {
  server.close();
  await browser.close();
}
