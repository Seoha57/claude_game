import './style.css';
import { setRenderer } from './state';
import { render } from './ui/router';
import { setAchievementNotifier } from './achievements';
import { showAchievementToast } from './ui/achievement-toast';
import { initializeSync } from './sync/sync';

setAchievementNotifier(showAchievementToast);
setRenderer(render);
initializeSync();
render();

// Re-render when sync pulls in remote changes
window.addEventListener('dungeoncard:sync-applied', () => {
  try { render(); } catch { /* ignore */ }
});
