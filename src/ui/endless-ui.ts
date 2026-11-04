import { el } from './dom';
import { ic, CHARACTER_SVG, artEl } from './art';
import { getRun, getRunOrNull, setScreen, setCombat, endRun } from '../state';
import { getAchievementTitle } from '../achievements';
import { getSelectedTitle } from '../titles';
import { startCombat } from '../combat/combat';
import {
  isEndlessRestWave, applyEndlessRest, endlessEncounterIds, endlessCombatSeed,
  applyEndlessScaling, endlessHpMult, endlessStrBonus, calcEndlessScore,
  hasEndlessReward, endlessRewardChoices, applyEndlessReward,
} from '../run/rules';
import type { EndlessRewardId } from '../run/rules';
import { resetCombatUiState } from './combat-ui';
import { playSfx } from '../audio';
import type { SfxName } from '../audio';
import { POTION_DEFS } from '../content/potions';
import { shareRun } from './share-run';
import type { RunState } from '../types';
import { t } from '../i18n';

const LB_NICK_KEY = 'dod_lb_nickname';

function saveEndlessBest(wave: number): void {
  try {
    const prev = parseInt(localStorage.getItem('dod_endless_best') ?? '0', 10) || 0;
    if (wave > prev) localStorage.setItem('dod_endless_best', String(wave));
  } catch { /* ignore */ }
}

function nextWaveLabel(nextWave: number): string {
  if (nextWave % 10 === 0) return t('보스');
  if (nextWave % 5 === 0) return t('엘리트');
  return t('일반');
}

function waveScalingText(wave: number): string {
  const strBonus = endlessStrBonus(wave);
  const parts: string[] = [`HP ×${endlessHpMult(wave).toFixed(1)}`];
  if (strBonus > 0) parts.push(`${t('힘')}+${strBonus}`);
  return parts.join(' · ');
}

export function startNextWave(): void {
  const run = getRun();
  if (!run.endless) return;
  run.endless.wave += 1;
  const wave = run.endless.wave;

  if (isEndlessRestWave(wave)) {
    run.endless.lastHeal = applyEndlessRest(run);
    setScreen('endless_wave_clear');
    return;
  }

  resetCombatUiState();
  const cs = startCombat(run.player, endlessEncounterIds(run, wave), endlessCombatSeed(run, wave));
  applyEndlessScaling(run, cs, wave);
  setCombat(cs);
  setScreen('combat');
}

export { calcEndlessScore };

// ── Wave clear rewards ─────────────────────────────────────────

const REWARD_LABELS: Record<EndlessRewardId, { icon: string; label: () => string; desc: () => string }> = {
  str: { icon: 'sword', label: () => t('힘 강화'), desc: () => t('힘 +1 (영구)') },
  dex: { icon: 'shield', label: () => t('민첩 강화'), desc: () => t('민첩 +1 (영구)') },
  heal: { icon: 'heart', label: () => t('치유'), desc: () => t('HP 30% 회복') },
  upgrade: { icon: 'star', label: () => t('카드 강화'), desc: () => t('랜덤 카드 1장 강화') },
  maxhp: { icon: 'heart', label: () => t('최대 HP'), desc: () => t('최대 HP +8, 즉시 회복') },
  potion: { icon: 'potion_small', label: () => t('물약'), desc: () => t('랜덤 물약 1개') },
};

/** 보상을 적용하고 화면에 띄울 문구를 만든다. */
function applyRewardForUi(run: RunState, id: EndlessRewardId): string {
  const r = applyEndlessReward(run, id);
  if (r.sfx) playSfx(r.sfx as SfxName);
  switch (r.id) {
    case 'str': return `${ic('sword')} ${t('힘')} +1 (${t('총')} +${r.amount})`;
    case 'dex': return `${ic('shield')} ${t('민첩')} +1 (${t('총')} +${r.amount})`;
    case 'heal': return `${ic('heart')} HP +${r.amount} ${t('회복')} (${run.player.hp}/${run.player.maxHp})`;
    case 'maxhp': return `${ic('heart')} ${t('최대 HP')} +${r.amount} (${run.player.hp}/${run.player.maxHp})`;
    case 'upgrade': return r.noop ? t('강화할 카드 없음') : `${ic('star')} ${t('카드 강화 완료')}`;
    case 'potion': return r.noop
      ? t('물약 슬롯이 가득 참')
      : `${ic('potion_small')} ${POTION_DEFS[r.potionId!].name} ${t('획득')}`;
  }
}

