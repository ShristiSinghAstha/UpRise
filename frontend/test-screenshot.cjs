const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:5174/admin/login');
  await page.fill('input[type="email"]', 'admin@uprise.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
