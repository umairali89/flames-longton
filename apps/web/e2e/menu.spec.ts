import { test, expect } from '@playwright/test';

test('home page loads with branding', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Flames Longton/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Browse menu|Order now/i }).first()).toBeVisible();
});

test('menu page lists products', async ({ page }) => {
  await page.goto('/menu');
  await expect(page.getByRole('heading', { name: 'Menu' })).toBeVisible();
});
