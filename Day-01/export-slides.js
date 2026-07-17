const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 }
  });
  const page = await context.newPage();

  const htmlPath = 'd:/Practise Coding Files/Microsoft Fabric/30-Day-Content/Day-01/carousel.html';
  const outDir = 'd:/Practise Coding Files/Microsoft Fabric/30-Day-Content/Day-01/slides';

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await page.goto('file:///' + htmlPath.replace(/\//g, '/'));
  await page.waitForTimeout(2000); // wait for fonts/animation

  const slides = await page.$$('.slide');
  console.log(`Found ${slides.length} slides`);

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const num = String(i + 1).padStart(2, '0');
    const outPath = path.join(outDir.replace(/\//g, '\\'), `slide-${num}.png`);
    await slide.screenshot({ path: outPath });
    console.log(`✅ Saved slide ${num} → ${outPath}`);
  }

  await browser.close();
  console.log('\n🎉 All 10 slides exported as PNG!');
})();
