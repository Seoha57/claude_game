import { el } from './dom';
import { getRun, setScreen, setCombat, getScreen } from '../state';
import { openDeckOverlay } from './deck-overlay';
import { nodeById } from '../map/map';
import { startCombat, applyRelicCombatStart } from '../combat/combat';
import {
  EASY_ENCOUNTERS,
  ELITE_ENCOUNTERS,
  NORMAL_ENCOUNTERS,
  BOSS_ENCOUNTERS,
  CH2_NORMAL_ENCOUNTERS,
  CH2_ELITE_ENCOUNTERS,
  CH2_BOSS_ENCOUNTERS,
  CH3_NORMAL_ENCOUNTERS,
  CH3_ELITE_ENCOUNTERS,
  CH3_BOSS_ENCOUNTERS,
  CH4_NORMAL_ENCOUNTERS,
  CH4_ELITE_ENCOUNTERS,
  CH4_BOSS_ENCOUNTERS,
  pickEncounter,
} from '../content/enemies';
import type { MapNode, NodeKind } from '../types';
import { makeRng } from '../rng';
import { RELIC_DEFS } from '../content/relics';
import { ENEMY_DEFS } from '../content/enemies';
import { ENEMY_ART, resetCombatUiState } from './combat-ui';
import { showBossIntro } from './splash-overlay';
import { bossIntroFlavor } from '../content/lore';

const markedNodes = new Set<string>();
let markedChapter = -1;

const NODE_ICON: Record<NodeKind, string> = {
  start: '🏁',
  combat: '⚔',
  elite: '💀',
  rest: '🔥',
  reward: '💰',
  shop: '🛒',
  boss: '👑',
  event: '❓',
};

const COL_WIDTH = 120;
const ROW_HEIGHT = 96;
const COLS = 4;
const PADDING_X = 60;
const PADDING_Y = 60;

