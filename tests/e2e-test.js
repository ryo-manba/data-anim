const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();

  // Collect console messages
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[ERROR] ${err.message}`));

  console.log('=== Test 1: hover-test.html ===');
  await page.goto('http://localhost:3333/tests/manual/hover-test.html', { waitUntil: 'networkidle0' });

  // Check console output
  console.log('Console logs:');
  logs.forEach(l => console.log('  ' + l));

  // Check if style tags were injected
  const styleCount = await page.evaluate(() => {
    const styles = document.querySelectorAll('style');
    return Array.from(styles).map(s => s.textContent.substring(0, 100));
  });
  console.log('\nInjected <style> tags:');
  styleCount.forEach((s, i) => console.log(`  [${i}] ${s}...`));

  // Check element states
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-anim]')).map(el => ({
      anim: el.getAttribute('data-anim'),
      trigger: el.getAttribute('data-anim-trigger') || 'scroll',
      opacity: getComputedStyle(el).opacity,
      animation: getComputedStyle(el).animation,
      hasInit: !!el._daInit,
    }));
  });
  console.log('\nElements:');
  elements.forEach(e => console.log(`  ${e.anim} (${e.trigger}): opacity=${e.opacity}, animation=${e.animation}, init=${e.hasInit}`));

  // Test hover
  console.log('\n--- Testing hover on first box (shake) ---');
  const shakeBox = await page.$('[data-anim="shake"]');
  if (shakeBox) {
    await shakeBox.hover();
    await new Promise(r => setTimeout(r, 100));
    const afterHover = await page.evaluate(el => ({
      animation: el.style.animation,
      computedAnimation: getComputedStyle(el).animationName,
    }), shakeBox);
    console.log('After hover:', afterHover);
  }

  // Test load trigger
  console.log('\n--- Load trigger elements ---');
  const loadEls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-anim-trigger="load"]')).map(el => ({
      anim: el.getAttribute('data-anim'),
      style: el.style.animation,
      computedAnim: getComputedStyle(el).animationName,
    }));
  });
  loadEls.forEach(e => console.log(`  ${e.anim}: style.animation="${e.style}", computed="${e.computedAnim}"`));

  // Check if keyframes exist
  const keyframesExist = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    let keyframeNames = [];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSKeyframesRule) {
            keyframeNames.push(rule.name);
          }
        }
      } catch(e) {}
    }
    return keyframeNames;
  });
  console.log('\nKeyframe rules found:', keyframesExist.length);
  console.log('  Names:', keyframesExist.slice(0, 10).join(', '), keyframesExist.length > 10 ? '...' : '');

  console.log('\n=== Test 2: examples/index.html ===');
  logs.length = 0;
  await page.goto('http://localhost:3333/examples/index.html', { waitUntil: 'networkidle0' });
  console.log('Console logs:');
  logs.forEach(l => console.log('  ' + l));

  const lpElements = await page.evaluate(() => {
    const els = document.querySelectorAll('[data-anim]');
    return { total: els.length };
  });
  console.log('Total data-anim elements:', lpElements.total);

  const lpKeyframes = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    let count = 0;
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSKeyframesRule) count++;
        }
      } catch(e) {}
    }
    return count;
  });
  console.log('Keyframe rules:', lpKeyframes);

  await browser.close();
  console.log('\n=== Done ===');
})();
