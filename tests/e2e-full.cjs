const puppeteer = require('puppeteer');

let passed = 0,
  failed = 0;
function assert(name, condition, detail) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}${detail ? ': ' + detail : ''}`);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  // ============================================
  // TEST SUITE 1: Core Library (hover-test.html)
  // ============================================
  console.log('\n🔬 Test Suite 1: Core Library');
  await page.goto('http://localhost:3333/tests/manual/hover-test.html', {
    waitUntil: 'networkidle0',
  });

  // No JS errors
  assert('No JS errors', errors.length === 0, errors.join('; '));

  // Keyframes injected
  const keyframeCount = await page.evaluate(() => {
    let count = 0;
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSKeyframesRule) count++;
        }
      } catch (e) {}
    }
    return count;
  });
  assert('30 keyframes injected', keyframeCount === 30, `got ${keyframeCount}`);

  // Anti-FOUC style exists
  const hasAntifouc = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (
            rule.selectorText &&
            rule.selectorText.includes('data-anim') &&
            rule.style.opacity === '0'
          )
            return true;
        }
      } catch (e) {}
    }
    return false;
  });
  assert('Anti-FOUC CSS injected', hasAntifouc);

  // Reduced motion CSS exists
  const hasReducedMotion = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (
            rule instanceof CSSMediaRule &&
            rule.conditionText &&
            rule.conditionText.includes('prefers-reduced-motion')
          )
            return true;
        }
      } catch (e) {}
    }
    return false;
  });
  assert('prefers-reduced-motion CSS exists', hasReducedMotion);

  // Hover trigger works
  const shakeBox = await page.$('[data-anim="shake"]');
  await shakeBox.hover();
  await new Promise((r) => setTimeout(r, 50));
  const shakeAnim = await page.evaluate((el) => getComputedStyle(el).animationName, shakeBox);
  assert('Hover trigger: shake plays on hover', shakeAnim === 'da-shake', `got ${shakeAnim}`);

  // Mouse leave resets animation (waits for animationend then resets)
  await page.mouse.move(0, 0);
  await new Promise((r) => setTimeout(r, 2000));
  const shakeAfterLeave = await page.evaluate((el) => getComputedStyle(el).animationName, shakeBox);
  assert(
    'Hover trigger: animation resets on mouseleave',
    shakeAfterLeave === 'none',
    `got "${shakeAfterLeave}"`,
  );

  // Hover re-triggers on second hover
  await shakeBox.hover();
  await new Promise((r) => setTimeout(r, 50));
  const shakeAnim2 = await page.evaluate((el) => getComputedStyle(el).animationName, shakeBox);
  assert('Hover trigger: re-triggers on second hover', shakeAnim2 === 'da-shake');

  // Load trigger works
  const loadAnims = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-anim-trigger="load"]')).map((el) => ({
      anim: el.getAttribute('data-anim'),
      animName: getComputedStyle(el).animationName,
    }));
  });
  assert(
    'Load trigger: fadeInUp plays',
    loadAnims[0]?.animName === 'da-fadeInUp',
    `got ${loadAnims[0]?.animName}`,
  );
  assert('Load trigger: zoomIn plays', loadAnims[1]?.animName === 'da-zoomIn');
  assert('Load trigger: fadeInRight plays', loadAnims[2]?.animName === 'da-fadeInRight');

  // Load trigger delay correct
  const loadDelays = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-anim-trigger="load"]')).map(
      (el) => el.style.animation,
    );
  });
  assert(
    'Load trigger: delay=200ms on zoomIn',
    loadDelays[1]?.includes('200ms') || loadDelays[1]?.includes('0.2s'),
    `got "${loadDelays[1]}"`,
  );

  // Duration check
  const loadDuration = await page.evaluate(() => {
    const el = document.querySelector('[data-anim-trigger="load"]');
    return getComputedStyle(el).animationDuration;
  });
  assert(
    'Load trigger: duration is reasonable',
    loadDuration === '1.6s' ||
      loadDuration === '1600ms' ||
      loadDuration === '0.8s' ||
      loadDuration === '800ms',
    `got ${loadDuration}`,
  );

  // Scroll trigger: elements below fold should NOT be animated yet
  // (They have IntersectionObserver, should wait for scroll)
  // Scroll into view and check
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 500));
  const scrollAnims = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        '[data-anim-trigger="scroll"], [data-anim]:not([data-anim-trigger])',
      ),
    )
      .filter((el) => !el.getAttribute('data-anim-trigger'))
      .map((el) => ({
        anim: el.getAttribute('data-anim'),
        animName: getComputedStyle(el).animationName,
        opacity: getComputedStyle(el).opacity,
      }));
  });
  scrollAnims.forEach((e) => {
    assert(
      `Scroll trigger: ${e.anim} animates after scroll`,
      e.animName.includes('da-') || e.opacity === '1',
      `animName=${e.animName}, opacity=${e.opacity}`,
    );
  });

  // All 5 hover animations exist
  const hoverAnims = ['shake', 'pulse', 'fadeIn', 'bounce', 'flip'];
  for (const name of hoverAnims) {
    const el = await page.$(`[data-anim="${name}"][data-anim-trigger="hover"]`);
    assert(`Hover element exists: ${name}`, !!el);
    if (el) {
      await el.hover();
      await new Promise((r) => setTimeout(r, 50));
      const animName = await page.evaluate((e) => getComputedStyle(e).animationName, el);
      assert(`Hover plays: ${name}`, animName === `da-${name}`, `got ${animName}`);
      await page.mouse.move(0, 0);
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  // ============================================
  // TEST SUITE 2: Landing Page
  // ============================================
  console.log('\n🔬 Test Suite 2: Landing Page (examples/index.html)');
  errors.length = 0;
  await page.goto('http://localhost:3333/examples/index.html', {
    waitUntil: 'networkidle0',
  });
  await new Promise((r) => setTimeout(r, 1500)); // wait for load animations

  assert('No JS errors on LP', errors.length === 0, errors.join('; '));

  // Script loaded
  const lpKeyframes = await page.evaluate(() => {
    let count = 0;
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSKeyframesRule) count++;
        }
      } catch (e) {}
    }
    return count;
  });
  assert('LP: 30 keyframes loaded', lpKeyframes === 30, `got ${lpKeyframes}`);

  // All 8 sections exist
  const sections = await page.evaluate(() => {
    return ['hero', 'what', 'features', 'how', 'gallery', 'comparison', 'quickstart', 'footer'].map(
      (id) => !!document.getElementById(id),
    );
  });
  assert(
    'LP: All 8 sections exist',
    sections.every(Boolean),
    `missing: ${sections
      .map((v, i) =>
        v
          ? null
          : ['hero', 'what', 'features', 'how', 'gallery', 'comparison', 'quickstart', 'footer'][i],
      )
      .filter(Boolean)
      .join(', ')}`,
  );

  // Hero load animations fired
  const heroAnims = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    if (!hero) return [];
    return Array.from(hero.querySelectorAll('[data-anim-trigger="load"]')).map((el) => ({
      anim: el.getAttribute('data-anim'),
      animName: getComputedStyle(el).animationName,
      opacity: getComputedStyle(el).opacity,
    }));
  });
  assert('LP: Hero has load-triggered elements', heroAnims.length > 0, `found ${heroAnims.length}`);
  heroAnims.forEach((e) => {
    assert(`LP Hero: ${e.anim} animated`, e.opacity === '1' || e.animName.includes('da-'));
  });

  // Gallery tab switching (CSS only)
  const galleryTabs = await page.evaluate(() => {
    const radios = document.querySelectorAll('input[name="gallery-tab"]');
    return radios.length;
  });
  assert('LP: Gallery has tab radio inputs', galleryTabs >= 5, `got ${galleryTabs}`);

  // Gallery hover animation (hover on .anim-card, animation on child .anim-preview)
  const galleryCardEl = await page.$('.anim-card');
  if (galleryCardEl) {
    await galleryCardEl.hover();
    await new Promise((r) => setTimeout(r, 200));
    const galleryHoverAnim = await page.evaluate((el) => {
      const preview = el.querySelector('.anim-preview[data-gallery-anim]');
      return preview ? getComputedStyle(preview).animationName : 'none';
    }, galleryCardEl);
    assert(
      'LP: Gallery hover animation plays',
      galleryHoverAnim.includes('da-'),
      `got ${galleryHoverAnim}`,
    );
  } else {
    assert('LP: Gallery hover cards exist', false, 'no .anim-card found');
  }

  // Comparison table exists
  const hasTable = await page.evaluate(() => !!document.querySelector('#comparison table'));
  assert('LP: Comparison table exists', hasTable);

  // Responsive: page renders at mobile width
  await page.setViewport({ width: 375, height: 812 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 200));
  const mobileOk = await page.evaluate(() => {
    return document.body.scrollWidth <= 375;
  });
  assert(
    'LP: No horizontal overflow at 375px',
    mobileOk,
    `scrollWidth=${await page.evaluate(() => document.body.scrollWidth)}`,
  );
  await page.setViewport({ width: 1440, height: 900 });

  // Total file size
  const lpSize = await page.evaluate(() => document.documentElement.outerHTML.length);
  assert('LP: File size < 100KB', lpSize < 100000, `${(lpSize / 1024).toFixed(1)}KB`);

  // Copy button exists
  const hasCopyBtn = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[onclick]')).some((el) =>
      el.getAttribute('onclick')?.includes('clipboard'),
    );
  });
  assert('LP: Copy button with clipboard exists', hasCopyBtn);

  // No img tags
  const imgCount = await page.evaluate(() => document.querySelectorAll('img').length);
  assert('LP: No <img> tags', imgCount === 0, `found ${imgCount}`);

  // Accessibility: skip link
  const hasSkipLink = await page.evaluate(
    () => !!document.querySelector('a[href="#main"], .skip-link'),
  );
  assert('LP: Skip link exists', hasSkipLink);

  // prefers-reduced-motion CSS in LP
  const lpReducedMotion = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (
            rule instanceof CSSMediaRule &&
            rule.conditionText?.includes('prefers-reduced-motion')
          )
            return true;
        }
      } catch (e) {}
    }
    return false;
  });
  assert('LP: prefers-reduced-motion CSS exists', lpReducedMotion);

  // Scroll animations on LP
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise((r) => setTimeout(r, 1000));
  const scrolledAnims = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        '[data-anim]:not([data-anim-trigger="load"]):not([data-anim-trigger="hover"]):not([data-anim-trigger="click"])',
      ),
    )
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      })
      .map((el) => ({
        anim: el.getAttribute('data-anim'),
        animName: getComputedStyle(el).animationName,
        opacity: getComputedStyle(el).opacity,
      }))
      .slice(0, 5);
  });
  scrolledAnims.forEach((e) => {
    assert(
      `LP scroll: ${e.anim} visible after scroll`,
      e.opacity === '1' || parseFloat(e.opacity) > 0.5,
    );
  });

  // ============================================
  // TEST SUITE 3: Docs Site
  // ============================================
  console.log('\n🔬 Test Suite 3: Documentation Site');
  errors.length = 0;

  // Check docs build output exists and key pages load
  const docsPages = [
    '/docs/getting-started/',
    '/docs/animations/',
    '/docs/triggers/',
    '/docs/attributes/',
    '/playground/',
  ];

  for (const path of docsPages) {
    const resp = await page
      .goto(`http://localhost:3333/docs/dist${path}`, {
        waitUntil: 'domcontentloaded',
      })
      .catch(() => null);
    const status = resp?.status() || 0;
    assert(`Docs page loads: ${path}`, status === 200, `status=${status}`);
  }

  // Docs index page
  const docsIndex = await page
    .goto('http://localhost:3333/docs/dist/', { waitUntil: 'domcontentloaded' })
    .catch(() => null);
  assert('Docs index loads', docsIndex?.status() === 200);

  // ============================================
  // SUMMARY
  // ============================================
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log(`${'='.repeat(40)}`);

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
