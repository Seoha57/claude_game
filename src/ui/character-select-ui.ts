import { el } from './dom';
import { startNewRun, setScreen, startingHp, starterDeck, STARTING_RELICS, SIGNATURE_RELICS } from '../state';
import { getEffectiveDef } from '../content/cards';
import type { CharacterClass } from '../types';
import { CHARACTER_SVG, CARD_TYPE_SVG, ic } from './art';
import { relicDef } from '../content/relics';
import { playSfx } from '../audio';
import { t } from '../i18n';
import { getMastery } from '../stats';

interface CharacterInfo {
  id: CharacterClass;
  name: string;
  subname: string;
  description: string;
  emoji: string;
  difficulty: 1 | 2 | 3;
  diffLabel: string;
  color: string;
  playstyle: string;
}

/**
 * 시작 덱 미리보기 — 실제 덱을 세서 만든다.
 * 손으로 적어뒀을 때 네 직업이 틀려 있었다 (마법사는 바뀐 10번째 카드가
 * 그대로, 공학자·갬블러는 10번째 카드가 없고 방어 카드가 5장으로,
 * 혈술사는 4/1이 3/2로).
 */
function starterCardCounts(cls: CharacterClass): { name: string; type: 'attack' | 'skill' | 'power'; count: number }[] {
  const out: { name: string; type: 'attack' | 'skill' | 'power'; count: number }[] = [];
  for (const card of starterDeck(cls)) {
    const def = getEffectiveDef(card);
    const hit = out.find((o) => o.name === def.name);
    if (hit) hit.count++;
    else out.push({ name: def.name, type: def.type as 'attack' | 'skill' | 'power', count: 1 });
  }
  return out;
}

