import { el } from './dom';
import { endRun, getRun, getRunOrNull, setScreen, startNextChapter, makeCard } from '../state';
import { showChapterIntro } from './splash-overlay';
import { playSfx } from '../audio';
import { recordRelics } from '../codex';
import { unlockNextAscension, getUnlockedMax } from '../ascension';
import { BOSS_RELICS } from '../content/relics';
import { makeRng, shuffle } from '../rng';

export function renderChapterClear(): HTMLElement {
  const run = getRunOrNull();
  if (!run) return el('div', {}, '오류');

  const cleared = run.chapter;
  const next = cleared + 1;

  // Auto-heal 25% of max HP on entering this screen (once)
  if (!(run as any)._chapterHealApplied) {
    const heal = Math.ceil(run.player.maxHp * 0.25);
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + heal);
    (run as any)._chapterHealApplied = true;
  }

  // Pick 3 random boss relics not yet owned
  const rng = makeRng(run.seed * 31 + cleared * 77);
  const candidates = shuffle(rng, BOSS_RELICS.slice()).filter((r) => !run.player.relics.includes(r.id));
  const choices = candidates.slice(0, 3);
  recordRelics(choices.map((r) => r.id));

  // Track which chapters we've already claimed a boss relic for (explicit & robust)
  const pickedChapters: number[] = (run as any)._bossRelicPickedChapters ?? [];
  const alreadyConfirmed = pickedChapters.includes(cleared);

  // Tentative selection (not yet confirmed). Persists across rebuilds via run state.
  if (!(run as any)._tentativeBossRelicChapter || (run as any)._tentativeBossRelicChapter !== cleared) {
    (run as any)._tentativeBossRelicChapter = cleared;
    (run as any)._tentativeBossRelicId = null;
  }

  const wrapper = el('div', { class: 'end-screen' });
  const rebuild = () => { wrapper.innerHTML = ''; appendContent(); };

  const appendContent = () => {
    const healAmt = Math.ceil(run.player.maxHp * 0.25);
    const tentativeId: string | null = (run as any)._tentativeBossRelicId ?? null;
    const noChoices = choices.length === 0;
    const canConfirm = alreadyConfirmed || noChoices || tentativeId !== null;

    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)' } }, `챕터 ${cleared} 클리어!`));
    wrapper.appendChild(
      el('div', { style: { color: 'var(--good)', marginBottom: '4px' } }, `❤ HP +${healAmt} 회복 (현재 ${run.player.hp}/${run.player.maxHp})`),
    );
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' } },
        alreadyConfirmed ? '보스 유물 선택 완료' : '보스 유물 1개를 선택하세요'),
    );

    const relicRow = el('div', {
      style: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' },
    });

    for (const relic of choices) {
      const isTentative = tentativeId === relic.id;
      const isOwned = run.player.relics.includes(relic.id);
      const dimmed = alreadyConfirmed && !isOwned;
      const card = el(
        'div',
        {
          style: {
            border: `2px solid ${(isTentative || isOwned) ? 'var(--good)' : 'var(--accent)'}`,
            borderRadius: '12px',
            padding: '20px 18px',
            width: '180px',
            cursor: alreadyConfirmed ? 'default' : 'pointer',
            background: (isTentative || isOwned) ? 'rgba(128,192,96,0.12)' : 'var(--card-bg)',
            opacity: dimmed ? '0.4' : '1',
            transition: 'border-color 0.15s, opacity 0.15s, background 0.15s',
          },
          onClick: () => {
            if (alreadyConfirmed) return;
            (run as any)._tentativeBossRelicId = isTentative ? null : relic.id;
            rebuild();
          },
        },
        el('div', { style: { fontWeight: 'bold', marginBottom: '8px' } }, relic.name),
        el('div', { style: { fontSize: '12px', color: 'var(--muted)', lineHeight: '1.5' } }, relic.description),
        isOwned
          ? el('div', { style: { color: 'var(--good)', fontSize: '12px', marginTop: '8px' } }, '✓ 획득')
          : isTentative
          ? el('div', { style: { color: 'var(--good)', fontSize: '12px', marginTop: '8px' } }, '◉ 선택중')
          : el('div'),
      );
      relicRow.appendChild(card);
    }

    if (noChoices) {
      relicRow.appendChild(el('div', { style: { color: 'var(--muted)' } }, '보스 유물을 모두 보유 중입니다.'));
    }

    wrapper.appendChild(relicRow);

    wrapper.appendChild(
      el(
        'button',
        {
          disabled: !canConfirm ? true : undefined,
          onClick: () => {
            // Finalize tentative pick (if any) before moving on
            if (!alreadyConfirmed && tentativeId) {
              run.player.relics.push(tentativeId);
              applyBossRelicOnPickup(tentativeId);
              playSfx('relic');
              const list: number[] = (run as any)._bossRelicPickedChapters ?? [];
              list.push(cleared);
              (run as any)._bossRelicPickedChapters = list;
            }
            (run as any)._tentativeBossRelicId = null;
            (run as any)._tentativeBossRelicChapter = null;
            (run as any)._chapterHealApplied = false;
            startNextChapter();
            showChapterIntro(next);
          },
        },
        alreadyConfirmed ? `챕터 ${next} 시작` : (tentativeId ? `${next}챕터 시작 (확정)` : `챕터 ${next} 시작`),
      ),
    );
    wrapper.appendChild(
      el('button', { style: { marginTop: '8px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' }, onClick: () => endRun() }, '포기하고 나가기'),
    );
  };

  appendContent();
  return wrapper;

  function applyBossRelicOnPickup(id: string) {
    const r = getRun();
    switch (id) {
      case 'energy_core':
        r.player.maxEnergy += 1;
        r.player.maxHp = Math.max(1, r.player.maxHp - 6);
        r.player.hp = Math.min(r.player.hp, r.player.maxHp);
        break;
      case 'warriors_heart':
        r.player.maxHp += 20;
        r.player.hp = Math.min(r.player.maxHp, r.player.hp + 20);
        break;
      case 'doom_ring':
        r.player.maxEnergy += 1;
        r.player.deck.push(makeCard('wound'));
        r.player.deck.push(makeCard('wound'));
        break;
    }
  }
}

