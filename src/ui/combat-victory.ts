// 전투 승리 화면 — 보상으로 넘어가기 전 한 장짜리 화면.
// combat-ui.ts에서 떼어냈다. 전투 로직과는 승리 보상 적용만 공유한다.
import { el } from './dom';
import { getRun, setCombat, setScreen } from '../state';
import { bossDefeatFlavor } from '../content/lore';
import { applyVictoryRewards } from '../run/rules';
import { recordEnemyKills } from '../codex';
import { ic } from './art';
import { t } from '../i18n';
import type { CombatState } from '../types';

function applyVictoryRelics(run: any, _state: any): void {
  recordEnemyKills(run.combatEnemyDefIds ?? []);
  const cur = run.currentNodeId ? run.map.find((n: any) => n.id === run.currentNodeId) : null;
  applyVictoryRewards(run, cur ?? null);
}

export function renderCombatVictory(_state: CombatState): HTMLElement {
  const run = getRun();
  const cur = run.currentNodeId
    ? run.map.find((n) => n.id === run.currentNodeId)!
    : null;
  const isBossNode = cur?.kind === 'boss';
  const isCh3Boss = isBossNode && run.chapter === 3;
  const isCh4Boss = isBossNode && run.chapter === 4;
  const isChapterBoss = isBossNode && (run.chapter === 1 || run.chapter === 2);
  const hasAllKeys = run.player.keys.includes('will') && run.player.keys.includes('emotion') && run.player.keys.includes('body');

  // Endless mode — skip normal routing
  if (run.endless) {
    // Apply end-of-combat relics
    if (!(_state as any)._victoryAppliedRelics) {
      applyVictoryRelics(run, _state);
      (_state as any)._victoryAppliedRelics = true;
    }
    const wave = run.endless.wave;
    return el('div', { class: `combat-screen ch-${run.chapter}` },
      el('div', { class: 'combat-top', style: { flexDirection: 'column', gap: '16px' } },
        el('h2', { style: { color: 'var(--good)', margin: 0 } }, `${t('웨이브')} ${wave} ${t('클리어!')}`),
        el('div', { style: { color: 'var(--muted)' } }, `HP ${run.player.hp}/${run.player.maxHp} · ${t('점수')} ${run.endless.score + wave * 100 + run.player.hp + run.player.gold + run.player.relics.length * 25}`),
        el('button', {
          onClick: () => {
            setCombat(null);
            setScreen('endless_wave_clear');
          },
        }, t('다음 웨이브')),
      ),
    );
  }

  // Determine next-screen routing
  let nextScreen: 'reward' | 'chapter_clear' | 'win' | 'true_win' | 'true_ending_choice' = 'reward';
  let nextLabel = t('보상 받기');
  if (isCh4Boss) {
    nextScreen = 'true_win';
    nextLabel = t('진엔딩 클리어!');
  } else if (isCh3Boss) {
    if (hasAllKeys) {
      nextScreen = 'true_ending_choice';
      nextLabel = t('계속...');
    } else {
      nextScreen = 'win';
      nextLabel = t('최종 클리어!');
    }
  } else if (isChapterBoss) {
    nextScreen = 'chapter_clear';
    nextLabel = t('챕터 클리어!');
  }

  // Key drops — first elite of each chapter
  let droppedKey: string | null = null;
  if (cur?.kind === 'elite') {
    const keyMap: Record<number, string> = { 1: 'will', 2: 'emotion', 3: 'body' };
    const keyName: Record<string, string> = { will: t('의지의 열쇠'), emotion: t('감정의 열쇠'), body: t('육체의 열쇠') };
    const keyToGive = keyMap[run.chapter];
    if (keyToGive && !run.player.keys.includes(keyToGive)) {
      if (!(_state as any)._keyDropped) {
        run.player.keys.push(keyToGive);
        droppedKey = keyName[keyToGive];
        (_state as any)._keyDropped = true;
      } else {
        droppedKey = keyName[keyToGive];
      }
    }
  }

  if (!(_state as any)._victoryAppliedRelics) {
    applyVictoryRelics(run, _state);
    (_state as any)._victoryAppliedRelics = true;
  }

  // 보스 처치 대사
  const defeatFlavor = isBossNode ? bossDefeatFlavor(run.combatEnemyDefIds?.[0] ?? '') : null;

  return el(
    'div',
    { class: `combat-screen ch-${run.chapter}` },
    el(
      'div',
      { class: 'combat-top', style: { flexDirection: 'column', gap: '16px' } },
      (() => { const h = el('h2', { style: { color: 'var(--good)', margin: 0 } }); h.innerHTML = isBossNode ? `${ic('crown')} ${t('보스 처치!')}` : t('승리!'); return h; })(),
      ...(defeatFlavor
        ? [el('div', {
            style: {
              color: 'var(--accent)',
              fontStyle: 'italic',
              maxWidth: '420px',
              textAlign: 'center',
              lineHeight: '1.6',
              fontSize: '14px',
            },
          }, defeatFlavor)]
        : []),
      el(
        'div',
        { style: { color: 'var(--muted)' } },
        `HP ${run.player.hp}/${run.player.maxHp}`,
      ),
      ...(droppedKey
        ? [(() => { const d = el('div', { style: { color: 'var(--accent)', fontWeight: 'bold' } }); d.innerHTML = `${ic('key')} ${droppedKey} ${t('획득!')}`; return d; })()]
        : []),
      el(
        'button',
        {
          onClick: () => {
            setCombat(null);
            setScreen(nextScreen);
          },
        },
        nextLabel,
      ),
    ),
  );
}
