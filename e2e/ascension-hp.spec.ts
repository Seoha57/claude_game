import { test, expect } from '@playwright/test';
import { dismissNotices, readStorage } from './helpers';

// 고단계 직업 보정 — A10에서 직업마다 시작 HP가 다르게 붙는다.
// A10 승률 편차를 11.5 → 2.9%p로 줄인 유일한 손잡이라, 화면까지 실제로
// 먹히는지 본다 (검사 72-4+9=77, 혈술사 75-4-13=58).
async function startAt(page: import('@playwright/test').Page, asc: number, charName: string) {
  await page.goto(`/?seed=1&asc=${asc}`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await dismissNotices(page);
  await page.locator('.cs-item', { hasText: charName }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /시작/ }).last().click();
  await page.waitForTimeout(1200);
  // 네오의 축복을 거절해야 런이 저장된다 (체력의 축복은 최대 HP를 바꾼다).
  const neow = page.getByRole('button', { name: /거절한다/ });
  if (await neow.count()) { await neow.first().click(); await page.waitForTimeout(1000); }
  const save = await readStorage(page, 'dod_save');
  return save?.runState?.player?.maxHp as number;
}

test('A10에서는 직업별 시작 HP 보정이 붙는다', async ({ page }) => {
  test.setTimeout(180_000);
  expect(await startAt(page, 10, '검사')).toBe(77);
  expect(await startAt(page, 10, '혈술사')).toBe(58);
});

test('A0에서는 보정이 붙지 않는다', async ({ page }) => {
  test.setTimeout(180_000);
  expect(await startAt(page, 0, '검사')).toBe(72);
  expect(await startAt(page, 0, '혈술사')).toBe(75);
});
