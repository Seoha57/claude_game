import { t } from './i18n';

export interface ChallengeModifier {
  id: string;
  name: string;
  desc: string;
  hpMult?: number;
  enemyHpMult?: number;
  bonusMaxEnergy?: number;
  handDrawDelta?: number;
  startCurses?: number;
  disableUpgrade?: boolean;
  disableRemove?: boolean;
  noShop?: boolean;
  costIncrease?: number;
  enemyStrBonus?: number;
  startStr?: number;
}

export const CHALLENGE_MODIFIERS: ChallengeModifier[] = [
  { id: 'glass_cannon',  name: t('유리대포'),     desc: t('HP -50%, 에너지 +1'),       hpMult: 0.5, bonusMaxEnergy: 1 },
  { id: 'iron_curse',    name: t('철의 저주'),     desc: t('상처 3장, 정화 불가'),       startCurses: 3, disableRemove: true },
  { id: 'energy_famine', name: t('에너지 기근'),   desc: t('에너지 -1'),                 bonusMaxEnergy: -1 },
  { id: 'titan_foes',    name: t('거인의 적'),     desc: t('적 HP +50%'),                enemyHpMult: 1.5 },
  { id: 'brutal_foes',   name: t('잔인한 적'),     desc: t('적 힘 +3'),                  enemyStrBonus: 3 },
  { id: 'costly_cards',  name: t('과중한 비용'),   desc: t('모든 카드 비용 +1'),          costIncrease: 1 },
  { id: 'sealed_forge',  name: t('봉인된 대장간'), desc: t('강화 불가'),                  disableUpgrade: true },
  { id: 'no_market',     name: t('시장 폐쇄'),     desc: t('상점 이용 불가'),             noShop: true },
  { id: 'thin_hand',     name: t('짧은 손'),       desc: t('손패 -2'),                    handDrawDelta: -2 },
  { id: 'berserker',     name: t('광전사'),        desc: t('힘 +3, HP -30%'),             startStr: 3, hpMult: 0.7 },
];
