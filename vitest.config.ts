import { defineConfig } from 'vitest/config';

// 게임 로직은 localStorage를 직접 읽고 쓰므로 jsdom 환경이 필요하다.
// PWA 플러그인은 테스트에 불필요하니 vite.config.ts를 쓰지 않고 따로 둔다.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    testTimeout: 60_000,
  },
});