export function renderWin(): HTMLElement {
  const run = getRunOrNull();
  const prevMax = getUnlockedMax();
  const runAscension = run?.ascension ?? 0;
  const didUnlock = runAscension >= prevMax && prevMax < 10;
  if (didUnlock) unlockNextAscension();
  const newMax = getUnlockedMax();

  return el(
    'div',
    { class: 'end-screen' },
    el('h1', { class: 'win' }, '승리!'),
    el(
      'div',
      { style: { color: 'var(--muted)' } },
      run ? `최종 덱 ${run.player.deck.length}장 / 골드 ${run.player.gold}` : '',
    ),
    ...(didUnlock && newMax > 0
      ? [el('div', { style: { color: 'var(--good)', marginTop: '12px' } }, `🔓 등반 A${newMax} 해금!`)]
      : []),
    ...(runAscension >= 10
      ? [el('div', { style: { color: 'var(--accent)', marginTop: '8px' } }, '최고 난이도 클리어! 진정한 승리!')]
      : []),
    el('button', { onClick: () => endRun() }, '제목 화면으로'),
  );
}

export function renderTrueEndingChoice(): HTMLElement {
  const run = getRunOrNull();
  if (!run) return el('div', {}, '오류');

  return el(
    'div',
    { class: 'end-screen' },
    el('h1', { style: { color: 'var(--accent)' } }, '균열이 열린다...'),
    el(
      'div',
      { style: { color: 'var(--muted)', maxWidth: '480px', textAlign: 'center', lineHeight: '1.7' } },
      '공허의 심장을 쓰러뜨리자, 모아둔 세 개의 열쇠가 빛을 발한다. 더 깊은 차원의 문이 열렸다. 그 너머에는 진정한 적이 기다리고 있다.',
    ),
    el(
      'div',
      { style: { display: 'flex', gap: '16px', marginTop: '20px' } },
      el(
        'button',
        {
          style: { background: 'var(--accent-2)', color: 'white', fontSize: '15px' },
          onClick: () => {
            // Heal 30% before entering chapter 4
            const heal = Math.ceil(run.player.maxHp * 0.30);
            run.player.hp = Math.min(run.player.maxHp, run.player.hp + heal);
            startNextChapter();
            showChapterIntro(4);
          },
        },
        '🌀 차원의 문으로 (진엔딩 도전)',
      ),
      el(
        'button',
        {
          style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
          onClick: () => setScreen('win'),
        },
        '여기서 멈춘다 (일반 엔딩)',
      ),
    ),
    el(
      'div',
      { style: { color: 'var(--muted)', fontSize: '12px', marginTop: '20px' } },
      `🗝️ ${run.player.keys.length}/3 획득`,
    ),
  );
}

export function renderTrueWin(): HTMLElement {
  const run = getRunOrNull();
  const prevMax = getUnlockedMax();
  const runAscension = run?.ascension ?? 0;
  const didUnlock = runAscension >= prevMax && prevMax < 10;
  if (didUnlock) unlockNextAscension();
  const newMax = getUnlockedMax();

  return el(
    'div',
    { class: 'end-screen' },
    el('h1', { class: 'win', style: { color: 'var(--accent)', textShadow: '0 0 20px var(--accent)' } }, '✨ 진엔딩 ✨'),
    el(
      'div',
      { style: { color: 'var(--accent)', fontSize: '15px', maxWidth: '500px', textAlign: 'center', lineHeight: '1.8' } },
      '차원의 지배자를 쓰러뜨렸다. 모든 균열이 닫히고, 세상은 평화를 되찾았다. 진정한 영웅으로서 그대의 이름이 영원히 기록될 것이다.',
    ),
    el(
      'div',
      { style: { color: 'var(--muted)', marginTop: '20px' } },
      run ? `최종 덱 ${run.player.deck.length}장 / 골드 ${run.player.gold}` : '',
    ),
    ...(didUnlock && newMax > 0
      ? [el('div', { style: { color: 'var(--good)', marginTop: '12px' } }, `🔓 등반 A${newMax} 해금!`)]
      : []),
    el('button', { style: { marginTop: '20px' }, onClick: () => endRun() }, '제목 화면으로'),
  );
}

export function renderLose(): HTMLElement {
  const run = getRunOrNull();
  return el(
    'div',
    { class: 'end-screen' },
    el('h1', { class: 'lose' }, '패배...'),
    el(
      'div',
      { style: { color: 'var(--muted)' } },
      run ? `${run.floor}층까지 도달` : '',
    ),
    el('button', { onClick: () => endRun() }, '제목 화면으로'),
  );
}
