import type { Page } from '@playwright/test';

/** 타이틀의 리브랜드 안내를 닫는다 (처음 방문 시에만 뜬다). */
export async function dismissNotices(page: Page): Promise<void> {
  const ok = page.getByRole('button', { name: '확인' });
  if (await ok.count()) { await ok.first().click(); await page.waitForTimeout(400); }
}

/** 새 런을 시작해 맵까지 간다. 네오의 축복은 보너스 없이 넘긴다. */
export async function startRun(page: Page, charName = '검사'): Promise<void> {
  await page.goto('/', { waitUntil: 'load' });
  // 서비스워커가 1.5MB를 프리캐시하는 동안은 모든 조작이 느려진다.
  // 기다리지 않으면 첫 전투 테스트만 몇 분씩 걸린다.
  await page.waitForFunction(() => navigator.serviceWorker?.controller != null, null,
    { timeout: 20_000 }).catch(() => { /* 서비스워커가 없는 환경도 있다 */ });
  await page.waitForTimeout(800);
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

/**
 * 전투에 들어갈 때까지 런을 다시 시작한다.
 * 맵은 런마다 달라서, 가까운 노드가 전부 모닥불·상점인 맵이 걸릴 수 있다.
 */
export async function startRunInCombat(page: Page, charName = '검사', attempts = 3): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    await startRun(page, charName);
    if (await enterCombat(page)) return true;
  }
  return false;
}

export const inCombat = async (page: Page): Promise<boolean> =>
  (await page.locator('[data-enemy-uid]').count()) > 0;

/**
 * 맵에서 일반 전투 노드로 들어간다.
 * 엘리트는 피한다 — 시작 덱으로는 전투가 몇 배로 길어져서 테스트가 흔들린다.
 * (노드 클래스는 `map-node <kind> accessible` 형태다)
 */
export async function enterCombat(page: Page): Promise<boolean> {
  const deadline = Date.now() + 60_000;
  for (let round = 0; round < 8 && Date.now() < deadline; round++) {
    if (await inCombat(page)) break;
    const nodes = page.locator('.map-node.combat.accessible');
    const n = await nodes.count();
    for (let i = 0; i < n && Date.now() < deadline; i++) {
      const el = nodes.nth(i);
      if (!(await el.isVisible().catch(() => false))) continue;
      await el.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(700);
      if (await inCombat(page)) break;
    }
    if (await inCombat(page)) break;
    // 일반 전투가 없으면 아무 노드나 (모닥불·상점은 건너뛰고 다음 줄로)
    const any = page.locator('.map-node.accessible');
    const m = await any.count();
    for (let i = 0; i < m && Date.now() < deadline; i++) {
      const el = any.nth(i);
      if (!(await el.isVisible().catch(() => false))) continue;
      await el.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(700);
      if (await inCombat(page)) break;
      for (const label of [/건너뛰기/, /맵으로/, /나가기/]) {
        const btn = page.getByRole('button', { name: label });
        if (await btn.count()) { await btn.first().click().catch(() => {}); await page.waitForTimeout(500); break; }
      }
    }
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
 * 전투를 끝까지 진행한다. 공격을 먼저 보고, 없으면 방어·파워도 낸다.
 * 손패 수가 줄었을 때만 "냈다"고 본다 — 에너지가 없으면 클릭해도 그대로다.
 *
 * 화면에서 HP를 읽어 판단하지 않는다. 못 찾는 선택자를 턴마다 기다리면
 * 전투 하나가 몇 분으로 늘어난다.
 */
export async function fightToEnd(page: Page, maxTurns = 200): Promise<void> {
  const deadline = Date.now() + 150_000;
  for (let turn = 0; turn < maxTurns && Date.now() < deadline; turn++) {
    if (!(await inCombat(page))) return;
    const handBefore = await page.locator('.card').count();
    if (handBefore === 0) { await page.keyboard.press('e'); await page.waitForTimeout(500); continue; }

    let played = false;
    for (const attacksOnly of [true, false]) {
      const cards = page.locator('.card');
      for (let i = 0; i < handBefore && !played && Date.now() < deadline; i++) {
        const type = await cards.nth(i).locator('.card-type').innerText().catch(() => '');
        if (attacksOnly && !type.includes('공격')) continue;
        await cards.nth(i).click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(60);
        const enemy = page.locator('[data-enemy-uid]').first();
        if (await enemy.count()) await enemy.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(140);
        if ((await page.locator('.card').count()) < handBefore) played = true;
      }
      if (played) break;
    }
    if (!played) { await page.keyboard.press('e'); await page.waitForTimeout(500); }
  }
}

export const readStorage = (page: Page, key: string) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);
