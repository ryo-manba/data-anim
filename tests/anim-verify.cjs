const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:3333/examples/index.html', {
    waitUntil: 'domcontentloaded',
  });

  // Screenshot immediately after DOMContentLoaded (before animations finish)
  await new Promise((r) => setTimeout(r, 100));
  await page.screenshot({ path: '/tmp/lp-t100ms.png' });
  console.log('Saved: /tmp/lp-t100ms.png (100ms after load)');

  // Check if noscript style is being applied incorrectly
  const noscriptActive = await page.evaluate(() => {
    const styles = Array.from(document.querySelectorAll('style'));
    for (const s of styles) {
      if (s.textContent.includes('opacity:1!important') && !s.closest('noscript')) {
        return true; // BAD: !important override is active outside noscript
      }
    }
    return false;
  });
  console.log('Noscript !important style leaking:', noscriptActive);

  // Check hero elements opacity at 100ms
  const heroOpacity = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    if (!hero) return [];
    return Array.from(hero.querySelectorAll('[data-anim]')).map((el) => ({
      anim: el.getAttribute('data-anim'),
      delay: el.getAttribute('data-anim-delay') || '0',
      opacity: getComputedStyle(el).opacity,
      animName: getComputedStyle(el).animationName,
    }));
  });
  console.log('\nHero at 100ms:');
  heroOpacity.forEach((e) => {
    console.log(`  ${e.anim} (delay=${e.delay}): opacity=${e.opacity}, anim=${e.animName}`);
  });

  // Wait for hero animation to complete
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: '/tmp/lp-t1600ms.png' });
  console.log('\nSaved: /tmp/lp-t1600ms.png (1600ms after load)');

  // Check scroll section — should still be hidden
  const whatSection = await page.evaluate(() => {
    const el = document.querySelector('#what [data-anim]');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      anim: el.getAttribute('data-anim'),
      opacity: getComputedStyle(el).opacity,
      animName: getComputedStyle(el).animationName,
      inViewport: rect.top < window.innerHeight,
    };
  });
  console.log('\nWhat section element (before scroll):', whatSection);

  // Scroll to What section
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: '/tmp/lp-scrolled.png' });
  console.log('Saved: /tmp/lp-scrolled.png');

  const whatAfterScroll = await page.evaluate(() => {
    const el = document.querySelector('#what [data-anim]');
    if (!el) return null;
    return {
      anim: el.getAttribute('data-anim'),
      opacity: getComputedStyle(el).opacity,
      animName: getComputedStyle(el).animationName,
    };
  });
  console.log('What section after scroll:', whatAfterScroll);

  // Hover test on gallery
  const galleryCard = await page.$('.anim-preview[data-anim-trigger="hover"]');
  if (galleryCard) {
    const beforeHover = await page.evaluate(
      (el) => ({
        opacity: getComputedStyle(el).opacity,
        animName: getComputedStyle(el).animationName,
      }),
      galleryCard,
    );
    console.log('\nGallery card before hover:', beforeHover);

    await galleryCard.hover();
    await new Promise((r) => setTimeout(r, 100));
    const afterHover = await page.evaluate(
      (el) => ({
        opacity: getComputedStyle(el).opacity,
        animName: getComputedStyle(el).animationName,
      }),
      galleryCard,
    );
    console.log('Gallery card after hover:', afterHover);
  }

  console.log('\nJS errors:', errors.length === 0 ? 'none' : errors);

  await browser.close();
})();
