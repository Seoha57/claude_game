import type { EnemyDef, Intent } from '../types';
import { dealDamage, gainBlock } from '../combat/effects';
import { applyStatus } from '../combat/statuses';

function attack(amount: number, hits = 1): Intent {
  return { kind: 'attack', damage: amount, hits, label: `${amount}×${hits}` };
}

export const ENEMY_DEFS: Record<string, EnemyDef> = {
  // ── Easy ──
  jaw_worm: {
    id: 'jaw_worm',
    name: '턱벌레',
    hpRange: [40, 44],
    decideIntent(_state, _self, turn) {
      // chomp / thrash / bellow rotation
      const i = turn % 3;
      if (i === 0) return attack(11, 1);
      if (i === 1) return { kind: 'attack_block', damage: 7, hits: 1, block: 5 };
      return { kind: 'buff', label: '힘+3, 방어+6' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'attack' && it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      } else if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.kind === 'buff') {
        applyStatus(self, 'strength', 3);
        gainBlock(self, 6);
      }
    },
  },

  cultist: {
    id: 'cultist',
    name: '광신자',
    hpRange: [48, 54],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '의식 +3' };
      return attack(6, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        applyStatus(self, 'ritual', 3);
      } else if (it.kind === 'attack' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
      }
    },
  },

  // ── Medium ──
  fungi_beast: {
    id: 'fungi_beast',
    name: '버섯괴수',
    hpRange: [22, 28],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 2) return { kind: 'buff', label: '힘 +3' };
      return attack(6, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') applyStatus(self, 'strength', 3);
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  // ── Elite ──
  gremlin_nob: {
    id: 'gremlin_nob',
    name: '그렘린 두목',
    hpRange: [82, 86],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '격노: 적이 스킬 쓰면 힘+2 (단순화)' };
      const i = (turn - 1) % 3;
      if (i === 2) return { kind: 'debuff', label: '약화 +2' };
      return attack(14, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') applyStatus(self, 'strength', 2);
      else if (it.kind === 'debuff') applyStatus(state.player, 'weak', 2);
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  // ── Mid-act tougher ──
  sentinel: {
    id: 'sentinel',
    name: '파수병',
    hpRange: [38, 42],
    decideIntent(_state, _self, turn) {
      const i = turn % 2;
      if (i === 0) return { kind: 'attack_block', damage: 9, block: 5, label: '9 / 방어 5' };
      return { kind: 'block', block: 8, label: '방어 8' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.kind === 'block' && it.block) {
        gainBlock(self, it.block);
      }
    },
  },

  // ── Boss ──
  hexaghost: {
    id: 'hexaghost',
    name: '헥사고스트',
    hpRange: [200, 212],
    isBoss: true,
    onHalfHp(_state, self) {
      applyStatus(self, 'strength', 3);
      applyStatus(self, 'ritual', 1);
      return '6개의 영혼이 깨어났다! (힘 +3, 의식 +1)';
    },
    decideIntent(_state, _self, turn) {
      // Pattern: turn 0 ritual, then 1: inferno (4x4), 2: sear (5+vuln), 3: inflame, 4: tackle (5x2), repeat 1..4
      if (turn === 0) return { kind: 'buff', label: '의식 +1' };
      const cycle = ((turn - 1) % 4) + 1;
      if (cycle === 1) return { kind: 'attack', damage: 4, hits: 4, label: '4×4' };
      if (cycle === 2) return { kind: 'attack', damage: 5, hits: 1, label: '5 + 취약' };
      if (cycle === 3) return { kind: 'buff', label: '힘 +1' };
      return { kind: 'attack', damage: 5, hits: 2, label: '5×2' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        if (self.turn === 0) applyStatus(self, 'ritual', 1);
        else applyStatus(self, 'strength', 1);
      } else if (it.kind === 'attack' && it.damage) {
        const hits = it.hits ?? 1;
        for (let h = 0; h < hits; h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
        if (hits === 1) applyStatus(state.player, 'vulnerable', 2);
      }
    },
  },

  // ── Chapter 1 alternate bosses ──
  mad_butcher: {
    id: 'mad_butcher',
    name: '광폭한 도살자',
    hpRange: [200, 215],
    isBoss: true,
    onHalfHp(_state, self) {
      applyStatus(self, 'ritual', 2);
      return '광기가 폭주한다! (의식 +2)';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '광기: 힘 +2' };
      const cycle = (turn - 1) % 4;
      if (cycle === 0) return { kind: 'attack', damage: 6, hits: 3, label: '6×3' };
      if (cycle === 1) return { kind: 'attack', damage: 14, hits: 1, label: '14' };
      if (cycle === 2) return { kind: 'buff', label: '힘 +1' };
      return { kind: 'attack', damage: 11, hits: 1, label: '11' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        applyStatus(self, 'strength', self.turn === 0 ? 2 : 1);
      } else if (it.kind === 'attack' && it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },
  obsidian_golem: {
    id: 'obsidian_golem',
    name: '흑요암 골렘',
    hpRange: [215, 225],
    isBoss: true,
    onHalfHp(_state, self) {
      applyStatus(self, 'thorns', 5);
      applyStatus(self, 'metallicize', 3);
      return '균열에서 빛이 솟구친다! (가시 +5, 금속화 +3)';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '가시 +3' };
      const cycle = (turn - 1) % 4;
      if (cycle === 0) return { kind: 'block', block: 12, label: '방어 12' };
      if (cycle === 1) return { kind: 'attack', damage: 16, hits: 1, label: '16' };
      if (cycle === 2) return { kind: 'buff', label: '가시 +3' };
      return { kind: 'attack', damage: 5, hits: 2, label: '5×2' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        applyStatus(self, 'thorns', 3);
      } else if (it.kind === 'block' && it.block) {
        gainBlock(self, it.block);
      } else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },

  // ── Chapter 2 enemies ──
  blue_slaver: {
    id: 'blue_slaver',
    name: '청 노예상',
    hpRange: [46, 52],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 2) return { kind: 'debuff', label: '약화 +2' };
      return attack(12, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'debuff') applyStatus(state.player, 'weak', 2);
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  red_slaver: {
    id: 'red_slaver',
    name: '홍 노예상',
    hpRange: [46, 52],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 1) return { kind: 'debuff', label: '취약 +2' };
      return attack(13, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'debuff') applyStatus(state.player, 'vulnerable', 2);
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  shield_gremlin: {
    id: 'shield_gremlin',
    name: '방패 그렘린',
    hpRange: [35, 40],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 0) return { kind: 'block', block: 15, label: '방어 15' };
      return attack(8, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'block' && it.block) gainBlock(self, it.block);
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  // ── Chapter 2 elites ──
  taskmaster: {
    id: 'taskmaster',
    name: '태스크마스터',
    hpRange: [54, 60],
    decideIntent(_state, _self, turn) {
      if (turn % 3 === 0) return { kind: 'debuff', label: '중독 +4' };
      return attack(10, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'debuff') applyStatus(state.player, 'poison', 4);
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  book_of_stabbing: {
    id: 'book_of_stabbing',
    name: '스타빙의 서',
    hpRange: [56, 60],
    decideIntent(_state, _self, turn) {
      const hits = 2 + Math.min(turn, 4);
      return { kind: 'attack', damage: 6, hits, label: `6×${hits}` };
    },
    act(state, self) {
      const it = self.intent;
      if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },

  // ── Chapter 3 normal ──
  looter: {
    id: 'looter',
    name: '약탈자',
    hpRange: [44, 48],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 1) return { kind: 'debuff', label: '취약+2, 약화+1' };
      if (i === 3) return { kind: 'attack_block', damage: 10, block: 6, label: '10 / 방어 6' };
      return attack(14, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'debuff') { applyStatus(state.player, 'vulnerable', 2); applyStatus(state.player, 'weak', 1); }
      else if (it.kind === 'attack_block' && it.damage) { dealDamage(state, self, state.player, it.damage, true); if (it.block) gainBlock(self, it.block); }
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  dark_slime: {
    id: 'dark_slime',
    name: '어둠 슬라임',
    hpRange: [50, 58],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 0) return { kind: 'debuff', label: '중독 +6' };
      if (i === 1) return { kind: 'block', block: 12, label: '방어 12' };
      return attack(10, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'debuff') applyStatus(state.player, 'poison', 6);
      else if (it.kind === 'block' && it.block) gainBlock(self, it.block);
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  centurion: {
    id: 'centurion',
    name: '백부장',
    hpRange: [76, 82],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 0) return { kind: 'attack_buff', damage: 16, label: '16 + 힘+2' };
      if (i === 1) return { kind: 'attack_block', damage: 12, block: 8, label: '12 / 방어 8' };
      return attack(20, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'attack_buff' && it.damage) { dealDamage(state, self, state.player, it.damage, true); applyStatus(self, 'strength', 2); }
      else if (it.kind === 'attack_block' && it.damage) { dealDamage(state, self, state.player, it.damage, true); if (it.block) gainBlock(self, it.block); }
      else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },

  // ── Chapter 3 elite ──
  writhing_mass: {
    id: 'writhing_mass',
    name: '꿈틀거리는 덩어리',
    hpRange: [160, 168],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '가시 +5' };
      const i = (turn - 1) % 4;
      if (i === 0) return { kind: 'attack', damage: 9, hits: 3, label: '9×3' };
      if (i === 1) return { kind: 'debuff', label: '약화+2, 취약+2' };
      if (i === 2) return { kind: 'attack', damage: 15, hits: 1, label: '15' };
      return { kind: 'attack_block', damage: 10, block: 10, label: '10 / 방어 10' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') applyStatus(self, 'thorns', 5);
      else if (it.kind === 'debuff') { applyStatus(state.player, 'weak', 2); applyStatus(state.player, 'vulnerable', 2); }
      else if (it.kind === 'attack_block' && it.damage) { dealDamage(state, self, state.player, it.damage, true); if (it.block) gainBlock(self, it.block); }
      else if (it.damage) { for (let h = 0; h < (it.hits ?? 1); h++) dealDamage(state, self, state.player, it.damage, true); }
    },
  },

  // ── Chapter 2 boss ──
  the_collector: {
    id: 'the_collector',
    name: '수집가',
    hpRange: [250, 265],
    isBoss: true,
    onHalfHp(state, self) {
      applyStatus(self, 'strength', 3);
      applyStatus(state.player, 'weak', 2);
      return '수집의 광기! (힘 +3, 플레이어 약화 +2)';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '힘 +2, 가시 준비' };
      const cycle = (turn - 1) % 4;
      if (cycle === 0) return { kind: 'attack', damage: 15, hits: 1, label: '15' };
      if (cycle === 1) return { kind: 'attack_block', damage: 8, block: 8, label: '8 / 방어 8' };
      if (cycle === 2) return { kind: 'debuff', label: '취약+1, 약화+1' };
      return { kind: 'attack', damage: 7, hits: 2, label: '7×2' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        applyStatus(self, 'strength', 2);
        applyStatus(self, 'thorns', 2);
      } else if (it.kind === 'attack' && it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      } else if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.kind === 'debuff') {
        applyStatus(state.player, 'vulnerable', 1);
        applyStatus(state.player, 'weak', 1);
      }
    },
  },

  // ── Chapter 2 alternate bosses ──
  karnak_runemaster: {
    id: 'karnak_runemaster',
    name: '카르낙 룬마스터',
    hpRange: [255, 268],
    isBoss: true,
    onHalfHp(state, self) {
      applyStatus(self, 'strength', 4);
      applyStatus(state.player, 'vulnerable', 2);
      return '룬이 폭주한다! (힘 +4, 플레이어 취약 +2)';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '의식 +2' };
      const cycle = (turn - 1) % 5;
      if (cycle === 0) return { kind: 'attack', damage: 16, hits: 1, label: '16' };
      if (cycle === 1) return { kind: 'debuff', label: '취약+2, 약화+2' };
      if (cycle === 2) return { kind: 'attack', damage: 9, hits: 2, label: '9×2' };
      if (cycle === 3) return { kind: 'buff', label: '힘 +2' };
      return { kind: 'attack', damage: 22, hits: 1, label: '22 (대마법)' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        if (self.turn === 0) applyStatus(self, 'ritual', 2);
        else applyStatus(self, 'strength', 2);
      } else if (it.kind === 'debuff') {
        applyStatus(state.player, 'vulnerable', 2);
        applyStatus(state.player, 'weak', 2);
      } else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },
  sirocco_phantom: {
    id: 'sirocco_phantom',
    name: '시로코의 환영',
    hpRange: [260, 275],
    isBoss: true,
    onHalfHp(_state, self) {
      applyStatus(self, 'strength', 4);
      applyStatus(self, 'ritual', 2);
      return '용의 본 모습이 드러난다! (힘 +4, 의식 +2)';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '용의 분노: 힘+2 의식+1' };
      const cycle = (turn - 1) % 5;
      if (cycle === 0) return { kind: 'attack', damage: 14, hits: 1, label: '14' };
      if (cycle === 1) return { kind: 'buff', label: '힘 +2' };
      if (cycle === 2) return { kind: 'attack', damage: 8, hits: 2, label: '8×2' };
      if (cycle === 3) return { kind: 'attack_block', damage: 10, block: 8, label: '10 / 방어 8' };
      return { kind: 'attack', damage: 18, hits: 1, label: '18 (불꽃숨결)' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        if (self.turn === 0) {
          applyStatus(self, 'strength', 2);
          applyStatus(self, 'ritual', 1);
        } else {
          applyStatus(self, 'strength', 2);
        }
      } else if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },

  // ── Chapter 3 boss ──
  void_heart: {
    id: 'void_heart',
    name: '공허의 심장',
    hpRange: [300, 320],
    isBoss: true,
    onHalfHp(state, self) {
      // Clear own debuffs and rage
      for (const k of ['vulnerable', 'weak', 'frail', 'burn', 'freeze', 'poison'] as const) {
        delete self.statuses[k];
      }
      applyStatus(self, 'strength', 5);
      applyStatus(self, 'metallicize', 3);
      applyStatus(state.player, 'vulnerable', 2);
      return '공허가 깨어났다! 디버프 정화 + 힘 +5 / 금속화 +3 / 플레이어 취약 +2';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '힘+3, 가시+4, 금속화+3' };
      const cycle = (turn - 1) % 5;
      if (cycle === 0) return { kind: 'attack', damage: 18, hits: 1, label: '18' };
      if (cycle === 1) return { kind: 'debuff', label: '취약+2, 약화+2' };
      if (cycle === 2) return { kind: 'attack', damage: 9, hits: 3, label: '9×3' };
      if (cycle === 3) return { kind: 'attack_block', damage: 14, block: 14, label: '14 / 방어 14' };
      return { kind: 'buff', label: '힘+2' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        if (self.turn === 0) {
          applyStatus(self, 'strength', 3);
          applyStatus(self, 'thorns', 4);
          applyStatus(self, 'metallicize', 3);
        } else {
          applyStatus(self, 'strength', 2);
        }
      } else if (it.kind === 'debuff') {
        applyStatus(state.player, 'vulnerable', 2);
        applyStatus(state.player, 'weak', 2);
      } else if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },

  // ── Chapter 3 alternate bosses ──
  death_apostle: {
    id: 'death_apostle',
    name: '죽음의 사도 케이지',
    hpRange: [310, 325],
    isBoss: true,
    onHalfHp(_state, self) {
      applyStatus(self, 'strength', 5);
      applyStatus(self, 'ritual', 2);
      return '광기의 정점! (힘 +5, 의식 +2)';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '광기의 힘 +4' };
      const cycle = (turn - 1) % 5;
      if (cycle === 0) return { kind: 'attack', damage: 8, hits: 4, label: '8×4' };
      if (cycle === 1) return { kind: 'attack', damage: 24, hits: 1, label: '24' };
      if (cycle === 2) return { kind: 'buff', label: '힘 +2' };
      if (cycle === 3) return { kind: 'debuff', label: '취약+2, 약화+2' };
      return { kind: 'attack', damage: 6, hits: 5, label: '6×5' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        applyStatus(self, 'strength', self.turn === 0 ? 4 : 2);
      } else if (it.kind === 'debuff') {
        applyStatus(state.player, 'vulnerable', 2);
        applyStatus(state.player, 'weak', 2);
      } else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },
  isaris_overlord: {
    id: 'isaris_overlord',
    name: '이샤리스의 군림자',
    hpRange: [320, 340],
    isBoss: true,
    onHalfHp(_state, self) {
      applyStatus(self, 'metallicize', 5);
      applyStatus(self, 'thorns', 5);
      applyStatus(self, 'strength', 2);
      return '진정한 군림자의 자세! (금속화 +5, 가시 +5, 힘 +2)';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '금속화 +5, 가시 +5' };
      const cycle = (turn - 1) % 5;
      if (cycle === 0) return { kind: 'block', block: 18, label: '방어 18' };
      if (cycle === 1) return { kind: 'attack', damage: 28, hits: 1, label: '28' };
      if (cycle === 2) return { kind: 'buff', label: '금속화 +3' };
      if (cycle === 3) return { kind: 'attack_block', damage: 16, block: 15, label: '16 / 방어 15' };
      return { kind: 'attack', damage: 12, hits: 2, label: '12×2' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        if (self.turn === 0) {
          applyStatus(self, 'metallicize', 5);
          applyStatus(self, 'thorns', 5);
        } else {
          applyStatus(self, 'metallicize', 3);
        }
      } else if (it.kind === 'block' && it.block) {
        gainBlock(self, it.block);
      } else if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },

  // ── Chapter 4 boss (true ending) ──
  abyss_lord: {
    id: 'abyss_lord',
    name: '차원의 지배자',
    hpRange: [440, 460],
    isBoss: true,
    onHalfHp(state, self) {
      for (const k of ['vulnerable', 'weak', 'frail', 'burn', 'freeze', 'poison'] as const) {
        delete self.statuses[k];
      }
      applyStatus(self, 'strength', 6);
      applyStatus(self, 'thorns', 8);
      applyStatus(self, 'metallicize', 4);
      applyStatus(state.player, 'vulnerable', 3);
      applyStatus(state.player, 'weak', 3);
      return '차원이 비명을 지른다! 모든 디버프 정화 + 광폭화';
    },
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '힘+5, 가시+8, 금속화+5' };
      const cycle = (turn - 1) % 6;
      if (cycle === 0) return { kind: 'attack', damage: 24, hits: 1, label: '24' };
      if (cycle === 1) return { kind: 'debuff', label: '취약+3, 약화+3, 약함+1' };
      if (cycle === 2) return { kind: 'attack', damage: 11, hits: 3, label: '11×3' };
      if (cycle === 3) return { kind: 'attack_block', damage: 18, block: 20, label: '18 / 방어 20' };
      if (cycle === 4) return { kind: 'buff', label: '힘+3, 가시+4' };
      return { kind: 'attack', damage: 8, hits: 5, label: '8×5' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        if (self.turn === 0) {
          applyStatus(self, 'strength', 5);
          applyStatus(self, 'thorns', 8);
          applyStatus(self, 'metallicize', 5);
        } else {
          applyStatus(self, 'strength', 3);
          applyStatus(self, 'thorns', 4);
        }
      } else if (it.kind === 'debuff') {
        applyStatus(state.player, 'vulnerable', 3);
        applyStatus(state.player, 'weak', 3);
        applyStatus(state.player, 'frail', 1);
      } else if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) {
          dealDamage(state, self, state.player, it.damage, true);
        }
      }
    },
  },

  // ─────────────────────────────────────────────────────────
  // New enemies (chapter 1)
  // ─────────────────────────────────────────────────────────
  goblin_berserker: {
    id: 'goblin_berserker',
    name: '고블린 광전사',
    hpRange: [38, 44],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return attack(8, 1);
      if (i === 1) return attack(6, 2);
      if (i === 2) return { kind: 'buff', label: '광기: 힘 +1' };
      return attack(10, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') applyStatus(self, 'strength', 1);
      else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) dealDamage(state, self, state.player, it.damage, true);
      }
    },
  },
  wandering_swordsman: {
    id: 'wandering_swordsman',
    name: '유랑 검사',
    hpRange: [32, 38],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return attack(7, 1);
      if (i === 1) return { kind: 'block', block: 8, label: '방어 8' };
      if (i === 2) return attack(5, 1);
      return { kind: 'attack', damage: 5, hits: 1, label: '5 + 취약' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'block' && it.block) gainBlock(self, it.block);
      else if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if ((self.turn % 4) === 3) applyStatus(state.player, 'vulnerable', 1);
      }
    },
  },
  frenzy_gremlin: {
    id: 'frenzy_gremlin',
    name: '광폭 그렘린',
    hpRange: [62, 70],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '분노: 힘 +2' };
      const i = (turn - 1) % 4;
      if (i === 0) return attack(4, 3);
      if (i === 1) return attack(11, 1);
      if (i === 2) return { kind: 'buff', label: '힘 +1' };
      return attack(7, 2);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') applyStatus(self, 'strength', self.turn === 0 ? 2 : 1);
      else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) dealDamage(state, self, state.player, it.damage, true);
      }
    },
  },

  // ─────────────────────────────────────────────────────────
  // New enemies (chapter 2)
  // ─────────────────────────────────────────────────────────
  arcane_scholar: {
    id: 'arcane_scholar',
    name: '마도 학자',
    hpRange: [42, 48],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return attack(8, 1);
      if (i === 1) return { kind: 'debuff', label: '취약 +2' };
      if (i === 2) return attack(12, 1);
      return { kind: 'debuff', label: '약화 +2' };
    },
    act(state, self) {
      const it = self.intent;
      const i = self.turn % 4;
      if (it.kind === 'debuff') {
        if (i === 1) applyStatus(state.player, 'vulnerable', 2);
        else applyStatus(state.player, 'weak', 2);
      } else if (it.damage) dealDamage(state, self, state.player, it.damage, true);
    },
  },
  black_butcher: {
    id: 'black_butcher',
    name: '흑의 도살자',
    hpRange: [52, 60],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 0) return attack(11, 1);
      if (i === 1) return attack(11, 1);
      return { kind: 'attack', damage: 7, hits: 1, label: '7 + 약화' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if ((self.turn % 3) === 2) applyStatus(state.player, 'weak', 1);
      }
    },
  },
  heavy_armored: {
    id: 'heavy_armored',
    name: '중장 기갑병',
    hpRange: [70, 78],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '가시 +3' };
      const i = (turn - 1) % 4;
      if (i === 0) return attack(13, 1);
      if (i === 1) return { kind: 'block', block: 10, label: '방어 10' };
      if (i === 2) return { kind: 'buff', label: '가시 +2' };
      return attack(8, 2);
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') applyStatus(self, 'thorns', self.turn === 0 ? 3 : 2);
      else if (it.kind === 'block' && it.block) gainBlock(self, it.block);
      else if (it.damage) {
        for (let h = 0; h < (it.hits ?? 1); h++) dealDamage(state, self, state.player, it.damage, true);
      }
    },
  },

  // ─────────────────────────────────────────────────────────
  // New enemies (chapter 3)
  // ─────────────────────────────────────────────────────────
  dark_knight: {
    id: 'dark_knight',
    name: '암흑 기사',
    hpRange: [58, 66],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return attack(13, 1);
      if (i === 1) return { kind: 'attack_block', damage: 8, block: 8, label: '8 / 방어 8' };
      if (i === 2) return attack(7, 2);
      return { kind: 'attack', damage: 10, hits: 1, label: '10 + 취약' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.damage) {
        const hits = it.hits ?? 1;
        for (let h = 0; h < hits; h++) dealDamage(state, self, state.player, it.damage, true);
        if ((self.turn % 4) === 3) applyStatus(state.player, 'vulnerable', 1);
      }
    },
  },
  corrupted_beast: {
    id: 'corrupted_beast',
    name: '부패한 마수',
    hpRange: [50, 58],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return { kind: 'attack', damage: 6, hits: 1, label: '6 + 중독 +5' };
      if (i === 1) return attack(10, 1);
      if (i === 2) return { kind: 'attack', damage: 8, hits: 1, label: '8 + 약화' };
      return attack(13, 1);
    },
    act(state, self) {
      const it = self.intent;
      if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        const i = self.turn % 4;
        if (i === 0) applyStatus(state.player, 'poison', 5);
        else if (i === 2) applyStatus(state.player, 'weak', 1);
      }
    },
  },
  dragonling: {
    id: 'dragonling',
    name: '마룡 새끼',
    hpRange: [92, 102],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '용의 분노: 힘 +1' };
      const i = (turn - 1) % 4;
      if (i === 0) return attack(15, 1);
      if (i === 1) return attack(8, 2);
      if (i === 2) return { kind: 'buff', label: '힘 +2' };
      return { kind: 'attack', damage: 10, hits: 1, label: '10 + 취약 +1' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') applyStatus(self, 'strength', self.turn === 0 ? 1 : 2);
      else if (it.damage) {
        const hits = it.hits ?? 1;
        for (let h = 0; h < hits; h++) dealDamage(state, self, state.player, it.damage, true);
        if (((self.turn - 1) % 4) === 3) applyStatus(state.player, 'vulnerable', 1);
      }
    },
  },

  // ─────────────────────────────────────────────────────────
  // 추가 적 (다양한 메커니즘)
  // ─────────────────────────────────────────────────────────

  // Chapter 1
  flame_wisp: {
    id: 'flame_wisp',
    name: '불꽃령',
    hpRange: [28, 32],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 0) return { kind: 'attack', damage: 5, hits: 1, label: '5 + 화상 +3' };
      if (i === 1) return attack(8, 1);
      return { kind: 'attack', damage: 6, hits: 1, label: '6 + 화상 +2' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        const i = self.turn % 3;
        if (i === 0) applyStatus(state.player, 'burn', 3);
        else if (i === 2) applyStatus(state.player, 'burn', 2);
      }
    },
  },
  charging_boar: {
    id: 'charging_boar',
    name: '돌격 멧돼지',
    hpRange: [42, 48],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 0) return { kind: 'buff', label: '예열: 힘 +3 (충전)' };
      if (i === 1) return attack(18, 1);
      return attack(6, 1);
    },
    act(state, self) {
      const it = self.intent;
      const i = self.turn % 3;
      if (it.kind === 'buff') {
        applyStatus(self, 'strength', 3);
      } else if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        // After the big charge, lose the buildup
        if (i === 1) applyStatus(self, 'strength', -3);
      }
    },
  },

  // Chapter 2
  curse_priest: {
    id: 'curse_priest',
    name: '저주 사제',
    hpRange: [46, 52],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return { kind: 'debuff', label: '약화 +2' };
      if (i === 1) return { kind: 'debuff', label: '취약 +2' };
      return attack(9, 1);
    },
    act(state, self) {
      const it = self.intent;
      const i = self.turn % 4;
      if (it.kind === 'debuff') {
        if (i === 0) applyStatus(state.player, 'weak', 2);
        else applyStatus(state.player, 'vulnerable', 2);
      } else if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
      }
    },
  },
  mech_scout: {
    id: 'mech_scout',
    name: '기갑 정찰병',
    hpRange: [50, 58],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return { kind: 'attack_block', damage: 0, block: 8, label: '방어 8 + 가시 +2' };
      if (i === 1) return attack(11, 1);
      if (i === 2) return { kind: 'block', block: 10, label: '방어 10' };
      return { kind: 'attack', damage: 7, hits: 1, label: '7 + 약화' };
    },
    act(state, self) {
      const it = self.intent;
      const i = self.turn % 4;
      if (i === 0) {
        gainBlock(self, 8);
        applyStatus(self, 'thorns', 2);
      } else if (it.kind === 'block' && it.block) {
        gainBlock(self, it.block);
      } else if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (i === 3) applyStatus(state.player, 'weak', 1);
      }
    },
  },

  // Chapter 3
  exorcist_hunter: {
    id: 'exorcist_hunter',
    name: '퇴마사 헌터',
    hpRange: [68, 76],
    decideIntent(_state, _self, turn) {
      const i = turn % 3;
      if (i === 0) return attack(14, 1);
      if (i === 1) return { kind: 'buff', label: '정화 + 8 데미지' };
      return attack(17, 1);
    },
    act(state, self) {
      const it = self.intent;
      const i = self.turn % 3;
      if (i === 1) {
        // Cleanse own debuffs (anti-DoT counter)
        for (const k of ['vulnerable', 'weak', 'frail', 'burn', 'freeze', 'poison'] as const) {
          delete self.statuses[k];
        }
        dealDamage(state, self, state.player, 8, true);
      } else if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
      }
    },
  },

  // Elites
  forest_spirit: {
    id: 'forest_spirit',
    name: '숲의 정령',
    hpRange: [88, 96],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '재생 +5' };
      const i = (turn - 1) % 4;
      if (i === 0) return attack(9, 1);
      if (i === 1) return attack(6, 2);
      if (i === 2) return { kind: 'attack', damage: 12, hits: 1, label: '12 + 약화 +1' };
      return { kind: 'buff', label: '재생 +3' };
    },
    act(state, self) {
      const it = self.intent;
      if (it.kind === 'buff') {
        applyStatus(self, 'regen', self.turn === 0 ? 5 : 3);
      } else if (it.damage) {
        const hits = it.hits ?? 1;
        for (let h = 0; h < hits; h++) dealDamage(state, self, state.player, it.damage, true);
        if (((self.turn - 1) % 4) === 2) applyStatus(state.player, 'weak', 1);
      }
    },
  },
  dimension_sorcerer: {
    id: 'dimension_sorcerer',
    name: '차원 술사',
    hpRange: [72, 80],
    decideIntent(_state, _self, turn) {
      const i = turn % 4;
      if (i === 0) return { kind: 'attack', damage: 5, hits: 1, label: '5 + 카드 1장 버림' };
      if (i === 1) return attack(14, 1);
      if (i === 2) return { kind: 'attack', damage: 7, hits: 1, label: '7 + 카드 1장 버림' };
      return attack(20, 1);
    },
    act(state, self) {
      const it = self.intent;
      const i = self.turn % 4;
      if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (i === 0 || i === 2) {
          // Discard a random card from player's hand
          if (state.player.hand.length > 0) {
            const idx = Math.floor(state.rng() * state.player.hand.length);
            const [c] = state.player.hand.splice(idx, 1);
            state.player.discard.push(c);
            state.log.push('차원 술사: 카드 1장 강제 버림');
          }
        }
      }
    },
  },
  titan_golem: {
    id: 'titan_golem',
    name: '거대 골렘',
    hpRange: [180, 200],
    decideIntent(_state, _self, turn) {
      if (turn === 0) return { kind: 'buff', label: '금속화 +4, 가시 +3' };
      const i = (turn - 1) % 4;
      if (i === 0) return { kind: 'block', block: 18, label: '방어 18' };
      if (i === 1) return attack(22, 1);
      if (i === 2) return { kind: 'attack_block', damage: 12, block: 12, label: '12 / 방어 12' };
      return { kind: 'attack', damage: 14, hits: 1, label: '14 + 약화 +1' };
    },
    act(state, self) {
      const it = self.intent;
      const i = (self.turn - 1) % 4;
      if (it.kind === 'buff') {
        applyStatus(self, 'metallicize', 4);
        applyStatus(self, 'thorns', 3);
      } else if (it.kind === 'block' && it.block) {
        gainBlock(self, it.block);
      } else if (it.kind === 'attack_block' && it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (it.block) gainBlock(self, it.block);
      } else if (it.damage) {
        dealDamage(state, self, state.player, it.damage, true);
        if (i === 3) applyStatus(state.player, 'weak', 1);
      }
    },
  },
};

