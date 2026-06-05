// ─────────────────────────────────────────────────────────────────
// 스토리 / 플레이버 텍스트
// 던전앤파이터 세계관 기반의 분위기 텍스트.
// ─────────────────────────────────────────────────────────────────

// 챕터 도입 내레이션 (스플래시 flavor 확장용)
export const CHAPTER_LORE: Record<number, string> = {
  1: '잿빛 안개가 사원을 뒤덮었다. 광기에 물든 것들이 어둠 속에서 꿈틀거린다. 첫 발을 내딛어라.',
  2: '기계 문명의 잔해가 끝없이 펼쳐진다. 추적자들의 붉은 눈이 폐허 사이에서 번뜩인다.',
  3: '이샤리스의 심연. 공허가 살아 숨 쉬는 이곳에서, 약한 자는 흔적도 없이 사라진다.',
  4: '세 개의 열쇠가 균열을 열었다. 차원의 끝, 모든 것의 근원이 그대를 기다린다.',
};

// 보스별 등장 대사 — 보스 인트로 스플래시에 표시
export const BOSS_INTRO_FLAVOR: Record<string, string> = {
  // Chapter 1
  hexaghost: '여섯 영혼이 하나로 타오른다. "재가 되어라."',
  mad_butcher: '피 묻은 칼날이 번뜩인다. "신선한 고기로군."',
  obsidian_golem: '흑요암 거인이 깨어난다. 대지가 진동한다.',
  // Chapter 2
  the_collector: '"네 영혼도 내 수집품이 되겠군." 수집가가 손짓한다.',
  karnak_runemaster: '룬이 허공에 떠오른다. "고대의 지식 앞에 무릎 꿇어라."',
  sirocco_phantom: '모래폭풍 속에서 용의 환영이 일렁인다.',
  // Chapter 3
  void_heart: '공허의 심장이 고동친다. 존재 자체가 일그러진다.',
  death_apostle: '"죽음은 곧 해방이다." 케이지가 미소 짓는다.',
  isaris_overlord: '군림자가 옥좌에서 일어선다. 그 위압에 공기마저 무거워진다.',
  // Chapter 4
  abyss_lord: '차원의 지배자. 모든 균열의 근원. "여기까지 온 것을 후회하게 해주마."',
  time_sovereign: '시간이 일그러진다. "네 끝은 이미 정해져 있다."',
  void_avatar: '공허가 형상을 갖춘다. 그것은 너를 응시하고, 너를 부정한다.',
};

// 보스 처치 후 대사 — 승리 직후 짧게 표시
export const BOSS_DEFEAT_FLAVOR: Record<string, string> = {
  hexaghost: '여섯 영혼이 흩어지며 잿빛 안개가 걷힌다.',
  mad_butcher: '도살자가 자신의 칼날 위로 쓰러진다.',
  obsidian_golem: '거인이 무너져 흑요암 조각으로 부서진다.',
  the_collector: '수집품들이 빛이 되어 흩어진다. 갇혔던 영혼들이 해방되었다.',
  karnak_runemaster: '룬이 산산이 부서지고, 고대의 비밀은 침묵 속에 묻힌다.',
  sirocco_phantom: '모래폭풍이 잦아들고, 용의 환영이 사라진다.',
  void_heart: '공허의 심장이 멈춘다. 일그러진 공간이 제자리를 찾는다.',
  death_apostle: '"드디어... 해방이군." 케이지가 안도하며 스러진다.',
  isaris_overlord: '군림자의 옥좌가 무너진다. 이샤리스가 자유를 되찾았다.',
  abyss_lord: '차원의 지배자가 소멸한다. 모든 균열이 닫히기 시작한다.',
  time_sovereign: '뒤틀린 시간이 바로잡힌다. 정해진 끝은 없었다.',
  void_avatar: '공허가 흩어진다. 너의 존재가 그것을 이겨냈다.',
};

export function bossIntroFlavor(bossId: string, chapter: number): string {
  return BOSS_INTRO_FLAVOR[bossId]
    ?? (chapter === 4 ? '차원의 끝, 진정한 적이 길을 막아선다...' : '강력한 적이 길을 막아선다...');
}

export function bossDefeatFlavor(bossId: string): string | null {
  return BOSS_DEFEAT_FLAVOR[bossId] ?? null;
}

// 카드 플레이버 — 대표/상징적 카드들. 덱 상세 보기에서 효과 아래 한 줄 표시.
export const CARD_FLAVOR: Record<string, string> = {
  // 검귀
  strike: '"베어라. 그게 전부다."',
  bash: '방패째 후려친다. 우아함은 사치다.',
  bludgeon: '폭풍이 칼끝에 깃든다. 모든 것을 쓸어버린다.',
  reaper: '"네 영혼, 내가 거두마."',
  demon_form: '귀신이 눈을 뜬다. 매 순간 강해진다.',
  thousand_cuts: '천 번의 베기. 그 끝에 남는 건 침묵뿐.',
  // 거너
  g_rising_shot: '한 발. 그거면 충분하다.',
  g_overheat: '총열이 붉게 달아오른다. 멈출 수 없다.',
  g_helios: '하늘에서 빛이 떨어진다. 도망칠 곳은 없다.',
  g_overdrive: '방아쇠는 멈추지 않는다.',
  // 격투가
  f_quick_kick: '눈에 보이기 전에 이미 맞았다.',
  f_dragon_fury: '용의 분노가 주먹에 깃든다.',
  f_shadow_kick: '그림자가 먼저 도착한다.',
  // 마법사
  m_magic_missile: '가장 단순한 마법. 가장 확실한 마법.',
  m_arcane_burst: '마력이 폭주한다. 대가는 나중에 치른다.',
  m_time_warp: '시간을 비틀어 한 박자 앞서간다.',
  // 프리스트
  p_smash: '신앙은 주먹으로도 전한다.',
  p_apocalypse: '심판의 날. 그 무게를 견딜 수 있나.',
  p_wrath_of_god: '"신의 진노를 보아라."',
  p_true_avenger: '복수는 나의 것. 모든 것을 불태운다.',
  // 저주
  wound: '잊을 수 없는 상처. 손에 쥘 때마다 욱신거린다.',
};

export function cardFlavor(cardId: string): string | null {
  // 강화/이중강화 접미사 제거 후 기본 id로 조회
  const baseId = cardId.replace(/\+$/, '');
  return CARD_FLAVOR[baseId] ?? CARD_FLAVOR[cardId] ?? null;
}
