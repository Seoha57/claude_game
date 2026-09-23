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
};

export function t(korean: string): string {
  if (currentLang === 'ko') return korean;
  return EN[korean] ?? korean;
}
