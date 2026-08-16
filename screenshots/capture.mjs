import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const outputDir = path.join(projectRoot, 'assets');
const outputFile = path.join(outputDir, 'preview.png');

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

const browser = await chromium.launch({ headless: true });
try {
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
    console.log('[mock] mygene.info/v3/query hit');
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([geneFixture.data]),
    });
  });

  // Mock MyChem.info annotation lookup (POST /v1/chem)
  await page.route('**/mychem.info/v1/chem', route => {
    console.log('[mock] mychem.info/v1/chem hit');
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([chemFixture.data]),
    });
  });

  // Mock MyChem.info general query (POST /v1/query) — fallback for name/best-guess lookups
  await page.route('**/mychem.info/v1/query**', route => {
    console.log('[mock] mychem.info/v1/query hit');
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([chemFixture.data]),
    });
  });

  await page.goto(`${baseUrl}/screenshots/screenshot.html`, { waitUntil: 'networkidle' });

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
  console.log('[capture] Chemical tooltip rendered');

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
  console.log('[capture] Chemical structure image ready');

  // 2. Pin the chemical tooltip
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.gt-pin-button');
    if (btns.length > 0) btns[0].click();
  });
  await page.waitForTimeout(300);
  console.log('[capture] Chemical tooltip pinned');

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
  console.log('[capture] Gene tooltip rendered');

  // Wait for ideogram and gene track visuals to finish rendering
  await page.waitForTimeout(3000);

  // Wait for fonts
  await page.evaluateHandle('document.fonts.ready');
  await page.waitForTimeout(200);

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Take the screenshot
  await page.screenshot({ path: outputFile, type: 'png', fullPage: false });
  console.log(`[capture] Screenshot saved to ${outputFile}`);
} finally {
  server.close();
  await browser.close();
}
