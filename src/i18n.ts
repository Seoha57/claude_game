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
};

export function t(korean: string): string {
  if (currentLang === 'ko') return korean;
  return EN[korean] ?? korean;
}
