const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', exception => console.log('BROWSER ERROR:', exception));
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(5000);
  await browser.close();
})();
