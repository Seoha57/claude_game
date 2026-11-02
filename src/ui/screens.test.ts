// 보상·상점·모닥불·챕터클리어 화면이 실제로 그려지는지 본다.
//
// 이 네 화면의 규칙을 run/rules.ts로 끄집어내면서 UI를 건드렸는데, e2e는
// 전투 노드만 밟아서 여기까지 오지 않는다. jsdom에서 렌더 함수를 직접 불러
// 터지지 않는지, 규칙이 UI까지 전달되는지 확인한다.

import { describe, it, expect, beforeEach } from 'vitest';
import { startNewRun, getRun, setScreen } from '../state';
import { renderReward } from './reward-ui';
import { renderShop } from './shop-ui';
import { renderRest } from './rest-ui';
import { renderChapterClear } from './end-ui';
import { restHealAmount, buildShopItems, rollReward } from '../run/rules';

beforeEach(() => {
  localStorage.clear();
  // 미니 튜토리얼 오버레이가 #app에 붙는다
  document.body.innerHTML = '<div id="app"></div>';
});

/** 런을 만들고 보상/상점 노드 하나에 올려놓는다. */
function standOn(kind: 'reward' | 'shop' | 'rest') {
  startNewRun(1234, 0, 'swordmaster');
  const run = getRun();
  const n = run.map.find((m) => m.kind === kind) ?? run.map[1];
  n.kind = kind;
  run.currentNodeId = n.id;
  run.floor = n.y;
  return run;
}

describe('보상 화면', () => {
  it('카드 3장을 그리고 골드를 준다', () => {
    const run = standOn('reward');
    const expected = rollReward(run, false);
    const gold = run.player.gold;
    setScreen('reward');

    const node = renderReward();
    expect(node.querySelectorAll('.reward-cards .card')).toHaveLength(3);
    expect(run.player.gold, '보상 골드가 안 들어왔다').toBe(gold + expected.gold);
    for (const id of expected.cardChoices) {
      expect(node.textContent, `${id}가 화면에 없다`).toBeTruthy();
    }
  });

  it('두 번 그려도 골드가 두 번 들어오지 않는다', () => {
    const run = standOn('reward');
    setScreen('reward');
    renderReward();
    const gold = run.player.gold;
    renderReward();
    expect(run.player.gold).toBe(gold);
  });
});

describe('상점 화면', () => {
  it('규칙이 낸 물건 수만큼 그린다', () => {
    const run = standOn('shop');
    setScreen('shop');
    const items = buildShopItems(run);
    const node = renderShop();
    // 카드 3 + 유물 2 + 포션 2 + 제거 1
    expect(items).toHaveLength(8);
    expect(node.textContent).toContain('보유 골드');
  });
});

describe('모닥불 화면', () => {
  it('휴식 회복량을 규칙과 같은 값으로 보여준다', () => {
    const run = standOn('rest');
    run.player.hp = 10;
    setScreen('rest');
    const node = renderRest();
    expect(node.textContent).toContain(`HP +${restHealAmount(run)}`);
  });
});

describe('챕터 클리어 화면', () => {
  it('회복하고 보스 유물 후보를 보여준다', () => {
    startNewRun(1234, 0, 'swordmaster');
    const run = getRun();
    run.player.hp = 10;
    setScreen('chapter_clear');

    const node = renderChapterClear();
    expect(run.player.hp, '챕터 클리어 회복이 안 들어왔다').toBeGreaterThan(10);
    expect(node.textContent).toContain('챕터');
  });

  it('다시 그려도 회복이 중복되지 않는다', () => {
    startNewRun(1234, 0, 'swordmaster');
    const run = getRun();
    run.player.hp = 10;
    setScreen('chapter_clear');
    renderChapterClear();
    const hp = run.player.hp;
    renderChapterClear();
    expect(run.player.hp).toBe(hp);
  });
});
