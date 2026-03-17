import { test, expect } from '@playwright/test';
import { format, nextMonday } from 'date-fns';
import { es } from 'date-fns/locale';

const testDate = nextMonday(new Date());

async function selectTestDate(page: import('@playwright/test').Page) {
  const targetMonth = format(testDate, 'MMMM', { locale: es }).toLowerCase();
  for (let i = 0; i < 3; i++) {
    const monthLabel = page.locator('button[aria-label="Mes anterior"] ~ span');
    const text = (await monthLabel.textContent())?.toLowerCase() ?? '';
    if (text.includes(targetMonth)) break;
    await page.click('button[aria-label="Mes siguiente"]');
  }
  const dayNum = format(testDate, 'd');
  await page.locator('button:not([disabled])').filter({ hasText: new RegExp(`^${dayNum}$`) }).first().click();
}

// ─── Header ──────────────────────────────────────────────────────────────────

test.describe('Header', () => {
  test('muestra logo y links de navegación en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header').getByText('Susana Biondi')).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: 'Galería' })).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: 'El Taller' })).toBeVisible();
  });

  test('no hay link de Reservar en el header', async ({ page }) => {
    await page.goto('/');
    const reservarLink = page.locator('header').getByRole('link', { name: /reservar/i });
    await expect(reservarLink).toHaveCount(0);
  });

  test('los links de nav están visibles en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('header').getByText('Susana Biondi')).toBeVisible();
    // nav links visible (no hay hamburger menu — están siempre visibles)
    await expect(page.locator('header').getByRole('link', { name: 'Galería' })).toBeVisible();
  });

  test('header no desborda el ancho en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const header = page.locator('header');
    const box = await header.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});

// ─── Home (Galería) ───────────────────────────────────────────────────────────

test.describe('Home — Galería', () => {
  test('carga la página correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Susana Biondi/i);
  });

  test('no desborda horizontalmente en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const body = await page.evaluate(() => document.body.scrollWidth);
    expect(body).toBeLessThanOrEqual(1280);
  });

  test('no desborda horizontalmente en mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const body = await page.evaluate(() => document.body.scrollWidth);
    expect(body).toBeLessThanOrEqual(375);
  });

  test('no desborda horizontalmente en tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const body = await page.evaluate(() => document.body.scrollWidth);
    expect(body).toBeLessThanOrEqual(768);
  });
});

// ─── Página El Taller ─────────────────────────────────────────────────────────

test.describe('El Taller', () => {
  test('carga con sección de reservas', async ({ page }) => {
    await page.goto('/taller');
    await expect(page.locator('#reservas')).toBeVisible();
  });

  test('no tiene sección de precios', async ({ page }) => {
    await page.goto('/taller');
    await expect(page.locator('#precios')).toHaveCount(0);
  });

  test('no desborda horizontalmente en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/taller');
    const body = await page.evaluate(() => document.body.scrollWidth);
    expect(body).toBeLessThanOrEqual(375);
  });

  test('no desborda horizontalmente en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/taller');
    const body = await page.evaluate(() => document.body.scrollWidth);
    expect(body).toBeLessThanOrEqual(1280);
  });
});

// ─── Footer (Contacto) ────────────────────────────────────────────────────────

test.describe('Footer — Contacto', () => {
  test('visible en home', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer').getByText('¿Tenés preguntas?')).toBeVisible();
  });

  test('visible en /taller', async ({ page }) => {
    await page.goto('/taller');
    await expect(page.locator('footer').getByText('¿Tenés preguntas?')).toBeVisible();
  });

  test('no desborda en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const footer = page.locator('footer');
    const box = await footer.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });

  test('grid de dos columnas en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const card = page.locator('footer .bg-bark-800');
    await expect(card).toBeVisible();
  });
});

// ─── Booking — DatePicker ─────────────────────────────────────────────────────

test.describe('DatePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taller#reservas');
  });

  test('muestra calendario con navegación', async ({ page }) => {
    await expect(page.locator('button[aria-label="Mes anterior"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Mes siguiente"]')).toBeVisible();
  });

  test('días pasados y fines de semana están deshabilitados', async ({ page }) => {
    const disabled = page.locator('button[disabled]');
    expect(await disabled.count()).toBeGreaterThan(0);
  });

  test('seleccionar fecha válida avanza a horarios', async ({ page }) => {
    await selectTestDate(page);
    await expect(page.locator('text=Elegí un horario')).toBeVisible();
  });

  test('calendario cabe en mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const calendar = page.locator('button[aria-label="Mes anterior"]').locator('xpath=ancestor::div[contains(@class,"rounded")]').first();
    const box = await calendar.boundingBox();
    if (box) expect(box.width).toBeLessThanOrEqual(375);
  });
});

// ─── Booking — SlotGrid ───────────────────────────────────────────────────────

test.describe('SlotGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taller#reservas');
    await selectTestDate(page);
    await expect(page.locator('text=Elegí un horario')).toBeVisible();
  });

  test('muestra turnos de mañana y tarde', async ({ page }) => {
    await expect(page.locator('p.uppercase').filter({ hasText: 'Mañana' })).toBeVisible();
    await expect(page.locator('p.uppercase').filter({ hasText: 'Tarde' })).toBeVisible();
  });

  test('seleccionar slot avanza al formulario', async ({ page }) => {
    await page.locator('button:not([disabled])').filter({ hasText: /^\d+:\d+$/ }).first().click();
    await expect(page.locator('text=Completá tus datos')).toBeVisible();
  });

  test('← Cambiar fecha vuelve al calendario', async ({ page }) => {
    await page.click('text=← Cambiar fecha');
    await expect(page.locator('text=Seleccioná una fecha')).toBeVisible();
  });

  test('slots caben en mobile sin overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/taller');
    await page.locator('#reservas').scrollIntoViewIfNeeded();
    await selectTestDate(page);
    const grid = page.locator('p.uppercase').filter({ hasText: 'Mañana' }).locator('xpath=following-sibling::div').first();
    const box = await grid.boundingBox();
    if (box) expect(box.width).toBeLessThanOrEqual(375);
  });
});

// ─── Booking — Formulario ─────────────────────────────────────────────────────

test.describe('BookingForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taller#reservas');
    await selectTestDate(page);
    await page.locator('button:not([disabled])').filter({ hasText: /^\d+:\d+$/ }).first().click();
    await expect(page.locator('text=Completá tus datos')).toBeVisible();
  });

  test('muestra todos los campos', async ({ page }) => {
    await expect(page.locator('#nombre')).toBeVisible();
    await expect(page.locator('#apellido')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#telefono')).toBeVisible();
  });

  test('no envía con campos vacíos', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('#nombre')).toBeVisible();
  });

  test('← Cambiar horario vuelve al SlotGrid', async ({ page }) => {
    await page.click('text=← Cambiar horario');
    await expect(page.locator('text=Elegí un horario')).toBeVisible();
  });

  test('formulario cabe en mobile sin overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/taller');
    await page.locator('#reservas').scrollIntoViewIfNeeded();
    await selectTestDate(page);
    await page.locator('button:not([disabled])').filter({ hasText: /^\d+:\d+$/ }).first().click();
    const form = page.locator('form');
    const box = await form.boundingBox();
    if (box) expect(box.width).toBeLessThanOrEqual(375);
  });
});