let pickedRewardWave = -1;

// ── Render ──────────────────────────────────────────────────────

export function renderEndlessWaveClear(): HTMLElement {
  const run = getRunOrNull();
  if (!run?.endless) return el('div', {}, t('오류'));
  const wave = run.endless.wave;
  const isRest = wave > 1 && (wave - 1) % 5 === 0 && (wave - 1) % 10 !== 0;
  const alreadyPicked = pickedRewardWave === wave;

  const wrapper = el('div', { class: 'end-screen' });

  if (wave === 0) {
    // Entry point — first time
    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } }, t('무한 던전')));
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', maxWidth: '400px', textAlign: 'center', lineHeight: '1.7', marginBottom: '20px' } },
        t('끝없는 적의 물결이 밀려옵니다. 얼마나 오래 버틸 수 있을까요? 웨이브가 올라갈수록 적이 강해지지만, 매 웨이브 보상으로 성장할 수 있습니다.')),
    );
    const startBtn = el('button', {
      style: { fontSize: '16px' },
      onClick: () => startNextWave(),
    });
    startBtn.innerHTML = `${ic('sword')} ${t('웨이브')} 1 ${t('시작')}`;
    wrapper.appendChild(startBtn);
    return wrapper;
  }

  if (isRest) {
    const heal = run.endless.lastHeal ?? Math.ceil(run.player.maxHp * 0.3);
    const restH = el('h1', { style: { color: 'var(--good)' } });
    restH.innerHTML = `${ic('fire')} ${t('휴식')}`;
    wrapper.appendChild(restH);
    const healEl = el('div', { style: { color: 'var(--good)', marginBottom: '8px' } });
    healEl.innerHTML = `${ic('heart')} HP +${heal} ${t('회복')} (${run.player.hp}/${run.player.maxHp})`;
    wrapper.appendChild(healEl);
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', marginBottom: '20px' } },
        `${t('웨이브')} ${wave} ${t('완료')} · ${t('점수')} ${calcEndlessScore(run)}`),
    );
    const nextW = wave + 1;
    const nextType = nextWaveLabel(nextW);
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '8px' } },
        `${t('다음')}: ${nextType} · ${waveScalingText(nextW)}`),
    );
    wrapper.appendChild(
      el('button', {
        onClick: () => startNextWave(),
      }, `${t('웨이브')} ${nextW} ${t('시작')} (${nextType})`),
    );
    wrapper.appendChild(
      el('button', {
        style: { marginTop: '8px', background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
        onClick: () => setScreen('endless_result'),
      }, t('그만두기')),
    );
    return wrapper;
  }

  // Normal / elite / boss wave clear
  const isBossWave = wave > 0 && wave % 10 === 0;
  const isEliteWave = !isBossWave && wave > 0 && wave % 5 === 0;
  const showReward = hasEndlessReward(wave);
  const waveH = el('h1', { style: { color: 'var(--accent)' } });
  waveH.innerHTML = isBossWave ? `${ic('crown')} ${t('웨이브')} ${wave} ${t('보스 처치!')}` : isEliteWave ? `${ic('sword')} ${t('웨이브')} ${wave} ${t('엘리트 처치!')}` : `${t('웨이브')} ${wave} ${t('클리어!')}`;
  wrapper.appendChild(waveH);

  // Buff summary
  const bStr = run.endless.bonusStr ?? 0;
  const bDex = run.endless.bonusDex ?? 0;
  const buffParts: string[] = [];
  if (bStr > 0) buffParts.push(`${t('힘')}+${bStr}`);
  if (bDex > 0) buffParts.push(`${t('민첩')}+${bDex}`);
  const buffText = buffParts.length > 0 ? ` · ${buffParts.join(' ')}` : '';

  wrapper.appendChild(
    el('div', { style: { color: 'var(--muted)', marginBottom: '16px' } },
      `HP ${run.player.hp}/${run.player.maxHp} · ${t('점수')} ${calcEndlessScore(run)}${buffText}`),
  );

  if (showReward && !alreadyPicked) {
    // Reward selection
    wrapper.appendChild(
      el('div', { style: { color: 'var(--accent)', marginBottom: '12px', fontSize: '14px' } },
        t('⬇ 보상을 선택하세요')),
    );
    const rewards = endlessRewardChoices(run);
    const rewardRow = el('div', {
      style: {
        display: 'flex', gap: '10px', justifyContent: 'center',
        flexWrap: 'wrap', marginBottom: '16px',
      },
    });
    for (const rewardId of rewards) {
      const meta = REWARD_LABELS[rewardId];
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
          const resultMsg = applyRewardForUi(run, rewardId);
          // Rebuild to show result
          while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
          const rh = el('h1', { style: { color: 'var(--accent)' } });
          rh.innerHTML = isBossWave ? `${ic('crown')} ${t('웨이브')} ${wave} ${t('보스 처치!')}` : `${t('웨이브')} ${wave} ${t('클리어!')}`;
          wrapper.appendChild(rh);
          const rm = el('div', { style: { color: 'var(--good)', fontSize: '16px', marginBottom: '16px' } });
          rm.innerHTML = resultMsg;
          wrapper.appendChild(rm);
          const bStr2 = run.endless!.bonusStr ?? 0;
          const bDex2 = run.endless!.bonusDex ?? 0;
          const bp: string[] = [];
          if (bStr2 > 0) bp.push(`${t('힘')}+${bStr2}`);
          if (bDex2 > 0) bp.push(`${t('민첩')}+${bDex2}`);
          const bt = bp.length > 0 ? ` · ${bp.join(' ')}` : '';
          wrapper.appendChild(
            el('div', { style: { color: 'var(--muted)', marginBottom: '20px' } },
              `HP ${run.player.hp}/${run.player.maxHp} · ${t('점수')} ${calcEndlessScore(run)}${bt}`),
          );
          const nw = wave + 1;
          const nt = nextWaveLabel(nw);
          wrapper.appendChild(
            el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '8px' } },
              `${t('다음')}: ${nt} · ${waveScalingText(nw)}`),
          );
          wrapper.appendChild(
            el('button', { onClick: () => startNextWave() }, `${t('웨이브')} ${nw} ${t('시작')} (${nt})`),
          );
          wrapper.appendChild(
            el('button', {
              style: { marginTop: '8px', background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
              onClick: () => setScreen('endless_result'),
            }, t('그만두기')),
          );
        },
      },
        (() => { const s = el('span', { style: { fontSize: '24px' } }); s.innerHTML = ic(meta.icon); return s; })(),
        el('span', { style: { fontWeight: 'bold', fontSize: '13px' } }, meta.label()),
        el('span', { style: { fontSize: '12px', color: 'var(--muted)' } }, meta.desc()),
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
    const nwNo = wave + 1;
    const ntNo = nextWaveLabel(nwNo);
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '8px' } },
        `${t('다음')}: ${ntNo} · ${waveScalingText(nwNo)}`),
    );
    wrapper.appendChild(
      el('button', { onClick: () => startNextWave() }, `${t('웨이브')} ${nwNo} ${t('시작')} (${ntNo})`),
    );
    wrapper.appendChild(
      el('button', {
        style: { marginTop: '8px', background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
        onClick: () => setScreen('endless_result'),
      }, t('그만두기')),
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
  wrapper.appendChild(el('h1', { class: 'lose' }, t('무한 던전 종료')));
  const finalWave = el('div', { style: { fontSize: '18px', color: 'var(--accent)', marginBottom: '8px' } });
  finalWave.innerHTML = `${ic('trophy')} ${t('최종 웨이브')}: ${wave}`;
  wrapper.appendChild(finalWave);
  const asc = run?.ascension ?? 0;
  const multEl = asc > 0
    ? el('div', { style: { fontSize: '13px', color: 'var(--accent)', marginBottom: '16px' } },
        `A${asc} 보너스 ×${(1 + asc * 0.1).toFixed(1)}`)
    : el('div');
  wrapper.appendChild(
    el('div', { style: { fontSize: '22px', color: 'var(--good)', marginBottom: '4px' } },
      `${t('점수')}: ${score}`),
  );
  wrapper.appendChild(multEl);

  // Nickname input + submit
  const savedNick = (() => { try { return localStorage.getItem(LB_NICK_KEY) ?? ''; } catch { return ''; } })();
  const inputRow = el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' } });
  const input = el('input', {
    type: 'text',
    placeholder: t('닉네임 (최대 12자)'),
    maxLength: 12,
    value: savedNick,
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
      const nickname = input.value.trim() || t('익명 모험가');
      try { localStorage.setItem(LB_NICK_KEY, input.value.trim()); } catch { /* */ }
      submitted = true;
      statusEl.textContent = t('제출 중...');
      try {
        const res = await fetch('/api/leaderboard/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname,
            score,
            wave,
            characterClass: run?.characterClass ?? 'swordmaster',
            title: getSelectedTitle()?.name ?? getAchievementTitle()?.name ?? '',
            ascension: run?.ascension ?? 0,
          }),
        });
        if (res.ok) {
          const data = await res.json() as { rank?: number };
          lastSubmitNickname = nickname;
          if (data.rank) {
            statusEl.textContent = `${t('등록 완료!')} #${data.rank}`;
          } else {
            statusEl.textContent = t('등록 완료!');
          }
          playSfx('upgrade');
        } else {
          statusEl.textContent = t('등록 실패');
          submitted = false;
        }
      } catch {
        statusEl.textContent = t('네트워크 오류');
        submitted = false;
      }
    },
  }, t('점수 등록'));

  inputRow.appendChild(input);
  inputRow.appendChild(submitBtn);
  wrapper.appendChild(inputRow);
  wrapper.appendChild(statusEl);

  if (run) {
    wrapper.appendChild(el('button', {
      style: { background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '13px', padding: '8px 16px', marginTop: '12px' },
      onClick: () => shareRun(run, false),
    }, t('결과 공유')));
  }

  const lbBtn = el('button', {
    style: { marginTop: '12px' },
    onClick: () => setScreen('leaderboard'),
  });
  lbBtn.innerHTML = `${ic('trophy')} ${t('리더보드 보기')}`;
  wrapper.appendChild(lbBtn);
  wrapper.appendChild(
    el('button', {
      style: { marginTop: '8px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
      onClick: () => endRun(),
    }, t('제목 화면으로')),
  );
  return wrapper;
}

