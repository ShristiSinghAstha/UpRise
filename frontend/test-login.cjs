const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', exception => console.log('UNCAUGHT EXCEPTION:', exception));

  await page.goto('http://localhost:5174/admin/login');
  await page.fill('input[type="email"]', 'admin@uprise.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(3000);
  console.log('Current URL:', page.url());

  await browser.close();
})();
