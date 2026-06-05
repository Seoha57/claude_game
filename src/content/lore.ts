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

// 카드 플레이버 — 덱 상세 보기에서 효과 아래 한 줄 표시.
export const CARD_FLAVOR: Record<string, string> = {
  // ── 검귀 ──
  strike: '"베어라. 그게 전부다."',
  defend: '막지 못하면 벨 수도 없다.',
  bash: '에쉔 포크의 끝이 살을 파고든다.',
  cleave: '한 호흡에 셋을 가른다.',
  iron_wave: '나아가며 베고, 베며 막는다.',
  pommel_strike: '피가 끓어오를수록 칼은 가벼워진다.',
  twin_strike: '올려친 칼이 두 번 운다.',
  shrug_it_off: '달빛 아래, 상처는 흉터가 된다.',
  thunderclap: '베는 소리가 천둥처럼 퍼진다.',
  heavy_blade: '하늘을 가르는 한 칼.',
  dropkick: '찌르고, 또 찌른다.',
  uppercut: '파동이 검을 타고 적을 꿰뚫는다.',
  bloodletting: '피를 흘려 길을 연다.',
  ghostly_armor: '도(刀)를 다루는 자에게 빈틈은 없다.',
  inflame: '검에 분노를 새긴다.',
  rage: '쓰러져도 다시 일어선다.',
  metallicize_card: '대검은 곧 갑옷이 된다.',
  mugeukdo: '극에 다다른 칼은 끝이 없다.',
  chain_release: '사슬이 풀리는 순간, 힘이 깨어난다.',
  bludgeon: '폭풍이 칼끝에 깃든다. 모든 것을 쓸어버린다.',
  demon_form: '귀신이 눈을 뜬다. 매 순간 강해진다.',
  feed: '죽음을 삼켜 더 강해진다.',
  immolate: '일곱 번째 귀신이 모든 것을 태운다.',
  reaper: '"네 영혼, 내가 거두마."',
  chain_slash: '한 번의 베기가 다음 베기를 부른다.',
  lingering_image: '잔상이 본체보다 먼저 벤다.',
  thousand_cuts: '천 번의 베기. 그 끝에 남는 건 침묵뿐.',
  twin_slash: '두 번 그어 확인 사살.',
  sword_phantom: '검의 환영은 막을 수 없다.',
  infinite_cut: '끝이 보이지 않는 연격.',
  awakening: '잠들었던 힘이 깨어난다.',
  demon_one_slash: '한 칼에 귀신마저 갈라낸다.',

  // ── 거너 ──
  g_rising_shot: '한 발. 그거면 충분하다.',
  g_reload: '재장전마저 공격이 된다.',
  g_headshot: '먼지 한 톨까지 조준한다.',
  g_frag: '돌면서 쏘면 누구도 다가오지 못한다.',
  g_armor: '얼어붙은 탄환이 발을 묶는다.',
  g_viper: '바베큐처럼 노릇하게 익혀주마.',
  g_optical: '한 호흡에 모든 것을 계산한다.',
  g_ammo: '조준은 곧 정보다.',
  g_reposit: '한 걸음 물러서며 한 발 더.',
  g_reinforce: '대전차포 앞에 장벽은 없다.',
  g_sparrow: '기계는 거짓말하지 않는다.',
  g_napalm: '불길은 물러서지 않는다.',
  g_g14: '터지는 순간, 약점이 드러난다.',
  g_satellite: '하늘에서 내려오는 심판.',
  g_barrage: '공중에서 쏟아지는 탄막.',
  g_burst_fire: '처벌은 단호하고 빠르다.',
  g_cannonball: '개틀링의 노래는 멈추지 않는다.',
  g_western_fire: '서부의 사나이는 발로도 쏜다.',
  g_overheat: '총열이 붉게 달아오른다. 멈출 수 없다.',
  g_mech_drop: '카운트다운이 끝나면, 끝이다.',
  g_arms_dealer: '뽑는 순간 승부는 끝나 있다.',
  g_airstrike: '은빛 탄환은 빗나가지 않는다.',
  g_gods_hail: '신의 우박이 쏟아진다.',
  g_divergent: '갈라지는 탄도, 갈라지는 운명.',
  g_carpet_bomb: '한 평도 남기지 않는다.',
  g_overdrive: '방아쇠는 멈추지 않는다.',
  g_smoke_grenade: '보이지 않으면 맞출 수도 없다.',
  g_sniper: '숨을 멈추고, 세상을 멈춘다.',
  g_grenade_launcher: '곡사의 미학.',
  g_kevlar: '맞아도 되돌려준다.',
  g_helios: '하늘에서 빛이 떨어진다. 도망칠 곳은 없다.',

  // ── 격투가 ──
  f_quick_kick: '눈에 보이기 전에 이미 맞았다.',
  f_nen_guard: '기로 두른 몸은 강철보다 단단하다.',
  f_upper_kick: '하늘로 띄워 올린다.',
  f_low_kick: '발목을 노리는 한 수.',
  f_combo: '연결되면 멈출 수 없다.',
  f_heavy_punch: '해머처럼 내리꽂는다.',
  f_nen_bullet: '기를 응축해 쏘아낸다.',
  f_iron_body: '흔들려도 무너지지 않는다.',
  f_flame_kick: '발끝에 불꽃이 인다.',
  f_dragon_kick: '용의 기세로 연격한다.',
  f_saro_hwanyeol: '불의 고리가 적을 가둔다.',
  f_red_dragon: '적룡의 분노가 깨어난다.',
  f_my_rhythm: '나의 리듬에 맞춰 춤춰라!',
  f_focused_strike: '첫 일격에 모든 것을 담는다.',
  f_combo_punch: '주먹이 주먹을 부른다.',
  f_dragon_fury: '용의 분노가 주먹에 깃든다.',
  f_jab: '가볍게, 그러나 끊임없이.',
  f_combination: '정해진 순서, 정해진 승리.',
  f_counter: '받아치는 자가 이긴다.',
  f_rage_burst: '분노를 터뜨려 길을 연다.',
  f_shadow_kick: '그림자가 먼저 도착한다.',
  f_ten_count: '카운트가 쌓일수록 마지막 일격은 무거워진다.',

  // ── 마법사 ──
  m_magic_missile: '가장 단순한 마법. 가장 확실한 마법.',
  m_aura_shield: '오라가 몸을 감싼다.',
  m_phase_shift: '위상을 비틀어 빈틈을 만든다.',
  m_lantern: '랜턴의 불씨가 적을 사른다.',
  m_frost: '서리가 머리부터 얼린다.',
  m_whip: '채찍이 허공을 가른다.',
  m_skystrike: '하늘에서 내리꽂는 일격.',
  m_petal: '꽃잎처럼 흩날리는 칼날.',
  m_doll_forest: '인형들이 숲을 이룬다.',
  m_fusion: '원소가 하나로 융합한다.',
  m_kasiyas: '정복자의 이름으로 명한다.',
  m_marionette: '실 끝에서 춤추게 하라.',
  m_quasar: '별의 폭발을 손에 담는다.',
  m_chain_lightning: '번개가 적에서 적으로 옮겨간다.',
  m_arcane_burst: '마력이 폭주한다. 대가는 나중에 치른다.',
  m_ouroboros: '끝이 시작을 삼킨다.',
  m_frost_bolt: '차가운 화살이 심장을 노린다.',
  m_mana_charge: '마나를 끌어모아 한 박자 빠르게.',
  m_fire_burst: '불씨가 폭발로 번진다.',
  m_energy_circuit: '마력 회로가 끊임없이 돈다.',
  m_time_warp: '시간을 비틀어 한 박자 앞서간다.',
  m_arcane_orb: '응축된 마력 구체가 빈틈을 노린다.',

  // ── 프리스트 ──
  p_smash: '신앙은 주먹으로도 전한다.',
  p_holy_guard: '신성한 가호가 방패가 된다.',
  p_lucky_strike: '행운도 실력의 일부다.',
  p_slow_heal: '천천히, 그러나 확실히 아문다.',
  p_cure: '상처를 씻고 다시 나아간다.',
  p_pure_blade: '순백의 칼날에 거짓은 없다.',
  p_falling_phoenix: '봉황이 떨어지듯 내리꽂는다.',
  p_gong_cham: '하늘을 가르는 두 번의 베기.',
  p_holy_chant: '성가가 힘을 북돋운다.',
  p_rage_grip: '분노로 적을 움켜쥔다.',
  p_second_upper: '두 번째 어퍼가 진짜다.',
  p_dragon_punch: '창룡이 솟구쳐 오른다.',
  p_holy_water: '성수가 몸과 영혼을 치유한다.',
  p_punishment: '죄에는 징벌이 따른다.',
  p_doom_guardian: '파멸의 수호자가 길을 막는다.',
  p_victory_spear: '승리의 창은 점점 날카로워진다.',
  p_holy_charge: '신성한 기운을 충전한다.',
  p_holy_sanctuary: '성역 안에서는 모두가 약해진다.',
  p_grand_cross: '거대한 십자가가 내려온다.',
  p_painful_joy: '고통 속에서 희열을 찾는다.',
  p_apocalypse: '심판의 날. 그 무게를 견딜 수 있나.',
  p_divine_punishment: '신의 벌은 불꽃으로 내린다.',
  p_holy_judgment: '심판의 빛이 상처를 씻는다.',
  p_immortal: '불멸의 의지는 꺾이지 않는다.',
  p_true_avenger: '복수는 나의 것. 모든 것을 불태운다.',
  p_holy_avalanche: '성스러운 눈사태가 모든 것을 휩쓴다.',
  p_blessed_blade: '축복받은 칼날이 빛난다.',
  p_meditation: '묵상 끝에 길이 보인다.',
  p_holy_shield: '신성한 방패는 되받아친다.',
  p_faith_strike: '신앙이 깃든 일격.',
  p_requiem: '진혼의 노래가 적을 잠재운다.',
  p_radiance: '광휘가 적을 얼어붙게 한다.',
  p_wrath_of_god: '"신의 진노를 보아라."',
  p_prayer: '한 줄기 기도가 상처를 어루만진다.',
  p_smite: '죄인에게 내리는 응징.',

  // ── 도적 ──
  t_slicer: '한 번 그으면 충분하다.',
  t_bone_shield: '뼈로 두른 방패는 부러지지 않는다.',
  t_rising_cut: '아래에서 위로, 한 호흡에.',
  t_shining_cut: '빛처럼 빠른 두 번의 베기.',
  t_kunai: '던지고, 다음 수를 본다.',
  t_dark_soul: '어둠이 칼끝에 스며든다.',
  t_ankle_strike: '발목을 끊으면 누구도 도망치지 못한다.',
  t_flying_squirrel: '바람을 타고 흐른다.',
  t_molting: '허물을 벗듯 공격을 흘려보낸다.',
  t_shadow_cut: '그림자가 먼저 벤다.',
  t_diving_arrow: '하늘에서 내리꽂는 일격.',
  t_quick_step: '한 박자 빠르게, 한 수 앞서.',
  t_poison_dagger: '작은 칼, 치명적인 독.',
  t_neck_snap: '소리 없이, 단번에.',
  t_backstab: '등 뒤에서, 첫 일격이 가장 깊다.',
  t_toxic_spread: '한 방울이 온몸을 좀먹는다.',
  t_eraser: '존재를 지운다.',
  t_curse_spear: '저주가 창끝에 깃든다.',
  t_flame_slash: '불꽃이 어둠을 가른다.',
  t_shadow_clone: '분신은 진짜보다 빠르다.',
  t_venom_burst: '독무가 전장을 뒤덮는다.',
  t_assassinate: '암살에 두 번은 없다.',
  t_dagger_throw: '쉴 새 없이 쏟아지는 칼날.',
  t_dance: '죽음의 무도가 시작된다.',
  t_silver_stream: '은빛 잔상이 흐른다.',
  t_combo_strike: '연계가 쌓일수록 칼은 날카로워진다.',
  t_grave_curse: '무덤에서 피어오르는 독기.',
  t_misty_step: '안개 속으로 사라진다.',
  t_balakar: '발라크르여, 내 몸에 강림하라.',
  t_yasakani: '곡옥이 회전하며 모두를 벤다.',
  t_death_shadow: '절명의 그림자는 피할 수 없다.',
  t_silvermoon: '은빛 달 아래, 칼은 멈추지 않는다.',
  t_plague: '역병이 모든 것을 잠식한다.',
  t_nightmare: '악몽에서 깨어날 수 없다.',
  t_phantom_blade: '환영의 칼날이 춤춘다.',

  // ── 저주 ──
  wound: '잊을 수 없는 상처. 손에 쥘 때마다 욱신거린다.',
};

export function cardFlavor(cardId: string): string | null {
  // 강화/이중강화 접미사 제거 후 기본 id로 조회
  const baseId = cardId.replace(/\+$/, '');
  return CARD_FLAVOR[baseId] ?? CARD_FLAVOR[cardId] ?? null;
}
