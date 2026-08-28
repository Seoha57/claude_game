import { el } from './dom';
import { getRun, getRunOrNull, setScreen, setCombat, endRun } from '../state';
import { getAchievementTitle } from '../achievements';
import { startCombat, applyRelicCombatStart } from '../combat/combat';
import { applyStatus } from '../combat/statuses';
import {
  NORMAL_ENCOUNTERS, ELITE_ENCOUNTERS, BOSS_ENCOUNTERS,
  CH2_NORMAL_ENCOUNTERS, CH2_ELITE_ENCOUNTERS, CH2_BOSS_ENCOUNTERS,
  CH3_NORMAL_ENCOUNTERS, CH3_ELITE_ENCOUNTERS,
  pickEncounter,
} from '../content/enemies';
import { makeRng } from '../rng';
import { resetCombatUiState } from './combat-ui';
import { playSfx } from '../audio';

function waveEncounterTable(wave: number): string[][] {
  if (wave % 10 === 0) return BOSS_ENCOUNTERS.concat(CH2_BOSS_ENCOUNTERS);
  if (wave % 5 === 0) return ELITE_ENCOUNTERS.concat(CH2_ELITE_ENCOUNTERS).concat(CH3_ELITE_ENCOUNTERS);
  if (wave <= 5) return NORMAL_ENCOUNTERS;
  if (wave <= 10) return CH2_NORMAL_ENCOUNTERS;
  return CH3_NORMAL_ENCOUNTERS;
}

function enemyHpMult(wave: number): number {
  return 1 + wave * 0.12;
}

function enemyStrBonus(wave: number): number {
  return Math.floor(wave / 3);
}

export function startNextWave(): void {
  const run = getRun();
  if (!run.endless) return;
  run.endless.wave += 1;
  const wave = run.endless.wave;

  // Every 5th wave (except boss waves at 10, 20...): rest — heal before save
  if (wave > 1 && (wave - 1) % 5 === 0 && (wave - 1) % 10 !== 0) {
    const heal = Math.ceil(run.player.maxHp * 0.25);
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + heal);
    run.endless.lastHeal = heal;
    setScreen('endless_wave_clear');
    return;
  }

  const rng = makeRng(run.seed * 97 + wave * 31);
  const table = waveEncounterTable(wave);
  const enemyIds = pickEncounter(rng, table);

  resetCombatUiState();
  const cs = startCombat(run.player, enemyIds, run.seed + wave * 17);

  // Override enemy scaling
  const hpMult = enemyHpMult(wave);
  const strBonus = enemyStrBonus(wave);
  for (const e of cs.enemies) {
    e.maxHp = Math.round(e.maxHp * hpMult);
    e.hp = e.maxHp;
    if (strBonus > 0) applyStatus(e, 'strength', strBonus);
  }

  applyRelicCombatStart(run.player.relics, cs);

  setCombat(cs);
  setScreen('combat');
}

export function calcEndlessScore(run: any): number {
  const wave = run.endless?.wave ?? 0;
  return wave * 100 + run.player.hp + run.player.gold + run.player.relics.length * 25;
}

export function renderEndlessWaveClear(): HTMLElement {
  const run = getRunOrNull();
  if (!run?.endless) return el('div', {}, '오류');
  const wave = run.endless.wave;
  const isRest = wave > 1 && (wave - 1) % 5 === 0 && (wave - 1) % 10 !== 0;

  const wrapper = el('div', { class: 'end-screen' });

  if (wave === 0) {
    // Entry point — first time
    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } }, '♾️ 무한 던전'));
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', maxWidth: '400px', textAlign: 'center', lineHeight: '1.7', marginBottom: '20px' } },
        '끝없는 적의 물결이 밀려옵니다. 얼마나 오래 버틸 수 있을까요? 웨이브가 올라갈수록 적이 강해집니다.'),
    );
    wrapper.appendChild(
      el('button', {
        style: { fontSize: '16px' },
        onClick: () => startNextWave(),
      }, '🗡️ 웨이브 1 시작'),
    );
    return wrapper;
  }

  if (isRest) {
    const heal = run.endless.lastHeal ?? Math.ceil(run.player.maxHp * 0.25);
    wrapper.appendChild(el('h1', { style: { color: 'var(--good)' } }, '🔥 휴식'));
    wrapper.appendChild(
      el('div', { style: { color: 'var(--good)', marginBottom: '8px' } },
        `❤ HP +${heal} 회복 (${run.player.hp}/${run.player.maxHp})`),
    );
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', marginBottom: '20px' } },
        `웨이브 ${wave} 완료 · 점수 ${calcEndlessScore(run)}`),
    );
    wrapper.appendChild(
      el('button', {
        onClick: () => startNextWave(),
      }, `웨이브 ${wave + 1} 시작`),
    );
    wrapper.appendChild(
      el('button', {
        style: { marginTop: '8px', background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
        onClick: () => setScreen('endless_result'),
      }, '🏳️ 그만두기'),
    );
    return wrapper;
  }

  // Normal wave clear
  wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } }, `웨이브 ${wave} 클리어!`));
  wrapper.appendChild(
    el('div', { style: { color: 'var(--muted)', marginBottom: '20px' } },
      `HP ${run.player.hp}/${run.player.maxHp} · 점수 ${calcEndlessScore(run)}`),
  );
  wrapper.appendChild(
    el('button', {
      onClick: () => startNextWave(),
    }, `웨이브 ${wave + 1} 시작`),
  );
  wrapper.appendChild(
    el('button', {
      style: { marginTop: '8px', background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
      onClick: () => setScreen('endless_result'),
    }, '🏳️ 그만두기'),
  );
  return wrapper;
}

