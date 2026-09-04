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
import { makeRng, pick, shuffle } from '../rng';
import { resetCombatUiState } from './combat-ui';
import { playSfx } from '../audio';
import { canUpgrade } from '../content/cards';
import { POTION_LIST } from '../content/potions';
import type { RunState } from '../types';

function saveEndlessBest(wave: number): void {
  try {
    const prev = parseInt(localStorage.getItem('dod_endless_best') ?? '0', 10) || 0;
    if (wave > prev) localStorage.setItem('dod_endless_best', String(wave));
  } catch { /* ignore */ }
}

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

  // Apply accumulated endless bonuses to player
  const bStr = run.endless.bonusStr ?? 0;
  const bDex = run.endless.bonusDex ?? 0;
  if (bStr > 0) applyStatus(cs.player, 'strength', bStr);
  if (bDex > 0) applyStatus(cs.player, 'dexterity', bDex);

  applyRelicCombatStart(run.player.relics, cs);

  setCombat(cs);
  setScreen('combat');
}

export function calcEndlessScore(run: any): number {
  const wave = run.endless?.wave ?? 0;
  const base = wave * 100 + run.player.hp + run.player.gold + run.player.relics.length * 25;
  const ascMult = 1 + (run.ascension ?? 0) * 0.1;
  return Math.floor(base * ascMult);
}

export function getAscensionMult(run: any): number {
  return 1 + (run.ascension ?? 0) * 0.1;
}

// ── Wave clear rewards ─────────────────────────────────────────

interface EndlessReward {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  apply: (r: RunState) => string;
}

function buildRewardPool(run: RunState): EndlessReward[] {
  const rewards: EndlessReward[] = [
    {
      id: 'str', label: '힘 강화', emoji: '⚔️',
      desc: '힘 +1 (영구)',
      apply: (r) => {
        r.endless!.bonusStr = (r.endless!.bonusStr ?? 0) + 1;
        return `⚔️ 힘 +1 (총 +${r.endless!.bonusStr})`;
      },
    },
    {
      id: 'dex', label: '민첩 강화', emoji: '🛡️',
      desc: '민첩 +1 (영구)',
      apply: (r) => {
        r.endless!.bonusDex = (r.endless!.bonusDex ?? 0) + 1;
        return `🛡️ 민첩 +1 (총 +${r.endless!.bonusDex})`;
      },
    },
    {
      id: 'max_hp', label: '생명력 강화', emoji: '❤️',
      desc: '최대 HP +8',
      apply: (r) => {
        r.player.maxHp += 8;
        r.player.hp = Math.min(r.player.maxHp, r.player.hp + 8);
        return `❤️ 최대 HP +8 (${r.player.hp}/${r.player.maxHp})`;
      },
    },
    {
      id: 'heal', label: '치유', emoji: '💚',
      desc: 'HP 30% 회복',
      apply: (r) => {
        const heal = Math.ceil(r.player.maxHp * 0.3);
        r.player.hp = Math.min(r.player.maxHp, r.player.hp + heal);
        return `💚 HP +${heal} 회복 (${r.player.hp}/${r.player.maxHp})`;
      },
    },
    {
      id: 'upgrade', label: '카드 강화', emoji: '✦',
      desc: '랜덤 카드 1장 강화',
      apply: (r) => {
        const fresh = r.player.deck.filter((c) => canUpgrade(c) && !c.upgraded);
        const plus = r.player.deck.filter((c) => canUpgrade(c) && c.upgraded === 1);
        const pool = fresh.length > 0 ? fresh : plus;
        if (pool.length > 0) {
          const rng2 = makeRng(r.seed * 71 + (r.endless?.wave ?? 0));
          const card = pick(rng2, pool);
          card.upgraded = (card.upgraded ?? 0) + 1;
          playSfx('upgrade');
          return '✦ 카드 강화 완료';
        }
        return '강화할 카드 없음';
      },
    },
    {
      id: 'gold', label: '골드', emoji: '💰',
      desc: '골드 +60',
      apply: (r) => {
        r.player.gold += 60;
        playSfx('gold');
        return `💰 골드 +60 (총 ${r.player.gold})`;
      },
    },
  ];

  if (run.player.potions.length < 3) {
    rewards.push({
      id: 'potion', label: '물약', emoji: '🧪',
      desc: '랜덤 물약 1개',
      apply: (r) => {
        if (r.player.potions.length >= 3) return '물약 슬롯이 가득 참';
        const rng2 = makeRng(r.seed * 83 + (r.endless?.wave ?? 0));
        const chosen = pick(rng2, POTION_LIST);
        r.player.potions.push(chosen.id);
        playSfx('potion');
        return `🧪 ${chosen.name} 획득`;
      },
    });
  }

  return rewards;
}

