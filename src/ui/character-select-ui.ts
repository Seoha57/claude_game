import { el } from './dom';
import { startNewRun, setScreen } from '../state';
import type { CharacterClass } from '../types';

interface CharacterInfo {
  id: CharacterClass;
  name: string;
  subname: string;
  hp: number;
  startRelic: string;
  signatureRelic: string;     // 캐릭터별 시그니처 메커니즘 유물
  signatureDesc: string;
  description: string;
  starterCards: string;
  emoji: string;
  difficulty: 1 | 2 | 3;     // 1=쉬움, 2=보통, 3=어려움
  diffLabel: string;
}

const CHARACTERS: CharacterInfo[] = [
  {
    id: 'swordmaster',
    name: '검사',
    subname: '(검술사 계열)',
    hp: 75,
    startRelic: '불타는 피',
    signatureRelic: '검혼',
    signatureDesc: '5번째 공격마다 +6 데미지',
    description: '전투 승리 시 HP 6 회복. 강력한 근접 검술로 적을 압도한다.',
    starterCards: '검격×5 · 가드×4 · 찌르기×1',
    emoji: '⚔️',
    difficulty: 1,
    diffLabel: '직관적인 공격 스타일, 입문용으로 추천',
  },
  {
    id: 'gunner',
    name: '사수',
    subname: '(저격·포격·기계·화약·돌격)',
    hp: 70,
    startRelic: '구슬 주머니',
    signatureRelic: '탄창',
    signatureDesc: '3번째 공격마다 +5 데미지, 카드 1장 드로우',
    description: '전투 시작 시 모든 적에게 취약 +1. 다양한 총기와 폭발물로 원거리를 지배한다.',
    starterCards: '속사×5 · 전술 재장전×4 · 정밀 사격×1',
    emoji: '🔫',
    difficulty: 2,
    diffLabel: '디버프와 콤보 시너지 활용이 핵심',
  },
  {
    id: 'fighter',
    name: '격투가',
    subname: '(타격·기공·유술·격투)',
    hp: 80,
    startRelic: '투혼',
    signatureRelic: '일심',
    signatureDesc: '한 턴 카드 3장 사용 시 힘 +1 (턴당 1회)',
    description: '전투 시작 시 힘 +2. 맨손과 기의 힘으로 적을 압도한다.',
    starterCards: '질풍 발차기×5 · 강철 방어×4 · 올려차기×1',
    emoji: '🥊',
    difficulty: 1,
    diffLabel: '높은 체력과 힘 버프로 안정적인 플레이',
  },
  {
    id: 'magician',
    name: '마법사',
    subname: '(원소·소환·전투마법·연금·부여)',
    hp: 65,
    startRelic: '마탑의 결정',
    signatureRelic: '원소 공명',
    signatureDesc: '방어 카드 사용 시 1장 드로우 (턴당 1회)',
    description: '매 턴 시작 시 무작위 적에게 3 데미지. 다양한 원소 마법으로 광역 전투에 강하다.',
    starterCards: '마력 화살×5 · 마력 방벽×4 · 차원 전환×1',
    emoji: '🔮',
    difficulty: 3,
    diffLabel: '낮은 체력, 카드 순서와 콤보 관리 필요',
  },
  {
    id: 'priest',
    name: '성직자',
    subname: '(성기사·권성·퇴마·복수)',
    hp: 78,
    startRelic: '성배',
    signatureRelic: '신성한 인장',
    signatureDesc: '회복/재생 발동 시 방어도 +2',
    description: '전투 시작 시 재생 +3. 회복과 콤보 타격, HP를 대가로 한 강타까지 다재다능한 성직자.',
    starterCards: '강타×5 · 신성 방어×4 · 행운의 일격×1',
    emoji: '⛪',
    difficulty: 1,
    diffLabel: '회복이 풍부해 실수를 만회하기 쉬움',
  },
  {
    id: 'thief',
    name: '도적',
    subname: '(암살·강령·인법·그림자)',
    hp: 68,
    startRelic: '매끈한 돌',
    signatureRelic: '독니',
    signatureDesc: '매 턴 첫 공격이 적에게 중독 +2',
    description: '전투 시작 시 민첩 +1. 중독과 다단히트, 그림자를 다루는 날렵한 암살자.',
    starterCards: '베기×5 · 뼈 방패×4 · 암흑의 혼×1',
    emoji: '🗡️',
    difficulty: 2,
    diffLabel: '중독과 민첩 활용, 덱 구성이 중요',
  },
  {
    id: 'summoner',
    name: '정령술사',
    subname: '(정령·영혼·소환·계약)',
    hp: 62,
    startRelic: '영혼의 등불',
    signatureRelic: '정령 계약서',
    signatureDesc: 'power 카드 사용 시 방어도 +3',
    description: '정령 소환과 영혼 마법으로 전투를 지배하는 정령술사. HP가 낮지만 다양한 power 스케일링이 강하다.',
    starterCards: '마력탄×5 · 보호막×4 · 대지 정령 소환×1',
    emoji: '👻',
    difficulty: 3,
    diffLabel: '최저 체력, 파워 카드 스케일링에 의존',
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
        el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' } }, `❤ ${ch.hp}  |  유물: ${ch.startRelic}`),
        el('div', {
          style: {
            fontSize: '11px',
            marginBottom: '8px',
            color: ch.difficulty === 1 ? 'var(--good)' : ch.difficulty === 2 ? 'var(--accent)' : 'var(--bad)',
          },
          title: ch.diffLabel,
        }, `${'★'.repeat(ch.difficulty)}${'☆'.repeat(3 - ch.difficulty)} ${ch.difficulty === 1 ? '쉬움' : ch.difficulty === 2 ? '보통' : '어려움'}`),
        el('div', { style: { fontSize: '12px', color: 'var(--fg)', marginBottom: '10px', lineHeight: '1.5' } }, ch.description),
        el(
          'div',
          {
            style: {
              fontSize: '11px',
              color: 'var(--accent)',
              marginBottom: '8px',
              padding: '6px 8px',
              background: 'rgba(212,160,91,0.10)',
              border: '1px solid rgba(212,160,91,0.35)',
              borderRadius: '6px',
              lineHeight: '1.4',
            },
          },
          `✦ ${ch.signatureRelic}: ${ch.signatureDesc}`,
        ),
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
            // startNewRun creates the run state; neow blessing screen lets
            // the player apply a bonus before the map appears.
            startNewRun(seed, ascension, selected, { goToScreen: 'neow_blessing' });
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
