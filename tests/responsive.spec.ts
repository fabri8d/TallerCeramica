import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile-xs', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 812 },
  { name: 'mobile-lg', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop-sm', width: 1024, height: 768 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'desktop-xl', width: 1440, height: 900 },
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'taller', path: '/taller' },
];

// ─── Overflow checks ──────────────────────────────────────────────────────────

for (const vp of VIEWPORTS) {
  for (const pg of PAGES) {
    test(`[${vp.name} ${vp.width}px] ${pg.name} — sin overflow horizontal`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(pg.path, { waitUntil: 'networkidle' });
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth, `body.scrollWidth (${scrollWidth}) excede viewport (${vp.width})`).toBeLessThanOrEqual(vp.width);
    });
  }
}

// ─── Header legibility ────────────────────────────────────────────────────────

for (const vp of VIEWPORTS) {
  test(`[${vp.name} ${vp.width}px] header — logo y nav visibles sin solaparse`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/', { waitUntil: 'networkidle' });

    const logo = page.locator('header').getByText('Susana Biondi');
    const galeria = page.locator('header').getByRole('link', { name: 'Galería' });

    await expect(logo).toBeVisible();
    await expect(galeria).toBeVisible();

    const logoBox = await logo.boundingBox();
    const galeriaBox = await galeria.boundingBox();

    // Ensure no horizontal overlap
    if (logoBox && galeriaBox) {
      const logoRight = logoBox.x + logoBox.width;
      expect(logoRight, `Logo (right=${logoRight}) solapa con nav (left=${galeriaBox.x})`).toBeLessThanOrEqual(galeriaBox.x);
    }
  });
}

// ─── Screenshots ──────────────────────────────────────────────────────────────

for (const vp of VIEWPORTS) {
  for (const pg of PAGES) {
    test(`screenshot [${vp.name}] ${pg.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(pg.path, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: `test-results/screenshots/${pg.name}-${vp.name}-${vp.width}.png`,
        fullPage: true,
      });
    });
  }
}

// ─── Footer no overflow en todos los viewports ───────────────────────────────

for (const vp of VIEWPORTS) {
  test(`[${vp.name} ${vp.width}px] footer — sin overflow`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const box = await footer.boundingBox();
    if (box) expect(box.width).toBeLessThanOrEqual(vp.width + 1);
  });
}

// ─── Booking section en mobile ───────────────────────────────────────────────

test('[mobile 375px] booking section — sin overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/taller', { waitUntil: 'networkidle' });
  await page.locator('#reservas').scrollIntoViewIfNeeded();
  const section = page.locator('#reservas');
  const box = await section.boundingBox();
  if (box) expect(box.width).toBeLessThanOrEqual(375);
});

test('[mobile-xs 320px] booking section — sin overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/taller', { waitUntil: 'networkidle' });
  await page.locator('#reservas').scrollIntoViewIfNeeded();
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(320);
});
