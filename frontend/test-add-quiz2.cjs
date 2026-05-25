const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('response', response => {
      if(response.url().includes('/api/v1/quiz/admin/')) {
          console.log(`API response: ${response.status()} ${response.url()}`);
      }
  });

  await page.goto('http://localhost:5174/admin/login');
  await page.fill('input[type="email"]', 'admin@uprise.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  
  await page.goto('http://localhost:5174/admin/courses/edit/69f34cb090130c78d2ec1de0');
  await page.waitForTimeout(2000);
  
  const questionInputs = await page.$$('input[placeholder="Enter question"]');
  if(questionInputs.length > 0) {
      await questionInputs[0].fill('Test Question?');
      await page.fill('input[placeholder="Option 1"]', 'A');
      await page.fill('input[placeholder="Option 2"]', 'B');
      await page.fill('input[placeholder="Option 3"]', 'C');
      await page.fill('input[placeholder="Option 4"]', 'D');
      await page.selectOption('select:has(option[value=""])', { label: 'A' });
      await page.click('button:has-text("Add Question")');
      await page.waitForTimeout(2000);
  }

  await browser.close();
})();
