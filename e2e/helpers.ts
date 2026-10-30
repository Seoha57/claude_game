import type { Page } from '@playwright/test';

/** 타이틀의 리브랜드 안내를 닫는다 (처음 방문 시에만 뜬다). */
export async function dismissNotices(page: Page): Promise<void> {
  const ok = page.getByRole('button', { name: '확인' });
  if (await ok.count()) { await ok.first().click(); await page.waitForTimeout(400); }
}

/** 새 런을 시작해 맵까지 간다. 네오의 축복은 보너스 없이 넘긴다. */
export async function startRun(page: Page, charName = '검사'): Promise<void> {
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await dismissNotices(page);
  await page.getByRole('button', { name: '새 게임 시작' }).click();
  await page.waitForTimeout(600);
  await page.locator('.cs-item', { hasText: charName }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /시작/ }).last().click();
  await page.waitForTimeout(1000);
  const neow = page.getByRole('button', { name: /거절한다/ });
  if (await neow.count()) { await neow.first().click(); await page.waitForTimeout(800); }
}

export const inCombat = async (page: Page): Promise<boolean> =>
  (await page.locator('[data-enemy-uid]').count()) > 0;

/** 맵에서 전투 노드를 찾아 들어간다. 모닥불·상점 등은 건너뛴다. */
export async function enterCombat(page: Page): Promise<boolean> {
  for (let round = 0; round < 12; round++) {
    if (await inCombat(page)) break;
    const nodes = page.locator('[class*="node"]');
    const n = await nodes.count();
    for (let i = 0; i < n; i++) {
      const el = nodes.nth(i);
      if (!(await el.isVisible().catch(() => false))) continue;
      await el.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(800);
      if (await inCombat(page)) break;
      for (const label of [/건너뛰기/, /맵으로/, /나가기/]) {
        const btn = page.getByRole('button', { name: label });
        if (await btn.count()) { await btn.first().click().catch(() => {}); await page.waitForTimeout(600); break; }
      }
    }
    await page.waitForTimeout(300);
  }
  await skipTutorial(page);
  return inCombat(page);
}

export async function skipTutorial(page: Page): Promise<void> {
  for (let i = 0; i < 5; i++) {
    if ((await page.locator('.tutorial-overlay').count()) === 0) return;
    const skip = page.getByRole('button', { name: /건너뛰기/ });
    if (await skip.count()) { await skip.first().click().catch(() => {}); await page.waitForTimeout(400); }
  }
}

/**
 * 공격 카드를 계속 내서 전투를 끝낸다.
 * 손패 수가 줄었을 때만 "냈다"고 본다 — 에너지가 없으면 클릭해도 그대로다.
 */
export async function fightToEnd(page: Page, maxTurns = 150): Promise<void> {
  for (let turn = 0; turn < maxTurns; turn++) {
    if (!(await inCombat(page))) return;
    const handBefore = await page.locator('.card').count();
    if (handBefore === 0) { await page.keyboard.press('e'); await page.waitForTimeout(1500); continue; }

    let played = false;
    const cards = page.locator('.card');
    for (let i = 0; i < handBefore; i++) {
      const type = await cards.nth(i).locator('.card-type').innerText().catch(() => '');
      if (!type.includes('공격')) continue;
      await cards.nth(i).click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(200);
      const enemy = page.locator('[data-enemy-uid]').first();
      if (await enemy.count()) await enemy.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(450);
      if ((await page.locator('.card').count()) < handBefore) { played = true; break; }
    }
    if (!played) { await page.keyboard.press('e'); await page.waitForTimeout(1500); }
  }
}

export const readStorage = (page: Page, key: string) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);
