export type EventEffect =
  | { kind: 'heal'; amount: number }
  | { kind: 'lose_hp'; amount: number }
  | { kind: 'gold'; amount: number }
  | { kind: 'lose_gold'; amount: number }
  | { kind: 'add_curse'; count: number }
  | { kind: 'upgrade_random'; count: number }
  | { kind: 'add_random_relic' }
  | { kind: 'add_card'; rarity: 'common' | 'uncommon' | 'rare' }
  | { kind: 'add_potion' }
  | { kind: 'max_hp'; amount: number };

export type EventCondition =
  | { kind: 'min_gold'; amount: number };

export interface EventChoice {
  label: string;
  result: string;
  effects: EventEffect[];
  condition?: EventCondition;
}

export interface EventDef {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export const EVENT_DEFS: EventDef[] = [
  {
    id: 'old_altar',
    title: '낡은 제단',
    description: '버려진 제단이 눈앞에 있다. 무언가를 바치면 힘을 얻을 수 있을 것 같다.',
    choices: [
      { label: '제물을 바친다 (HP -8)', result: '제단이 빛을 발하며 최대 HP가 증가했다.', effects: [{ kind: 'lose_hp', amount: 8 }, { kind: 'max_hp', amount: 10 }] },
      { label: '그냥 지나친다', result: '조용히 자리를 떴다.', effects: [] },
    ],
  },
  {
    id: 'golden_idol',
    title: '황금 우상',
    description: '황금빛 우상이 놓여 있다. 강한 기운이 느껴지지만, 저주가 깃들어 있는 것 같다.',
    choices: [
      { label: '집어든다', result: '유물을 손에 넣었지만, 저주가 덱에 스며들었다.', effects: [{ kind: 'add_random_relic' }, { kind: 'add_curse', count: 1 }] },
      { label: '그냥 지나친다', result: '조용히 자리를 떴다.', effects: [] },
    ],
  },
  {
    id: 'secret_lab',
    title: '비밀 실험실',
    description: '방치된 실험실이 있다. 실험 장비가 카드를 강화하는 데 사용될 수 있을 것 같다.',
    choices: [
      { label: '실험에 참여한다 (HP -10)', result: '고통스럽지만 카드 2장이 강화되었다.', effects: [{ kind: 'lose_hp', amount: 10 }, { kind: 'upgrade_random', count: 2 }] },
      { label: '장비만 사용한다', result: '카드 1장이 강화되었다.', effects: [{ kind: 'upgrade_random', count: 1 }] },
    ],
  },
  {
    id: 'cursed_cavern',
    title: '저주받은 토굴',
    description: '금화가 가득한 토굴이 있다. 하지만 어딘가 불길한 기운이 감돈다.',
    choices: [
      { label: '금화를 가져간다', result: '금화를 챙겼지만 저주가 깃들었다.', effects: [{ kind: 'gold', amount: 75 }, { kind: 'add_curse', count: 2 }] },
      { label: '무시한다', result: '현명하게 지나쳤다.', effects: [] },
    ],
  },
  {
    id: 'wounded_mercenary',
    title: '부상당한 용병',
    description: '길가에 쓰러진 용병이 있다. 치료해주면 보답을 하겠다고 한다.',
    choices: [
      { label: '치료해준다', result: '용병이 감사의 표시로 물약을 건네주었다.', effects: [{ kind: 'heal', amount: 12 }, { kind: 'add_potion' }] },
      { label: '카드를 요구한다', result: '용병이 마지못해 카드를 건네주었다.', effects: [{ kind: 'add_card', rarity: 'common' }] },
    ],
  },
  {
    id: 'healing_spring',
    title: '회복의 샘',
    description: '맑은 샘물이 솟아나고 있다. 마시면 체력이 회복될 것 같다.',
    choices: [
      { label: '실컷 마신다', result: '샘물을 실컷 마시고 HP를 회복했다.', effects: [{ kind: 'heal', amount: 30 }] },
      { label: '조금만 마시고 물약병에 담는다', result: 'HP를 회복하고 물약을 챙겼다.', effects: [{ kind: 'heal', amount: 15 }, { kind: 'add_potion' }] },
    ],
  },
  {
    id: 'ancient_tome',
    title: '고대 서적',
    description: '먼지가 쌓인 고대 서적이 있다. 강력한 지식이 담겨 있을 것 같다.',
    choices: [
      { label: '읽는다 (HP -6)', result: '지식을 얻었다. 카드가 덱에 추가되었다.', effects: [{ kind: 'lose_hp', amount: 6 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '불태운다', result: '서적을 태워 몸을 녹였다. HP가 회복되었다.', effects: [{ kind: 'heal', amount: 10 }] },
    ],
  },
  {
    id: 'old_coin',
    title: '낡은 동전',
    description: '정체불명의 낡은 동전이 있다. 사용하면 큰돈이 생긴다는 소문이 있다.',
    choices: [
      { label: '동전을 사용한다', result: '금화가 쏟아졌다! 하지만 저주가 따라왔다.', effects: [{ kind: 'gold', amount: 100 }, { kind: 'add_curse', count: 1 }] },
      { label: '버린다', result: '동전을 버렸다.', effects: [] },
    ],
  },
  {
    id: 'merchant_deal',
    title: '상인의 제안',
    description: '수상한 상인이 희귀 물건을 팔겠다고 제안한다. (75골드)',
    choices: [
      { label: '75골드에 구매한다', result: '희귀한 물건을 손에 넣었다.', condition: { kind: 'min_gold', amount: 75 }, effects: [{ kind: 'lose_gold', amount: 75 }, { kind: 'add_random_relic' }] },
      { label: '거절한다', result: '상인이 투덜거리며 떠났다.', effects: [] },
    ],
  },
  {
    id: 'mysterious_chest',
    title: '수수께끼 상자',
    description: '잠겨 있는 상자가 있다. 안에 무엇이 들어있는지 알 수 없다.',
    choices: [
      { label: '열어본다 (HP -5)', result: '상자 안에서 희귀한 카드가 나왔다!', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'add_card', rarity: 'rare' }] },
      { label: '그냥 지나친다', result: '안전하게 지나쳤다.', effects: [] },
    ],
  },
  {
    id: 'abandoned_camp',
    title: '버려진 야영지',
    description: '꺼진 모닥불 옆에 누군가의 짐이 흩어져 있다. 주변에 인기척은 없다.',
    choices: [
      { label: '텐트를 뒤진다 (HP -5)', result: '함정에 살짝 걸렸지만 골드 주머니를 발견했다.', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'gold', amount: 60 }] },
      { label: '모닥불을 다시 피우고 휴식한다', result: '잠시 몸을 녹이고 회복했다.', effects: [{ kind: 'heal', amount: 22 }] },
      { label: '그냥 지나친다', result: '뭔가 있었을지도 모른다는 생각이 든다.', effects: [] },
    ],
  },
  {
    id: 'black_market',
    title: '검은 시장',
    description: '어두운 골목에서 후드를 깊게 눌러쓴 상인이 손짓한다. 영혼을 사겠다고 한다.',
    choices: [
      { label: '영혼을 판다 (최대 HP -8)', result: '거래를 마쳤다. 손에 묵직한 금화가 쥐어졌다.', effects: [{ kind: 'max_hp', amount: -8 }, { kind: 'gold', amount: 90 }] },
      { label: '거래는 하되 작게 (최대 HP -3)', result: '작은 거래라며 상인이 비웃었다.', effects: [{ kind: 'max_hp', amount: -3 }, { kind: 'gold', amount: 35 }] },
      { label: '거절한다', result: '뒤도 돌아보지 않고 자리를 떴다.', effects: [] },
    ],
  },
  {
    id: 'sacred_well',
    title: '신성한 우물',
    description: '맑은 물이 가득 찬 우물이 있다. 무언가를 던지면 보답이 있을 것 같다.',
    choices: [
      { label: '금화를 던진다 (50골드)', result: '우물에서 빛이 솟아오르며 유물이 떠올랐다.', condition: { kind: 'min_gold', amount: 50 }, effects: [{ kind: 'lose_gold', amount: 50 }, { kind: 'add_random_relic' }] },
      { label: 'HP를 바친다 (HP -12)', result: '피의 대가로 두 장의 카드가 강화되었다.', effects: [{ kind: 'lose_hp', amount: 12 }, { kind: 'upgrade_random', count: 2 }] },
      { label: '그냥 떠난다', result: '아무 일 없었다.', effects: [] },
    ],
  },
  {
    id: 'mystic_fountain',
    title: '신비한 분수',
    description: '두 갈래로 갈라진 분수가 있다. 한쪽은 붉게, 다른 쪽은 푸르게 빛난다.',
    choices: [
      { label: '붉은 분수를 마신다 (HP -5)', result: '몸이 더 단단해진 느낌이다.', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'max_hp', amount: 12 }] },
      { label: '푸른 분수를 마신다 (HP -3)', result: '머릿속이 맑아지고 새로운 카드를 떠올렸다.', effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '둘 다 마신다 (HP -10)', result: '두 힘이 몸 안에서 조화를 이루었다.', effects: [{ kind: 'lose_hp', amount: 10 }, { kind: 'max_hp', amount: 8 }, { kind: 'add_potion' }] },
    ],
  },
  {
    id: 'lost_child',
    title: '길 잃은 어린아이',
    description: '울고 있는 아이가 길에 앉아 있다. 부모를 잃은 모양이다.',
    choices: [
      { label: '마을까지 데려다준다 (HP -5)', result: '부모가 감사의 표시로 보답했다.', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'gold', amount: 55 }, { kind: 'add_card', rarity: 'common' }] },
      { label: '간식을 나눠준다 (10골드)', result: '아이가 신비한 약병을 건네줬다.', condition: { kind: 'min_gold', amount: 10 }, effects: [{ kind: 'lose_gold', amount: 10 }, { kind: 'heal', amount: 8 }, { kind: 'add_potion' }] },
      { label: '모른척한다', result: '뒷맛이 씁쓸하다.', effects: [] },
    ],
  },
  {
    id: 'cursed_blade',
    title: '저주받은 검',
    description: '땅에 박힌 검이 검은 빛을 흘리고 있다. 강력한 힘이 느껴진다.',
    choices: [
      { label: '뽑아든다', result: '검의 힘을 얻었지만 어두운 흔적이 덱에 새겨졌다.', effects: [{ kind: 'add_card', rarity: 'rare' }, { kind: 'add_curse', count: 1 }] },
      { label: '천으로 감싸 가져간다 (HP -3)', result: '저주를 막으며 검의 힘만 흡수했다.', effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '그대로 둔다', result: '현명한 판단이었다.', effects: [] },
    ],
  },
];
