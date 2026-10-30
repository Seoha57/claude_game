import { defineConfig, devices } from '@playwright/test';

// 이 머신에는 firefox만 받아져 있다 (npx playwright install firefox).
// 크롬도 쓰려면 받고 projects에 추가하면 된다.
export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }],
  // 빌드된 결과물로 돌린다 — 실제 배포물과 같은 경로를 검증한다.
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
