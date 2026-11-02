import { test, expect } from '@playwright/test';
import { dismissNotices } from './helpers';

// 이벤트 규칙을 run/rules.ts로 옮기면서 생긴 배선 테스트.
// seed 1은 첫 갈래가 event,event,combat 이라 이벤트를 바로 밟을 수 있다.
test('이벤트 노드에서 선택지를 고르면 결과가 뜬다', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/?seed=1', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await dismissNotices(page);
  await page.locator('.cs-item', { hasText: '검사' }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /시작/ }).last().click();
  await page.waitForTimeout(1200);
  const neow = page.getByRole('button', { name: /거절한다/ });
  if (await neow.count()) { await neow.first().click(); await page.waitForTimeout(800); }

  await page.locator('.map-node.event.accessible').first().click();
  await page.waitForTimeout(900);
  await expect(page.locator('.event-screen')).toBeVisible();

  await page.locator('.event-choice:not(.disabled)').first().click();
  await page.waitForTimeout(700);
  await expect(page.locator('.event-result')).toBeVisible();
});
