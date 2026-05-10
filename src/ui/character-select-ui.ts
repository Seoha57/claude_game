import { el } from './dom';
import { startNewRun, setScreen } from '../state';
import { showChapterIntro } from './splash-overlay';
import type { CharacterClass } from '../types';

interface CharacterInfo {
  id: CharacterClass;
  name: string;
  subname: string;
  hp: number;
  startRelic: string;
  description: string;
  starterCards: string;
  emoji: string;
}

const CHARACTERS: CharacterInfo[] = [
  {
    id: 'swordmaster',
    name: '귀검사',
    subname: '(웨펀마스터 계열)',
    hp: 75,
    startRelic: '불타는 피',
    description: '전투 승리 시 HP 6 회복. 강력한 근접 검술로 적을 압도한다.',
    starterCards: '귀참×5 · 발도×4 · 에쉔포크×1',
    emoji: '⚔️',
  },
  {
    id: 'gunner',
    name: '거너',
    subname: '(레인저·런처·메카닉·스핏파이어·어썰트)',
    hp: 70,
    startRelic: '구슬 주머니',
    description: '전투 시작 시 모든 적에게 취약 +1. 다양한 총기와 폭발물로 원거리를 지배한다.',
    starterCards: '라이징 샷×5 · 전술 재장전×4 · 헤드샷×1',
    emoji: '🔫',
  },
  {
    id: 'fighter',
    name: '격투가',
    subname: '(스트리트파이터·넨마스터·그래플러·스트라이커)',
    hp: 80,
    startRelic: '투혼',
    description: '전투 시작 시 힘 +2. 맨손과 기의 힘으로 적을 압도한다.',
    starterCards: '질풍각×5 · 철금강×4 · 무즈 어퍼×1',
    emoji: '🥊',
  },
  {
    id: 'magician',
    name: '마법사',
    subname: '(엘레멘탈마스터·소환사·배틀메이지·마도학자·인챈트리스)',
    hp: 65,
    startRelic: '마탑의 결정',
    description: '매 턴 시작 시 무작위 적에게 3 데미지. 다양한 원소 마법으로 광역 전투에 강하다.',
    starterCards: '매직 미사일×5 · 오라 실드×4 · 위상변화×1',
    emoji: '🔮',
  },
];

export function renderCharacterSelect(seed: number, ascension: number): HTMLElement {
  let selected: CharacterClass = 'swordmaster';

  const wrapper = el('div', { class: 'character-select-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    append();
  };

  const append = () => {
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)', marginBottom: '4px' } }, '캐릭터 선택'));
    wrapper.appendChild(el('div', { style: { color: 'var(--muted)', marginBottom: '24px', fontSize: '13px' } }, '플레이할 직업을 선택하세요'));

    const cardRow = el('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' } });

    for (const ch of CHARACTERS) {
      const isSelected = selected === ch.id;
      const card = el(
        'div',
        {
          'data-char-card': '1',
          style: {
            border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '12px',
            padding: '20px',
            width: '220px',
            cursor: 'pointer',
            background: isSelected ? 'rgba(212,180,100,0.10)' : 'var(--card-bg)',
            boxShadow: isSelected ? '0 0 18px rgba(212,160,91,0.45)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
            position: 'relative',
            WebkitTapHighlightColor: 'rgba(212,160,91,0.3)',
          },
          onClick: () => { selected = ch.id; rebuild(); },
        },
        isSelected ? el('div', {
          style: {
            position: 'absolute', top: '8px', right: '10px',
            color: 'var(--accent)', fontSize: '13px', fontWeight: 'bold',
          },
        }, '✓ 선택됨') : el('div'),
        el('div', { style: { fontSize: '36px', marginBottom: '8px' } }, ch.emoji),
        el('div', { style: { fontWeight: 'bold', fontSize: '18px', marginBottom: '2px' } }, ch.name),
        el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '12px' } }, ch.subname),
        el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '8px' } }, `❤ ${ch.hp}  |  유물: ${ch.startRelic}`),
        el('div', { style: { fontSize: '12px', color: 'var(--fg)', marginBottom: '10px', lineHeight: '1.5' } }, ch.description),
        el('div', { style: { fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '8px' } }, `시작 덱: ${ch.starterCards}`),
      );
      cardRow.appendChild(card);
    }

    wrapper.appendChild(cardRow);

    wrapper.appendChild(
      el(
        'button',
        {
          onClick: () => {
            startNewRun(seed, ascension, selected);
            showChapterIntro(1);
          },
        },
        `${CHARACTERS.find((c) => c.id === selected)?.name ?? ''} 시작`,
      ),
    );

    wrapper.appendChild(
      el(
        'button',
        {
          style: { marginTop: '8px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
          onClick: () => setScreen('title'),
        },
        '← 뒤로',
      ),
    );
  };

  append();
  return wrapper;
}