// ── Encounter tables ──
export const EASY_ENCOUNTERS: string[][] = [
  ['jaw_worm'],
  ['cultist'],
  ['fungi_beast', 'fungi_beast'],
  ['wandering_swordsman'],
  ['goblin_berserker'],
  ['flame_wisp'],
  ['flame_wisp', 'flame_wisp'],
];

export const NORMAL_ENCOUNTERS: string[][] = [
  ['jaw_worm', 'fungi_beast'],
  ['cultist', 'fungi_beast'],
  ['sentinel'],
  ['jaw_worm', 'jaw_worm'],
  ['goblin_berserker', 'fungi_beast'],
  ['wandering_swordsman', 'cultist'],
  ['goblin_berserker', 'wandering_swordsman'],
  ['charging_boar'],
  ['flame_wisp', 'cultist'],
  ['charging_boar', 'flame_wisp'],
];

export const ELITE_ENCOUNTERS: string[][] = [
  ['gremlin_nob'],
  ['sentinel', 'sentinel'],
  ['frenzy_gremlin'],
  ['forest_spirit'],
];

export const BOSS_ENCOUNTERS: string[][] = [['hexaghost'], ['mad_butcher'], ['obsidian_golem']];

// Chapter 2
export const CH2_NORMAL_ENCOUNTERS: string[][] = [
  ['blue_slaver'],
  ['red_slaver'],
  ['blue_slaver', 'shield_gremlin'],
  ['red_slaver', 'fungi_beast'],
  ['shield_gremlin', 'shield_gremlin'],
  ['arcane_scholar'],
  ['black_butcher'],
  ['arcane_scholar', 'shield_gremlin'],
  ['black_butcher', 'arcane_scholar'],
  ['curse_priest'],
  ['mech_scout'],
  ['curse_priest', 'shield_gremlin'],
  ['mech_scout', 'arcane_scholar'],
];

