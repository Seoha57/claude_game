import { clear } from './dom';
import { getScreen, getCombatOrNull } from '../state';
import { renderTitle, getPendingRunParams } from './title-ui';
import { renderCharacterSelect } from './character-select-ui';
import { renderMap } from './map-ui';
import { renderCombat } from './combat-ui';
import { renderReward } from './reward-ui';
import { renderRest } from './rest-ui';
import { renderShop } from './shop-ui';
import { renderChapterClear, renderWin, renderLose, renderTrueEndingChoice, renderTrueWin } from './end-ui';
import { renderEvent } from './event-ui';
import { renderStats } from './stats-ui';
import { renderHelp } from './help-ui';
import { renderCodex } from './codex-ui';
import { renderAchievements } from './achievements-ui';
import { renderNeowBlessing } from './neow-ui';
import { renderSync } from './sync-ui';
import { renderDaily } from './daily-ui';
import { renderHistory } from './history-ui';
import { renderEndlessWaveClear, renderEndlessResult, renderLeaderboard } from './endless-ui';
import { renderSettings } from './settings-ui';

type Screen = ReturnType<typeof getScreen>;
let prevScreen: Screen | null = null;

function getTransitionClass(from: Screen | null, to: Screen): string {
  if (!from || from === to) return '';
  if (to === 'combat') return 'screen-enter-combat';
  if (from === 'combat' && (to === 'reward' || to === 'win' || to === 'lose' || to === 'true_win')) return 'screen-enter-fade';
  if (to === 'lose') return 'screen-enter-fade';
  return 'screen-enter';
}

export function render(): void {
  const root = document.getElementById('app');
  if (!root) return;
  clear(root);

  const screen = getScreen();
  let view: HTMLElement;
  switch (screen) {
    case 'title':
      view = renderTitle();
      break;
    case 'character_select': {
      const { seed, ascension } = getPendingRunParams();
      view = renderCharacterSelect(seed, ascension);
      break;
    }
    case 'map':
      view = renderMap();
      break;
    case 'combat':
      view = getCombatOrNull() ? renderCombat() : renderTitle();
      break;
    case 'reward':
      view = renderReward();
      break;
    case 'rest':
      view = renderRest();
      break;
    case 'shop':
      view = renderShop();
      break;
    case 'chapter_clear':
      view = renderChapterClear();
      break;
    case 'win':
      view = renderWin();
      break;
    case 'lose':
      view = renderLose();
      break;
    case 'event':
      view = renderEvent();
      break;
    case 'true_ending_choice':
      view = renderTrueEndingChoice();
      break;
    case 'true_win':
      view = renderTrueWin();
      break;
    case 'stats':
      view = renderStats();
      break;
    case 'help':
      view = renderHelp();
      break;
    case 'codex':
      view = renderCodex();
      break;
    case 'achievements':
      view = renderAchievements();
      break;
    case 'neow_blessing':
      view = renderNeowBlessing();
      break;
    case 'sync':
      view = renderSync();
      break;
    case 'daily':
      view = renderDaily();
      break;
    case 'history':
      view = renderHistory();
      break;
    case 'endless_wave_clear':
      view = renderEndlessWaveClear();
      break;
    case 'endless_result':
      view = renderEndlessResult();
      break;
    case 'leaderboard':
      view = renderLeaderboard();
      break;
    case 'settings':
      view = renderSettings();
      break;
  }

  const transition = getTransitionClass(prevScreen, screen);
  if (transition) view.classList.add(transition);
  prevScreen = screen;

  root.appendChild(view);
}
