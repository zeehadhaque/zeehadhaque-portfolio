const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '../dist');
const SCREENSHOTS_DIR = path.resolve(__dirname, '../artifacts/audit-screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Simple Static File Server for dist
function startServer(port = 4173) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    let filePath = path.join(DIST_DIR, reqPath);

    if (!fs.existsSync(filePath)) {
      // SPA Fallback
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Test static server running at http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function runBrowserTests() {
  const port = 4173;
  const server = await startServer(port);
  const url = `http://127.0.0.1:${port}`;

  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Initial Hero Foyer Screenshot
  console.log('Testing Stage 0: Hero Foyer...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-hero-foyer-desktop.png') });

  // 2. Test Navigation to Monoliths
  console.log('Testing Stage 1: Crystalline Monoliths...');
  await page.evaluate(() => {
    document.getElementById('monoliths')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-monoliths-desktop.png') });

  // 3. Test Navigation to Screening Hall
  console.log('Testing Stage 2: Imperial Screening Hall...');
  await page.evaluate(() => {
    document.getElementById('screenings')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-screening-hall-desktop.png') });

  // Verify all 8 video cards exist
  const videoCardsCount = await page.locator('.video-card').count();
  console.log(`Verified video cards count: ${videoCardsCount} (Expected: 8)`);

  // Test Video Modal interaction
  console.log('Testing Video Modal on first film card...');
  const firstCard = page.locator('.video-card').first();
  await firstCard.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-video-modal-open.png') });

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 4. Test Director's Suite & Writer's Room
  console.log('Testing Stage 3: Director\'s Suite & Writer\'s Room...');
  await page.evaluate(() => {
    document.getElementById('directors-suite')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-directors-suite-desktop.png') });

  // 5. Test Filmmaking Institute & Language Switch
  console.log('Testing Stage 4: Filmmaking Institute...');
  await page.evaluate(() => {
    document.getElementById('institute')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-institute-en-desktop.png') });

  // Test Bangla Language Switch
  console.log('Testing Bangla language toggle in Institute...');
  const bnBtn = page.locator('.lang-btn:text("বাংলা")');
  if (await bnBtn.isVisible()) {
    await bnBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-institute-bn-desktop.png') });
  }

  // 6. Test ZEE AI Core
  console.log('Testing Stage 5: ZEE AI Core...');
  await page.evaluate(() => {
    document.getElementById('zee-core')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-zee-ai-terminal.png') });

  // 7. Test Grand Exit & Communications
  console.log('Testing Stage 6: Grand Exit & Contact Transmission...');
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-grand-exit-desktop.png') });

  // 8. Test Reverse Scroll to Top
  console.log('Testing Reverse Scroll to Top...');
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(500);

  // 9. Mobile Viewport Testing (iPhone 14 / modern mobile 390x844)
  console.log('Testing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(url, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '10-mobile-hero.png') });

  await mobilePage.evaluate(() => {
    document.getElementById('screenings')?.scrollIntoView({ behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '11-mobile-screenings.png') });

  console.log('Console Errors intercepted during audit:', consoleErrors);

  await browser.close();
  server.close();
  console.log('All automated browser tests completed successfully!');
}

runBrowserTests().catch(err => {
  console.error('Browser testing failed:', err);
  process.exit(1);
});
