import type { Combatant, Intent } from '../types';
import { modifiedAttackDamage } from './statuses';

// Compute the damage shown in intent (per hit, against player)
export function intentDisplayDamage(intent: Intent, attacker: Combatant, defender: Combatant): number {
  if (intent.damage === undefined) return 0;
  return modifiedAttackDamage(intent.damage, attacker, defender);
}

export function intentSymbol(intent: Intent): string {
  switch (intent.kind) {
    case 'attack':
      return '⚔';
    case 'attack_block':
      return '⚔🛡';
    case 'attack_buff':
      return '⚔↑';
    case 'block':
      return '🛡';
    case 'buff':
      return '↑';
    case 'debuff':
      return '↓';
    case 'unknown':
    default:
      return '?';
  }
}

// Build a rich intent display showing modified damage, hits, total, and any block/buff annotations
export interface IntentDisplay {
  symbol: string;
  damageText: string;        // main damage text e.g. "11×3" or "18"
  totalText: string;         // "(총 33)" if multi-hit and modified, else ""
  suffix: string;            // " 🛡8" or " + 힘+2" etc
  modClass: 'boosted' | 'reduced' | 'normal'; // CSS class for color
  fallbackLabel: string;     // for non-attack intents
}

export function buildIntentDisplay(intent: Intent, attacker: Combatant, defender: Combatant): IntentDisplay {
  const out: IntentDisplay = {
    symbol: intentSymbol(intent),
    damageText: '',
    totalText: '',
    suffix: '',
    modClass: 'normal',
    fallbackLabel: '',
  };

  const isAttack = intent.kind === 'attack' || intent.kind === 'attack_block' || intent.kind === 'attack_buff';
  if (!isAttack || intent.damage === undefined) {
    out.fallbackLabel = intent.label ?? '';
    return out;
  }

  const baseDmg = intent.damage;
  const modDmg = modifiedAttackDamage(baseDmg, attacker, defender);
  const hits = intent.hits ?? 1;
  const totalRaw = baseDmg * hits;
  const totalMod = modDmg * hits;

  if (modDmg > baseDmg) out.modClass = 'boosted';
  else if (modDmg < baseDmg) out.modClass = 'reduced';

  out.damageText = hits > 1 ? `${modDmg}×${hits}` : `${modDmg}`;
  if (hits > 1 && totalMod !== totalRaw) {
    out.totalText = ` (총 ${totalMod})`;
  } else if (hits > 1) {
    out.totalText = ` (총 ${totalMod})`;
  }

  if (intent.kind === 'attack_block' && intent.block) {
    out.suffix = ` 🛡${intent.block}`;
  } else if (intent.kind === 'attack_buff') {
    // Extract the buff portion from label (e.g. "16 + 힘+2" → "+ 힘+2")
    const lbl = intent.label ?? '';
    const plus = lbl.indexOf('+');
    if (plus > 0) out.suffix = ` ${lbl.slice(plus).trim()}`;
  }

  return out;
}