const CHARACTERS: CharacterInfo[] = [
  {
    id: 'swordmaster',
    name: t('검사'),
    subname: t('검술사 계열'),
    description: t('강력한 근접 검술로 적을 압도한다.'),
    emoji: '⚔️',
    difficulty: 1,
    diffLabel: t('직관적인 공격 스타일, 입문용으로 추천'),
    color: '#e85040',
    playstyle: t('근접 공격형'),
  },
  {
    id: 'gunner',
    name: t('총잡이'),
    subname: t('저격·포격·기계·화약·돌격'),
    description: t('다양한 총기와 폭발물로 원거리를 지배한다.'),
    emoji: '🔫',
    difficulty: 2,
    diffLabel: t('디버프와 콤보 시너지 활용이 핵심'),
    color: '#5090d0',
    playstyle: t('디버프 콤보형'),
  },
  {
    id: 'fighter',
    name: t('격투가'),
    subname: t('타격·기공·유술·격투'),
    description: t('맨손과 기의 힘으로 적을 압도한다.'),
    emoji: '🥊',
    difficulty: 1,
    diffLabel: t('높은 체력과 힘 버프로 안정적인 플레이'),
    color: '#e0a030',
    playstyle: t('힘 스케일링형'),
  },
  {
    id: 'magician',
    name: t('마법사'),
    subname: t('원소·소환·전투마법·연금·부여'),
    description: t('다양한 원소 마법으로 광역 전투에 강하다.'),
    emoji: '🔮',
    difficulty: 3,
    diffLabel: t('낮은 체력, 카드 순서와 콤보 관리 필요'),
    color: '#a060e0',
    playstyle: t('광역 마법형'),
  },
  {
    id: 'priest',
    name: t('성직자'),
    subname: t('성기사·권성·퇴마·복수'),
    description: t('회복과 콤보 타격, HP를 대가로 한 강타까지 다재다능한 성직자.'),
    emoji: '⛪',
    difficulty: 1,
    diffLabel: t('회복이 풍부해 실수를 만회하기 쉬움'),
    color: '#e0d060',
    playstyle: t('회복 지속형'),
  },
  {
    id: 'thief',
    name: t('도적'),
    subname: t('암살·강령·인법·그림자'),
    description: t('중독과 다단히트, 그림자를 다루는 날렵한 암살자.'),
    emoji: '🗡️',
    difficulty: 3,
    diffLabel: t('낮은 체력, 중독·민첩 콤보를 굴려야 생존'),
    color: '#60c080',
    playstyle: t('중독 암살형'),
  },
  {
    id: 'summoner',
    name: t('정령술사'),
    subname: t('정령·영혼·소환·계약'),
    description: t('정령 소환과 영혼 마법으로 전투를 지배하는 정령술사. HP가 낮지만 다양한 power 스케일링이 강하다.'),
    emoji: '🪬',
    difficulty: 3,
    diffLabel: t('최저 체력, 파워 카드 스케일링에 의존'),
    color: '#60b0c0',
    playstyle: t('소환 스케일형'),
  },
  {
    id: 'engineer',
    name: t('공학자'),
    subname: t('드론·기계·화력·자동화'),
    description: t('드론을 배치해 자동 화력을 구축하는 공학자. 드론 데미지는 힘에 비례해 후반 보스전에도 강력하다.'),
    emoji: '🔧',
    difficulty: 2,
    diffLabel: t('드론 배치 후 자동 화력, 힘 스케일링 필수'),
    color: '#c0a040',
    playstyle: t('드론 자동화형'),
  },
  {
    id: 'gambler',
    name: t('갬블러'),
    subname: t('주사위·도박·행운·배팅'),
    description: t('운에 모든 것을 건다. 카드 효과가 날카롭지만 일정하지 않아 매 전투가 도박이다.'),
    emoji: '🎲',
    difficulty: 3,
    diffLabel: t('랜덤 기반 고위험/고보상, 운이 곧 전략'),
    color: '#d0a060',
    playstyle: t('랜덤 배팅형'),
  },
  {
    id: 'blood_mage',
    name: t('혈술사'),
    subname: t('사혈·흡혈·혈갑·출혈'),
    description: t('HP를 자원으로 소모하고, 흡혈로 되찾는다.'),
    emoji: '🩸',
    difficulty: 3,
    diffLabel: t('HP 관리가 핵심, 상급자 추천'),
    color: '#8b0000',
    playstyle: t('HP 소모/흡혈 순환형'),
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
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)', marginBottom: '4px' } }, t('캐릭터 선택')));
    wrapper.appendChild(el('div', { style: { color: 'var(--muted)', marginBottom: '20px', fontSize: '13px' } }, t('플레이할 직업을 선택하세요')));

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
          onClick: () => { playSfx('click'); selected = ch.id; rebuild(); },
        },
        (() => { const s = el('span', { class: 'cs-item-emoji' }); s.innerHTML = CHARACTER_SVG[ch.id] ?? ch.emoji; return s; })(),
        el('div', { class: 'cs-item-info' },
          el('div', { class: 'cs-item-name' }, ch.name),
          el('div', { class: 'cs-item-sub' }, ch.playstyle),
        ),
        el('div', { class: 'cs-item-right' },
          el('div', {
            class: 'cs-item-diff',
            style: { color: ch.difficulty === 1 ? 'var(--good)' : ch.difficulty === 2 ? 'var(--accent)' : 'var(--bad)' },
          }, '★'.repeat(ch.difficulty) + '☆'.repeat(3 - ch.difficulty)),
          (() => {
            const m = getMastery(ch.id);
            return el('div', {
              class: m.level > 0 ? 'cs-item-mastery earned' : 'cs-item-mastery',
            }, m.level > 0 ? `Lv.${m.level}` : '—');
          })(),
        ),
      );
      item.setAttribute('data-class', ch.id);
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
    }, ch.difficulty === 1 ? t('쉬움') : ch.difficulty === 2 ? t('보통') : t('어려움')));
    const mastery = getMastery(ch.id);
    tags.appendChild(el('span', {
      class: 'cs-tag',
      style: {
        background: mastery.level > 0 ? 'rgba(212,160,91,0.15)' : 'rgba(255,255,255,0.05)',
        color: mastery.level > 0 ? 'var(--accent)' : 'var(--muted)',
        border: `1px solid ${mastery.level > 0 ? 'rgba(212,160,91,0.4)' : 'var(--border)'}`,
      },
    }, mastery.level > 0 ? `${t('숙련도')} Lv.${mastery.level} ${mastery.title}` : t('미숙련')));
    headerText.appendChild(tags);
    headerText.appendChild(el('div', { class: 'cs-mastery-progress' },
      mastery.nextAt === null
        ? `${t('숙련도')} ${t('최대')} · ${mastery.points}${t('점')}`
        : `${t('다음 레벨까지')} ${mastery.nextAt - mastery.points}${t('점')} (${mastery.points}/${mastery.nextAt})`));
    header.appendChild(headerText);
    detail.appendChild(header);

    // Stats row
    const stats = el('div', { class: 'cs-stats' });
    // HP·유물 수치를 여기 따로 적어두면 어긋난다. 실제로 열 직업 전부 틀려
    // 있었고(검사 75 ↔ 72, 공학자 68 ↔ 61), 시그니처 설명 다섯 개도 옛 효과를
    // 그대로 보여주고 있었다. 전부 정의에서 읽는다.
    stats.appendChild(makeStatBox(ic('heart'), `${startingHp(ch.id, ascension)}`, 'HP'));
    const startRelic = relicDef(STARTING_RELICS[ch.id]);
    const relicBox = makeStatBox(ic('gem'), startRelic.name, t('시작 유물'));
    relicBox.setAttribute('data-tooltip', `${startRelic.name}\n${startRelic.description}`);
    stats.appendChild(relicBox);
    stats.appendChild(makeStatBox(ic('lightning'), '3', t('에너지')));
    detail.appendChild(stats);

    // Description
    detail.appendChild(el('div', { class: 'cs-desc' }, ch.description));

    // Signature relic
    const sig = el('div', { class: 'cs-signature', style: { borderColor: `${ch.color}50`, background: `${ch.color}10` } });
    const sigTitle = el('div', { class: 'cs-sig-title', style: { color: ch.color } });
    const sigRelic = relicDef(SIGNATURE_RELICS[ch.id]);
    sigTitle.innerHTML = `${ic('star')} ${sigRelic.name}`;
    sig.appendChild(sigTitle);
    sig.appendChild(el('div', { class: 'cs-sig-desc' }, sigRelic.description));
    detail.appendChild(sig);

    // Starter deck preview
    const deckSection = el('div', { class: 'cs-deck-section' });
    deckSection.appendChild(el('div', { class: 'cs-deck-title' }, t('시작 덱 (10장)')));
    const deckRow = el('div', { class: 'cs-deck-row' });
    for (const card of starterCardCounts(ch.id)) {
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
        onClick: () => { playSfx('click'); startNewRun(seed, ascension, selected, { goToScreen: 'neow_blessing' }); },
      }, `${ch.name} ${t('시작')}`),
    );

    wrapper.appendChild(
      el('button', {
        style: { marginTop: '8px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
        onClick: () => setScreen('title'),
      }, t('← 뒤로')),
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
