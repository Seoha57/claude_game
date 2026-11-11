import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// 영어 모드에서 카드가 한국어로 보이던 적이 있다. 렌더가 def.name/description을
// 그대로 그려서 i18n을 안 거쳤고, 설명문은 번역 자체가 없었다.
const SAVE = readFileSync(new URL('./fixtures/en-save.json', import.meta.url), 'utf-8');

test('영어 모드에서 카드·유물이 영어로 보인다', async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript((s) => {
    localStorage.setItem('dod_lang', 'en');
    localStorage.setItem('dod_save', s);
  }, SAVE);
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const ok = page.getByRole('button', { name: /^(OK|Confirm)$/ });
  if (await ok.count()) { await ok.first().click(); await page.waitForTimeout(400); }
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(800);

  // 유물 이름 (상단 바)
  await expect(page.getByText('Burning Blood')).toBeVisible();
  await expect(page.getByText('Retribution Mail')).toBeVisible();

  await page.getByText(/Deck \d+/).first().click();
  await page.waitForTimeout(600);
  const body = await page.locator('body').innerText();
  expect(body, '카드 이름').toContain('Slash');
  expect(body, '기본 공격 설명문').toContain('Deal 6 damage.');
  expect(body, '방어 설명문').toContain('Gain 6 Block.');
  expect(body, '복합 설명문').toContain('Apply 2 Vulnerable.');
  expect(body, '플레이버').toContain('Cut. That is all.');
  expect(body, '플레이버').toContain('If you cannot block, you cannot cut.');
});

// 이벤트 텍스트(제목·본문·선택지)도 영어여야 한다. seed 1은 첫 갈래가 event다.
test('영어 모드에서 이벤트가 영어로 보인다', async ({ page }) => {
  test.setTimeout(180_000);
  await page.addInitScript(() => localStorage.setItem('dod_lang', 'en'));
  await page.goto('/?seed=1', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  const ok = page.getByRole('button', { name: /^(OK|Confirm)$/ });
  if (await ok.count()) { await ok.first().click(); await page.waitForTimeout(400); }
  await page.locator('.cs-item').first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Start/ }).last().click();
  await page.waitForTimeout(1200);
  const neow = page.getByRole('button', { name: /Refuse/ });
  if (await neow.count()) { await neow.first().click(); await page.waitForTimeout(800); }

  await page.locator('.map-node.event.accessible').first().click();
  await page.waitForTimeout(900);
  await expect(page.locator('.event-screen')).toBeVisible();
  const body = await page.locator('body').innerText();
  expect(body, '이벤트 제목').toContain('Dimensional Rift');
  expect(body, '이벤트 본문').toContain('violet light');
  expect(body, '선택지').toContain('Step back');
});
