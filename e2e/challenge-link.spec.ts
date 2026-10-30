import { test, expect } from '@playwright/test';
import { dismissNotices } from './helpers';

// 회귀 테스트: 앱 소스가 여러 청크로 쪼개지면 state.ts가 두 번 로드되고,
// 두 번째 인스턴스가 currentScreen을 'title'로 초기화해 이 화면이 타이틀로 되돌아갔다.
// vite.config.ts의 manualChunks가 그걸 막는다.
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
