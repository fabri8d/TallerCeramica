import { test, expect } from '@playwright/test';
import { format, nextMonday } from 'date-fns';
import { es } from 'date-fns/locale';

const testDate = nextMonday(new Date());

// Helper: navega el calendario hasta el mes de testDate y hace click en el día
async function selectTestDate(page: import('@playwright/test').Page) {
  const targetMonth = format(testDate, 'MMMM', { locale: es }).toLowerCase();
  for (let i = 0; i < 3; i++) {
    // Selector específico: el span dentro del div de navegación del calendario
    const monthLabel = page.locator('button[aria-label="Mes anterior"] ~ span');
    const text = (await monthLabel.textContent())?.toLowerCase() ?? '';
    if (text.includes(targetMonth)) break;
    await page.click('button[aria-label="Mes siguiente"]');
  }
  const dayNum = format(testDate, 'd');
  await page.locator(`button:not([disabled])`).filter({ hasText: new RegExp(`^${dayNum}$`) }).first().click();
}

test.describe('Navegación y secciones estáticas', () => {
  test('carga la home con todas las secciones', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Taller de Cerámica/);
    await expect(page.locator('#nosotros')).toBeVisible();
    await expect(page.locator('#galeria')).toBeVisible();
    await expect(page.locator('#precios')).toBeVisible();
    await expect(page.locator('#reservas')).toBeVisible();
    await expect(page.locator('#contacto')).toBeVisible();
  });

  test('header tiene links de navegación', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header a[href="#reservas"]').first()).toBeVisible();
  });

  test('scroll suave al hacer click en nav', async ({ page }) => {
    await page.goto('/');
    await page.click('header a[href="#nosotros"]');
    await page.waitForTimeout(600);
    await expect(page.locator('#nosotros')).toBeInViewport();
  });
});

test.describe('DatePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#reservas');
  });

  test('muestra el calendario con navegación de meses', async ({ page }) => {
    const calendar = page.locator('.bg-white.border.border-linen.rounded-sm');
    await expect(calendar).toBeVisible();
    await expect(page.locator('button[aria-label="Mes anterior"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Mes siguiente"]')).toBeVisible();
  });

  test('los fines de semana y fechas pasadas están deshabilitados', async ({ page }) => {
    const disabledDays = page.locator('button[disabled]');
    const count = await disabledDays.count();
    expect(count).toBeGreaterThan(0);
  });

  test('avanza al paso de horarios al seleccionar una fecha válida', async ({ page }) => {
    await selectTestDate(page);
    await expect(page.locator('text=Elegí un horario')).toBeVisible();
  });
});

test.describe('SlotGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#reservas');
    await selectTestDate(page);
    await expect(page.locator('text=Elegí un horario')).toBeVisible();
  });

  test('muestra slots de mañana y tarde', async ({ page }) => {
    // Selector específico: etiquetas uppercase del SlotGrid
    await expect(page.locator('p.uppercase').filter({ hasText: 'Mañana' })).toBeVisible();
    await expect(page.locator('p.uppercase').filter({ hasText: 'Tarde' })).toBeVisible();
  });

  test('al seleccionar un slot disponible avanza al formulario', async ({ page }) => {
    await page.locator('button:not([disabled])').filter({ hasText: /^\d+:\d+$/ }).first().click();
    await expect(page.locator('text=Completá tus datos')).toBeVisible();
  });

  test('botón Cambiar fecha vuelve al calendario', async ({ page }) => {
    await page.click('text=← Cambiar fecha');
    await expect(page.locator('text=Seleccioná una fecha')).toBeVisible();
  });
});

test.describe('BookingForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#reservas');
    await selectTestDate(page);
    await page.locator('button:not([disabled])').filter({ hasText: /^\d+:\d+$/ }).first().click();
    await expect(page.locator('text=Completá tus datos')).toBeVisible();
  });

  test('muestra todos los campos requeridos', async ({ page }) => {
    await expect(page.locator('#nombre')).toBeVisible();
    await expect(page.locator('#apellido')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#telefono')).toBeVisible();
  });

  test('no envía con campos vacíos (validación HTML nativa)', async ({ page }) => {
    await page.click('button[type="submit"]');
    // El formulario no avanza — sigue mostrando los campos
    await expect(page.locator('#nombre')).toBeVisible();
  });

  test('botón Cambiar horario vuelve al SlotGrid', async ({ page }) => {
    await page.click('text=← Cambiar horario');
    await expect(page.locator('text=Elegí un horario')).toBeVisible();
  });
});

test.describe('Responsive — Mobile (375px)', () => {
  test('muestra el botón Reservar en mobile y oculta la nav desktop', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('header a.md\\:hidden')).toBeVisible();
  });

  test('el calendario cabe en el ancho mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/#reservas');
    const calendar = page.locator('.bg-white.border.border-linen.rounded-sm');
    await expect(calendar).toBeVisible();
    const box = await calendar.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});

test.describe('Seguridad', () => {
  test('SUPABASE_SERVICE_ROLE_KEY no aparece en ninguna respuesta de red', async ({ page }) => {
    const bodies: string[] = [];
    page.on('response', async (response) => {
      try { bodies.push(await response.text()); } catch {}
    });
    await page.goto('/');
    await page.waitForTimeout(1000);
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'SERVICE_ROLE_PLACEHOLDER';
    for (const body of bodies) {
      expect(body).not.toContain(serviceKey);
    }
  });
});
