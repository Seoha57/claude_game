import './style.css';
import { setRenderer } from './state';
import { render } from './ui/router';
import { setAchievementNotifier } from './achievements';
import { showAchievementToast } from './ui/achievement-toast';

setAchievementNotifier(showAchievementToast);
setRenderer(render);
render();
