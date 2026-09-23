const STORAGE_KEY = 'dod_lang';

export type Lang = 'ko' | 'en';

let currentLang: Lang = 'ko';

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en') currentLang = 'en';
} catch { /* ignore */ }

export function getLang(): Lang { return currentLang; }

export function setLang(lang: Lang): void {
  currentLang = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
}

const EN: Record<string, string> = {
  // ── UI 공통 ──
  '덱 오브 던전': 'Deck of Dungeon',
  '덱빌더 로그라이트': 'Deckbuilder Roguelite',
  '새 게임 시작': 'New Game',
  '이어하기': 'Continue',
  '제목 화면으로': 'Title Screen',
  '확인': 'OK',
  '취소': 'Cancel',
  '닫기': 'Close',

  // ── 타이틀 메뉴 ──
  '도움말': 'Help',
  '도감': 'Codex',
  '도전과제': 'Achievements',
  '통계': 'Stats',
  '기록': 'History',
  '동기화': 'Sync',
  '설정': 'Settings',
  '오늘의 도전': 'Daily Challenge',
  '리더보드': 'Leaderboard',
  '등반 난이도': 'Ascension',
  '기본': 'Normal',
  '카드 프레임': 'Card Frame',

  // ── 전투 UI ──
  '턴 종료': 'End Turn',
  '덱': 'Deck',
  '버림': 'Discard',
  '소멸': 'Exhaust',
  '에너지': 'Energy',
  '공격': 'Attack',
  '방어': 'Skill',
  '효과': 'Power',
  '저주': 'Curse',
  '패배...': 'Defeat...',
  '승리!': 'Victory!',

  // ── 맵 ──
  '전투': 'Combat',
  '일반 전투': 'Combat',
  '엘리트': 'Elite',
  '보스': 'Boss',
  '모닥불': 'Rest',
  '이벤트': 'Event',
  '상점': 'Shop',
  '보물': 'Treasure',
  '시작': 'Start',

  // ── 보상 ──
  '보상 선택': 'Choose Reward',
  '건너뛰기': 'Skip',

  // ── 상점 ──
  '카드 제거': 'Remove Card',

  // ── 휴식 ──
  '휴식': 'Rest',
  '대장간': 'Smith',
  '정화': 'Purge',
  '복제': 'Duplicate',

  // ── 결과 화면 ──
  '결과 공유': 'Share Result',
  '무한 던전 도전': 'Endless Dungeon',

  // ── 설정 ──
  '효과음': 'SFX',
  '배경음악': 'BGM',
  '언어': 'Language',
  '한국어': 'Korean',
  'English': 'English',

  // ── 덱 뷰어 ──
  '전체': 'All',

  // ── 상태이상 ──
  '힘': 'Strength',
  '민첩': 'Dexterity',
  '취약': 'Vulnerable',
  '약화': 'Weak',
  '쇠약': 'Frail',
  '중독': 'Poison',
  '화상': 'Burn',
  '빙결': 'Freeze',
  '재생': 'Regen',
  '가시': 'Thorns',
  '금속화': 'Metallicize',
  '의식': 'Ritual',
  '역장': 'Barrier',

  // ── 캐릭터 이름 ──
  '검사': 'Swordmaster',
  '총잡이': 'Gunner',
  '격투가': 'Fighter',
  '마법사': 'Mage',
  '성직자': 'Priest',
  '도적': 'Thief',
  '정령술사': 'Summoner',
  '공학자': 'Engineer',
  '갬블러': 'Gambler',

  // ── 난이도 수식어 ──
  '적 HP +5%': 'Enemy HP +5%',
  '적 힘 +1': 'Enemy Str +1',
  '시작 덱에 상처 +1': 'Start with +1 Wound',
  '상점 가격 +10%': 'Shop price +10%',
  '시작 HP -4': 'Starting HP -4',
  '적 HP +10% 추가': 'Enemy HP +10% more',
  '휴식 회복량 30%→20%': 'Rest heal 30%→20%',
  '시작 덱에 상처 +1 추가': '+1 more Wound',
  '적 힘 +1 추가': 'Enemy Str +1 more',
  '적 HP +15% 추가': 'Enemy HP +15% more',

  // ── PWA ──
  '홈 화면에 추가': 'Add to Home Screen',
  '앱처럼 바로 실행할 수 있어요': 'Launch it like an app',
  '설치': 'Install',

  // ── 공유 ──
  '결과 이미지가 클립보드에 복사되었습니다!': 'Result image copied to clipboard!',

  // ── 챕터/층 ──
  '챕터': 'Ch.',
  '층': 'F',
  '장': '',
  '개': '',
  '클리어!': 'Clear!',
  '최종 클리어!': 'Final Clear!',
  '챕터 클리어!': 'Chapter Clear!',
  '회복': 'healed',
  '현재': 'now',

  // ── 보스 유물 ──
  '보스 유물 선택 완료': 'Boss Relic Selected',
  '보스 유물 1개를 선택하세요': 'Choose a Boss Relic',
  '보스 유물을 모두 보유 중입니다.': 'All boss relics owned.',
  '획득': 'Owned',
  '선택중': 'Selected',
  '확정': 'Confirm',
  '포기하고 나가기': 'Give Up',

  // ── 패배 화면 ──
  '에게 쓰러졌다': 'defeated you',
  '유물': 'Relics',
  '최종 덱': 'Final Deck',

  // ── 동기화 ──
  '여러 기기에서 같은 진행도를 공유합니다.': 'Sync progress across devices.',
  '동기화 중...': 'Syncing...',
  '로그인': 'Sign In',
  '로그아웃': 'Sign Out',
  '로그아웃 완료': 'Signed out',
  '코드 동기화 켜짐': 'Code sync on',
  '마지막 동기화': 'Last sync',
  '전': 'ago',
  '아직 동기화한 적 없음': 'Never synced',
  '지금 받기': 'Pull',
  '지금 올리기': 'Push',
  '다른 기기 추가': 'Add device',
  '동기화 완료': 'Sync complete',
  '업로드 완료': 'Upload complete',
  '동기화 끄기': 'Disconnect',
  '이 기기에서 동기화를 끕니다. 데이터는 그대로 남아 있습니다.': 'Disconnect sync on this device. Your data will remain.',
  '동기화가 꺼졌습니다': 'Sync disconnected',
  '다른 기기에서 아래 코드를 입력하세요': 'Enter this code on another device',
  '1시간 동안 유효': 'Valid for 1 hour',
  '코드 복사': 'Copy Code',
  '코드 복사됨': 'Code copied',
  '클립보드 복사 실패': 'Clipboard copy failed',
  '다른 기기의 8자리 코드 입력': 'Enter 8-digit code from another device',
  '형식이 맞지 않습니다. 예: DNC-4F2X': 'Invalid format. Example: DNC-4F2X',
  '연결 중...': 'Connecting...',
  '연결': 'Connect',
  '연결 완료': 'Connected',
  '연결 및 데이터 합치기 완료': 'Connected & data merged',
  '연결 실패': 'Connection failed',
  '새 코드 생성 중...': 'Generating code...',
  '코드 생성 완료': 'Code generated',
  '코드로 새 동기화': 'Sync with code',
  '코드 입력해서 연결': 'Enter code to connect',
  '또는': 'or',
  'Google 로그인 중...': 'Signing in with Google...',
  '클라우드 데이터와 합침 완료': 'Merged with cloud data',
  '로그인 완료 — 데이터 업로드됨': 'Signed in — data uploaded',
  '클라우드에서 받아오는 중...': 'Pulling from cloud...',
  '클라우드에 올리는 중...': 'Pushing to cloud...',
  '방금': 'just now',
  '분': 'min',
  '시간': 'hr',
  '일': 'd',

  // ── 도감 ──
  '발견한 카드와 유물을 모두 모아보세요. 미발견 항목은 ???로 표시됩니다.': 'Collect all discovered cards and relics. Undiscovered items show as ???.',
  '카드/유물 이름 검색...': 'Search cards/relics...',
  '카드': 'Cards',
  '← 제목으로': '← Title',
  '도감 초기화': 'Reset Codex',
  '도감을 초기화합니다. 발견 기록이 모두 사라집니다. 계속할까요?': 'Reset codex? All discovery records will be lost.',
  '미발견': 'Undiscovered',
  '발견': 'Found',
  '스타터': 'Starter',
  '커먼': 'Common',
  '언커먼': 'Uncommon',
  '레어': 'Rare',

  // ── 맵 UI ──
  '시작 지점': 'Start',
  '데일리': 'Daily',
  '기본 난이도': 'Normal difficulty',
  '의지의 열쇠': 'Key of Will',
  '감정의 열쇠': 'Key of Emotion',
  '육체의 열쇠': 'Key of Body',
  '노드를 클릭해서 이동하세요': 'Click a node to move',
  '상점 폐쇄': 'Shop Closed',
  '상점 이용 불가': 'Shop unavailable',
  '몬스터와 싸워 골드와 카드 보상을 획득합니다.': 'Fight monsters for gold and card rewards.',
  '강력한 적. 쓰러뜨리면 희귀 유물을 얻습니다.': 'Powerful foe. Defeat for a rare relic.',
  'HP를 회복하거나 카드를 강화할 수 있습니다.': 'Heal HP or upgrade a card.',
  '골드와 카드 선택 보상을 받습니다.': 'Receive gold and card choice rewards.',
  '카드·유물 구매 및 카드 제거 서비스.': 'Buy cards/relics and remove cards.',
  '후보': 'Bosses',
  '예상치 못한 만남. 선택에 따라 다른 결과가...': 'An unexpected encounter. Your choice matters...',

  // ── 휴식 UI ──
  '한 가지를 선택하세요': 'Choose one',
  '카드 강화': 'Upgrade',
  '← 뒤로': '← Back',
  '데일리 제약: 강화 봉인': 'Daily: Upgrade locked',
  '강화 봉인': 'Locked',
  '데일리 제약: 정화 봉인': 'Daily: Purge locked',
  '정화 봉인': 'Locked',
  '카드 복제': 'Duplicate',
  '복제할 카드가 없습니다.': 'No cards to duplicate.',
  '복제할 카드 1장을 선택하세요. 같은 카드 1장이 덱에 추가됩니다.': 'Choose a card to duplicate. A copy will be added.',
  '제거할 카드 1장을 선택하세요': 'Choose a card to remove',
  '덱이 너무 작아 제거할 수 없습니다.': 'Deck too small to remove.',
  '강화 가능한 카드가 없습니다.': 'No cards to upgrade.',
  '강화할 카드 1장을 선택하세요': 'Choose a card to upgrade',
  '이중 강화 (탭하여 확정)': 'Double upgrade (tap to confirm)',
  '강화 미리보기 (탭하여 확정)': 'Upgrade preview (tap to confirm)',

  // ── 보상 UI ──
  '보상': 'Rewards',
  '골드': 'Gold',
  '자동 획득': 'auto-collected',
  '카드 1장 선택 또는 건너뛰기': 'Choose a card or skip',
  '유물 획득': 'Get Relic',
  '최대 보유': 'Max owned',
  '카드 리롤': 'Reroll',
  '보유': 'Have',
  '덱에': 'In deck:',
  '장 보유': '',

  // ── 상점 UI ──
  '보유 골드': 'Gold',
  '카드 제거 서비스': 'Card Removal Service',
  '덱에서 카드 1장을 영구 삭제합니다.': 'Permanently remove a card from your deck.',
  '이용 완료': 'Used',
  '물약 되팔기': 'Sell Potions',
  '개당': 'each',
  '상점 나가기': 'Leave Shop',
  '판매 완료': 'Sold',
  '이미 보유': 'Already owned',
  '물약 가득 (최대 3)': 'Potions full (max 3)',
  '제거할 카드를 선택하세요': 'Choose a card to remove',
  '← 취소': '← Cancel',

  // ── 이벤트 UI ──
  '지도로 돌아가기': 'Return to Map',
  '최대': 'Max',
  '물약': 'Potion',
  '강화': 'Upgrade',
  '축복': 'Blessing',

  // ── 네오 UI ──
  '네오의 축복': "Neow's Blessing",
  '오랜 여정의 시작, 신비한 존재가 당신에게 한 가지 축복을 내린다.': 'At the start of a long journey, a mysterious being grants you one blessing.',
  '거절한다 (보너스 없이 시작)': 'Refuse (start with no bonus)',

  // ── 통계 UI ──
  '통계 대시보드': 'Stats Dashboard',
  '총 런': 'Total Runs',
  '승리': 'Wins',
  '진엔딩': 'True Ending',
  '패배': 'Losses',
  '승률': 'Win Rate',
  '최고 등반': 'Best Ascension',
  '최근 런 타임라인': 'Recent Run Timeline',
  '현재 연승': 'Current Win Streak',
  '연승': ' wins',
  '최고 연승': 'Best Win Streak',
  '현재 연패': 'Current Loss Streak',
  '연패': ' losses',
  '캐릭터별 승률': 'Win Rate by Character',
  '사망 원인 TOP 5': 'Top 5 Causes of Death',
  '캐릭터별 상세': 'Character Details',
  '런': 'Runs',
  '과거': 'Past',
  '최근': 'Recent',
  '회': 'x',
  '통계 초기화': 'Reset Stats',
  '통계를 모두 초기화합니다. 계속할까요?\n(등반 해금은 유지됩니다)': 'Reset all stats? (Ascension unlocks are kept)',

  // ── 런 기록 UI ──
  '런 기록': 'Run History',
  '기록 삭제': 'Delete History',
  '런 기록을 모두 삭제합니다. 계속할까요?': 'Delete all run history?',
  '아직 기록된 런이 없습니다.': 'No runs recorded yet.',
  '판': 'run',
  '일반 클리어': 'Cleared',
  '진엔딩 클리어': 'True Ending Clear',
  '진엔딩 클리어!': 'True Ending Clear!',
  '보스 처치!': 'Boss Defeated!',
  '엘리트 처치!': 'Elite Defeated!',
  '챕터 3 보스 클리어': 'Chapter 3 Boss Clear',
  '챕터 4 클리어': 'Chapter 4 Clear',
  '승': 'W',
  '패': 'L',
  '총': 'Total',
  '클리어': 'Clear',
  '도달': 'Reached',
  '클래스': 'Class',

  // ── 도전과제 UI ──
  '도전과제 초기화': 'Reset Achievements',
  '도전과제 기록을 모두 초기화합니다. 계속할까요?': 'Reset all achievements?',
  '달성': 'Done',
  '개 더 달성': ' more to go',
  '다음 칭호': 'Next Title',
  '칭호': 'Title',
  '칭호 없음': 'No Title',
  '아직 기록이 없습니다.': 'No records yet.',

  // ── 데일리 UI ──
  '매일 모두에게 같은 시드 / 캐릭터 / 제약. 동기화 켜져 있으면 결과도 클라우드에 저장.': 'Same seed/character/rules for everyone. Syncs to cloud if enabled.',
  '도전 시작': 'Start Challenge',
  '내일 새 도전이 열립니다.': 'New challenge opens tomorrow.',
  '진행 중인 오늘의 도전이 있습니다.': "Today's challenge is in progress.",
  '진행 중인 일반 런이 있습니다. 데일리를 시작하면 기존 진행이 삭제됩니다. 계속할까요?': 'A normal run is in progress. Starting daily will delete it. Continue?',
  '오늘의 도전을 포기합니다. 실패로 기록되고 내일까지 재도전 불가능합니다.': 'Abandon challenge? It will be recorded as a loss and locked until tomorrow.',
  '오늘': 'Today',
  '어제': 'Yesterday',
  '최근 도전': 'Recent Challenges',
  '완료': 'Done',
  '실패': 'Failed',
  '미클리어': 'Not Cleared',
  '그만두기': 'Give Up',
  '포기': 'Forfeit',
  '점수': 'Score',
  '점수 등록': 'Submit Score',
  '제출 중...': 'Submitting...',
  '등록 완료!': 'Submitted!',
  '등록 실패': 'Submit Failed',
  '닉네임': 'Nickname',
  '닉네임 (최대 12자)': 'Nickname (max 12 chars)',
  '익명 모험가': 'Anonymous',
  '리더보드 보기': 'View Leaderboard',
  '리더보드를 불러올 수 없습니다.': 'Could not load leaderboard.',
  '네트워크 오류': 'Network Error',
  '오류': 'Error',
  '로딩 중...': 'Loading...',
  '쉬움': 'Easy',
  '보통': 'Normal',
  '어려움': 'Hard',

  // ── 무한 던전 UI ──
  '무한 던전': 'Endless Dungeon',
  '끝없는 적의 물결이 밀려옵니다. 얼마나 오래 버틸 수 있을까요? 웨이브가 올라갈수록 적이 강해지지만, 매 웨이브 보상으로 성장할 수 있습니다.': 'Endless waves of enemies. How long can you survive? Enemies grow stronger each wave, but you earn rewards to keep up.',
  '웨이브': 'Wave',
  '최종 웨이브': 'Final Wave',
  '무한 던전 종료': 'Endless Dungeon Over',
  '⬇ 보상을 선택하세요': '⬇ Choose a reward',
  '카드 강화 완료': 'Card Upgraded',
  '강화할 카드 없음': 'No cards to upgrade',
  '물약 슬롯이 가득 참': 'Potion slots full',
  '랜덤 카드 1장 강화': 'Upgrade a random card',
  '랜덤 물약 1개': 'Random potion',
  '최대 HP +8': 'Max HP +8',
  '최대 HP +8, 즉시 회복': 'Max HP +8, heal now',
  'HP 30% 회복': 'Heal 30% HP',
  '힘 +1 (영구)': 'Strength +1 (permanent)',
  '민첩 +1 (영구)': 'Dexterity +1 (permanent)',
  '힘 강화': 'Str Boost',
  '민첩 강화': 'Dex Boost',
  '생명력 강화': 'HP Boost',
  '치유': 'Heal',
  '최대 HP': 'Max HP',

  // ── 캐릭터 선택 UI ──
  '캐릭터 선택': 'Select Character',
  '플레이할 직업을 선택하세요': 'Choose a class to play',
  '시작 유물': 'Starting Relic',
  '시작 덱 (10장)': 'Starting Deck (10 cards)',

  // ── 도움말 UI ──
  '한 번 훑어보면 게임 진행이 훨씬 쉬워집니다.': 'A quick read will make gameplay much easier.',
  '← 전투로': '← Combat',
  '← 맵으로': '← Map',
  '← 돌아가기': '← Back',
  '카드 사용법': 'How to Use Cards',
  '카드 강화 (모닥불 대장간)': 'Card Upgrade (Campfire Smith)',
  '카드 타게팅 — 중요!': 'Card Targeting — Important!',
  '핫키 (PC)': 'Hotkeys (PC)',
  '포션': 'Potion',
  '방어도 & 적 의도': 'Block & Enemy Intent',
  '맵 노드': 'Map Nodes',
  '진엔딩 (키 시스템)': 'True Ending (Key System)',
  '도감 보상': 'Codex Rewards',
  '업적 보상': 'Achievement Rewards',
  '턴': 'Turn',

  // ── 덱 오버레이 ──
  '덱 보기': 'View Deck',
  '이름순': 'By Name',
  '코스트순': 'By Cost',
  '타입순': 'By Type',
  '비어있습니다.': 'Empty.',
  '★ 강화됨': '★ Upgraded',
  '★★ 이중 강화': '★★ Double Upgraded',
  '⚠ 드로우 순서는 매번 섞입니다. 어떤 카드가 들어있는지만 표시합니다.': '⚠ Draw order is shuffled each time. This only shows what cards are in the pile.',

  // ── batch B additions ──

  // ── 도전과제 카테고리 ──
  '진행': 'Progression',
  '캐릭터': 'Character',
  '등반': 'Ascension',
  '수집': 'Collection',

  // ── 도전과제 칭호 (단독) ──
  '초보 모험가': 'Novice Adventurer',
  '숙련된 전사': 'Veteran Warrior',
  '던전 정복자': 'Dungeon Conqueror',
  '전설의 영웅': 'Legendary Hero',

  // ── 상태이상 섹션 ──
  '상태이상': 'Status Effects',

  // ── 도움말 · 카드 사용법 ──
  '카드는 화면 아래쪽 "핸드"에 보입니다. 좌상단의 노란 숫자가 비용(에너지).': 'Cards appear in your "hand" at the bottom. The yellow number (top-left) is the cost (energy).',
  '카드 종류는 3가지:': 'Three card types:',
  '저주 카드: 이벤트에서 획득. 사용 불가, 덱만 차지. (부식: HP-2, 의심: 약화+1, 기생충: 소멸 불가)': 'Curse cards: from events. Unplayable, clutter your deck. (Decay: HP-2, Doubt: Weak+1, Parasite: cannot exhaust)',
  '축복 카드: 이벤트 보상. 0코스트 강력 효과, 소멸.': 'Blessing cards: event reward. 0-cost powerful effect, exhausts.',
  '빨간 자물쇠(': 'Red lock (',
  ')가 뜨면 에너지 부족 — 못 씀.': ') means not enough energy — can\'t play.',
  '카드에 적힌 키워드:': 'Card keywords:',
  '  • 소멸: 사용 후 영구 제거 (보라 디졸브)': '  • Exhaust: permanently removed after use (purple dissolve)',
  '  • 선천: 항상 첫 핸드에 들어옴': '  • Innate: always in your opening hand',
  '  • 유지: 턴 종료해도 핸드에 남음': '  • Retain: stays in hand at end of turn',
  '  • 영구 +N: 사용/처치 시마다 데미지가 영구히 증가 (런 끝까지 누적)': '  • Permanent +N: damage increases permanently per use/kill (lasts entire run)',
  '  • 이번 턴 N번째 이후 / 직전이 OO면: 콤보 조건 — 순서 맞춰 내면 추가 효과': '  • This turn Nth+ / if previous was XX: combo condition — order matters for bonus effect',
  '  • 데미지 = N × …: 누적 공격 수나 이번 턴 카드 수에 비례': '  • Damage = N × …: scales with total attacks or cards played this turn',

  // ── 도움말 · 카드 강화 ──
  '모닥불에서 카드를 강화하면 더 강해집니다.': 'Upgrade cards at the campfire to make them stronger.',
  '  • ★ 강화 (+): 효과/수치 상승': '  • ★ Upgrade (+): improved values',
  '  • ★★ 이중 강화 (++): 한 번 더 강화 (금색). 데미지/방어/회복 추가 +,': '  • ★★ Double Upgrade (++): upgraded again (gold). Extra damage/block/heal +,',
  '    상태이상·드로우·에너지도 추가 상승.': '    status effects, draw, and energy also improved.',
  '모바일에선 대장간에서 카드를 한 번 탭하면 미리보기, 다시 탭하면 확정.': 'On mobile, tap a card once to preview, tap again to confirm.',

  // ── 도움말 · 카드 타게팅 ──
  '적을 직접 지정하는 카드(예: 검격, 산탄)는:': 'Cards that target an enemy (e.g. Slash, Shotgun):',
  '  ① 카드를 한 번 탭/클릭 → 카드가 위로 떠오름 (선택됨)': '  ① Tap/click card once → it rises up (selected)',
  '  ② 그 다음 공격할 적을 탭/클릭 → 발동': '  ② Then tap/click the enemy to attack → activates',
  '적 1마리만 남아있으면 ②번 자동으로 처리됨.': 'If only 1 enemy remains, step ② is automatic.',
  '전체 공격(회전 참격) / 자기 강화(가드, 검의 정수) 같은 건 한 번 탭으로 즉시 발동.': 'AoE attacks / self-buffs activate with a single tap.',

  // ── 도움말 · 에너지 & 턴 ──
  '매 턴 시작 시 에너지 3 충전 (좌측 노란 구슬).': 'Gain 3 energy each turn (yellow orb on the left).',
  '카드 비용만큼 에너지 소모. 모자라면 못 씀.': 'Cards cost energy. Not enough = can\'t play.',
  '턴 종료(우측 버튼 또는 E키) → 적이 행동 → 다음 턴.': 'End turn (right button or E key) → enemies act → next turn.',
  '남은 에너지는 이월 안 됨.': 'Leftover energy does not carry over.',

  // ── 도움말 · 방어도 & 적 의도 ──
  '적 머리 위 표시가 "다음 턴 행동 예고":': 'Icons above enemies show their next action:',
  '숫자 = 공격 (수치는 취약/약화/힘 적용된 실제 데미지)': 'Number = attack (actual damage after Vulnerable/Weak/Strength)',
  '= 방어 / ↑ = 자기 강화 / ↓ = 디버프': '= block / ↑ = self-buff / ↓ = debuff',
  '내 방어도(': 'If your block (',
  ')로 다 막히면 적 의도가 푸르게 표시됨 (안전!).': ') covers the attack, the intent turns blue (safe!).',
  '방어도는 다음 턴 시작 시 사라짐 — 매 턴 새로 쌓아야 함.': 'Block resets at the start of each turn — rebuild it every turn.',

  // ── 도움말 · 상태이상 ──
  '아이콘에 마우스 올리거나 탭하면 자세한 설명 + 누적 총량이 뜸.': 'Hover or tap an icon for details and total stacks.',
  '주요 상태이상:': 'Key status effects:',
  '  • 힘 +N: 공격 데미지 +N (영구)': '  • Strength +N: attack damage +N (permanent)',
  '  • 민첩 +N: 획득 방어도 +N (영구)': '  • Dexterity +N: block gained +N (permanent)',
  '  • 취약 +N: 받는 데미지 +50% (N턴)': '  • Vulnerable +N: take +50% damage (N turns)',
  '  • 약화 +N: 주는 데미지 -25% (N턴)': '  • Weak +N: deal -25% damage (N turns)',
  '  • 쇠약 +N: 획득 방어도 -25% (N턴)': '  • Frail +N: block gained -25% (N turns)',
  '  • 중독 +N: 턴 시작 시 N 데미지, N은 1씩 감소': '  • Poison +N: N damage at turn start, decreases by 1',
  '  • 화상 +N: 턴 종료 시 N 데미지 (방어 무시), 1씩 감소': '  • Burn +N: N damage at turn end (ignores block), decreases by 1',
  '  • 빙결 +N: 다음 N턴 동안 행동 불가 (보스는 최대 1턴, 해제 후 2턴 면역)': '  • Freeze +N: unable to act for N turns (bosses: max 1 turn, 2-turn immunity after)',
  '  • 재생 +N: 턴 종료 시 N 회복, 1씩 감소': '  • Regen +N: heal N at turn end, decreases by 1',
  '  • 가시 +N: 공격받을 때마다 N 반사 (영구)': '  • Thorns +N: reflect N when attacked (permanent)',
  '  • 금속화 +N: 턴 종료 시 방어도 +N (영구)': '  • Metallicize +N: gain N block at turn end (permanent)',
  '  • 의식 +N: 턴 종료 시 힘 +N (영구)': '  • Ritual +N: gain N Strength at turn end (permanent)',

  // ── 도움말 · 맵 노드 ──
  '전투 — 일반 몬스터, 골드+카드 보상': 'Combat — normal monsters, gold + card rewards',
  '엘리트 — 강한 적, 희귀 유물 보상.': 'Elite — tough enemy, rare relic reward.',
  '챕터당 첫 엘리트에서': 'First elite per chapter drops',
  '키 드롭': 'a Key',
  '모닥불 — 휴식(HP)/대장간(강화)/정화(제거)/복제 중 1택': 'Campfire — rest (HP) / smith (upgrade) / purge (remove) / duplicate',
  '보물 — 무료 골드+카드 선택': 'Treasure — free gold + card choice',
  '상점 — 카드·유물 구매, 카드 제거': 'Shop — buy cards/relics, remove cards',
  '이벤트 — 선택지에 따라 다른 결과': 'Event — different outcomes per choice',
  '보스 — 챕터 보스. 처치 시 보스 유물 1개 선택': 'Boss — chapter boss. Choose 1 boss relic on defeat',

  // ── 도움말 · 진엔딩 ──
  '각 챕터 첫 엘리트에서 키 1개 획득:': 'Get 1 key from the first elite of each chapter:',
  '  • 챕터 1 → 의지의 열쇠': '  • Chapter 1 → Key of Will',
  '  • 챕터 2 → 감정의 열쇠': '  • Chapter 2 → Key of Emotion',
  '  • 챕터 3 → 육체의 열쇠': '  • Chapter 3 → Key of Body',
  '키 3개 모두 모은 채로 챕터 3 보스 클리어 → 진엔딩 도전 가능.': 'Clear chapter 3 boss with all 3 keys → True Ending unlocked.',
  '진엔딩(챕터 4)은 짧지만 강력한 보스(차원의 지배자 / 시간의 군주 / 공허의 화신 중 하나)가 기다림. 빌드 잘 짜고 가기.': 'True Ending (Ch.4) has a short but powerful boss (Dimensional Overlord / Time Lord / Void Avatar). Build well.',

  // ── 도움말 · 핫키 ──
  '1~9 — 핸드 N번째 카드 선택/사용': '1–9 — select/play Nth card in hand',
  'E 또는 Space — 턴 종료 (카드 선택 중이면 타겟 확정)': 'E or Space — end turn (confirm target if card selected)',
  'Tab — 적 타겟 순환 (적 여러 마리일 때)': 'Tab — cycle enemy targets',
  'Esc — 선택 해제': 'Esc — deselect',

  // ── 도움말 · 포션 ──
  '전투 승리 시 30~50% 확률로 드롭 (최대 3개 보유).': '30–50% drop rate on combat win (max 3).',
  '전투 중 좌측 포션 슬롯 탭으로 즉시 사용.': 'Tap a potion slot on the left during combat to use.',
  '일부 포션(독/화염)은 적을 지정해야 함.': 'Some potions (poison/fire) require a target.',

  // ── 도움말 · 유물 ──
  '영구 효과를 주는 아이템. 한 번 얻으면 런 끝까지 발동.': 'Items with permanent effects. Once obtained, active for the entire run.',
  '엘리트/상점/이벤트/보상에서 획득.': 'Found from elites, shops, events, and rewards.',
  '엘리트 유물: 엘리트 전투에서만 드롭. 클래스 전용 유물 포함.': 'Elite relics: only from elite fights. Includes class-exclusive relics.',
  '시너지: 특정 유물 2개를 함께 보유하면 추가 효과 발동! (금색 테두리)': 'Synergy: owning 2 specific relics triggers a bonus effect! (gold border)',
  '보스 유물(노란색)은 챕터 클리어 시 3개 중 1개 선택 — 매우 강력.': 'Boss relics (yellow) — pick 1 of 3 after clearing a chapter. Very powerful.',

  // ── 도움말 · 도감 보상 ──
  '카드와 유물을 발견할수록 시작 보너스가 해금됩니다.': 'Discover more cards and relics to unlock starting bonuses.',
  '25% (31개) — 시작 골드 +30': '25% (31) — starting gold +30',
  '50% (62개) — 시작 최대HP +5': '50% (62) — starting max HP +5',
  '75% (93개) — 시작 에너지 +1': '75% (93) — starting energy +1',

  // ── 도움말 · 업적 보상 ──
  '업적을 달성할수록 칭호와 시작 보너스를 얻습니다.': 'Earn titles and starting bonuses by completing achievements.',
  '3개 —': '3 —',
  '초보 모험가 (시작 골드 +20)': 'Novice Adventurer (starting gold +20)',
  '8개 —': '8 —',
  '숙련된 전사 (시작 최대HP +3)': 'Veteran Warrior (starting max HP +3)',
  '15개 —': '15 —',
  '던전 정복자 (시작 골드 +30)': 'Dungeon Conqueror (starting gold +30)',
  '22개 —': '22 —',
  '칭호는 리더보드에 표시됩니다.': 'Titles are shown on the leaderboard.',

  // ── 캐릭터 선택 · 서브네임 ──
  '검술사 계열': 'Swordsmanship',
  '저격·포격·기계·화약·돌격': 'Snipe · Bomb · Machine · Gunpowder · Rush',
  '타격·기공·유술·격투': 'Strike · Ki · Grapple · Brawl',
  '원소·소환·전투마법·연금·부여': 'Elemental · Summon · Battle Magic · Alchemy · Enchant',
  '성기사·권성·퇴마·복수': 'Paladin · Holy Fist · Exorcism · Vengeance',
  '암살·강령·인법·그림자': 'Assassin · Necro · Ninjutsu · Shadow',
  '정령·영혼·소환·계약': 'Spirit · Soul · Summon · Pact',
  '드론·기계·화력·자동화': 'Drone · Machine · Firepower · Automation',
  '주사위·도박·행운·배팅': 'Dice · Gamble · Luck · Bet',

  // ── 캐릭터 선택 · 시작 유물 ──
  '불타는 피': 'Burning Blood',
  '구슬 주머니': 'Bag of Marbles',
  '투혼': 'Fighting Spirit',
  '마탑의 결정': 'Mage Orb',
  '성배': 'Holy Chalice',
  '매끈한 돌': 'Oddly Smooth Stone',
  '영혼의 등불': 'Soul Lantern',
  '에너지 배터리': 'Energy Battery',
  '행운의 동전': 'Lucky Coin',

  // ── 캐릭터 선택 · 고유 유물 ──
  '검혼': 'Sword Soul',
  '탄창': 'Ammo Clip',
  '일심': 'One Mind',
  '원소 공명': 'Elemental Resonance',
  '신성한 인장': 'Holy Sigil',
  '독니': 'Venom Fang',
  '정령 계약서': 'Spirit Contract',
  '드론 코어': 'Drone Core',
  '갬블러의 직감': "Gambler's Instinct",

  // ── 캐릭터 선택 · 고유 유물 설명 ──
  '5번째 공격마다 +6 데미지': 'Every 5th attack deals +6 damage',
  '3번째 공격마다 +5 데미지, 카드 1장 드로우': 'Every 3rd attack deals +5 damage, draw 1 card',
  '한 턴 카드 3장 사용 시 힘 +1 (턴당 1회)': 'Play 3 cards in a turn: Strength +1 (once per turn)',
  '방어 카드 사용 시 1장 드로우 (턴당 1회)': 'Playing a skill card draws 1 (once per turn)',
  '회복/재생 발동 시 방어도 +2': 'Heal/Regen triggers grant +2 Block',
  '매 턴 첫 공격이 적에게 중독 +2': 'First attack each turn applies Poison +2',
  'power 카드 사용 시 방어도 +3': 'Playing a power card grants +3 Block',
  'power 카드 사용 시 랜덤 적 4 데미지 + 방어도 +4': 'Playing a power: 4 dmg to random enemy + 4 Block',
  '전투 시작 시 1장 드로우, 힘 +1': 'At combat start: draw 1, Strength +1',

  // ── 캐릭터 선택 · 설명 ──
  '전투 승리 시 HP 6 회복. 강력한 근접 검술로 적을 압도한다.': 'Heal 6 HP on combat win. Overwhelms foes with powerful melee swordplay.',
  '전투 시작 시 모든 적에게 취약 +1. 다양한 총기와 폭발물로 원거리를 지배한다.': 'Apply Vulnerable +1 to all enemies at combat start. Dominates at range with guns and explosives.',
  '전투 시작 시 힘 +2. 맨손과 기의 힘으로 적을 압도한다.': 'Strength +2 at combat start. Overwhelms with fists and ki.',
  '매 턴 시작 시 무작위 적에게 3 데미지. 다양한 원소 마법으로 광역 전투에 강하다.': 'Deal 3 damage to a random enemy each turn. Excels at AoE with elemental magic.',
  '전투 시작 시 재생 +3. 회복과 콤보 타격, HP를 대가로 한 강타까지 다재다능한 성직자.': 'Regen +3 at combat start. Versatile: heals, combos, and HP-cost strikes.',
  '전투 시작 시 민첩 +1. 중독과 다단히트, 그림자를 다루는 날렵한 암살자.': 'Dexterity +1 at combat start. A nimble assassin wielding poison, multi-hits, and shadows.',
  '정령 소환과 영혼 마법으로 전투를 지배하는 정령술사. HP가 낮지만 다양한 power 스케일링이 강하다.': 'A summoner who commands spirits and soul magic. Low HP but strong power scaling.',
  '드론을 배치해 자동 화력을 구축하는 공학자. 드론 데미지는 힘에 비례해 후반 보스전에도 강력하다.': 'An engineer who deploys drones for auto-fire. Drone damage scales with Strength.',
  '운에 모든 것을 건다. 카드 효과가 날카롭지만 일정하지 않아 매 전투가 도박이다.': 'Bets it all on luck. Sharp card effects but inconsistent — every fight is a gamble.',

  // ── 캐릭터 선택 · 플레이스타일 ──
  '근접 공격형': 'Melee Attacker',
  '디버프 콤보형': 'Debuff Combo',
  '힘 스케일링형': 'Strength Scaler',
  '광역 마법형': 'AoE Mage',
  '회복 지속형': 'Sustain Healer',
  '중독 암살형': 'Poison Assassin',
  '소환 스케일형': 'Summon Scaler',
  '드론 자동화형': 'Drone Automator',
  '랜덤 배팅형': 'Random Bettor',

  // ── 캐릭터 선택 · 난이도 설명 ──
  '직관적인 공격 스타일, 입문용으로 추천': 'Straightforward attack style, recommended for beginners',
  '디버프와 콤보 시너지 활용이 핵심': 'Leveraging debuffs and combo synergies is key',
  '높은 체력과 힘 버프로 안정적인 플레이': 'Stable play with high HP and Strength buffs',
  '낮은 체력, 카드 순서와 콤보 관리 필요': 'Low HP, requires careful card order and combo management',
  '회복이 풍부해 실수를 만회하기 쉬움': 'Abundant healing makes mistakes forgiving',
  '낮은 체력, 중독·민첩 콤보를 굴려야 생존': 'Low HP, must leverage poison + dexterity combos to survive',
  '최저 체력, 파워 카드 스케일링에 의존': 'Lowest HP, relies on power card scaling',
  '드론 배치 후 자동 화력, 힘 스케일링 필수': 'Deploy drones for auto-fire, Strength scaling essential',
  '랜덤 기반 고위험/고보상, 운이 곧 전략': 'Random-based high risk/reward — luck is your strategy',
};

export function t(korean: string): string {
  if (currentLang === 'ko') return korean;
  return EN[korean] ?? korean;
}