export function renderEndlessResult(): HTMLElement {
  const run = getRunOrNull();
  const wave = run?.endless?.wave ?? 0;
  const score = run ? calcEndlessScore(run) : 0;

  const wrapper = el('div', { class: 'end-screen' });
  wrapper.appendChild(el('h1', { class: 'lose' }, '무한 던전 종료'));
  wrapper.appendChild(
    el('div', { style: { fontSize: '18px', color: 'var(--accent)', marginBottom: '8px' } },
      `🏆 최종 웨이브: ${wave}`),
  );
  wrapper.appendChild(
    el('div', { style: { fontSize: '22px', color: 'var(--good)', marginBottom: '20px' } },
      `점수: ${score}`),
  );

  // Nickname input + submit
  const inputRow = el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' } });
  const input = el('input', {
    type: 'text',
    placeholder: '닉네임 (최대 12자)',
    maxLength: 12,
    style: {
      background: 'var(--panel)', color: 'var(--fg)', border: '1px solid var(--accent)',
      borderRadius: '6px', padding: '8px 12px', fontSize: '14px', width: '160px',
    },
  }) as HTMLInputElement;

  let submitted = false;
  const statusEl = el('div', { style: { color: 'var(--muted)', fontSize: '13px', minHeight: '20px' } });

  const submitBtn = el('button', {
    style: { fontSize: '14px' },
    onClick: async () => {
      if (submitted) return;
      const nickname = input.value.trim() || '익명 모험가';
      submitted = true;
      statusEl.textContent = '제출 중...';
      try {
        const res = await fetch('/api/leaderboard/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname,
            score,
            wave,
            characterClass: run?.characterClass ?? 'swordmaster',
            title: getAchievementTitle()?.name ?? '',
          }),
        });
        if (res.ok) {
          statusEl.textContent = '✅ 등록 완료!';
          playSfx('upgrade');
        } else {
          statusEl.textContent = '❌ 등록 실패';
          submitted = false;
        }
      } catch {
        statusEl.textContent = '❌ 네트워크 오류';
        submitted = false;
      }
    },
  }, '점수 등록');

  inputRow.appendChild(input);
  inputRow.appendChild(submitBtn);
  wrapper.appendChild(inputRow);
  wrapper.appendChild(statusEl);

  wrapper.appendChild(
    el('button', {
      style: { marginTop: '12px' },
      onClick: () => setScreen('leaderboard'),
    }, '🏆 리더보드 보기'),
  );
  wrapper.appendChild(
    el('button', {
      style: { marginTop: '8px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
      onClick: () => endRun(),
    }, '제목 화면으로'),
  );
  return wrapper;
}

const CLASS_LABEL: Record<string, string> = {
  swordmaster: '검사', gunner: '사수', fighter: '격투가',
  magician: '마법사', priest: '성직자', thief: '도적',
};

export function renderLeaderboard(): HTMLElement {
  const wrapper = el('div', { class: 'end-screen' });
  wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } }, '🏆 리더보드'));

  const listEl = el('div', { style: { maxWidth: '500px', width: '100%' } });
  wrapper.appendChild(listEl);
  listEl.textContent = '로딩 중...';

  fetch('/api/leaderboard/top')
    .then((r) => r.json())
    .then((data: any) => {
      listEl.textContent = '';
      const entries: any[] = data.entries ?? [];
      if (entries.length === 0) {
        listEl.appendChild(el('div', { style: { color: 'var(--muted)' } }, '아직 기록이 없습니다.'));
        return;
      }
      const table = el('div', { class: 'leaderboard-table' });
      // Header
      table.appendChild(el('div', { class: 'lb-row lb-header' },
        el('span', { class: 'lb-rank' }, '#'),
        el('span', { class: 'lb-name' }, '닉네임'),
        el('span', { class: 'lb-class' }, '클래스'),
        el('span', { class: 'lb-wave' }, '웨이브'),
        el('span', { class: 'lb-score' }, '점수'),
      ));
      entries.forEach((e: any, i: number) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
        table.appendChild(el('div', { class: `lb-row ${i < 3 ? 'lb-top' : ''}` },
          el('span', { class: 'lb-rank' }, medal),
          el('span', { class: 'lb-name' }, e.title ? `${e.nickname} · ${e.title}` : e.nickname),
          el('span', { class: 'lb-class' }, CLASS_LABEL[e.characterClass] ?? e.characterClass),
          el('span', { class: 'lb-wave' }, `${e.wave}`),
          el('span', { class: 'lb-score' }, `${e.score}`),
        ));
      });
      listEl.appendChild(table);
    })
    .catch(() => {
      listEl.textContent = '리더보드를 불러올 수 없습니다.';
    });

  const run = getRunOrNull();
  wrapper.appendChild(
    el('button', {
      style: { marginTop: '20px' },
      onClick: () => run ? setScreen('endless_result') : setScreen('title'),
    }, '← 돌아가기'),
  );
  return wrapper;
}
