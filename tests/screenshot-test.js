const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const logs = [];
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => logs.push(`[ERROR] ${err.message}`));

  // Test LP
  console.log('Loading LP...');
  await page.goto('http://localhost:3333/examples/index.html', {
    waitUntil: 'networkidle0',
  });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('\nConsole output:');
  logs.forEach((l) => console.log('  ' + l));

  // Check what styles are actually on elements
  const heroState = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    if (!hero) return 'no hero';
    const els = hero.querySelectorAll('[data-anim]');
    return Array.from(els).map((el) => {
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        text: el.textContent?.substring(0, 30),
        anim: el.getAttribute('data-anim'),
        trigger: el.getAttribute('data-anim-trigger'),
        styleAnimation: el.style.animation,
        computedAnimation: cs.animationName,
        computedOpacity: cs.opacity,
        computedTransform: cs.transform,
        _daInit: !!el._daInit,
      };
    });
  });

  console.log('\nHero elements state:');
  heroState.forEach((e) => {
    console.log(`  <${e.tag}> "${e.text}"`);
    console.log(`    data-anim="${e.anim}" trigger="${e.trigger}"`);
    console.log(`    style.animation = "${e.styleAnimation}"`);
    console.log(
      `    computed: animation=${e.computedAnimation}, opacity=${e.computedOpacity}, transform=${e.computedTransform}`,
    );
    console.log(`    _daInit=${e._daInit}`);
  });

  // Check injected styles
  const styles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('style')).map((s, i) => ({
      index: i,
      length: s.textContent.length,
      preview: s.textContent.substring(0, 120),
      inHead: s.parentElement === document.head,
    }));
  });
  console.log('\n<style> tags:');
  styles.forEach((s) => {
    console.log(`  [${s.index}] (${s.length} chars, inHead=${s.inHead}): ${s.preview}...`);
  });

  // Check if script tag actually loaded
  const scriptTags = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script')).map((s) => ({
      src: s.src,
      inline: !s.src,
      length: s.textContent?.length || 0,
      preview: s.textContent?.substring(0, 80) || '',
    }));
  });
  console.log('\n<script> tags:');
  scriptTags.forEach((s) => {
    if (s.src) console.log(`  src="${s.src}"`);
    else console.log(`  inline (${s.length} chars): ${s.preview}...`);
  });

  // Take screenshot
  await page.screenshot({ path: '/tmp/lp-hero.png', fullPage: false });
  console.log('\nScreenshot saved to /tmp/lp-hero.png');

  // Scroll down and screenshot
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: '/tmp/lp-scroll.png', fullPage: false });
  console.log('Scroll screenshot saved to /tmp/lp-scroll.png');

  await browser.close();
})();
