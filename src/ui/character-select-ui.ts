import { el } from './dom';
import { startNewRun, setScreen } from '../state';
import type { CharacterClass } from '../types';
import { CHARACTER_SVG, CARD_TYPE_SVG, ic } from './art';

interface CharacterInfo {
  id: CharacterClass;
  name: string;
  subname: string;
  hp: number;
  startRelic: string;
  signatureRelic: string;
  signatureDesc: string;
  description: string;
  starterCards: { name: string; type: 'attack' | 'skill' | 'power'; count: number }[];
  emoji: string;
  difficulty: 1 | 2 | 3;
  diffLabel: string;
  color: string;
  playstyle: string;
}

const CHARACTERS: CharacterInfo[] = [
  {
    id: 'swordmaster',
    name: '검사',
    subname: '검술사 계열',
    hp: 75,
    startRelic: '불타는 피',
    signatureRelic: '검혼',
    signatureDesc: '5번째 공격마다 +6 데미지',
    description: '전투 승리 시 HP 6 회복. 강력한 근접 검술로 적을 압도한다.',
    starterCards: [
      { name: '검격', type: 'attack', count: 5 },
      { name: '가드', type: 'skill', count: 4 },
      { name: '찌르기', type: 'attack', count: 1 },
    ],
    emoji: '⚔️',
    difficulty: 1,
    diffLabel: '직관적인 공격 스타일, 입문용으로 추천',
    color: '#e85040',
    playstyle: '근접 공격형',
  },
  {
    id: 'gunner',
    name: '총잡이',
    subname: '저격·포격·기계·화약·돌격',
    hp: 70,
    startRelic: '구슬 주머니',
    signatureRelic: '탄창',
    signatureDesc: '3번째 공격마다 +5 데미지, 카드 1장 드로우',
    description: '전투 시작 시 모든 적에게 취약 +1. 다양한 총기와 폭발물로 원거리를 지배한다.',
    starterCards: [
      { name: '속사', type: 'attack', count: 5 },
      { name: '긴급 회피', type: 'skill', count: 4 },
      { name: '산탄', type: 'attack', count: 1 },
    ],
    emoji: '🔫',
    difficulty: 2,
    diffLabel: '디버프와 콤보 시너지 활용이 핵심',
    color: '#5090d0',
    playstyle: '디버프 콤보형',
  },
  {
    id: 'fighter',
    name: '격투가',
    subname: '타격·기공·유술·격투',
    hp: 80,
    startRelic: '투혼',
    signatureRelic: '일심',
    signatureDesc: '한 턴 카드 3장 사용 시 힘 +1 (턴당 1회)',
    description: '전투 시작 시 힘 +2. 맨손과 기의 힘으로 적을 압도한다.',
    starterCards: [
      { name: '속공각', type: 'attack', count: 5 },
      { name: '강철 방어', type: 'skill', count: 4 },
      { name: '승천각', type: 'attack', count: 1 },
    ],
    emoji: '🥊',
    difficulty: 1,
    diffLabel: '높은 체력과 힘 버프로 안정적인 플레이',
    color: '#e0a030',
    playstyle: '힘 스케일링형',
  },
  {
    id: 'magician',
    name: '마법사',
    subname: '원소·소환·전투마법·연금·부여',
    hp: 65,
    startRelic: '마탑의 결정',
    signatureRelic: '원소 공명',
    signatureDesc: '방어 카드 사용 시 1장 드로우 (턴당 1회)',
    description: '매 턴 시작 시 무작위 적에게 3 데미지. 다양한 원소 마법으로 광역 전투에 강하다.',
    starterCards: [
      { name: '마력 화살', type: 'attack', count: 5 },
      { name: '마력 방벽', type: 'skill', count: 4 },
      { name: '차원 전환', type: 'skill', count: 1 },
    ],
    emoji: '🔮',
    difficulty: 3,
    diffLabel: '낮은 체력, 카드 순서와 콤보 관리 필요',
    color: '#a060e0',
    playstyle: '광역 마법형',
  },
  {
    id: 'priest',
    name: '성직자',
    subname: '성기사·권성·퇴마·복수',
    hp: 78,
    startRelic: '성배',
    signatureRelic: '신성한 인장',
    signatureDesc: '회복/재생 발동 시 방어도 +2',
    description: '전투 시작 시 재생 +3. 회복과 콤보 타격, HP를 대가로 한 강타까지 다재다능한 성직자.',
    starterCards: [
      { name: '강타', type: 'attack', count: 5 },
      { name: '신성 방어', type: 'skill', count: 4 },
      { name: '행운의 일격', type: 'attack', count: 1 },
    ],
    emoji: '⛪',
    difficulty: 1,
    diffLabel: '회복이 풍부해 실수를 만회하기 쉬움',
    color: '#e0d060',
    playstyle: '회복 지속형',
  },
  {
    id: 'thief',
    name: '도적',
    subname: '암살·강령·인법·그림자',
    hp: 68,
    startRelic: '매끈한 돌',
    signatureRelic: '독니',
    signatureDesc: '매 턴 첫 공격이 적에게 중독 +2',
    description: '전투 시작 시 민첩 +1. 중독과 다단히트, 그림자를 다루는 날렵한 암살자.',
    starterCards: [
      { name: '베기', type: 'attack', count: 5 },
      { name: '뼈 방패', type: 'skill', count: 4 },
      { name: '암흑의 혼', type: 'attack', count: 1 },
    ],
    emoji: '🗡️',
    difficulty: 3,
    diffLabel: '낮은 체력, 중독·민첩 콤보를 굴려야 생존',
    color: '#60c080',
    playstyle: '중독 암살형',
  },
  {
    id: 'summoner',
    name: '정령술사',
    subname: '정령·영혼·소환·계약',
    hp: 62,
    startRelic: '영혼의 등불',
    signatureRelic: '정령 계약서',
    signatureDesc: 'power 카드 사용 시 방어도 +3',
    description: '정령 소환과 영혼 마법으로 전투를 지배하는 정령술사. HP가 낮지만 다양한 power 스케일링이 강하다.',
    starterCards: [
      { name: '마력탄', type: 'attack', count: 5 },
      { name: '보호막', type: 'skill', count: 4 },
      { name: '대지 정령 소환', type: 'power', count: 1 },
    ],
    emoji: '🪬',
    difficulty: 3,
    diffLabel: '최저 체력, 파워 카드 스케일링에 의존',
    color: '#60b0c0',
    playstyle: '소환 스케일형',
  },
  {
    id: 'engineer',
    name: '공학자',
    subname: '드론·기계·화력·자동화',
    hp: 68,
    startRelic: '에너지 배터리',
    signatureRelic: '드론 코어',
    signatureDesc: 'power 카드 사용 시 랜덤 적 4 데미지 + 방어도 +4',
    description: '드론을 배치해 자동 화력을 구축하는 공학자. 드론 데미지는 힘에 비례해 후반 보스전에도 강력하다.',
    starterCards: [
      { name: '렌치 타격', type: 'attack', count: 5 },
      { name: '에너지 실드', type: 'skill', count: 5 },
    ],
    emoji: '🔧',
    difficulty: 2,
    diffLabel: '드론 배치 후 자동 화력, 힘 스케일링 필수',
    color: '#c0a040',
    playstyle: '드론 자동화형',
  },
  {
    id: 'gambler',
    name: '갬블러',
    subname: '주사위·도박·행운·배팅',
    hp: 70,
    startRelic: '행운의 동전',
    signatureRelic: '갬블러의 직감',
    signatureDesc: '전투 시작 시 1장 드로우, 힘 +1',
    description: '운에 모든 것을 건다. 카드 효과가 날카롭지만 일정하지 않아 매 전투가 도박이다.',
    starterCards: [
      { name: '주사위 투척', type: 'attack', count: 5 },
      { name: '블러프', type: 'skill', count: 5 },
    ],
    emoji: '🎲',
    difficulty: 3,
    diffLabel: '랜덤 기반 고위험/고보상, 운이 곧 전략',
    color: '#d0a060',
    playstyle: '랜덤 배팅형',
  },
];

