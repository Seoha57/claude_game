import type { CardDef } from '../types';

const PLUSPLUS_DAMAGE_BONUS = 3;
const PLUSPLUS_BLOCK_BONUS = 3;
const PLUSPLUS_HEAL_BONUS = 3;
const PLUSPLUS_STATUS_BONUS = 1;
const PLUSPLUS_DRAW_BONUS = 1;
const PLUSPLUS_ENERGY_BONUS = 1;

export function applyPlusPlus(def: CardDef): CardDef {
  const effects = def.effects.map((e) => {
    if (e.kind === 'damage' || e.kind === 'damage_all') {
      return { ...e, amount: e.amount + PLUSPLUS_DAMAGE_BONUS };
    }
    if (e.kind === 'damage_dice' || e.kind === 'damage_all_dice') {
      return { ...e, base: e.base + PLUSPLUS_DAMAGE_BONUS };
    }
    if (e.kind === 'block') {
      return { ...e, amount: e.amount + PLUSPLUS_BLOCK_BONUS };
    }
    if (e.kind === 'block_dice') {
      return { ...e, base: e.base + PLUSPLUS_BLOCK_BONUS };
    }
    if (e.kind === 'heal') {
      return { ...e, amount: e.amount + PLUSPLUS_HEAL_BONUS };
    }
    if (e.kind === 'heal_dice') {
      return { ...e, base: e.base + PLUSPLUS_HEAL_BONUS };
    }
    if (e.kind === 'apply_self' || e.kind === 'apply_enemy' || e.kind === 'apply_all') {
      if (e.amount <= 0) return e;
      return { ...e, amount: e.amount + PLUSPLUS_STATUS_BONUS };
    }
    if (e.kind === 'apply_enemy_dice' || e.kind === 'apply_self_dice') {
      return { ...e, base: e.base + PLUSPLUS_STATUS_BONUS };
    }
    if (e.kind === 'damage_per_card_this_turn' || e.kind === 'damage_per_attack') {
      return { ...e, amount: e.amount + PLUSPLUS_DAMAGE_BONUS };
    }
    if (e.kind === 'fire_all_drones') {
      return { ...e, times: (e.times ?? 1) + 1 };
    }
    if (e.kind === 'draw') return { ...e, amount: e.amount + PLUSPLUS_DRAW_BONUS };
    if (e.kind === 'energy') return { ...e, amount: e.amount + PLUSPLUS_ENERGY_BONUS };
    return e;
  });
  const name = def.name.endsWith('++') ? def.name : def.name.endsWith('+') ? def.name + '+' : def.name + '++';
  return { ...def, effects, name, description: bumpNumbersForPlusPlus(def.description) };
}

function bumpNumbersForPlusPlus(desc: string): string {
  const damageRe = /(\d+)( 데미지)/g;
  const healRe = /(\d+)( 회복)/g;
  const blockRe = /(방어도 \+)(\d+)/g;
  const drawRe = /(\d+)(장 드로우)/g;
  const energyRe = /(에너지 \+)(\d+)/g;
  const diceDamageRe = /(\d+)( × 🎲 데미지)/g;
  const diceBlockRe = /(\d+)( × 🎲 방어도)/g;
  const diceHealRe = /(\d+)( × 🎲 회복)/g;
  const perCardRe = /(데미지 = )(\d+)( × 이번 턴)/g;
  const perAttackRe = /(데미지 = )(\d+)( × 이번 전투)/g;
  const firesRe = /(\d+)(회 발사)/g;
  const statusLabels = ['힘', '민첩', '취약', '약화', '재생', '중독', '화상', '빙결', '의식', '가시', '금속화', '연약'];
  let out = desc
    .replace(perCardRe, (_m, p, n, t) => `${p}${parseInt(n, 10) + PLUSPLUS_DAMAGE_BONUS}${t}`)
    .replace(perAttackRe, (_m, p, n, t) => `${p}${parseInt(n, 10) + PLUSPLUS_DAMAGE_BONUS}${t}`)
    .replace(firesRe, (_m, n, t) => `${parseInt(n, 10) + 1}${t}`)
    .replace(diceDamageRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_DAMAGE_BONUS}${t}`)
    .replace(diceBlockRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_BLOCK_BONUS}${t}`)
    .replace(diceHealRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_HEAL_BONUS}${t}`)
    .replace(damageRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_DAMAGE_BONUS}${t}`)
    .replace(healRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_HEAL_BONUS}${t}`)
    .replace(blockRe, (_m, p, n) => `${p}${parseInt(n, 10) + PLUSPLUS_BLOCK_BONUS}`)
    .replace(drawRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_DRAW_BONUS}${t}`)
    .replace(energyRe, (_m, p, n) => `${p}${parseInt(n, 10) + PLUSPLUS_ENERGY_BONUS}`);
  for (const label of statusLabels) {
    const diceRe = new RegExp(`(\\d+)( × 🎲 ${label})`, 'g');
    out = out.replace(diceRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_STATUS_BONUS}${t}`);
    const implicitDiceRe = new RegExp(`(${label} \\+)(🎲)`, 'g');
    out = out.replace(implicitDiceRe, (_m, _p, _d) => `${1 + PLUSPLUS_STATUS_BONUS} × 🎲 ${label}`);
    const re = new RegExp(`(${label} \\+)(\\d+)`, 'g');
    out = out.replace(re, (_m, p, n) => `${p}${parseInt(n, 10) + PLUSPLUS_STATUS_BONUS}`);
  }
  return out;
}