export function renderMap(): HTMLElement {
  const run = getRun();
  if (run.chapter !== markedChapter) { markedNodes.clear(); markedChapter = run.chapter; }
  const cur = run.currentNodeId ? nodeById(run.map, run.currentNodeId) : null;
  const accessibleIds = new Set<string>();
  if (cur) for (const n of cur.next) accessibleIds.add(n);

  const header = el(
    'div',
    { class: 'map-header' },
    el(
      'div',
      { class: 'info' },
      el('span', {}, `챕터 ${run.chapter}`),
      el('span', {}, `층: ${run.floor}`),
      run.dailyConfig
        ? el('span', { style: { color: 'var(--accent)' }, title: '오늘의 도전' }, '🌅 데일리')
        : el('span', {
            style: { color: run.ascension > 0 ? 'var(--bad)' : 'var(--muted)' },
            title: run.ascension > 0 ? `등반 난이도 A${run.ascension}` : '기본 난이도',
          }, run.ascension > 0 ? `⛰ A${run.ascension}` : '기본'),
      el('span', {}, `❤ ${run.player.hp}/${run.player.maxHp}`),
      el('span', {}, `💰 ${run.player.gold}`),
      el('span', {
        style: { cursor: 'pointer', textDecoration: 'underline', color: 'var(--accent)' },
        onClick: () => openDeckOverlay(run.player.deck),
      }, `덱 ${run.player.deck.length}장`),
      el(
        'span',
        {
          title: run.player.relics
            .map((id) => `${RELIC_DEFS[id]?.name ?? id}: ${RELIC_DEFS[id]?.description ?? ''}`)
            .join('\n'),
        },
        `유물: ${run.player.relics.map((id) => RELIC_DEFS[id]?.name ?? id).join(', ')}`,
      ),
      ...(run.player.keys.length > 0
        ? [
            el(
              'span',
              {
                style: { color: 'var(--accent)', fontWeight: 'bold' },
                title: run.player.keys
                  .map((k) => k === 'will' ? '의지의 열쇠' : k === 'emotion' ? '감정의 열쇠' : '육체의 열쇠')
                  .join(', '),
              },
              `🗝️ ${run.player.keys.length}/3`,
            ),
          ]
        : []),
    ),
  );

  const maxFloor = Math.max(...run.map.map((n) => n.y));
  const width = PADDING_X * 2 + (COLS - 1) * COL_WIDTH;
  const height = PADDING_Y * 2 + maxFloor * ROW_HEIGHT;

  const canvas = el('div', {
    class: 'map-canvas',
    style: { width: `${width}px`, height: `${height}px` },
  });

  // SVG edges (drawn first, behind nodes)
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'map-edges');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));

  const edgesByPair = new Map<string, SVGLineElement>();
  for (const n of run.map) {
    for (const nextId of n.next) {
      const nb = nodeById(run.map, nextId);
      const [x1, y1] = nodePos(n, height);
      const [x2, y2] = nodePos(nb, height);
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', String(x1));
      line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(x2));
      line.setAttribute('y2', String(y2));
      let cls = 'edge-line';
      const isTraveled = n.visited && nb.visited;
      const isAccEdge = run.currentNodeId === n.id && accessibleIds.has(nb.id);
      if (isTraveled) cls += ' traveled';
      else if (isAccEdge) cls += ' accessible';
      if (!isTraveled && !isAccEdge && markedNodes.has(n.id) && markedNodes.has(nextId)) cls += ' marked';
      line.setAttribute('class', cls);
      svg.appendChild(line);
      edgesByPair.set(`${n.id}|${nextId}`, line);
    }
  }
  canvas.appendChild(svg);

  const nodeEls = new Map<string, HTMLElement>();

  const refreshMarks = () => {
    for (const [key, line] of edgesByPair) {
      const [a, b] = key.split('|');
      const skip = line.classList.contains('traveled') || line.classList.contains('accessible');
      line.classList.toggle('marked', !skip && markedNodes.has(a) && markedNodes.has(b));
    }
    for (const [id, dom] of nodeEls) {
      dom.classList.toggle('marked', markedNodes.has(id));
    }
  };

  // Nodes
  for (const n of run.map) {
    const isAccessible = accessibleIds.has(n.id);
    const isCurrent = run.currentNodeId === n.id;
    const [x, y] = nodePos(n, height);
    const marked = markedNodes.has(n.id);
    const toggleMark = () => {
      if (n.visited && !isCurrent) return;
      if (markedNodes.has(n.id)) markedNodes.delete(n.id);
      else markedNodes.add(n.id);
      refreshMarks();
    };
    const shopBlocked = n.kind === 'shop' && !!run.dailyConfig?.noShop;
    const nodeEl = el(
      'div',
      {
        class: `map-node ${n.kind} ${isAccessible && !shopBlocked ? 'accessible' : ''} ${
          n.visited && !isCurrent ? 'visited' : ''
        } ${isCurrent ? 'current' : ''} ${marked ? 'marked' : ''} ${shopBlocked ? 'disabled' : ''}`,
        style: { left: `${x}px`, top: `${y}px` },
        'data-tooltip': shopBlocked ? '🚫 상점 폐쇄\n오늘의 도전: 상점 이용 불가' : nodeLabel(n, run.chapter),
        onClick: () => { if (isAccessible && !shopBlocked) enterNode(n); },
        onContextmenu: (e: Event) => { e.preventDefault(); toggleMark(); },
      },
      NODE_ICON[n.kind] ?? '?',
    );
    // Long press for mobile
    let lpTimer = 0;
    nodeEl.addEventListener('touchstart', (e) => {
      lpTimer = window.setTimeout(() => { e.preventDefault(); toggleMark(); }, 400);
    }, { passive: false });
    nodeEl.addEventListener('touchend', () => clearTimeout(lpTimer));
    nodeEl.addEventListener('touchmove', () => clearTimeout(lpTimer));
    nodeEls.set(n.id, nodeEl);
    canvas.appendChild(nodeEl);
  }

  const board = el('div', { class: 'map-board' }, canvas);

  // 현재 노드 위치로 스크롤: 시작 지점이면 맨 아래, 이후엔 가운데
  if (cur) {
    requestAnimationFrame(() => {
      const [, curY] = nodePos(cur, height);
      if (cur.y === 0) {
        board.scrollTop = board.scrollHeight;
      } else {
        const targetScroll = curY - board.clientHeight / 2;
        board.scrollTop = Math.max(0, targetScroll);
      }
    });
  }

  return el('div', { class: 'map-screen' }, header, board);
}

function nodePos(n: MapNode, totalHeight: number): [number, number] {
  const x = PADDING_X + n.x * COL_WIDTH;
  // y=0 is start (bottom); top of canvas is the boss. Flip y.
  const y = totalHeight - PADDING_Y - n.y * ROW_HEIGHT;
  return [x, y];
}

