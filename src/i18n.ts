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
};

export function t(korean: string): string {
  if (currentLang === 'ko') return korean;
  return EN[korean] ?? korean;
}
