import './style.css';
import { migrateStorage } from './migrate-storage';
migrateStorage();
import { setRenderer } from './state';
import { render } from './ui/router';
import { setAchievementNotifier, reconcileAchievements } from './achievements';
import { showAchievementToast } from './ui/achievement-toast';
import { initializeSync } from './sync/sync';
import { showRebrandNotice } from './ui/rebrand-notice';

setAchievementNotifier(showAchievementToast);
setRenderer(render);
reconcileAchievements();
initializeSync();
render();
showRebrandNotice();

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
