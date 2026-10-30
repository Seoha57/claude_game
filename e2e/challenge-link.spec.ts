import { test, expect } from '@playwright/test';
import { dismissNotices } from './helpers';

// 회귀 테스트: PWA가 autoUpdate로 새로고침을 걸면서 replaceState로 지운 직후의
// 주소가 아니라 원래 주소로 되돌아가 ?seed=가 사라졌다.
// 지금은 seed를 sessionStorage에 넣어두고 새로고침 뒤에도 다시 읽는다 (main.ts).
test('?seed= 챌린지 링크가 캐릭터 선택으로 들어간다', async ({ page }) => {
  await page.goto('/?seed=12345', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await dismissNotices(page);

  await expect(page.getByText('캐릭터 선택')).toBeVisible();
  await expect(page.locator('.cs-item')).not.toHaveCount(0);

  // 링크를 소비했으면 주소에서 쿼리를 지운다 (새로고침 시 같은 런이 또 시작되지 않도록)
  expect(await page.evaluate(() => location.search)).toBe('');
});

test('seed 없이 들어오면 제목 화면이다', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await dismissNotices(page);
  await expect(page.getByRole('button', { name: '새 게임 시작' })).toBeVisible();
});