const CARD_TYPE_ICON: Record<string, string> = { attack: ic('sword'), skill: ic('shield'), power: ic('star') };
const CARD_TYPE_COLOR: Record<string, string> = { attack: '#d05060', skill: '#5090d0', power: '#e0a030' };

export function renderCharacterSelect(seed: number, ascension: number): HTMLElement {
  let selected: CharacterClass = 'swordmaster';

  const wrapper = el('div', { class: 'character-select-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    append();
  };

  const append = () => {
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)', marginBottom: '4px' } }, '캐릭터 선택'));
    wrapper.appendChild(el('div', { style: { color: 'var(--muted)', marginBottom: '20px', fontSize: '13px' } }, '플레이할 직업을 선택하세요'));

    const layout = el('div', { class: 'cs-layout' });

    // ── Left: character list ──
    const list = el('div', { class: 'cs-list' });
    for (const ch of CHARACTERS) {
      const isSel = selected === ch.id;
      const item = el(
        'div',
        {
          class: `cs-item${isSel ? ' cs-item--active' : ''}`,
          style: {
            borderColor: isSel ? ch.color : '',
            background: isSel ? `${ch.color}15` : '',
            boxShadow: isSel ? `0 0 12px ${ch.color}40` : '',
          },
          onClick: () => { selected = ch.id; rebuild(); },
        },
        (() => { const s = el('span', { class: 'cs-item-emoji' }); s.innerHTML = CHARACTER_SVG[ch.id] ?? ch.emoji; return s; })(),
        el('div', { class: 'cs-item-info' },
          el('div', { class: 'cs-item-name' }, ch.name),
          el('div', { class: 'cs-item-sub' }, ch.playstyle),
        ),
        el('div', {
          class: 'cs-item-diff',
          style: { color: ch.difficulty === 1 ? 'var(--good)' : ch.difficulty === 2 ? 'var(--accent)' : 'var(--bad)' },
        }, '★'.repeat(ch.difficulty) + '☆'.repeat(3 - ch.difficulty)),
      );
      list.appendChild(item);
    }
    layout.appendChild(list);

    // ── Right: detail panel ──
    const ch = CHARACTERS.find(c => c.id === selected)!;
    const detail = el('div', { class: 'cs-detail' });

    // Header: big emoji + name
    const header = el('div', { class: 'cs-detail-header' });
    const bigEmoji = el('div', {
      class: 'cs-big-emoji',
      style: { background: `radial-gradient(circle, ${ch.color}30 0%, transparent 70%)` },
    });
    bigEmoji.innerHTML = CHARACTER_SVG[ch.id] ?? ch.emoji;
    header.appendChild(bigEmoji);
    const headerText = el('div', { class: 'cs-header-text' });
    headerText.appendChild(el('div', { class: 'cs-char-name' }, ch.name));
    headerText.appendChild(el('div', { class: 'cs-char-sub' }, ch.subname));
    const tags = el('div', { class: 'cs-tags' });
    tags.appendChild(el('span', { class: 'cs-tag', style: { background: `${ch.color}25`, color: ch.color, border: `1px solid ${ch.color}50` } }, ch.playstyle));
    tags.appendChild(el('span', {
      class: 'cs-tag',
      style: {
        background: ch.difficulty === 1 ? 'rgba(128,192,96,0.15)' : ch.difficulty === 2 ? 'rgba(212,160,91,0.15)' : 'rgba(208,80,96,0.15)',
        color: ch.difficulty === 1 ? 'var(--good)' : ch.difficulty === 2 ? 'var(--accent)' : 'var(--bad)',
        border: `1px solid ${ch.difficulty === 1 ? 'rgba(128,192,96,0.4)' : ch.difficulty === 2 ? 'rgba(212,160,91,0.4)' : 'rgba(208,80,96,0.4)'}`,
      },
    }, ch.difficulty === 1 ? '쉬움' : ch.difficulty === 2 ? '보통' : '어려움'));
    headerText.appendChild(tags);
    header.appendChild(headerText);
    detail.appendChild(header);

    // Stats row
    const stats = el('div', { class: 'cs-stats' });
    stats.appendChild(makeStatBox(ic('heart'), `${ch.hp}`, 'HP'));
    stats.appendChild(makeStatBox(ic('gem'), ch.startRelic, '시작 유물'));
    stats.appendChild(makeStatBox(ic('lightning'), '3', '에너지'));
    detail.appendChild(stats);

    // Description
    detail.appendChild(el('div', { class: 'cs-desc' }, ch.description));

    // Signature relic
    const sig = el('div', { class: 'cs-signature', style: { borderColor: `${ch.color}50`, background: `${ch.color}10` } });
    const sigTitle = el('div', { class: 'cs-sig-title', style: { color: ch.color } });
    sigTitle.innerHTML = `${ic('star')} ${ch.signatureRelic}`;
    sig.appendChild(sigTitle);
    sig.appendChild(el('div', { class: 'cs-sig-desc' }, ch.signatureDesc));
    detail.appendChild(sig);

    // Starter deck preview
    const deckSection = el('div', { class: 'cs-deck-section' });
    deckSection.appendChild(el('div', { class: 'cs-deck-title' }, '시작 덱 (10장)'));
    const deckRow = el('div', { class: 'cs-deck-row' });
    for (const card of ch.starterCards) {
      const typeColor = CARD_TYPE_COLOR[card.type];
      const cardIconEl = el('div', { class: 'cs-card-icon', style: { color: typeColor } });
      const csvg = CARD_TYPE_SVG[card.type];
      if (csvg) cardIconEl.innerHTML = csvg;
      else cardIconEl.innerHTML = CARD_TYPE_ICON[card.type];
      const cardEl = el('div', { class: `cs-card-preview ${card.type}` },
        cardIconEl,
        el('div', { class: 'cs-card-name' }, card.name),
        el('div', { class: 'cs-card-count', style: { background: `${typeColor}20`, color: typeColor } }, `×${card.count}`),
      );
      deckRow.appendChild(cardEl);
    }
    deckSection.appendChild(deckRow);
    detail.appendChild(deckSection);

    // Difficulty note
    const diffNote = el('div', { class: 'cs-diff-note' });
    diffNote.innerHTML = `${ic('tip')} ${ch.diffLabel}`;
    detail.appendChild(diffNote);

    layout.appendChild(detail);
    wrapper.appendChild(layout);

    // Start button
    wrapper.appendChild(
      el('button', {
        class: 'cs-start-btn',
        style: { background: ch.color, borderColor: ch.color },
        onClick: () => startNewRun(seed, ascension, selected, { goToScreen: 'neow_blessing' }),
      }, `${ch.name} 시작`),
    );

    wrapper.appendChild(
      el('button', {
        style: { marginTop: '8px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
        onClick: () => setScreen('title'),
      }, '← 뒤로'),
    );
  };

  append();
  return wrapper;
}

function makeStatBox(icon: string, value: string, label: string): HTMLElement {
  const iconEl = el('span', { class: 'cs-stat-icon' });
  iconEl.innerHTML = icon;
  return el('div', { class: 'cs-stat-box' },
    iconEl,
    el('div', {},
      el('div', { class: 'cs-stat-value' }, value),
      el('div', { class: 'cs-stat-label' }, label),
    ),
  );
}
