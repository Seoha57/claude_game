// 영어 모드에서 한국어가 새어 나오지 않는지 본다.
//
// 번역은 한국어 문장을 키로 영어 표를 찾고, 키가 없으면 에러 없이 한국어를
// 그대로 보여준다. 그래서 카드를 추가하며 번역을 빠뜨려도 아무 데서도 안
// 터진다. 2026-11-19에 재보니 카드 이름 297개, 유물 이름 38개가 이렇게
// 한국어로 나오고 있었다 (e2e는 기본 카드 하나와 유물 두 개만 봤다).
//
// 물약과 캐릭터 정보는 모듈을 불러올 때 t()를 한 번 부르므로, 언어를 먼저
// 영어로 바꾼 뒤 동적 import로 불러온다.

import { describe, it, expect, beforeAll } from 'vitest';

const HANGUL = /[가-힣]/;

/** 한국어가 남은 항목만 모은다. 실패 메시지에 그대로 찍힌다. */
function leaks(entries: [string, string][]): string[] {
  return entries.filter(([, text]) => HANGUL.test(text)).map(([where, text]) => `${where}: ${text}`);
}

let cards: typeof import('./content/cards');
let relics: typeof import('./content/relics');
let enemies: typeof import('./content/enemies');

beforeAll(async () => {
  localStorage.setItem('dod_lang', 'en');
  const i18n = await import('./i18n');
  i18n.setLang('en');
  cards = await import('./content/cards');
  relics = await import('./content/relics');
  enemies = await import('./content/enemies');
});

describe('영어 모드에 한국어가 남지 않는다', () => {
  it('카드 이름과 설명 (강화 0·1·2단계)', () => {
    const entries: [string, string][] = [];
    for (const id of Object.keys(cards.CARD_DEFS)) {
      for (const upgraded of [0, 1, 2]) {
        const d = cards.getEffectiveDef({ defId: id, upgraded, uid: 'x' } as never);
        entries.push([`${id}+${upgraded} 이름`, d.name], [`${id}+${upgraded} 설명`, d.description]);
      }
    }
    expect(leaks(entries)).toEqual([]);
  });

  it('유물 이름과 설명', () => {
    const entries: [string, string][] = relics.RELIC_LIST.flatMap((r) => {
      const d = relics.relicDef(r.id);
      return [[`${r.id} 이름`, d.name], [`${r.id} 설명`, d.description]] as [string, string][];
    });
    expect(leaks(entries)).toEqual([]);
  });

  it('적 이름', () => {
    const entries: [string, string][] = Object.keys(enemies.ENEMY_DEFS).map((id) => [id, enemies.enemyName(id)]);
    expect(leaks(entries)).toEqual([]);
  });

  it('물약', async () => {
    const { POTION_LIST } = await import('./content/potions');
    const entries: [string, string][] = POTION_LIST.flatMap((p) => [[p.id, p.name], [p.id, p.description]] as [string, string][]);
    expect(leaks(entries)).toEqual([]);
  });

  it('상태 이상 이름·설명·툴팁', async () => {
    const st = await import('./combat/statuses');
    const entries: [string, string][] = [];
    for (const key of Object.keys(st.STATUS_INFO) as (keyof typeof st.STATUS_INFO)[]) {
      const info = st.STATUS_INFO[key];
      entries.push([key, info.name], [key, info.description], [key, st.getStatusTooltip(key, 2)]);
    }
    expect(leaks(entries)).toEqual([]);
  });

  it('캐릭터 선택 화면 (전 직업)', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const { renderCharacterSelect } = await import('./ui/character-select-ui');
    const root = renderCharacterSelect(1, 0);
    document.getElementById('app')!.appendChild(root);
    const entries: [string, string][] = [];
    for (const item of root.querySelectorAll<HTMLElement>('.cs-item')) {
      item.click();
      entries.push([item.textContent ?? '', root.textContent ?? '']);
    }
    // 같은 줄이 직업 수만큼 반복되지 않게 줄 단위로 모아 본다.
    const lines = new Set(entries.flatMap(([, text]) => text.split(/\n|(?<=[.!?])\s+/)).filter((l) => HANGUL.test(l)));
    expect([...lines]).toEqual([]);
  });

  it('도전 화면', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const { renderChallenge } = await import('./ui/challenge-ui');
    const text = renderChallenge().textContent ?? '';
    expect(text.split(/\n|(?<=[.!?])\s+/).filter((l) => HANGUL.test(l))).toEqual([]);
  });
});

describe('설명 문장 다듬기', () => {
  it('숫자가 1이면 단수, 말줄임표는 붙여 쓴다', () => {
    const d = (id: string) => cards.getEffectiveDef({ defId: id, upgraded: 0, uid: 'x' } as never).description;
    const all = Object.keys(cards.CARD_DEFS).map(d).join('\n');
    expect(all).not.toMatch(/\b1 (\w+ )?(cards|times|hits)\b/);
    expect(all).not.toMatch(/\. \./);
    expect(d('p_falling_phoenix')).toContain('Block... or so the legend goes.');
  });
});

describe('강화 카드 이름', () => {
  it('강화해도 이름은 기본 이름에 +/++만 붙는다', async () => {
    // 이름을 바꿀 때 강화 표를 빠뜨리면 강화하는 순간 다른 카드처럼 보인다
    // (2026-11-19에 도적 카드 8장이 옛 이름으로 남아 있었다).
    const i18n = await import('./i18n');
    i18n.setLang('ko');
    try {
      const wrong: string[] = [];
      for (const id of Object.keys(cards.CARD_DEFS)) {
        const base = cards.getEffectiveDef({ defId: id, upgraded: 0, uid: 'x' } as never).name;
        for (const u of [1, 2]) {
          // 저주·축복처럼 강화가 없는 카드는 이름이 그대로다.
          const name = cards.getEffectiveDef({ defId: id, upgraded: u, uid: 'x' } as never).name;
          if (name.replace(/\+*$/, '') !== base) wrong.push(`${id}: ${base} → ${name}`);
        }
      }
      expect(wrong).toEqual([]);
    } finally {
      i18n.setLang('en');
    }
  });
});