export const CH2_ELITE_ENCOUNTERS: string[][] = [
  ['taskmaster'],
  ['book_of_stabbing'],
  ['taskmaster', 'shield_gremlin'],
  ['heavy_armored'],
  ['heavy_armored', 'arcane_scholar'],
  ['dimension_sorcerer'],
];

export const CH2_BOSS_ENCOUNTERS: string[][] = [['the_collector'], ['karnak_runemaster'], ['sirocco_phantom']];

// Chapter 3
export const CH3_NORMAL_ENCOUNTERS: string[][] = [
  ['looter'],
  ['dark_slime'],
  ['centurion'],
  ['looter', 'dark_slime'],
  ['centurion', 'shield_gremlin'],
  ['dark_knight'],
  ['corrupted_beast'],
  ['dark_knight', 'corrupted_beast'],
  ['dark_knight', 'dark_slime'],
  ['corrupted_beast', 'looter'],
  ['exorcist_hunter'],
  ['exorcist_hunter', 'corrupted_beast'],
];

export const CH3_ELITE_ENCOUNTERS: string[][] = [
  ['writhing_mass'],
  ['book_of_stabbing', 'taskmaster'],
  ['dragonling'],
  ['dragonling', 'corrupted_beast'],
  ['titan_golem'],
];

export const CH3_BOSS_ENCOUNTERS: string[][] = [['void_heart'], ['death_apostle'], ['isaris_overlord']];

// Chapter 4 (true ending route)
export const CH4_BOSS_ENCOUNTERS: string[][] = [['abyss_lord']];

export function pickEncounter(rng: () => number, table: string[][]): string[] {
  return table[Math.floor(rng() * table.length)];
}