let lastSubmitNickname = '';

const MEDAL = ['🥇', '🥈', '🥉'];

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return t('방금');
  if (diff < 3600) return `${Math.floor(diff / 60)}${t('분')} ${t('전')}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}${t('시간')} ${t('전')}`;
  return `${Math.floor(diff / 86400)}${t('일')} ${t('전')}`;
}

export function renderLeaderboard(): HTMLElement {
  const wrapper = el('div', { class: 'end-screen' });
  const lbTitle = el('h1', { style: { color: 'var(--accent)' } });
  lbTitle.innerHTML = `${ic('trophy')} ${t('리더보드')}`;
  wrapper.appendChild(lbTitle);

  const listEl = el('div', { class: 'lb-container' });
  wrapper.appendChild(listEl);
  listEl.textContent = t('로딩 중...');

  fetch('/api/leaderboard/top')
    .then((r) => r.json())
    .then((data: any) => {
      listEl.textContent = '';
      const entries: any[] = data.entries ?? [];
      if (entries.length === 0) {
        listEl.appendChild(el('div', { style: { color: 'var(--muted)', textAlign: 'center', padding: '24px' } }, t('아직 기록이 없습니다.')));
        return;
      }

      // Top 3 podium
      if (entries.length >= 3) {
        const podium = el('div', { class: 'lb-podium' });
        const order = [1, 0, 2];
        for (const idx of order) {
          const e = entries[idx];
          const card = el('div', { class: `lb-podium-card lb-podium-${idx + 1}` });
          card.appendChild(el('div', { class: 'lb-podium-medal' }, MEDAL[idx]));
          const charIcon = artEl(CHARACTER_SVG[e.characterClass], 28);
          charIcon.classList.add('lb-podium-char');
          card.appendChild(charIcon);
          card.appendChild(el('div', { class: 'lb-podium-name' }, e.nickname));
          if (e.title) {
            card.appendChild(el('div', { class: 'lb-podium-title' }, e.title));
          }
          card.appendChild(el('div', { class: 'lb-podium-score' }, `${e.score}`));
          const meta = `W${e.wave}${e.ascension > 0 ? ` · A${e.ascension}` : ''}`;
          card.appendChild(el('div', { class: 'lb-podium-meta' }, meta));
          if (e.timestamp) {
            card.appendChild(el('div', { class: 'lb-podium-time' }, relativeTime(e.timestamp)));
          }
          if (lastSubmitNickname && e.nickname === lastSubmitNickname) {
            card.classList.add('lb-me');
          }
          podium.appendChild(card);
        }
        listEl.appendChild(podium);
      }

      // Table for all entries (or 4+ if podium shown)
      const startIdx = entries.length >= 3 ? 3 : 0;
      if (startIdx < entries.length || entries.length < 3) {
        const table = el('div', { class: 'leaderboard-table' });
        if (entries.length < 3) {
          table.appendChild(el('div', { class: 'lb-row lb-header' },
            el('span', { class: 'lb-rank' }, '#'),
            el('span', { class: 'lb-name' }, t('닉네임')),
            el('span', { class: 'lb-class' }),
            el('span', { class: 'lb-wave' }, t('웨이브')),
            el('span', { class: 'lb-score' }, t('점수')),
          ));
        }
        const tableStart = entries.length < 3 ? 0 : startIdx;
        for (let i = tableStart; i < entries.length; i++) {
          const e = entries[i];
          const isMe = lastSubmitNickname && e.nickname === lastSubmitNickname;
          const rowCls = `lb-row${i < 3 ? ' lb-top' : ''}${isMe ? ' lb-me' : ''}`;
          const rankText = i < 3 ? MEDAL[i] : `${i + 1}`;
          const ascLabel = e.ascension > 0 ? ` A${e.ascension}` : '';
          const classCell = el('span', { class: 'lb-class' });
          classCell.appendChild(artEl(CHARACTER_SVG[e.characterClass], 16));
          const nameCell = el('span', { class: 'lb-name' });
          nameCell.textContent = e.title ? `${e.nickname} · ${e.title}` : e.nickname;
          if (e.timestamp) {
            nameCell.appendChild(el('span', { class: 'lb-time' }, relativeTime(e.timestamp)));
          }
          const row = el('div', { class: rowCls },
            el('span', { class: 'lb-rank' }, rankText),
            nameCell,
            classCell,
            el('span', { class: 'lb-wave' }, `W${e.wave}${ascLabel}`),
            el('span', { class: 'lb-score' }, `${e.score}`),
          );
          table.appendChild(row);
        }
        listEl.appendChild(table);
      }

      const countEl = el('div', { class: 'lb-count' }, `${entries.length} ${t('판')}`);
      listEl.appendChild(countEl);
    })
    .catch(() => {
      listEl.textContent = t('리더보드를 불러올 수 없습니다.');
    });

  const run = getRunOrNull();
  wrapper.appendChild(
    el('button', {
      style: { marginTop: '20px' },
      onClick: () => run ? setScreen('endless_result') : setScreen('title'),
    }, t('← 돌아가기')),
  );
  return wrapper;
}
