import { test, expect } from '@playwright/test';
import { startRun, enterCombat, fightToEnd, readStorage, dismissNotices } from './helpers';

test('적을 쓰러뜨리면 도감에 처치 기록이 남는다', async ({ page }) => {
  await startRun(page);
  expect(await enterCombat(page), '맵에서 전투 노드를 못 찾음').toBe(true);

  const before = await readStorage(page, 'dod_codex');
  expect(before?.enemies ?? {}).toEqual({});

  await fightToEnd(page);
  await expect(page.getByText('승리!')).toBeVisible();

  const after = await readStorage(page, 'dod_codex');
  const kills = after?.enemies ?? {};
  expect(Object.keys(kills).length, '처치한 적이 기록되지 않음').toBeGreaterThan(0);
  for (const n of Object.values(kills)) expect(n).toBeGreaterThan(0);

  // 기존 카드·유물 기록이 날아가지 않아야 한다 (CODEX_VERSION을 올리면 깨진다)
  expect(Array.isArray(after.cards)).toBe(true);
  expect(Array.isArray(after.relics)).toBe(true);
});

test('도감 적 탭이 전체 53종을 보여준다', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await dismissNotices(page);
  await page.locator('button', { hasText: '☰' }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /도감/ }).first().click();
  await page.waitForTimeout(800);

  await page.locator('.codex-tab', { hasText: '적' }).first().click();
  await page.waitForTimeout(500);

  await expect(page.locator('.codex-relic-slot')).toHaveCount(53);
  await expect(page.locator('.codex-stats')).toContainText('/ 53');
});

test('제목 화면에서 칭호와 카드 프레임을 고를 수 있다', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await dismissNotices(page);

  const selects = page.locator('select.frame-select');
  await expect(selects).toHaveCount(2);

  // 아무것도 달성하지 않은 상태 → 칭호는 전부 잠겨 있어야 한다
  const titleSelect = selects.nth(1);
  const enabled = await titleSelect.locator('option:not(:disabled)').allTextContents();
  expect(enabled).toEqual(['칭호 없음']);
});