let pickedRewardWave = -1;

function hasReward(wave: number): boolean {
  return wave > 0 && wave % 5 === 0;
}

function pickRewards(run: RunState): EndlessReward[] {
  const wave = run.endless?.wave ?? 0;
  const isBossWave = wave % 10 === 0;
  const rng = makeRng(run.seed * 59 + wave * 43);
  const pool = buildRewardPool(run);
  return shuffle(rng, pool).slice(0, isBossWave ? 4 : 3);
}

// ── Render ──────────────────────────────────────────────────────

export function renderEndlessWaveClear(): HTMLElement {
  const run = getRunOrNull();
  if (!run?.endless) return el('div', {}, '오류');
  const wave = run.endless.wave;
  const isRest = wave > 1 && (wave - 1) % 5 === 0 && (wave - 1) % 10 !== 0;
  const alreadyPicked = pickedRewardWave === wave;

  const wrapper = el('div', { class: 'end-screen' });

  if (wave === 0) {
    // Entry point — first time
    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } }, '♾️ 무한 던전'));
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', maxWidth: '400px', textAlign: 'center', lineHeight: '1.7', marginBottom: '20px' } },
        '끝없는 적의 물결이 밀려옵니다. 얼마나 오래 버틸 수 있을까요? 웨이브가 올라갈수록 적이 강해지지만, 매 웨이브 보상으로 성장할 수 있습니다.'),
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

  // Normal / elite / boss wave clear
  const isBossWave = wave > 0 && wave % 10 === 0;
  const isEliteWave = !isBossWave && wave > 0 && wave % 5 === 0;
  const showReward = hasReward(wave);
  wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } },
    isBossWave ? `👑 웨이브 ${wave} 보스 처치!` : isEliteWave ? `⚔ 웨이브 ${wave} 엘리트 처치!` : `웨이브 ${wave} 클리어!`));

  // Buff summary
  const bStr = run.endless.bonusStr ?? 0;
  const bDex = run.endless.bonusDex ?? 0;
  const buffParts: string[] = [];
  if (bStr > 0) buffParts.push(`힘+${bStr}`);
  if (bDex > 0) buffParts.push(`민첩+${bDex}`);
  const buffText = buffParts.length > 0 ? ` · ${buffParts.join(' ')}` : '';

  wrapper.appendChild(
    el('div', { style: { color: 'var(--muted)', marginBottom: '16px' } },
      `HP ${run.player.hp}/${run.player.maxHp} · 점수 ${calcEndlessScore(run)}${buffText}`),
  );

  if (showReward && !alreadyPicked) {
    // Reward selection
    wrapper.appendChild(
      el('div', { style: { color: 'var(--accent)', marginBottom: '12px', fontSize: '14px' } },
        '⬇ 보상을 선택하세요'),
    );
    const rewards = pickRewards(run);
    const rewardRow = el('div', {
      style: {
        display: 'flex', gap: '10px', justifyContent: 'center',
        flexWrap: 'wrap', marginBottom: '16px',
      },
    });
    for (const reward of rewards) {
      const btn = el('button', {
        style: {
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '14px 18px', minWidth: '100px', gap: '6px',
          background: 'var(--panel)', border: '1px solid var(--border)',
          borderRadius: '10px', cursor: 'pointer',
          transition: 'border-color 0.15s, transform 0.15s',
        },
        onClick: () => {
          if (pickedRewardWave === wave) return;
          pickedRewardWave = wave;
          const resultMsg = reward.apply(run);
          // Rebuild to show result
          while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
          wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } },
            isBossWave ? `👑 웨이브 ${wave} 보스 처치!` : `웨이브 ${wave} 클리어!`));
          wrapper.appendChild(
            el('div', { style: { color: 'var(--good)', fontSize: '16px', marginBottom: '16px' } },
              resultMsg),
          );
          const bStr2 = run.endless!.bonusStr ?? 0;
          const bDex2 = run.endless!.bonusDex ?? 0;
          const bp: string[] = [];
          if (bStr2 > 0) bp.push(`힘+${bStr2}`);
          if (bDex2 > 0) bp.push(`민첩+${bDex2}`);
          const bt = bp.length > 0 ? ` · ${bp.join(' ')}` : '';
          wrapper.appendChild(
            el('div', { style: { color: 'var(--muted)', marginBottom: '20px' } },
              `HP ${run.player.hp}/${run.player.maxHp} · 점수 ${calcEndlessScore(run)}${bt}`),
          );
          wrapper.appendChild(
            el('button', { onClick: () => startNextWave() }, `웨이브 ${wave + 1} 시작`),
          );
          wrapper.appendChild(
            el('button', {
              style: { marginTop: '8px', background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
              onClick: () => setScreen('endless_result'),
            }, '🏳️ 그만두기'),
          );
        },
      },
        el('span', { style: { fontSize: '24px' } }, reward.emoji),
        el('span', { style: { fontWeight: 'bold', fontSize: '13px' } }, reward.label),
        el('span', { style: { fontSize: '12px', color: 'var(--muted)' } }, reward.desc),
      );
      // Hover effect
      btn.addEventListener('mouseenter', () => {
        (btn as HTMLElement).style.borderColor = 'var(--accent)';
        (btn as HTMLElement).style.transform = 'translateY(-2px)';
      });
      btn.addEventListener('mouseleave', () => {
        (btn as HTMLElement).style.borderColor = 'var(--border)';
        (btn as HTMLElement).style.transform = '';
      });
      rewardRow.appendChild(btn);
    }
    wrapper.appendChild(rewardRow);
  } else {
    // No reward (normal wave) or already picked — show continue
    wrapper.appendChild(
      el('button', { onClick: () => startNextWave() }, `웨이브 ${wave + 1} 시작`),
    );
    wrapper.appendChild(
      el('button', {
        style: { marginTop: '8px', background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
        onClick: () => setScreen('endless_result'),
      }, '🏳️ 그만두기'),
    );
  }

  return wrapper;
}

