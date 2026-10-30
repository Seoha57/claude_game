import './style.css';
import { migrateStorage } from './migrate-storage';
migrateStorage();
import { setRenderer } from './state';
import { render } from './ui/router';
import { setAchievementNotifier, reconcileAchievements } from './achievements';
import { showAchievementToast } from './ui/achievement-toast';
import { initializeSync } from './sync/sync';
import { showRebrandNotice } from './ui/rebrand-notice';
import { initPwaInstall } from './ui/pwa-install';
import { initTouchTooltip } from './ui/touch-tooltip';
import { applyToDOM } from './game-settings';
import { setPendingRunParams } from './ui/title-ui';
import { setScreen } from './state';

setAchievementNotifier(showAchievementToast);
applyToDOM();
setRenderer(render);
reconcileAchievements();
initializeSync();
render();

// Handle challenge URL: ?seed=X&char=Y&asc=Z
//
// 파라미터를 sessionStorage에도 남긴다. PWA(autoUpdate)가 새 서비스워커를 잡으면
// 페이지를 한 번 리로드하는데, 그 시점엔 아래 replaceState로 쿼리가 이미 지워져 있어
// 링크가 통째로 사라지고 제목 화면으로 떨어졌다.
const CHALLENGE_KEY = 'dod_pending_challenge';
const urlParams = new URLSearchParams(window.location.search);
let seedParam = urlParams.get('seed');
let ascParam = urlParams.get('asc');
if (!seedParam) {
  try {
    const saved = sessionStorage.getItem(CHALLENGE_KEY);
    if (saved) {
      const p = JSON.parse(saved) as { seed: number; asc: number };
      seedParam = String(p.seed);
      ascParam = String(p.asc);
    }
  } catch { /* ignore */ }
}
if (seedParam) {
  const seed = parseInt(seedParam, 10);
  const asc = parseInt(ascParam ?? '0', 10);
  if (!isNaN(seed)) {
    try { sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify({ seed, asc })); } catch { /* ignore */ }
    setPendingRunParams(seed, asc);
    setScreen('character_select');
    render();
    history.replaceState(null, '', window.location.pathname);
  }
}

showRebrandNotice();
initPwaInstall();
initTouchTooltip();

// Re-render when sync pulls in remote changes
window.addEventListener('dod:sync-applied', () => {
  try { reconcileAchievements(); } catch { /* ignore */ }
  try { render(); } catch { /* ignore */ }
});

// SW가 업데이트되면 새 코드를 로드하기 위해 페이지 리로드 (무한 루프 방지)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (sessionStorage.getItem('sw_reloaded')) return;
    sessionStorage.setItem('sw_reloaded', '1');
    window.location.reload();
  });
}
