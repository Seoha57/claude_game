import './style.css';
import { setRenderer } from './state';
import { render } from './ui/router';
import { setAchievementNotifier, reconcileAchievements } from './achievements';
import { showAchievementToast } from './ui/achievement-toast';
import { initializeSync } from './sync/sync';

setAchievementNotifier(showAchievementToast);
setRenderer(render);
// 과거 버그로 누락된 도전과제를 기록 기반으로 소급 보정
reconcileAchievements();
initializeSync();
render();

// Re-render when sync pulls in remote changes
window.addEventListener('dungeoncard:sync-applied', () => {
  try { reconcileAchievements(); } catch { /* ignore */ }
  try { render(); } catch { /* ignore */ }
});