export function renderEndlessResult(): HTMLElement {
  const run = getRunOrNull();
  const wave = run?.endless?.wave ?? 0;
  const score = run ? calcEndlessScore(run) : 0;

  // Save best wave record
  saveEndlessBest(wave);

  const wrapper = el('div', { class: 'end-screen' });
  wrapper.appendChild(el('h1', { class: 'lose' }, '무한 던전 종료'));
  wrapper.appendChild(
    el('div', { style: { fontSize: '18px', color: 'var(--accent)', marginBottom: '8px' } },
      `🏆 최종 웨이브: ${wave}`),
  );
  const asc = run?.ascension ?? 0;
  const multEl = asc > 0
    ? el('div', { style: { fontSize: '13px', color: 'var(--accent)', marginBottom: '16px' } },
        `A${asc} 보너스 ×${(1 + asc * 0.1).toFixed(1)}`)
    : el('div');
  wrapper.appendChild(
    el('div', { style: { fontSize: '22px', color: 'var(--good)', marginBottom: '4px' } },
      `점수: ${score}`),
  );
  wrapper.appendChild(multEl);

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
            ascension: run?.ascension ?? 0,
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
  summoner: '정령술사',
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
        const ascLabel = e.ascension > 0 ? ` A${e.ascension}` : '';
        table.appendChild(el('div', { class: `lb-row ${i < 3 ? 'lb-top' : ''}` },
          el('span', { class: 'lb-rank' }, medal),
          el('span', { class: 'lb-name' }, e.title ? `${e.nickname} · ${e.title}` : e.nickname),
          el('span', { class: 'lb-class' }, `${CLASS_LABEL[e.characterClass] ?? e.characterClass}${ascLabel}`),
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
