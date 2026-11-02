import { test, expect } from '@playwright/test';
import { dismissNotices } from './helpers';

// 축복 적용을 run/rules.ts로 옮기면서 생긴 배선 테스트.
test('네오의 축복을 고르면 적용되고 지도로 넘어간다', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/?seed=1', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await dismissNotices(page);
  await page.locator('.cs-item', { hasText: '검사' }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /시작/ }).last().click();
  await page.waitForTimeout(1200);

  await expect(page.locator('.neow-card')).toHaveCount(4);
  await page.locator('.neow-card').first().click();
  await page.waitForTimeout(1200);
  await expect(page.locator('.map-node').first()).toBeVisible();
});
