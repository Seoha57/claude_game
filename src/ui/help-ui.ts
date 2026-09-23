import { el } from './dom';
import { setScreen, getRunOrNull, getCombatOrNull } from '../state';
import { ic } from './art';
import { t } from '../i18n';

type HelpLine = string | { text: string; highlight?: boolean };

export function renderHelp(): HTMLElement {
  const wrapper = el('div', { class: 'help-screen' });

  const helpTitle = el('h1', { style: { color: 'var(--accent)', margin: '0' } });
  helpTitle.innerHTML = `${ic('question')} ${t('도움말')}`;
  wrapper.appendChild(helpTitle);
  wrapper.appendChild(
    el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' } },
      t('한 번 훑어보면 게임 진행이 훨씬 쉬워집니다.')),
  );

  wrapper.appendChild(section(`${ic('card')} ${t('카드 사용법')}`, [
    t('카드는 화면 아래쪽 "핸드"에 보입니다. 좌상단의 노란 숫자가 비용(에너지).'),
    `${t('카드 종류는 3가지:')} ${ic('sword')} ${t('공격')} / ${ic('shield')} ${t('방어')} / ${ic('sparkle')} ${t('효과')}.`,
    `${ic('poison')} ${t('저주 카드: 이벤트에서 획득. 사용 불가, 덱만 차지. (부식: HP-2, 의심: 약화+1, 기생충: 소멸 불가)')}`,
    `${ic('sparkle')} ${t('축복 카드: 이벤트 보상. 0코스트 강력 효과, 소멸.')}`,
    `${t('빨간 자물쇠(')}${ic('lock')}${t(')가 뜨면 에너지 부족 — 못 씀.')}`,
    t('카드에 적힌 키워드:'),
    t('  • 소멸: 사용 후 영구 제거 (보라 디졸브)'),
    t('  • 선천: 항상 첫 핸드에 들어옴'),
    t('  • 유지: 턴 종료해도 핸드에 남음'),
    t('  • 영구 +N: 사용/처치 시마다 데미지가 영구히 증가 (런 끝까지 누적)'),
    t('  • 이번 턴 N번째 이후 / 직전이 OO면: 콤보 조건 — 순서 맞춰 내면 추가 효과'),
    t('  • 데미지 = N × …: 누적 공격 수나 이번 턴 카드 수에 비례'),
  ]));

  wrapper.appendChild(section(`${ic('star')} ${t('카드 강화 (모닥불 대장간)')}`, [
    t('모닥불에서 카드를 강화하면 더 강해집니다.'),
    t('  • ★ 강화 (+): 효과/수치 상승'),
    t('  • ★★ 이중 강화 (++): 한 번 더 강화 (금색). 데미지/방어/회복 추가 +,'),
    t('    상태이상·드로우·에너지도 추가 상승.'),
    t('모바일에선 대장간에서 카드를 한 번 탭하면 미리보기, 다시 탭하면 확정.'),
  ]));

  wrapper.appendChild(section(`${ic('star')} ${t('카드 타게팅 — 중요!')}`, [
    t('적을 직접 지정하는 카드(예: 검격, 산탄)는:'),
    { text: t('  ① 카드를 한 번 탭/클릭 → 카드가 위로 떠오름 (선택됨)'), highlight: true },
    { text: t('  ② 그 다음 공격할 적을 탭/클릭 → 발동'), highlight: true },
    t('적 1마리만 남아있으면 ②번 자동으로 처리됨.'),
    t('전체 공격(회전 참격) / 자기 강화(가드, 검의 정수) 같은 건 한 번 탭으로 즉시 발동.'),
  ]));

  wrapper.appendChild(section(`${ic('lightning')} ${t('에너지')} &amp; ${t('턴')}`, [
    t('매 턴 시작 시 에너지 3 충전 (좌측 노란 구슬).'),
    t('카드 비용만큼 에너지 소모. 모자라면 못 씀.'),
    t('턴 종료(우측 버튼 또는 E키) → 적이 행동 → 다음 턴.'),
    t('남은 에너지는 이월 안 됨.'),
  ]));

  wrapper.appendChild(section(`${ic('shield')} ${t('방어도 & 적 의도')}`, [
    t('적 머리 위 표시가 "다음 턴 행동 예고":'),
    `  ${ic('sword')} ${t('숫자 = 공격 (수치는 취약/약화/힘 적용된 실제 데미지)')}`,
    `  ${ic('shield')} ${t('= 방어 / ↑ = 자기 강화 / ↓ = 디버프')}`,
    `${t('내 방어도(')}${ic('shield')}${t(')로 다 막히면 적 의도가 푸르게 표시됨 (안전!).')}`,
    t('방어도는 다음 턴 시작 시 사라짐 — 매 턴 새로 쌓아야 함.'),
  ]));

  wrapper.appendChild(section(`${ic('sparkle')} ${t('상태이상')}`, [
    t('아이콘에 마우스 올리거나 탭하면 자세한 설명 + 누적 총량이 뜸.'),
    t('주요 상태이상:'),
    t('  • 힘 +N: 공격 데미지 +N (영구)'),
    t('  • 민첩 +N: 획득 방어도 +N (영구)'),
    t('  • 취약 +N: 받는 데미지 +50% (N턴)'),
    t('  • 약화 +N: 주는 데미지 -25% (N턴)'),
    t('  • 쇠약 +N: 획득 방어도 -25% (N턴)'),
    t('  • 중독 +N: 턴 시작 시 N 데미지, N은 1씩 감소'),
    t('  • 화상 +N: 턴 종료 시 N 데미지 (방어 무시), 1씩 감소'),
    t('  • 빙결 +N: 다음 N턴 동안 행동 불가 (보스는 최대 1턴, 해제 후 2턴 면역)'),
    t('  • 재생 +N: 턴 종료 시 N 회복, 1씩 감소'),
    t('  • 가시 +N: 공격받을 때마다 N 반사 (영구)'),
    t('  • 금속화 +N: 턴 종료 시 방어도 +N (영구)'),
    t('  • 의식 +N: 턴 종료 시 힘 +N (영구)'),
  ]));

  wrapper.appendChild(section(`${ic('star')} ${t('맵 노드')}`, [
    `${ic('sword')} ${t('전투 — 일반 몬스터, 골드+카드 보상')}`,
    `${ic('skull')} ${t('엘리트 — 강한 적, 희귀 유물 보상.')} ${t('챕터당 첫 엘리트에서')} ${ic('key')} ${t('키 드롭')}`,
    `${ic('fire')} ${t('모닥불 — 휴식(HP)/대장간(강화)/정화(제거)/복제 중 1택')}`,
    `${ic('gold')} ${t('보물 — 무료 골드+카드 선택')}`,
    `${ic('cart')} ${t('상점 — 카드·유물 구매, 카드 제거')}`,
    `${ic('question')} ${t('이벤트 — 선택지에 따라 다른 결과')}`,
    `${ic('crown')} ${t('보스 — 챕터 보스. 처치 시 보스 유물 1개 선택')}`,
  ]));

  wrapper.appendChild(section(`${ic('key')} ${t('진엔딩 (키 시스템)')}`, [
    t('각 챕터 첫 엘리트에서 키 1개 획득:'),
    t('  • 챕터 1 → 의지의 열쇠'),
    t('  • 챕터 2 → 감정의 열쇠'),
    t('  • 챕터 3 → 육체의 열쇠'),
    t('키 3개 모두 모은 채로 챕터 3 보스 클리어 → 진엔딩 도전 가능.'),
    t('진엔딩(챕터 4)은 짧지만 강력한 보스(차원의 지배자 / 시간의 군주 / 공허의 화신 중 하나)가 기다림. 빌드 잘 짜고 가기.'),
  ]));

  wrapper.appendChild(section(`${ic('lightning')} ${t('핫키 (PC)')}`, [
    t('1~9 — 핸드 N번째 카드 선택/사용'),
    t('E 또는 Space — 턴 종료 (카드 선택 중이면 타겟 확정)'),
    t('Tab — 적 타겟 순환 (적 여러 마리일 때)'),
    t('Esc — 선택 해제'),
  ]));

  wrapper.appendChild(section(`${ic('potion_small')} ${t('포션')}`, [
    t('전투 승리 시 30~50% 확률로 드롭 (최대 3개 보유).'),
    t('전투 중 좌측 포션 슬롯 탭으로 즉시 사용.'),
    t('일부 포션(독/화염)은 적을 지정해야 함.'),
  ]));

  wrapper.appendChild(section(`${ic('gem')} ${t('유물')}`, [
    t('영구 효과를 주는 아이템. 한 번 얻으면 런 끝까지 발동.'),
    t('엘리트/상점/이벤트/보상에서 획득.'),
    t('엘리트 유물: 엘리트 전투에서만 드롭. 클래스 전용 유물 포함.'),
    `${ic('lightning')} ${t('시너지: 특정 유물 2개를 함께 보유하면 추가 효과 발동! (금색 테두리)')}`,
    t('보스 유물(노란색)은 챕터 클리어 시 3개 중 1개 선택 — 매우 강력.'),
  ]));

  wrapper.appendChild(section(`${ic('card')} ${t('도감 보상')}`, [
    t('카드와 유물을 발견할수록 시작 보너스가 해금됩니다.'),
    t('25% (31개) — 시작 골드 +30'),
    t('50% (62개) — 시작 최대HP +5'),
    t('75% (93개) — 시작 에너지 +1'),
  ]));

  wrapper.appendChild(section(`${ic('medal')} ${t('업적 보상')}`, [
    t('업적을 달성할수록 칭호와 시작 보너스를 얻습니다.'),
    `${t('3개 —')} ${ic('star')} ${t('초보 모험가 (시작 골드 +20)')}`,
    `${t('8개 —')} ${ic('sword')} ${t('숙련된 전사 (시작 최대HP +3)')}`,
    `${t('15개 —')} ${ic('fire')} ${t('던전 정복자 (시작 골드 +30)')}`,
    `${t('22개 —')} ${ic('crown')} ${t('전설의 영웅')}`,
    t('칭호는 리더보드에 표시됩니다.'),
  ]));

  const backScreen = getCombatOrNull() ? 'combat' as const : getRunOrNull() ? 'map' as const : 'title' as const;
  const backLabel = backScreen === 'combat' ? t('← 전투로') : backScreen === 'map' ? t('← 맵으로') : t('← 제목으로');
  wrapper.appendChild(
    el('button', { style: { marginTop: '20px' }, onClick: () => setScreen(backScreen) }, backLabel),
  );

  return wrapper;
}

function section(title: string, lines: HelpLine[]): HTMLElement {
  const box = el('div', { class: 'help-section' });
  const titleEl = el('div', { class: 'help-section-title' });
  titleEl.innerHTML = title;
  box.appendChild(titleEl);
  const body = el('div', { class: 'help-section-body' });
  for (const item of lines) {
    if (typeof item === 'string') {
      const line = el('div', { class: 'help-line' });
      line.innerHTML = item;
      body.appendChild(line);
    } else {
      const cls = 'help-line' + (item.highlight ? ' highlight' : '');
      const line = el('div', { class: cls });
      line.innerHTML = item.text;
      body.appendChild(line);
    }
  }
  box.appendChild(body);
  return box;
}
