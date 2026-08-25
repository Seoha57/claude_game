import './style.css';
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
window.addEventListener('dungeoncard:sync-applied', () => {
  try { reconcileAchievements(); } catch { /* ignore */ }
  try { render(); } catch { /* ignore */ }
});

// SW가 업데이트되면 새 코드를 로드하기 위해 페이지 리로드
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}
