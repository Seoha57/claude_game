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
  }
  root.appendChild(view);
}
