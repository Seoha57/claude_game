import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dismissNotices } from './helpers';

// 무한 던전은 게임을 깬 뒤에야 들어갈 수 있어서 e2e로 직접 플레이할 수 없다.
// 시뮬레이터가 실제로 이긴 런을 픽스처로 떠놨다 (tools/tmp-fixture는 일회용이라
// 지웠고, 깨지면 같은 방식으로 다시 뜨면 된다). 웨이브 5 클리어 직후 상태다.
const SAVE = readFileSync(new URL('./fixtures/endless-save.json', import.meta.url), 'utf-8');

test('무한 던전 — 보상을 고르고 다음 웨이브로 넘어간다', async ({ page }) => {
  await page.addInitScript((save) => localStorage.setItem('dod_save', save), SAVE);
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await dismissNotices(page);

  await page.getByRole('button', { name: '이어하기' }).click();
  await page.waitForTimeout(600);

  // 웨이브 5는 엘리트라 보상 선택이 뜬다
  await expect(page.getByText('웨이브 5')).toBeVisible();
  await expect(page.getByText('보상을 선택하세요')).toBeVisible();

  const rewards = page.locator('button', { hasText: /힘 강화|민첩 강화|치유|카드 강화|최대 HP|물약/ });
  expect(await rewards.count()).toBeGreaterThanOrEqual(3);
  await rewards.first().click();
  await page.waitForTimeout(400);

  // 고르고 나면 다음 웨이브 버튼이 뜬다 — 6은 휴식이다
  const next = page.getByRole('button', { name: /웨이브 6 시작/ });
  await expect(next).toBeVisible();
  await next.click();
  await page.waitForTimeout(600);
  await expect(page.getByText('휴식')).toBeVisible();

  // 휴식 다음은 실제 전투다
  await page.getByRole('button', { name: /웨이브 7 시작/ }).click();
  await page.waitForTimeout(1200);
  await expect(page.locator('.combat-screen')).toBeVisible();
});
