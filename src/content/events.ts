export type EventEffect =
  | { kind: 'heal'; amount: number }
  | { kind: 'lose_hp'; amount: number }
  | { kind: 'gold'; amount: number }
  | { kind: 'lose_gold'; amount: number }
  | { kind: 'add_curse'; count: number }
  | { kind: 'add_blessing'; count: number }
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

export type EventMood = 'mystic' | 'dark' | 'warm' | 'gold' | 'nature' | 'danger';

export interface EventDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  mood?: EventMood;
  forClass?: import('../types').CharacterClass;
  choices: EventChoice[];
}

export const EVENT_DEFS: EventDef[] = [
  {
    id: 'old_altar',
    title: '낡은 제단',
    emoji: '🗿',
    mood: 'mystic',
    description: '버려진 제단이 눈앞에 있다. 무언가를 바치면 힘을 얻을 수 있을 것 같다.',
    choices: [
      { label: '제물을 바친다 (HP -8)', result: '제단이 빛을 발하며 최대 HP가 증가했다.', effects: [{ kind: 'lose_hp', amount: 8 }, { kind: 'max_hp', amount: 10 }] },
      { label: '그냥 지나친다', result: '조용히 자리를 떴다.', effects: [] },
    ],
  },
  {
    id: 'golden_idol',
    title: '황금 우상',
    emoji: '🏆',
    mood: 'gold',
    description: '황금빛 우상이 놓여 있다. 강한 기운이 느껴지지만, 저주가 깃들어 있는 것 같다.',
    choices: [
      { label: '집어든다', result: '유물을 손에 넣었지만, 저주가 덱에 스며들었다.', effects: [{ kind: 'add_random_relic' }, { kind: 'add_curse', count: 1 }] },
      { label: '그냥 지나친다', result: '조용히 자리를 떴다.', effects: [] },
    ],
  },
  {
    id: 'secret_lab',
    title: '비밀 실험실',
    emoji: '⚗️',
    mood: 'mystic',
    description: '방치된 실험실이 있다. 실험 장비가 카드를 강화하는 데 사용될 수 있을 것 같다.',
    choices: [
      { label: '실험에 참여한다 (HP -10)', result: '고통스럽지만 카드 2장이 강화되었다.', effects: [{ kind: 'lose_hp', amount: 10 }, { kind: 'upgrade_random', count: 2 }] },
      { label: '장비만 사용한다', result: '카드 1장이 강화되었다.', effects: [{ kind: 'upgrade_random', count: 1 }] },
    ],
  },
  {
    id: 'cursed_cavern',
    title: '저주받은 토굴',
    emoji: '🕳️',
    mood: 'dark',
    description: '금화가 가득한 토굴이 있다. 하지만 어딘가 불길한 기운이 감돈다.',
    choices: [
      { label: '금화를 가져간다', result: '금화를 챙겼지만 저주가 깃들었다.', effects: [{ kind: 'gold', amount: 75 }, { kind: 'add_curse', count: 2 }] },
      { label: '무시한다', result: '현명하게 지나쳤다.', effects: [] },
    ],
  },
  {
    id: 'wounded_mercenary',
    title: '부상당한 용병',
    emoji: '🩸',
    mood: 'warm',
    description: '길가에 쓰러진 용병이 있다. 치료해주면 보답을 하겠다고 한다.',
    choices: [
      { label: '치료해준다', result: '용병이 감사의 표시로 물약을 건네주었다.', effects: [{ kind: 'heal', amount: 12 }, { kind: 'add_potion' }] },
      { label: '카드를 요구한다', result: '용병이 마지못해 카드를 건네주었다.', effects: [{ kind: 'add_card', rarity: 'common' }] },
    ],
  },
  {
    id: 'healing_spring',
    title: '회복의 샘',
    emoji: '💧',
    mood: 'nature',
    description: '맑은 샘물이 솟아나고 있다. 마시면 체력이 회복될 것 같다.',
    choices: [
      { label: '실컷 마신다', result: '샘물을 실컷 마시고 HP를 회복했다.', effects: [{ kind: 'heal', amount: 30 }] },
      { label: '조금만 마시고 물약병에 담는다', result: 'HP를 회복하고 물약을 챙겼다.', effects: [{ kind: 'heal', amount: 15 }, { kind: 'add_potion' }] },
    ],
  },
  {
    id: 'ancient_tome',
    title: '고대 서적',
    emoji: '📜',
    mood: 'mystic',
    description: '먼지가 쌓인 고대 서적이 있다. 강력한 지식이 담겨 있을 것 같다.',
    choices: [
      { label: '읽는다 (HP -6)', result: '지식을 얻었다. 카드가 덱에 추가되었다.', effects: [{ kind: 'lose_hp', amount: 6 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '불태운다', result: '서적을 태워 몸을 녹였다. HP가 회복되었다.', effects: [{ kind: 'heal', amount: 10 }] },
    ],
  },
  {
    id: 'old_coin',
    title: '낡은 동전',
    emoji: '🪙',
    mood: 'gold',
    description: '정체불명의 낡은 동전이 있다. 사용하면 큰돈이 생긴다는 소문이 있다.',
    choices: [
      { label: '동전을 사용한다', result: '금화가 쏟아졌다! 하지만 저주가 따라왔다.', effects: [{ kind: 'gold', amount: 100 }, { kind: 'add_curse', count: 1 }] },
      { label: '버린다', result: '동전을 버렸다.', effects: [] },
    ],
  },
  {
    id: 'merchant_deal',
    title: '상인의 제안',
    emoji: '💼',
    mood: 'gold',
    description: '수상한 상인이 희귀 물건을 팔겠다고 제안한다. (75골드)',
    choices: [
      { label: '75골드에 구매한다', result: '희귀한 물건을 손에 넣었다.', condition: { kind: 'min_gold', amount: 75 }, effects: [{ kind: 'lose_gold', amount: 75 }, { kind: 'add_random_relic' }] },
      { label: '거절한다', result: '상인이 투덜거리며 떠났다.', effects: [] },
    ],
  },
  {
    id: 'mysterious_chest',
    title: '수수께끼 상자',
    emoji: '🎁',
    mood: 'gold',
    description: '잠겨 있는 상자가 있다. 안에 무엇이 들어있는지 알 수 없다.',
    choices: [
      { label: '열어본다 (HP -5)', result: '상자 안에서 희귀한 카드가 나왔다!', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'add_card', rarity: 'rare' }] },
      { label: '그냥 지나친다', result: '안전하게 지나쳤다.', effects: [] },
    ],
  },
  {
    id: 'abandoned_camp',
    title: '버려진 야영지',
    emoji: '⛺',
    mood: 'warm',
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
    emoji: '🌑',
    mood: 'dark',
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
    emoji: '⛲',
    mood: 'nature',
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
    emoji: '🌊',
    mood: 'mystic',
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
    emoji: '🧒',
    mood: 'warm',
    description: '울고 있는 아이가 길에 앉아 있다. 부모를 잃은 모양이다.',
    choices: [
      { label: '마을까지 데려다준다 (HP -5)', result: '부모가 감사의 표시로 보답했다.', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'gold', amount: 55 }, { kind: 'add_card', rarity: 'common' }] },
      { label: '간식을 나눠준다 (10골드)', result: '아이가 신비한 약병을 건네줬다.', condition: { kind: 'min_gold', amount: 10 }, effects: [{ kind: 'lose_gold', amount: 10 }, { kind: 'heal', amount: 8 }, { kind: 'add_potion' }] },
      { label: '모른척한다', result: '뒷맛이 씁쓸하다.', effects: [] },
    ],
  },
  {
    id: 'forge_master',
    title: '대장장이의 화로',
    emoji: '🔨',
    mood: 'warm',
    description: '거대한 화로 옆에서 대장장이가 망치를 두드리고 있다. 카드를 단련시켜준다고 한다.',
    choices: [
      { label: '강하게 단련 (HP -7)', result: '화로의 열기에 살이 데였지만 두 장이 단련되었다.', effects: [{ kind: 'lose_hp', amount: 7 }, { kind: 'upgrade_random', count: 2 }] },
      { label: '돈으로 의뢰 (40골드)', result: '대장장이가 카드 한 장을 단단히 다듬어줬다.', condition: { kind: 'min_gold', amount: 40 }, effects: [{ kind: 'lose_gold', amount: 40 }, { kind: 'upgrade_random', count: 1 }] },
      { label: '구경만 한다', result: '대장장이가 미소 지으며 손을 흔들었다.', effects: [] },
    ],
  },
  {
    id: 'masked_oracle',
    title: '가면의 예언자',
    emoji: '🎭',
    mood: 'mystic',
    description: '가면을 쓴 예언자가 운명을 봐주겠다고 한다. 대가가 필요하다.',
    choices: [
      { label: '점을 본다 (30골드)', result: '예언자가 카드 한 장을 보여줬다.', condition: { kind: 'min_gold', amount: 30 }, effects: [{ kind: 'lose_gold', amount: 30 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '피로 점을 본다 (HP -10)', result: '피의 대가로 강한 운명을 받았다.', effects: [{ kind: 'lose_hp', amount: 10 }, { kind: 'add_card', rarity: 'rare' }] },
      { label: '거절한다', result: '예언자가 가면 너머로 웃었다.', effects: [] },
    ],
  },
  {
    id: 'goblin_traveler',
    title: '떠돌이 고블린',
    emoji: '👺',
    mood: 'gold',
    description: '괴상한 짐꾸러미를 진 고블린이 거래를 제안한다. 골드와 물약을 바꿔주거나, 카드와 골드를 바꿔주겠다고 한다.',
    choices: [
      { label: '골드로 물약 구매 (35골드)', result: '고블린이 물약 두 개를 건네줬다.', condition: { kind: 'min_gold', amount: 35 }, effects: [{ kind: 'lose_gold', amount: 35 }, { kind: 'add_potion' }, { kind: 'add_potion' }] },
      { label: '저주를 받고 골드 획득', result: '고블린은 박장대소했다. 손에 묵직한 금화 주머니가 쥐어졌다.', effects: [{ kind: 'add_curse', count: 1 }, { kind: 'gold', amount: 80 }] },
      { label: '쫓아낸다', result: '고블린이 욕설을 퍼부으며 사라졌다.', effects: [] },
    ],
  },
  {
    id: 'forgotten_shrine',
    title: '잊혀진 사당',
    emoji: '⛩️',
    mood: 'nature',
    description: '이끼 낀 작은 사당이 있다. 옅은 신성한 기운이 흐른다.',
    choices: [
      { label: '기도한다', result: '몸이 따뜻해지며 회복되고 새 카드 영감을 얻었다.', effects: [{ kind: 'heal', amount: 15 }, { kind: 'add_card', rarity: 'common' }] },
      { label: '봉헌한다 (25골드)', result: '사당의 빛이 강해지며 두 장이 강화되었다.', condition: { kind: 'min_gold', amount: 25 }, effects: [{ kind: 'lose_gold', amount: 25 }, { kind: 'upgrade_random', count: 2 }] },
      { label: '사당을 부순다', result: '사당이 무너지자 안에서 유물이 굴러나왔다. 어딘가 불길하다.', effects: [{ kind: 'add_random_relic' }, { kind: 'add_curse', count: 2 }] },
    ],
  },
  {
    id: 'mirror_pool',
    title: '거울 연못',
    emoji: '🪞',
    mood: 'mystic',
    description: '거울처럼 잔잔한 수면에 또 다른 자신이 비친다. 거울 속의 자신이 손을 내민다.',
    choices: [
      { label: '거울에 손을 댄다', result: '거울 속의 자신과 힘을 나눴다. 최대 HP가 늘었다.', effects: [{ kind: 'max_hp', amount: 8 }, { kind: 'heal', amount: 8 }] },
      { label: '거울을 깬다 (HP -6)', result: '깨진 거울 조각에서 유물이 드러났다.', effects: [{ kind: 'lose_hp', amount: 6 }, { kind: 'add_random_relic' }] },
      { label: '뒤돌아 떠난다', result: '거울 속의 자신이 손을 내린다.', effects: [] },
    ],
  },
  {
    id: 'cursed_blade',
    title: '저주받은 검',
    emoji: '🗡️',
    mood: 'danger',
    description: '땅에 박힌 검이 검은 빛을 흘리고 있다. 강력한 힘이 느껴진다.',
    choices: [
      { label: '뽑아든다', result: '검의 힘을 얻었지만 어두운 흔적이 덱에 새겨졌다.', effects: [{ kind: 'add_card', rarity: 'rare' }, { kind: 'add_curse', count: 1 }] },
      { label: '천으로 감싸 가져간다 (HP -3)', result: '저주를 막으며 검의 힘만 흡수했다.', effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '그대로 둔다', result: '현명한 판단이었다.', effects: [] },
    ],
  },
  {
    id: 'holy_spring',
    title: '축복받은 샘',
    emoji: '⛲',
    mood: 'warm',
    description: '빛나는 샘이 신성한 기운을 뿜어내고 있다. 그 안에 무언가 빛나는 것이 보인다.',
    choices: [
      { label: '기도를 올린다 (HP -5)', result: '샘의 축복이 덱에 깃들었다.', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'add_blessing', count: 2 }] },
      { label: '물을 마신다', result: '몸에 활력이 돈다.', effects: [{ kind: 'heal', amount: 15 }] },
      { label: '그냥 지나친다', result: '조용히 자리를 떴다.', effects: [] },
    ],
  },
  {
    id: 'cursed_tome',
    title: '저주받은 서고',
    emoji: '📕',
    mood: 'dark',
    description: '먼지 쌓인 서고에서 두 권의 책이 눈에 띈다. 하나는 빛나고, 하나는 어둠을 품고 있다.',
    choices: [
      { label: '빛나는 책을 펼친다', result: '축복의 힘이 깃들었지만, 어둠도 함께 스며들었다.', effects: [{ kind: 'add_blessing', count: 1 }, { kind: 'add_curse', count: 1 }] },
      { label: '어두운 책을 펼친다', result: '강력한 힘을 얻었지만 대가가 따른다.', effects: [{ kind: 'add_card', rarity: 'rare' }, { kind: 'add_curse', count: 2 }] },
      { label: '둘 다 내려놓는다', result: '현명한 선택이다.', effects: [{ kind: 'upgrade_random', count: 1 }] },
    ],
  },
  {
    id: 'gambler_den',
    title: '도박꾼의 소굴',
    emoji: '🎲',
    mood: 'gold',
    description: '어둠 속에서 주사위 소리가 울린다. 수상한 남자가 판돈을 걸자고 한다.',
    choices: [
      { label: '50골드를 건다', result: '운이 좋았다! 큰 이익을 남겼다.', condition: { kind: 'min_gold', amount: 50 }, effects: [{ kind: 'lose_gold', amount: 50 }, { kind: 'gold', amount: 120 }] },
      { label: '소지금 전부를 건다 (HP -10)', result: '모 아니면 도. 유물 하나를 얻었지만 대가가 컸다.', effects: [{ kind: 'lose_hp', amount: 10 }, { kind: 'add_random_relic' }] },
      { label: '지나친다', result: '도박에는 관심 없다.', effects: [] },
    ],
  },
  {
    id: 'dimensional_rift',
    title: '차원의 틈',
    emoji: '🌀',
    mood: 'mystic',
    description: '공간에 균열이 생겨 보랏빛 빛이 새어 나온다. 손을 넣으면 무엇이든 나올 것 같다.',
    choices: [
      { label: '손을 넣는다', result: '차원 너머에서 강력한 카드가 왔다!', effects: [{ kind: 'add_card', rarity: 'rare' }, { kind: 'lose_hp', amount: 8 }] },
      { label: '몸을 던진다 (HP -15)', result: '차원을 넘어갔다 돌아왔다. 몸은 아프지만 많은 것을 얻었다.', effects: [{ kind: 'lose_hp', amount: 15 }, { kind: 'add_random_relic' }, { kind: 'upgrade_random', count: 2 }] },
      { label: '물러선다', result: '균열이 서서히 닫혔다.', effects: [] },
    ],
  },
  {
    id: 'wandering_bard',
    title: '떠돌이 음유시인',
    emoji: '🎵',
    mood: 'warm',
    description: '모닥불 옆에서 음유시인이 노래를 부르고 있다. 노래를 들으면 마음이 편안해질 것 같다.',
    choices: [
      { label: '노래를 듣는다', result: '아름다운 선율에 마음이 치유되었다.', effects: [{ kind: 'heal', amount: 20 }] },
      { label: '함께 노래한다 (15골드)', result: '시인이 감사하며 특별한 포션을 건넨다.', condition: { kind: 'min_gold', amount: 15 }, effects: [{ kind: 'lose_gold', amount: 15 }, { kind: 'add_potion' }, { kind: 'add_potion' }] },
      { label: '그냥 지나친다', result: '노래 소리가 점점 멀어진다.', effects: [] },
    ],
  },
  {
    id: 'ancient_guardian',
    title: '고대의 수호자',
    emoji: '🗽',
    mood: 'mystic',
    description: '돌로 된 거대한 수호자상이 길을 막고 있다. 통과하려면 시련을 받아야 한다.',
    choices: [
      { label: '힘의 시련 (HP -12)', result: '시련을 통과했다. 수호자가 유물을 건넨다.', effects: [{ kind: 'lose_hp', amount: 12 }, { kind: 'add_random_relic' }] },
      { label: '지혜의 시련 (30골드)', result: '지식의 대가를 치르자 카드 두 장이 강화되었다.', condition: { kind: 'min_gold', amount: 30 }, effects: [{ kind: 'lose_gold', amount: 30 }, { kind: 'upgrade_random', count: 2 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '돌아간다', result: '다른 길을 찾는다.', effects: [] },
    ],
  },
  {
    id: 'blood_pact',
    title: '피의 계약',
    emoji: '📜',
    mood: 'danger',
    description: '피로 쓰인 계약서가 바닥에 떨어져 있다. 서명하면 큰 힘을 얻을 수 있지만...',
    choices: [
      { label: '서명한다 (최대HP -8)', result: '계약이 성립되었다. 강력한 힘이 밀려온다.', effects: [{ kind: 'max_hp', amount: -8 }, { kind: 'add_card', rarity: 'rare' }, { kind: 'add_random_relic' }] },
      { label: '찢어버린다', result: '계약서가 불꽃에 사라졌다. 마음이 편안해졌다.', effects: [{ kind: 'heal', amount: 10 }] },
    ],
  },
  {
    id: 'fairy_garden',
    title: '요정의 정원',
    emoji: '🧚',
    mood: 'nature',
    description: '꽃이 만발한 숨겨진 정원. 작은 요정들이 반짝이며 날아다닌다.',
    choices: [
      { label: '요정과 놀아준다', result: '요정들이 선물을 남기고 떠났다.', effects: [{ kind: 'add_potion' }, { kind: 'heal', amount: 10 }] },
      { label: '꽃을 꺾는다', result: '꽃에서 축복의 힘이 피어올랐다.', effects: [{ kind: 'add_blessing', count: 2 }] },
      { label: '정원의 열매를 먹는다', result: '달콤한 열매가 몸에 활력을 불어넣었다.', effects: [{ kind: 'max_hp', amount: 6 }, { kind: 'heal', amount: 6 }] },
    ],
  },
  {
    id: 'treasure_mimic',
    title: '의심스러운 보물상자',
    emoji: '📦',
    mood: 'danger',
    description: '반짝이는 보물상자가 놓여 있다. 하지만 뭔가 이상하다... 상자가 미세하게 떨리고 있다.',
    choices: [
      { label: '조심히 연다', result: '미믹이었다! 싸우다 다쳤지만 보물은 가져왔다.', effects: [{ kind: 'lose_hp', amount: 10 }, { kind: 'gold', amount: 80 }, { kind: 'add_potion' }] },
      { label: '발로 걷어찬다 (HP -5)', result: '미믹이 도망갔다. 뱉어낸 카드를 주웠다.', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '무시한다', result: '상자가 뒤에서 이빨을 드러냈다. 지나치길 잘했다.', effects: [] },
    ],
  },
  {
    id: 'soul_merchant',
    title: '영혼 상인',
    emoji: '👻',
    mood: 'dark',
    description: '반투명한 유령이 가게를 열고 있다. "영혼의 일부와 교환하겠네..."',
    choices: [
      { label: '영혼 조각을 판다 (최대HP -5)', result: '유령이 만족하며 유물을 건넨다.', effects: [{ kind: 'max_hp', amount: -5 }, { kind: 'add_random_relic' }] },
      { label: '골드로 사겠다 (40골드)', result: '유령이 실망하지만 거래를 수락했다.', condition: { kind: 'min_gold', amount: 40 }, effects: [{ kind: 'lose_gold', amount: 40 }, { kind: 'add_card', rarity: 'rare' }] },
      { label: '거절한다', result: '유령이 안개처럼 사라졌다.', effects: [] },
    ],
  },

  // ── 정령술사 전용 이벤트 ──────────────────────────────────────
  {
    id: 'spirit_trial',
    title: '정령의 시련',
    emoji: '🌀',
    mood: 'mystic',
    forClass: 'summoner',
    description: '어둠 속에서 고대 정령이 나타나 영혼의 힘을 시험한다. 시련을 통과하면 보답하겠다고 한다.',
    choices: [
      { label: '영혼을 바친다 (최대HP -6)', result: '정령이 영혼의 힘을 인정하며 강력한 카드를 남겼다.', effects: [{ kind: 'max_hp', amount: -6 }, { kind: 'add_card', rarity: 'rare' }] },
      { label: '정령과 대화한다', result: '정령이 오래된 지혜를 전했다. 카드 2장이 강화되었다.', effects: [{ kind: 'upgrade_random', count: 2 }] },
      { label: '도망친다 (HP -8)', result: '정령의 분노를 겨우 피했다.', effects: [{ kind: 'lose_hp', amount: 8 }] },
    ],
  },
  {
    id: 'soul_well',
    title: '영혼의 우물',
    emoji: '🕳️',
    mood: 'dark',
    forClass: 'summoner',
    description: '영혼이 소용돌이치는 우물이 있다. 속삭이는 목소리가 힘을 나눠주겠다고 한다.',
    choices: [
      { label: '영혼을 흡수한다 (HP -10)', result: '강력한 영혼의 힘이 몸에 깃들었다.', effects: [{ kind: 'lose_hp', amount: 10 }, { kind: 'add_card', rarity: 'rare' }, { kind: 'max_hp', amount: 5 }] },
      { label: '금화를 던진다 (50골드)', result: '영혼들이 감사하며 유물을 건넸다.', condition: { kind: 'min_gold', amount: 50 }, effects: [{ kind: 'lose_gold', amount: 50 }, { kind: 'add_random_relic' }] },
      { label: '무시한다', result: '우물의 속삭임이 점점 희미해졌다.', effects: [] },
    ],
  },
  {
    id: 'ruined_circle',
    title: '소환진의 잔해',
    emoji: '⭕',
    mood: 'mystic',
    forClass: 'summoner',
    description: '바닥에 희미한 소환진이 새겨져 있다. 아직 마력이 남아 있는 것 같다.',
    choices: [
      { label: '소환진을 활성화한다 (HP -7)', result: '소환진에서 정령이 나타나 두 장의 카드를 남기고 사라졌다.', effects: [{ kind: 'lose_hp', amount: 7 }, { kind: 'add_card', rarity: 'uncommon' }, { kind: 'add_card', rarity: 'uncommon' }] },
      { label: '마력만 흡수한다', result: '소환진의 잔여 마력으로 카드가 강화되었다.', effects: [{ kind: 'upgrade_random', count: 1 }] },
      { label: '소환진을 파괴한다 (HP -5)', result: '소환진이 폭발하며 금화가 쏟아졌다.', effects: [{ kind: 'lose_hp', amount: 5 }, { kind: 'gold', amount: 70 }] },
    ],
  },
  {
    id: 'contract_demon',
    title: '계약의 악마',
    emoji: '😈',
    mood: 'danger',
    forClass: 'summoner',
    description: '붉은 눈의 악마가 나타나 속삭인다. "영혼의 조각을 주면 큰 힘을 주마..."',
    choices: [
      { label: '계약한다 (최대HP -10)', result: '악마와 계약했다. 강력한 힘과 유물을 얻었지만, 저주가 따라왔다.', effects: [{ kind: 'max_hp', amount: -10 }, { kind: 'add_random_relic' }, { kind: 'add_card', rarity: 'rare' }, { kind: 'add_curse', count: 1 }] },
      { label: '작은 거래만 한다 (HP -8)', result: '악마가 비웃지만 거래를 수락했다.', effects: [{ kind: 'lose_hp', amount: 8 }, { kind: 'add_card', rarity: 'uncommon' }, { kind: 'add_potion' }] },
      { label: '거절한다', result: '악마가 씩 웃으며 어둠 속으로 사라졌다.', effects: [] },
    ],
  },
];
