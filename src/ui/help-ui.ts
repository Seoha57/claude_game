import { el } from './dom';
import { setScreen } from '../state';

type HelpLine = string | { text: string; highlight?: boolean };

export function renderHelp(): HTMLElement {
  const wrapper = el('div', { class: 'help-screen' });

  wrapper.appendChild(el('h1', { style: { color: 'var(--accent)', margin: '0' } }, '❓ 도움말'));
  wrapper.appendChild(
    el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' } },
      '한 번 훑어보면 게임 진행이 훨씬 쉬워집니다.'),
  );

  wrapper.appendChild(section('🃏 카드 사용법', [
    '카드는 화면 아래쪽 "핸드"에 보입니다. 좌상단의 노란 숫자가 비용(에너지).',
    '카드 종류는 3가지: ⚔ 공격 / 🛡 스킬 / ✨ 파워.',
    '빨간 자물쇠(🔒)가 뜨면 에너지 부족 — 못 씀.',
    '카드에 적힌 키워드:',
    '  • 소멸: 사용 후 영구 제거 (보라 디졸브)',
    '  • 선천: 항상 첫 핸드에 들어옴',
    '  • 유지: 턴 종료해도 핸드에 남음',
    '  • 영구 +N: 사용/처치 시마다 데미지가 영구히 증가 (런 끝까지 누적)',
    '  • 이번 턴 N번째 이후 / 직전이 OO면: 콤보 조건 — 순서 맞춰 내면 추가 효과',
    '  • 데미지 = N × …: 누적 공격 수나 이번 턴 카드 수에 비례',
  ]));

  wrapper.appendChild(section('✦ 카드 강화 (모닥불 대장간)', [
    '모닥불에서 카드를 강화하면 더 강해집니다.',
    '  • ★ 강화 (+): 효과/수치 상승',
    '  • ★★ 이중 강화 (++): 한 번 더 강화 (금색). 데미지/방어/회복 추가 +,',
    '    상태이상·드로우·에너지도 추가 상승.',
    '모바일에선 대장간에서 카드를 한 번 탭하면 미리보기, 다시 탭하면 확정.',
  ]));

  wrapper.appendChild(section('🎯 카드 타게팅 — 중요!', [
    '적을 직접 지정하는 카드(예: 검격, 산탄)는:',
    { text: '  ① 카드를 한 번 탭/클릭 → 카드가 위로 떠오름 (선택됨)', highlight: true },
    { text: '  ② 그 다음 공격할 적을 탭/클릭 → 발동', highlight: true },
    '적 1마리만 남아있으면 ②번 자동으로 처리됨.',
    '전체 공격(회전 참격) / 자기 강화(가드, 검의 정수) 같은 건 한 번 탭으로 즉시 발동.',
  ]));

  wrapper.appendChild(section('⚡ 에너지 & 턴', [
    '매 턴 시작 시 에너지 3 충전 (좌측 노란 구슬).',
    '카드 비용만큼 에너지 소모. 모자라면 못 씀.',
    '턴 종료(우측 버튼 또는 E키) → 적이 행동 → 다음 턴.',
    '남은 에너지는 이월 안 됨.',
  ]));

  wrapper.appendChild(section('🛡 방어도 & 적 의도', [
    '적 머리 위 표시가 "다음 턴 행동 예고":',
    '  ⚔ 숫자 = 공격 (수치는 취약/약화/힘 적용된 실제 데미지)',
    '  🛡 = 방어 / ↑ = 자기 강화 / ↓ = 디버프',
    '내 방어도(🛡)로 다 막히면 적 의도가 푸르게 표시됨 (안전!).',
    '방어도는 다음 턴 시작 시 사라짐 — 매 턴 새로 쌓아야 함.',
  ]));

  wrapper.appendChild(section('✨ 상태이상', [
    '아이콘에 마우스 올리거나 탭하면 자세한 설명 + 누적 총량이 뜸.',
    '주요 상태이상:',
    '  • 힘 +N: 공격 데미지 +N (영구)',
    '  • 민첩 +N: 획득 방어도 +N (영구)',
    '  • 취약 +N: 받는 데미지 +50% (N턴)',
    '  • 약화 +N: 주는 데미지 -25% (N턴)',
    '  • 쇠약 +N: 획득 방어도 -25% (N턴)',
    '  • 중독 +N: 턴 시작 시 N 데미지, N은 1씩 감소',
    '  • 화상 +N: 턴 종료 시 N 데미지 (방어 무시), 1씩 감소',
    '  • 빙결 +N: 다음 N턴 동안 행동 불가 (보스는 최대 1턴, 해제 후 2턴 면역)',
    '  • 재생 +N: 턴 종료 시 N 회복, 1씩 감소',
    '  • 가시 +N: 공격받을 때마다 N 반사 (영구)',
    '  • 금속화 +N: 턴 종료 시 방어도 +N (영구)',
    '  • 의식 +N: 턴 종료 시 힘 +N (영구)',
  ]));

  wrapper.appendChild(section('🗺 맵 노드', [
    '⚔ 전투 — 일반 몬스터, 골드+카드 보상',
    '💀 엘리트 — 강한 적, 희귀 유물 보상. 챕터당 첫 엘리트에서 🗝️ 키 드롭',
    '🔥 모닥불 — 휴식(HP)/대장간(강화)/정화(제거)/복제 중 1택',
    '💰 보물 — 무료 골드+카드 선택',
    '🛒 상점 — 카드·유물 구매, 카드 제거',
    '❓ 이벤트 — 선택지에 따라 다른 결과',
    '👑 보스 — 챕터 보스. 처치 시 보스 유물 1개 선택',
  ]));

  wrapper.appendChild(section('🌀 진엔딩 (키 시스템)', [
    '각 챕터 첫 엘리트에서 키 1개 획득:',
    '  • 챕터 1 → 의지의 열쇠',
    '  • 챕터 2 → 감정의 열쇠',
    '  • 챕터 3 → 육체의 열쇠',
    '키 3개 모두 모은 채로 챕터 3 보스 클리어 → 진엔딩 도전 가능.',
    '진엔딩(챕터 4)은 짧지만 강력한 보스(차원의 지배자 / 시간의 군주 / 공허의 화신 중 하나)가 기다림. 빌드 잘 짜고 가기.',
  ]));

  wrapper.appendChild(section('⌨ 핫키 (PC)', [
    '1~9 — 핸드 N번째 카드 선택/사용',
    'E 또는 Space — 턴 종료 (카드 선택 중이면 타겟 확정)',
    'Tab — 적 타겟 순환 (적 여러 마리일 때)',
    'Esc — 선택 해제',
  ]));

  wrapper.appendChild(section('💉 포션', [
    '전투 승리 시 30~50% 확률로 드롭 (최대 3개 보유).',
    '전투 중 좌측 포션 슬롯 탭으로 즉시 사용.',
    '일부 포션(독/화염)은 적을 지정해야 함.',
  ]));

  wrapper.appendChild(section('💎 유물', [
    '영구 효과를 주는 아이템. 한 번 얻으면 런 끝까지 발동.',
    '엘리트/상점/이벤트/보상에서 획득.',
    '보스 유물(노란색)은 챕터 클리어 시 3개 중 1개 선택 — 매우 강력.',
  ]));

  wrapper.appendChild(
    el('button', { style: { marginTop: '20px' }, onClick: () => setScreen('title') }, '← 제목으로'),
  );

  return wrapper;
}

function section(title: string, lines: HelpLine[]): HTMLElement {
  const box = el('div', { class: 'help-section' });
  box.appendChild(el('div', { class: 'help-section-title' }, title));
  const body = el('div', { class: 'help-section-body' });
  for (const item of lines) {
    if (typeof item === 'string') {
      body.appendChild(el('div', { class: 'help-line' }, item));
    } else {
      const cls = 'help-line' + (item.highlight ? ' highlight' : '');
      body.appendChild(el('div', { class: cls }, item.text));
    }
  }
  box.appendChild(body);
  return box;
}