function nodeLabel(n: MapNode, chapter?: number): string {
  switch (n.kind) {
    case 'start':   return '시작 지점';
    case 'combat':  return '⚔ 전투\n몬스터와 싸워 골드와 카드 보상을 획득합니다.';
    case 'elite':   return '💀 엘리트\n강력한 적. 쓰러뜨리면 희귀 유물을 얻습니다.';
    case 'rest':    return '🔥 모닥불\nHP를 회복하거나 카드를 강화할 수 있습니다.';
    case 'reward':  return '💰 보물\n골드와 카드 선택 보상을 받습니다.';
    case 'shop':    return '🛒 상점\n카드·유물 구매 및 카드 제거 서비스.';
    case 'boss': {
      const table =
        chapter === 4 ? CH4_BOSS_ENCOUNTERS :
        chapter === 3 ? CH3_BOSS_ENCOUNTERS :
        chapter === 2 ? CH2_BOSS_ENCOUNTERS : BOSS_ENCOUNTERS;
      const names = table.map((ids) => ids.map((id) => ENEMY_DEFS[id]?.name ?? id).join(' & ')).join(' / ');
      return `👑 보스\n후보: ${names}`;
    }
    case 'event':   return '❓ 이벤트\n예상치 못한 만남. 선택에 따라 다른 결과가...';
  }
}

let enteringNode = false;

function enterNode(n: MapNode): void {
  // 더블클릭/분리된 DOM 재발동 방어: 노드 진입 처리 중이거나
  // 이미 맵을 떠났으면 무시 (전투 재생성/중복 진입 차단)
  if (enteringNode || getScreen() !== 'map') return;
  enteringNode = true;
  // 다음 틱에 해제 — 같은 클릭 버스트만 막고 정상 흐름은 통과
  setTimeout(() => { enteringNode = false; }, 0);

  const run = getRun();
  if (run.currentNodeId) {
    const cur = nodeById(run.map, run.currentNodeId);
    cur.visited = true;
  }
  run.currentNodeId = n.id;
  run.floor = n.y;
  n.visited = true;

  if (n.kind === 'combat' || n.kind === 'elite' || n.kind === 'boss') {
    const rng = makeRng(run.seed + n.y * 31 + n.x);
    const ch = run.chapter;
    let table =
      ch === 4 ? CH4_NORMAL_ENCOUNTERS :
      ch === 3 ? CH3_NORMAL_ENCOUNTERS :
      ch === 2 ? CH2_NORMAL_ENCOUNTERS :
      NORMAL_ENCOUNTERS;
    if (n.kind === 'elite')
      table = ch === 4 ? CH4_ELITE_ENCOUNTERS : ch === 3 ? CH3_ELITE_ENCOUNTERS : ch === 2 ? CH2_ELITE_ENCOUNTERS : ELITE_ENCOUNTERS;
    else if (n.kind === 'boss')
      table = ch === 4 ? CH4_BOSS_ENCOUNTERS : ch === 3 ? CH3_BOSS_ENCOUNTERS : ch === 2 ? CH2_BOSS_ENCOUNTERS : BOSS_ENCOUNTERS;
    else if (ch === 1 && n.y <= 3) table = EASY_ENCOUNTERS;
    const enemyIds = pickEncounter(rng, table);
    // Remember for defeat screen ("X에게 쓰러졌다")
    run.combatEnemyDefIds = enemyIds.slice();

    const startBattle = () => {
      resetCombatUiState();
      const cs = startCombat(run.player, enemyIds, run.seed + n.y * 17 + n.x * 7);

      applyRelicCombatStart(run.player.relics, cs);

      setCombat(cs);
      setScreen('combat');
    };

    // Show boss intro before battle
    if (n.kind === 'boss') {
      const bossId = enemyIds[0];
      const bossDef = ENEMY_DEFS[bossId];
      if (bossDef) {
        const avgHp = Math.floor((bossDef.hpRange[0] + bossDef.hpRange[1]) / 2);
        showBossIntro(
          {
            name: bossDef.name,
            emoji: ENEMY_ART[bossId] ?? '👑',
            hp: avgHp,
            flavor: bossIntroFlavor(bossId, ch),
          },
          startBattle,
        );
        return;
      }
    }

    startBattle();
  } else if (n.kind === 'rest') {
    setScreen('rest');
  } else if (n.kind === 'reward') {
    setScreen('reward');
  } else if (n.kind === 'shop') {
    if (run.dailyConfig?.noShop) {
      setScreen('map');
      return;
    }
    setScreen('shop');
  } else if (n.kind === 'event') {
    setScreen('event');
  }
}
