import { t } from '../i18n';
import { C, Cy, p, ci, rc } from './art-shapes';

// 덩치 큰 데이터는 따로 둔다 — 불러 쓰는 쪽은 예전처럼 './art' 하나만 본다.
export * from './art-enemies';
export * from './art-relics';
export * from './art-events';
export * from './art-achievements';

// ── Character Art (detailed, used in select screen + UI) ──

export const CHARACTER_SVG: Record<string, string> = {
  swordmaster: C([
    // Cape
    p('M18 24 L10 30 L8 52 L20 56 L26 44', '#a03028'),
    p('M46 24 L54 30 L56 52 L44 56 L38 44', '#a03028'),
    // Body armor
    p('M24 22 L20 28 L18 48 L28 54 L36 54 L46 48 L44 28 L40 22Z', '#d04840'),
    // Chest plate
    p('M28 26 L36 26 L35 40 L29 40Z', '#e86058'),
    // Armor line
    p('M30 26 L34 26 L33 40 L31 40Z', '#f08070'),
    // Belt
    p('M22 40 L42 40 L42 44 L22 44Z', '#8a2820'),
    rc(30, 40, 4, 4, '#ffd700'),
    // Head
    ci(32, 14, 9, '#f0c8a0'),
    // Hair spiky
    p('M24 10 L27 2 L30 8 L33 2 L36 8 L39 2 L40 10 Q32 6 24 10Z', '#c83028'),
    // Headband
    p('M23 12 L41 12 L41 14 L23 14Z', '#fff'),
    // Eyes
    ci(29, 15, 1.5, '#1a1a2e'),
    ci(35, 15, 1.5, '#1a1a2e'),
    // Mouth
    p('M30 18 Q32 20 34 18', '#c07060'),
    // Sword blade
    p('M46 4 L48 2 L50 4 L49 24 L47 24Z', '#c8d0d8'),
    p('M47.5 4 L48 2 L49 4 L48.5 24 L47.5 24Z', '#e8f0f8'),
    // Sword guard
    p('M44 23 L52 23 L52 25.5 L44 25.5Z', '#ffd700'),
    // Sword handle
    rc(47, 25.5, 2.5, 5, '#6b3410'),
    // Sword pommel
    ci(48.25, 31.5, 1.5, '#ffd700'),
    // Legs
    p('M26 54 L24 62 L30 62 L32 54Z', '#c04038'),
    p('M32 54 L34 62 L40 62 L38 54Z', '#c04038'),
    // Boots
    p('M23 60 L22 63 L31 63 L30 60Z', '#4a2818'),
    p('M33 60 L34 63 L42 63 L41 60Z', '#4a2818'),
  ].join('')),

  gunner: C([
    // Coat tails
    p('M18 38 L14 54 L22 56 L26 44Z', '#2a5a90'),
    p('M46 38 L50 54 L42 56 L38 44Z', '#2a5a90'),
    // Body coat
    p('M22 22 L18 28 L16 48 L28 54 L36 54 L48 48 L46 28 L42 22Z', '#3878b8'),
    // Coat front panel
    p('M30 24 L34 24 L34 50 L30 50Z', '#4a90d0'),
    // Belt / bandolier
    p('M24 28 L40 38 L40 40 L24 30Z', '#c8a040'),
    p('M40 28 L24 38 L24 40 L40 30Z', '#c8a040'),
    // Collar
    p('M26 22 L32 26 L38 22 L36 20 L28 20Z', '#4a90d0'),
    // Head
    ci(32, 13, 9, '#f0c8a0'),
    // Cap
    p('M22 10 L32 4 L42 10 L40 14 L24 14Z', '#2a5a90'),
    p('M24 13 L40 13 L42 15 L22 15Z', '#1a3a60'),
    // Cap brim
    p('M22 14 L42 14 L44 16 L20 16Z', '#1a3a60'),
    // Goggles
    p('M26 11 L30 11 L30 14 L26 14Z', '#ffd700'),
    p('M34 11 L38 11 L38 14 L34 14Z', '#ffd700'),
    ci(28, 12.5, 1.5, '#80d0f0'),
    ci(36, 12.5, 1.5, '#80d0f0'),
    // Eyes (behind goggles, visible as dark)
    ci(28, 12.5, 0.8, '#1a1a2e'),
    ci(36, 12.5, 0.8, '#1a1a2e'),
    // Rifle
    p('M10 30 L12 28 L44 22 L46 24 L14 32Z', '#5a5a5a'),
    p('M10 30 L6 32 L8 34 L12 32Z', '#4a4a4a'),
    rc(40, 22, 6, 3, '#6a6a6a'),
    // Rifle detail
    p('M14 29 L40 23 L40 24 L14 30Z', '#888'),
    // Legs
    p('M26 54 L24 62 L30 62 L32 54Z', '#2a5a90'),
    p('M32 54 L34 62 L40 62 L38 54Z', '#2a5a90'),
    // Boots
    p('M23 60 L22 63 L31 63 L30 60Z', '#3a2818'),
    p('M33 60 L34 63 L42 63 L41 60Z', '#3a2818'),
  ].join('')),

  fighter: C([
    // Body - gi open
    p('M24 22 L20 28 L18 48 L28 54 L36 54 L46 48 L44 28 L40 22Z', '#d09020'),
    // Gi opening - skin
    p('M28 22 L36 22 L34 38 L30 38Z', '#e0b080'),
    // Gi lapels
    p('M26 22 L30 22 L30 36 L26 30Z', '#e8a828'),
    p('M38 22 L34 22 L34 36 L38 30Z', '#e8a828'),
    // Belt sash
    p('M20 38 L44 38 L44 42 L20 42Z', '#2a2a2a'),
    rc(30, 38, 4, 4, '#e0a030'),
    // Left arm raised - fist up
    p('M20 26 L14 18 L10 16 L8 18 L12 22 L18 28Z', '#e0b080'),
    // Left fist
    ci(9, 17, 4, '#e0b080'),
    // Left hand wrap
    p('M6 15 L12 15 L12 17 L6 17Z', '#fff'),
    p('M6 17 L12 17 L12 19 L6 19Z', '#fff'),
    // Right arm raised - fist up
    p('M44 26 L50 18 L54 16 L56 18 L52 22 L46 28Z', '#e0b080'),
    // Right fist
    ci(55, 17, 4, '#e0b080'),
    // Right hand wrap
    p('M52 15 L58 15 L58 17 L52 17Z', '#fff'),
    p('M52 17 L58 17 L58 19 L52 19Z', '#fff'),
    // Head
    ci(32, 13, 9, '#e0b080'),
    // Hair - short spiky
    p('M24 9 L26 4 L29 7 L32 3 L35 7 L38 4 L40 9 Q32 5 24 9Z', '#2a2a2a'),
    // Headband
    p('M23 10 L41 10 L41 12 L23 12Z', '#e85040'),
    // Headband tail
    p('M41 10 L48 8 L48 10 L41 12Z', '#e85040'),
    // Eyes - fierce
    p('M27 14 L31 13 L31 16 L28 16Z', '#1a1a2e'),
    p('M33 13 L37 14 L36 16 L33 16Z', '#1a1a2e'),
    // Mouth - grin
    p('M29 18 Q32 21 35 18', '#c07060'),
    // Legs
    p('M26 54 L24 62 L30 62 L32 54Z', '#d09020'),
    p('M32 54 L34 62 L40 62 L38 54Z', '#d09020'),
    // Boots/wraps
    p('M23 58 L22 63 L31 63 L30 58Z', '#2a2a2a'),
    p('M33 58 L34 63 L42 63 L41 58Z', '#2a2a2a'),
  ].join('')),

  magician: C([
    // Robe body
    p('M22 26 L16 34 L12 54 L28 60 L36 60 L52 54 L48 34 L42 26Z', '#7840b8'),
    // Robe front
    p('M30 26 L34 26 L35 58 L29 58Z', '#9060d0'),
    // Robe trim
    p('M12 54 L28 60 L36 60 L52 54 L52 56 L36 62 L28 62 L12 56Z', '#5a2890'),
    // Shoulders
    p('M20 24 L26 22 L26 28 L18 30Z', '#6830a0'),
    p('M44 24 L38 22 L38 28 L46 30Z', '#6830a0'),
    // Head
    ci(32, 16, 8, '#f0c8a0'),
    // Wizard hat
    p('M22 14 L32 -2 L42 14 L40 18 L24 18Z', '#5a2890'),
    // Hat brim
    p('M18 17 L46 17 L44 20 L20 20Z', '#6830a0'),
    // Hat band
    p('M24 15 L40 15 L40 17 L24 17Z', '#ffd700'),
    // Hat star
    p('M32 4 L33 7 L36 7 L34 9 L35 12 L32 10 L29 12 L30 9 L28 7 L31 7Z', '#ffd700'),
    // Eyes
    ci(29, 18, 1.5, '#1a1a2e'),
    ci(35, 18, 1.5, '#1a1a2e'),
    // Staff
    rc(8, 8, 2.5, 48, '#6b3410'),
    // Staff orb
    ci(9.25, 8, 5, '#d090ff80'),
    ci(9.25, 8, 3.5, '#d090ff'),
    ci(9.25, 7, 1.5, '#f0d0ff'),
    // Magic sparkles
    p('M52 10 L53 8 L54 10 L56 11 L54 12 L53 14 L52 12 L50 11Z', '#d090ff80'),
    p('M48 4 L49 2 L50 4 L52 5 L50 6 L49 8 L48 6 L46 5Z', '#d090ff60'),
    p('M56 18 L57 16 L58 18 L60 19 L58 20 L57 22 L56 20 L54 19Z', '#d090ff40'),
    // Legs (hidden by robe, just shoes peeking)
    p('M26 58 L24 63 L30 63 L30 58Z', '#4a2818'),
    p('M34 58 L34 63 L40 63 L38 58Z', '#4a2818'),
  ].join('')),

  priest: C([
    // Halo glow
    ci(32, 6, 7, '#ffe08030'),
    ci(32, 6, 5, '#ffe08060'),
    // Halo ring
    p('M25 6 Q25 2 32 2 Q39 2 39 6 Q39 8 32 8 Q25 8 25 6Z', '#ffd700'),
    p('M27 6 Q27 3.5 32 3.5 Q37 3.5 37 6 Q37 7 32 7 Q27 7 27 6Z', '#1a141600'),
    // Robe body
    p('M22 24 L18 30 L14 54 L28 60 L36 60 L50 54 L46 30 L42 24Z', '#e8e0c8'),
    // Robe front panel
    p('M30 24 L34 24 L34 58 L30 58Z', '#f0e8d0'),
    // Cross on chest
    p('M31 28 L33 28 L33 38 L31 38Z', '#ffd700'),
    p('M29 31 L35 31 L35 33 L29 33Z', '#ffd700'),
    // Robe trim
    p('M14 54 L28 60 L36 60 L50 54 L50 56 L36 62 L28 62 L14 56Z', '#c8a040'),
    // Shoulders/stole
    p('M22 24 L28 22 L34 28 L26 30Z', '#c8a040'),
    p('M42 24 L36 22 L30 28 L38 30Z', '#c8a040'),
    // Head
    ci(32, 16, 8, '#f0c8a0'),
    // Hair/hood
    p('M24 12 L26 8 L38 8 L40 12 L40 18 L38 14 L26 14 L24 18Z', '#c8a040'),
    // Eyes - gentle
    ci(29, 16, 1.3, '#1a1a2e'),
    ci(35, 16, 1.3, '#1a1a2e'),
    // Gentle smile
    p('M30 19 Q32 21 34 19', '#c07060'),
    // Staff
    rc(50, 6, 2.5, 50, '#c8a040'),
    // Staff cross top
    p('M47 4 L55 4 L55 6 L47 6Z', '#ffd700'),
    p('M50 0 L52.5 0 L52.5 10 L50 10Z', '#ffd700'),
    // Staff glow
    ci(51.25, 5, 3, '#ffe08040'),
    // Legs (shoes)
    p('M26 58 L24 63 L30 63 L30 58Z', '#8a6830'),
    p('M34 58 L34 63 L40 63 L38 58Z', '#8a6830'),
  ].join('')),

  thief: C([
    // Body - leather
    p('M24 24 L20 30 L18 48 L28 54 L36 54 L46 48 L44 30 L40 24Z', '#308050'),
    // Vest detail
    p('M28 26 L36 26 L36 44 L28 44Z', '#286840'),
    // Belt
    p('M20 42 L44 42 L44 46 L20 46Z', '#2a2a2a'),
    rc(30, 42, 4, 4, '#808080'),
    // Shoulder pads
    p('M22 24 L18 22 L16 26 L20 28Z', '#286840'),
    p('M42 24 L46 22 L48 26 L44 28Z', '#286840'),
    // Left arm + dagger
    p('M18 28 L12 34 L10 38 L14 38 L20 32Z', '#e0b080'),
    // Left dagger blade
    p('M8 38 L10 34 L12 38 L10 50Z', '#c0c8d0'),
    p('M9.5 38 L10 34 L11 38 L10 48Z', '#e0e8f0'),
    // Right arm + dagger
    p('M46 28 L52 34 L54 38 L50 38 L44 32Z', '#e0b080'),
    // Right dagger blade
    p('M56 38 L54 34 L52 38 L54 50Z', '#c0c8d0'),
    p('M54.5 38 L54 34 L53 38 L54 48Z', '#e0e8f0'),
    // Head
    ci(32, 15, 8, '#f0c8a0'),
    // Hood
    p('M22 12 L28 4 L36 4 L42 12 L42 18 L40 14 L24 14 L22 18Z', '#286840'),
    p('M22 12 L26 6 L38 6 L42 12 L40 14 L24 14Z', '#308050'),
    // Face scarf/mask
    p('M24 18 L40 18 L40 22 L24 22Z', '#1a3020'),
    // Eyes - sharp
    p('M27 14 L31 14 L30 16.5 L27 16Z', '#1a1a2e'),
    p('M33 14 L37 14 L37 16 L34 16.5Z', '#1a1a2e'),
    // Eye shine
    ci(29, 15, 0.6, '#80ffa0'),
    ci(35, 15, 0.6, '#80ffa0'),
    // Legs
    p('M26 54 L24 62 L30 62 L32 54Z', '#286840'),
    p('M32 54 L34 62 L40 62 L38 54Z', '#286840'),
    // Boots
    p('M23 60 L22 63 L31 63 L30 60Z', '#2a2a2a'),
    p('M33 60 L34 63 L42 63 L41 60Z', '#2a2a2a'),
  ].join('')),

  summoner: C([
    // Robe body
    p('M22 26 L16 34 L12 54 L28 60 L36 60 L52 54 L48 34 L42 26Z', '#408898'),
    // Robe front
    p('M30 26 L34 26 L34 58 L30 58Z', '#58a8b8'),
    // Robe pattern lines
    p('M16 40 L48 40 L48 42 L16 42Z', '#306878'),
    p('M14 48 L50 48 L50 50 L14 50Z', '#306878'),
    // Robe trim
    p('M12 54 L28 60 L36 60 L52 54 L52 56 L36 62 L28 62 L12 56Z', '#306878'),
    // Shoulders
    p('M20 24 L26 22 L26 28 L18 30Z', '#508898'),
    p('M44 24 L38 22 L38 28 L46 30Z', '#508898'),
    // Head
    ci(32, 16, 8, '#f0c8a0'),
    // Long hair
    p('M24 12 L28 6 L36 6 L40 12 L42 24 L40 16 L24 16 L22 24Z', '#58a8b8'),
    // Hair bangs
    p('M26 10 L30 6 L34 6 L38 10 L36 14 L28 14Z', '#4898a8'),
    // Eyes
    ci(29, 16, 1.3, '#1a1a2e'),
    ci(35, 16, 1.3, '#1a1a2e'),
    // Crystal staff
    rc(8, 14, 2, 48, '#6b5030'),
    // Staff crystal
    p('M4 10 L9 2 L14 10 L9 14Z', '#80d0e0'),
    p('M6 9 L9 4 L12 9 L9 12Z', '#a0e8f0'),
    ci(9, 8, 1.5, '#d0f0ff'),
    // Floating spirit orbs
    ci(52, 10, 5, '#80d0e040'),
    ci(52, 10, 3.5, '#80d0e080'),
    ci(52, 9, 1.5, '#c0f0ff'),
    ci(56, 22, 3.5, '#80d0e030'),
    ci(56, 22, 2.5, '#80d0e060'),
    ci(56, 21, 1, '#c0f0ff'),
    ci(48, 2, 2.5, '#80d0e020'),
    ci(48, 2, 1.5, '#80d0e050'),
    // Legs (shoes)
    p('M26 58 L24 63 L30 63 L30 58Z', '#3a2818'),
    p('M34 58 L34 63 L40 63 L38 58Z', '#3a2818'),
  ].join('')),

  engineer: C([
    // Jumpsuit body
    p('M22 26 L18 34 L16 54 L28 60 L36 60 L48 54 L46 34 L42 26Z', '#c09030'),
    // Jumpsuit front zip
    p('M30 26 L34 26 L34 58 L30 58Z', '#d0a040'),
    // Belt
    p('M18 40 L46 40 L46 43 L18 43Z', '#5a4020'),
    rc(30, 40, 4, 3, '#888'),
    // Shoulder pads
    p('M20 24 L26 22 L26 28 L18 30Z', '#a08028'),
    p('M44 24 L38 22 L38 28 L46 30Z', '#a08028'),
    // Head
    ci(32, 16, 8, '#f0c8a0'),
    // Goggles
    p('M24 13 L40 13 L40 19 L24 19Z', '#40404080'),
    ci(28, 16, 3, '#80c0ff60'),
    ci(36, 16, 3, '#80c0ff60'),
    p('M24 14 L40 14 L40 15 L24 15Z', '#606060'),
    // Short hair
    p('M24 8 L28 5 L36 5 L40 8 L40 14 L24 14Z', '#4a3520'),
    // Eyes behind goggles
    ci(28, 16, 1, '#1a1a2e'),
    ci(36, 16, 1, '#1a1a2e'),
    // Wrench tool
    rc(48, 18, 2, 40, '#707070'),
    p('M46 16 L50 14 L52 16 L52 22 L46 22Z', '#888'),
    p('M46 54 L50 52 L52 54 L52 58 L46 58Z', '#888'),
    // Hovering drone
    ci(10, 12, 4, '#60606080'),
    p('M6 10 L14 10 L14 14 L6 14Z', '#808080'),
    p('M4 11 L6 10 L6 14 L4 13Z', '#a0a0a0'),
    p('M14 11 L16 10 L16 14 L14 13Z', '#a0a0a0'),
    ci(10, 12, 1.5, '#ff6030'),
    // Boots
    p('M24 58 L22 63 L30 63 L28 58Z', '#5a4020'),
    p('M36 58 L34 63 L42 63 L40 58Z', '#5a4020'),
  ].join('')),

  gambler: C([
    // Suit jacket
    p('M20 26 L16 34 L14 56 L28 60 L36 60 L50 56 L48 34 L44 26Z', '#2a1a30'),
    // Lapels
    p('M28 26 L24 34 L28 42 L32 26Z', '#3a2a40'),
    p('M36 26 L40 34 L36 42 L32 26Z', '#3a2a40'),
    // Shirt
    p('M28 26 L32 26 L36 26 L36 56 L28 56Z', '#e8e0d0'),
    // Tie
    p('M30 26 L32 24 L34 26 L33 42 L32 44 L31 42Z', '#c03030'),
    // Vest
    p('M28 34 L24 34 L22 56 L28 58Z', '#4a2050'),
    p('M36 34 L40 34 L42 56 L36 58Z', '#4a2050'),
    // Head
    ci(32, 16, 8, '#f0c8a0'),
    // Hat
    p('M20 14 L44 14 L44 16 L20 16Z', '#1a0a20'),
    p('M24 6 L40 6 L42 14 L22 14Z', '#2a1a30'),
    p('M26 6 L38 6 L38 8 L26 8Z', '#c03030'),
    // Eyes
    ci(28, 16, 1.5, '#1a1a2e'),
    ci(36, 16, 1.5, '#1a1a2e'),
    // Smirk
    p('M29 20 L35 20 L34 21 L30 21Z', '#c08080'),
    // Dice in hand
    rc(46, 28, 8, 8, '#f0f0f0'),
    ci(48, 30, 0.8, '#222'),
    ci(52, 30, 0.8, '#222'),
    ci(48, 34, 0.8, '#222'),
    ci(52, 34, 0.8, '#222'),
    ci(50, 32, 0.8, '#c03030'),
    // Shoes
    p('M22 58 L20 63 L30 63 L28 58Z', '#1a0a20'),
    p('M36 58 L34 63 L44 63 L42 58Z', '#1a0a20'),
  ].join('')),

  blood_mage: C([
    // Dark robe
    p('M18 28 L14 34 L12 58 L28 62 L36 62 L52 58 L50 34 L46 28Z', '#3a0a0a'),
    // Inner robe
    p('M28 28 L36 28 L36 58 L28 58Z', '#1a0000'),
    // Blood sigils on robe
    ci(24, 44, 3, '#8b000040'),
    ci(40, 44, 3, '#8b000040'),
    // Collar
    p('M26 28 L32 24 L38 28 L36 30 L28 30Z', '#5a0a0a'),
    // Head
    ci(32, 17, 8, '#e8c8a0'),
    // Hood
    p('M22 10 L42 10 L44 20 L40 24 L24 24 L20 20Z', '#3a0a0a'),
    p('M24 10 L40 10 L42 18 L22 18Z', '#2a0000'),
    // Eyes (glowing red)
    ci(28, 17, 1.5, '#ff2020'),
    ci(36, 17, 1.5, '#ff2020'),
    // Blood orb in hand
    ci(48, 34, 5, '#8b0000'),
    ci(48, 34, 3, '#cc2020'),
    ci(48, 33, 1.5, '#ff6060'),
    // Blood drips from orb
    p('M47 39 L48 44 L49 39Z', '#8b0000'),
    p('M45 38 L46 42 L47 38Z', '#8b0000'),
    // Belt with blood vial
    p('M24 48 L40 48 L40 50 L24 50Z', '#5a2020'),
    rc(30, 46, 4, 6, '#cc4040'),
    // Boots
    p('M24 58 L22 63 L30 63 L28 58Z', '#2a0808'),
    p('M36 58 L34 63 L42 63 L40 58Z', '#2a0808'),
  ].join('')),
};


// ── Enemy Art (compact icons for combat screen) ──

export const CHAR_NAMES: Record<string, string> = {
  swordmaster: t('검사'),
  gunner: t('총잡이'),
  fighter: t('격투가'),
  magician: t('마법사'),
  priest: t('성직자'),
  thief: t('도적'),
  summoner: t('정령술사'),
  engineer: t('공학자'),
  gambler: t('갬블러'),
  blood_mage: t('혈술사'),
};

export function artEl(svg: string | undefined, size = 64): HTMLElement {
  const d = document.createElement('span');
  d.style.display = 'inline-block';
  d.style.width = `${size}px`;
  d.style.height = `${size}px`;
  d.style.verticalAlign = 'middle';
  if (svg) d.innerHTML = svg;
  return d;
}
// ─── MAP NODE ICONS ──────────────────────────────────────────

export const MAP_NODE_SVG: Record<string, string> = {
  start: C(
    // Stone base
    rc(20, 44, 24, 8, '#666666') +
    rc(24, 40, 16, 6, '#777777') +
    // Flag pole
    rc(30, 10, 3, 36, '#8b6914') +
    // Flag body
    p('M33 10 L52 16 L52 28 L33 22Z', '#33aa55') +
    // Flag inner stripe
    p('M33 14 L48 18 L48 24 L33 20Z', '#44cc66') +
    // Flag star
    ci(42, 19, 2.5, '#ffffff') +
    // Pole top
    ci(31.5, 9, 2.5, '#d4af37') +
    // Stone texture
    p('M22 46 L26 46', '#555555') +
    p('M32 46 L38 46', '#555555') +
    // Base shadow
    rc(22, 50, 20, 2, '#555555')
  ),

  combat: Cy(5,
    // Left sword blade
    p('M10 10 L28 32 L24 36 L6 14Z', '#b0c0d0') +
    // Left blade highlight
    p('M12 12 L26 30 L24 32 L10 14Z', '#d0dde8') +
    // Right sword blade
    p('M54 10 L36 32 L40 36 L58 14Z', '#b0c0d0') +
    // Right blade highlight
    p('M52 12 L38 30 L40 32 L54 14Z', '#d0dde8') +
    // Left guard
    p('M22 30 L30 34 L28 38 L20 34Z', '#d4af37') +
    // Right guard
    p('M42 30 L34 34 L36 38 L44 34Z', '#d4af37') +
    // Left handle
    p('M26 36 L22 42 L26 44 L30 38Z', '#8b4513') +
    // Right handle
    p('M38 36 L42 42 L38 44 L34 38Z', '#8b4513') +
    // Clash spark center
    ci(32, 28, 4, '#ffee44') +
    ci(32, 28, 2, '#ffffff') +
    // Small sparks
    ci(28, 24, 1.5, '#ffcc22') +
    ci(36, 24, 1.5, '#ffcc22')
  ),

  elite: Cy(10,
    // Skull dome
    p('M20 18 Q20 6 32 4 Q44 6 44 18 Q44 28 40 32 L24 32 Q20 28 20 18Z', '#e0d8cc') +
    // Skull face
    p('M24 32 L24 40 Q28 44 32 44 Q36 44 40 40 L40 32Z', '#d8d0c4') +
    // Left eye
    p('M24 20 Q28 18 30 22 Q28 26 24 24Z', '#1a0a0a') +
    // Right eye
    p('M40 20 Q36 18 34 22 Q36 26 40 24Z', '#1a0a0a') +
    // Eye glow left
    ci(27, 22, 1.5, '#ff2222') +
    // Eye glow right
    ci(37, 22, 1.5, '#ff2222') +
    // Nose
    p('M30 30 L32 28 L34 30Z', '#c8c0b4') +
    // Teeth
    rc(27, 38, 3, 4, '#f0e8dc') +
    rc(31, 38, 3, 4, '#f0e8dc') +
    rc(35, 38, 3, 4, '#f0e8dc') +
    // Left horn
    p('M20 18 Q14 8 10 2 Q16 6 22 14Z', '#aa3322') +
    // Right horn
    p('M44 18 Q50 8 54 2 Q48 6 42 14Z', '#aa3322') +
    // Crown/headband
    p('M20 16 L44 16 L44 18 L20 18Z', '#d4af37')
  ),

  rest: Cy(5,
    // Log left
    p('M8 48 L28 48 L26 42 L10 42Z', '#6b4226') +
    p('M10 42 L26 42 L24 38 L12 38Z', '#7a4e2e') +
    // Log right
    p('M36 48 L56 48 L54 42 L38 42Z', '#6b4226') +
    p('M38 42 L54 42 L52 38 L40 38Z', '#7a4e2e') +
    // Fire base
    p('M22 42 Q26 34 32 28 Q38 34 42 42Z', '#ff4400') +
    // Fire mid
    p('M24 40 Q28 32 32 24 Q36 32 40 40Z', '#ff8800') +
    // Fire inner
    p('M27 38 Q30 30 32 22 Q34 30 37 38Z', '#ffcc00') +
    // Fire core
    p('M29 36 Q31 28 32 20 Q33 28 35 36Z', '#ffee88') +
    // Sparks
    ci(20, 24, 1.5, '#ff8844') +
    ci(44, 22, 1.5, '#ff8844') +
    ci(36, 16, 1, '#ffcc44') +
    // Smoke wisps
    p('M30 14 Q28 8 30 4', '#88888844') +
    p('M34 12 Q36 6 34 2', '#88888844')
  ),

  reward: Cy(3,
    // Chest body
    p('M12 30 L12 50 L52 50 L52 30Z', '#8b6914') +
    // Chest lid
    p('M10 28 Q10 22 32 20 Q54 22 54 28 L54 32 Q54 30 32 28 Q10 30 10 32Z', '#a07828') +
    // Chest lid top
    p('M10 22 Q10 18 32 16 Q54 18 54 22 Q54 24 32 22 Q10 24 10 22Z', '#b88c3c') +
    // Lock
    rc(28, 28, 8, 8, '#d4af37') +
    ci(32, 32, 2, '#1a1a1a') +
    // Gold coin 1
    ci(22, 14, 4, '#ffd700') +
    ci(22, 14, 2.5, '#ffee44') +
    // Gold coin 2
    ci(42, 12, 4, '#ffd700') +
    ci(42, 12, 2.5, '#ffee44') +
    // Gold coin 3
    ci(32, 10, 3.5, '#ffd700') +
    // Chest band
    rc(12, 38, 40, 3, '#d4af37') +
    // Wood grain
    p('M14 34 L24 34', '#7a5c10') +
    p('M34 42 L50 42', '#7a5c10')
  ),

  shop: Cy(2,
    // Shop bag body
    p('M16 24 L14 52 L50 52 L48 24Z', '#c9a96e') +
    // Bag opening
    p('M16 24 Q18 20 32 18 Q46 20 48 24 Q44 22 32 21 Q20 22 16 24Z', '#b8985a') +
    // Handle left
    p('M20 18 Q18 10 24 8 Q28 10 26 18', '#b8985a') +
    // Handle right
    p('M44 18 Q46 10 40 8 Q36 10 38 18', '#b8985a') +
    // Gold coin symbol
    ci(32, 36, 8, '#d4af37') +
    ci(32, 36, 6, '#f0d866') +
    // Dollar sign
    p('M30 32 Q33 30 35 32 Q33 34 30 36 Q33 38 35 36', '#aa8822') +
    rc(31.5, 30, 1, 8, '#aa8822') +
    // Bag fold line
    p('M18 30 Q32 28 46 30', '#b8985a') +
    // Shadow
    p('M16 48 Q32 50 48 48 L50 52 L14 52Z', '#a68850')
  ),

  boss: C(
    // Dark aura behind
    ci(32, 32, 28, '#40082020') +
    ci(32, 32, 22, '#60102030') +
    // Energy rays
    p('M32 6 L34 18 L30 18Z', '#c0304060') +
    p('M32 60 L34 50 L30 50Z', '#c0304060') +
    p('M4 32 L14 34 L14 30Z', '#c0304060') +
    p('M60 32 L50 34 L50 30Z', '#c0304060') +
    p('M12 14 L18 24 L16 26Z', '#c0304040') +
    p('M52 14 L46 24 L48 26Z', '#c0304040') +
    p('M12 52 L18 44 L16 42Z', '#c0304040') +
    p('M52 52 L46 44 L48 42Z', '#c0304040') +
    // Horns — large, sweeping (behind skull)
    p('M20 28 Q12 20 6 10 Q14 16 22 24Z', '#881020') +
    p('M44 28 Q52 20 58 10 Q50 16 42 24Z', '#881020') +
    p('M20 26 Q14 20 8 12', '#aa2030') +
    p('M44 26 Q50 20 56 12', '#aa2030') +
    // Demon skull
    p('M20 28 Q20 18 32 16 Q44 18 44 28 Q44 38 40 42 L24 42 Q20 38 20 28Z', '#d8d0c0') +
    // Jaw
    p('M24 42 L24 48 Q28 54 32 54 Q36 54 40 48 L40 42Z', '#c8c0b0') +
    // Eye sockets
    p('M24 28 Q27 25 30 29 Q28 34 24 32Z', '#0a0008') +
    p('M40 28 Q37 25 34 29 Q36 34 40 32Z', '#0a0008') +
    // Burning eye glow
    ci(27, 29, 2, '#ff2020') +
    ci(37, 29, 2, '#ff2020') +
    ci(27, 29, 1, '#ff8060') +
    ci(37, 29, 1, '#ff8060') +
    // Nose
    p('M30 38 L32 36 L34 38Z', '#b8b0a4') +
    // Fangs
    p('M27 44 L29 50', '#f0e8dc') +
    p('M37 44 L35 50', '#f0e8dc') +
    // Teeth
    rc(30, 44, 2, 3, '#f0e8dc') +
    rc(33, 44, 2, 3, '#f0e8dc') +
    // Crown on skull
    p('M22 20 L24 12 L28 16 L32 10 L36 16 L40 12 L42 20Z', '#ffd700') +
    p('M22 20 L42 20 L42 22 L22 22Z', '#d4a800') +
    // Crown jewel
    ci(32, 12, 1.5, '#ff1020') +
    ci(32, 12, 0.7, '#ff6080')
  ),

  event: Cy(6,
    // Glow background
    ci(32, 32, 22, '#2a1a4e') +
    ci(32, 32, 16, '#3a2a6e') +
    // Question mark body
    p('M24 16 Q24 8 32 8 Q40 8 40 16 Q40 24 34 28 L34 34 L30 34 L30 28 Q24 24 24 16Z', '#cc88ff') +
    // Inner highlight
    p('M26 16 Q26 10 32 10 Q38 10 38 16 Q38 22 34 26 L34 32 L30 32 L30 26 Q26 22 26 16Z', '#dd99ff') +
    // Bright spot
    p('M28 14 Q28 12 32 12 Q36 12 36 14 Q36 18 34 20 L30 20 Q28 18 28 14Z', '#eeccff') +
    // Dot
    ci(32, 42, 4, '#cc88ff') +
    ci(32, 42, 2, '#eeccff') +
    // Sparkles around
    ci(14, 18, 2, '#aa66ee') +
    ci(50, 18, 2, '#aa66ee') +
    ci(12, 44, 1.5, '#aa66ee') +
    ci(52, 44, 1.5, '#aa66ee') +
    // Star burst
    p('M46 10 L48 14 L50 10 L48 6Z', '#ddaaff')
  ),
};

// ─── POTION ICONS ────────────────────────────────────────────

export const POTION_SVG: Record<string, string> = {
  health_potion: C(
    // Bottle body
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#ee3333') +
    // Bottle lighter
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#ff4444') +
    // Bottle neck
    rc(28, 18, 8, 10, '#ffaaaa') +
    // Cork
    rc(27, 14, 10, 6, '#8b6914') +
    // Glass shine
    p('M24 28 L25 28 L25 48 L24 48Z', '#ff8888') +
    // Heart symbol
    p('M28 36 Q28 32 32 30 Q36 32 36 36 Q36 40 32 44 Q28 40 28 36Z', '#ffffff') +
    // Heart inner
    p('M30 36 Q30 34 32 33 Q34 34 34 36 Q34 38 32 40 Q30 38 30 36Z', '#ffcccc') +
    // Label band
    rc(22, 38, 20, 2, '#cc2222') +
    // Liquid bubble
    ci(35, 46, 1.5, '#ff6666')
  ),

  strength_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#dd5500') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#ee6622') +
    rc(28, 18, 8, 10, '#ffaa88') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#ff8855') +
    // Fist symbol
    p('M28 34 L28 42 Q28 44 30 44 L34 44 Q36 44 36 42 L36 36 Q36 34 34 34Z', '#ffffff') +
    p('M28 34 Q28 32 30 32 L34 32 Q36 32 36 34Z', '#ffddcc') +
    // Muscle line
    p('M30 36 L30 32', '#ddaa88') +
    p('M33 36 L33 32', '#ddaa88') +
    rc(22, 38, 20, 2, '#cc4400') +
    ci(35, 48, 1.5, '#ff8844')
  ),

  block_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#2266cc') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#3388dd') +
    rc(28, 18, 8, 10, '#88bbee') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#5599ee') +
    // Shield symbol
    p('M27 32 L37 32 L36 42 L32 46 L28 42Z', '#ffffff') +
    p('M29 34 L35 34 L34 40 L32 43 L30 40Z', '#aaccff') +
    rc(22, 38, 20, 2, '#1155aa') +
    ci(35, 48, 1.5, '#5599ee')
  ),

  energy_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#ccaa00') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#ddbb22') +
    rc(28, 18, 8, 10, '#ffee88') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#eedd44') +
    // Lightning bolt
    p('M34 30 L30 38 L33 38 L29 48 L38 38 L35 38 L38 30Z', '#ffffff') +
    rc(22, 38, 20, 2, '#aa8800') +
    ci(35, 48, 1.5, '#eedd44')
  ),

  poison_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#228822') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#33aa33') +
    rc(28, 18, 8, 10, '#88dd88') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#44bb44') +
    // Skull symbol
    ci(32, 36, 4, '#ffffff') +
    ci(30, 35, 1, '#228822') +
    ci(34, 35, 1, '#228822') +
    rc(30, 38, 4, 2, '#ffffff') +
    // Bubbles
    ci(28, 48, 2, '#66dd66') +
    ci(36, 46, 1.5, '#66dd66') +
    ci(32, 50, 1, '#88ff88') +
    rc(22, 38, 20, 2, '#116611')
  ),

  fire_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#cc3300') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#ee4411') +
    rc(28, 18, 8, 10, '#ffaa88') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#ff6633') +
    // Flame
    p('M32 30 Q36 34 36 38 Q36 44 32 46 Q28 44 28 38 Q28 34 32 30Z', '#ff8800') +
    p('M32 32 Q34 36 34 38 Q34 42 32 44 Q30 42 30 38 Q30 36 32 32Z', '#ffcc00') +
    ci(32, 38, 2, '#ffee88') +
    rc(22, 38, 20, 2, '#aa2200')
  ),

  weak_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#6622aa') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#8833cc') +
    rc(28, 18, 8, 10, '#bb88ee') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#9944dd') +
    // Down arrow
    p('M28 32 L36 32 L36 38 L40 38 L32 48 L24 38 L28 38Z', '#ffffff') +
    rc(22, 38, 20, 2, '#551899')
  ),

  vulnerable_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#882222') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#aa3333') +
    rc(28, 18, 8, 10, '#dd8888') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#cc4444') +
    // Cracked shield
    p('M27 32 L37 32 L36 42 L32 46 L28 42Z', '#ffffff') +
    p('M31 34 L33 38 L30 40', '#882222') +
    p('M33 34 L35 38', '#882222') +
    rc(22, 38, 20, 2, '#661111')
  ),

  burn_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#ee6600') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#ff7722') +
    rc(28, 18, 8, 10, '#ffcc88') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#ff9944') +
    // Fire swirl
    p('M28 38 Q26 32 30 30 Q34 28 36 32 Q38 36 36 40 Q34 44 30 44 Q26 44 28 38Z', '#ffcc00') +
    p('M30 38 Q30 34 32 32 Q34 34 34 38 Q34 42 32 42 Q30 42 30 38Z', '#ffee88') +
    ci(32, 37, 2, '#ffffff') +
    rc(22, 38, 20, 2, '#cc5500')
  ),

  freeze_potion: C(
    p('M22 26 L22 50 Q22 56 32 56 Q42 56 42 50 L42 26Z', '#2288cc') +
    p('M26 28 L26 48 Q26 52 32 52 Q38 52 38 48 L38 28Z', '#44aadd') +
    rc(28, 18, 8, 10, '#aaddff') +
    rc(27, 14, 10, 6, '#8b6914') +
    p('M24 28 L25 28 L25 48 L24 48Z', '#66bbee') +
    // Snowflake
    rc(31, 30, 2, 16, '#ffffff') +
    p('M24 34 L40 42', '#ffffff') +
    p('M24 42 L40 34', '#ffffff') +
    ci(32, 38, 2, '#ccffff') +
    // Ice crystals
    ci(27, 46, 1.5, '#aaeeff') +
    ci(37, 48, 1, '#aaeeff') +
    rc(22, 38, 20, 2, '#1166aa')
  ),
};

// ─── NEOW ICONS ──────────────────────────────────────────────

export const NEOW_SVG: Record<string, string> = {
  neow: C(
    // Body glow
    ci(32, 32, 22, '#1a1a3e') +
    ci(32, 32, 16, '#2a2a5e') +
    // Star body
    p('M32 6 L36 24 L54 24 L40 36 L44 54 L32 44 L20 54 L24 36 L10 24 L28 24Z', '#ffcc44') +
    // Star inner
    p('M32 12 L35 26 L48 26 L38 34 L42 48 L32 40 L22 48 L26 34 L16 26 L29 26Z', '#ffee88') +
    // Center glow
    ci(32, 30, 6, '#ffffff') +
    ci(32, 30, 3, '#ffffcc') +
    // Sparkles
    ci(18, 14, 2, '#ffdd66') +
    ci(48, 14, 2, '#ffdd66') +
    ci(14, 46, 1.5, '#ffdd66') +
    ci(50, 46, 1.5, '#ffdd66')
  ),

  heal: C(
    // Outer glow
    ci(32, 32, 22, '#3a1a1a') +
    // Heart body
    p('M32 16 Q24 6 14 16 Q4 26 16 40 Q24 50 32 58 Q40 50 48 40 Q60 26 50 16 Q40 6 32 16Z', '#ee3344') +
    // Heart inner
    p('M32 20 Q26 12 18 20 Q10 28 20 38 Q26 46 32 52 Q38 46 44 38 Q54 28 46 20 Q38 12 32 20Z', '#ff4455') +
    // Highlight
    p('M22 18 Q26 12 32 18 Q28 14 24 16Z', '#ff8899') +
    // Bright spot
    ci(24, 22, 3, '#ff8899') +
    ci(23, 20, 1.5, '#ffccdd') +
    // Pulse lines
    p('M8 32 L14 32 L16 28 L18 36 L20 30 L22 32', '#ff6677') +
    // Glow
    ci(32, 34, 6, '#ff556644')
  ),

  gold: C(
    // Bottom coins
    ci(22, 50, 7, '#b8942a') +
    ci(42, 50, 7, '#b8942a') +
    ci(32, 48, 7, '#c8a432') +
    // Middle coins
    ci(22, 42, 7, '#d4af37') +
    ci(42, 42, 7, '#d4af37') +
    ci(32, 40, 7, '#e8cc66') +
    // Top coins
    ci(27, 32, 7, '#d4af37') +
    ci(37, 32, 7, '#d4af37') +
    ci(32, 28, 7, '#f0d866') +
    // Coin details
    ci(32, 28, 4, '#d4af37') +
    ci(32, 28, 2, '#f0d866') +
    // Shine
    ci(30, 26, 1.5, '#fff8cc')
  ),

  relic: C(
    // Outer glow
    ci(32, 32, 22, '#1a1a3a') +
    // Diamond shape
    p('M32 6 L52 32 L32 58 L12 32Z', '#44aadd') +
    // Diamond facet left
    p('M32 6 L12 32 L32 36Z', '#55ccee') +
    // Diamond facet right
    p('M32 6 L52 32 L32 36Z', '#3388bb') +
    // Diamond facet bottom
    p('M12 32 L32 58 L52 32 L32 36Z', '#2277aa') +
    // Inner glow
    ci(32, 28, 6, '#88eeff') +
    ci(32, 26, 3, '#ccffff') +
    ci(31, 24, 1.5, '#ffffff') +
    // Sparkles
    ci(20, 18, 2, '#88ccee') +
    ci(46, 20, 1.5, '#88ccee') +
    ci(18, 44, 1.5, '#88ccee')
  ),

  power: C(
    // Outer glow
    ci(32, 32, 22, '#2a2a1a') +
    // Star 8-point
    p('M32 6 L36 22 L52 18 L40 30 L56 32 L40 34 L52 46 L36 42 L32 58 L28 42 L12 46 L24 34 L8 32 L24 30 L12 18 L28 22Z', '#ffcc22') +
    // Inner star
    p('M32 14 L35 26 L46 24 L38 31 L48 32 L38 33 L46 40 L35 38 L32 50 L29 38 L18 40 L26 33 L16 32 L26 31 L18 24 L29 26Z', '#ffee66') +
    // Center glow
    ci(32, 32, 6, '#ffffff') +
    ci(32, 32, 3, '#ffffcc') +
    // Rays
    ci(32, 8, 1.5, '#ffee88') +
    ci(32, 56, 1.5, '#ffee88')
  ),

  potion: C(
    // Flask body
    p('M24 28 L24 48 Q24 54 32 54 Q40 54 40 48 L40 28Z', '#88ddaa') +
    // Flask liquid
    p('M25 34 L25 48 Q25 53 32 53 Q39 53 39 48 L39 34Z', '#44bb66') +
    // Flask neck
    rc(28, 20, 8, 10, '#aaeebb') +
    // Cork
    rc(27, 16, 10, 6, '#8b6914') +
    // Glass shine
    p('M26 30 L27 30 L27 48 L26 48Z', '#aaffcc') +
    // Bubbles
    ci(30, 44, 2, '#66dd88') +
    ci(36, 46, 1.5, '#88ffaa') +
    ci(33, 42, 1, '#88ffaa') +
    // Test tube symbol
    p('M30 36 L34 36 L34 48 Q32 50 30 48Z', '#ffffff44')
  ),

  energy: C(
    // Glow
    ci(32, 32, 22, '#2a2a0a') +
    ci(32, 32, 16, '#3a3a1a') +
    // Lightning bolt
    p('M36 4 L22 30 L30 30 L18 60 L42 32 L34 32 L44 6Z', '#ffcc00') +
    // Inner bolt
    p('M35 8 L24 30 L30 30 L22 54 L40 34 L34 34 L42 10Z', '#ffee44') +
    // Bright core
    p('M34 12 L28 30 L32 30 L26 48 L38 34 L34 34 L40 14Z', '#ffff88') +
    // Sparks
    ci(16, 22, 2, '#ffdd44') +
    ci(48, 40, 2, '#ffdd44') +
    ci(44, 16, 1.5, '#ffee66')
  ),

  curse: C(
    // Dark glow
    ci(32, 32, 22, '#1a0a1a') +
    ci(32, 32, 16, '#2a102a') +
    // Skull
    p('M22 18 Q22 8 32 6 Q42 8 42 18 Q42 26 38 30 L26 30 Q22 26 22 18Z', '#ccbbaa') +
    // Skull jaw
    p('M26 30 L26 36 Q30 40 32 40 Q34 40 38 36 L38 30Z', '#c0b0a0') +
    // Eyes
    p('M26 18 Q28 16 30 18 Q28 22 26 20Z', '#1a001a') +
    p('M38 18 Q36 16 34 18 Q36 22 38 20Z', '#1a001a') +
    // Eye glow
    ci(28, 19, 1.5, '#cc22ff') +
    ci(36, 19, 1.5, '#cc22ff') +
    // Teeth
    rc(28, 34, 2, 4, '#e0d8cc') +
    rc(32, 34, 2, 4, '#e0d8cc') +
    rc(36, 34, 2, 4, '#e0d8cc') +
    // Dark energy wisps
    p('M18 12 Q14 6 16 2', '#8822aa') +
    p('M46 12 Q50 6 48 2', '#8822aa') +
    p('M16 40 Q10 44 12 50', '#6622aa') +
    p('M48 40 Q54 44 52 50', '#6622aa')
  ),
};

// ─── CARD TYPE ICONS ─────────────────────────────────────────

export const CARD_TYPE_SVG: Record<string, string> = {
  attack: C(
    // Blade
    p('M32 4 L38 6 L36 42 L32 48 L28 42 L26 6Z', '#c0d0e0') +
    // Blade highlight
    p('M32 6 L36 8 L35 40 L32 44 L29 40 L28 8Z', '#dde8f0') +
    // Blade edge
    p('M32 4 L33 6 L32 44 L31 6Z', '#eef4ff') +
    // Guard
    p('M20 42 L44 42 L42 46 L22 46Z', '#d4af37') +
    // Guard gem
    ci(32, 44, 2.5, '#ff4444') +
    // Handle
    rc(29, 46, 6, 10, '#8b4513') +
    // Handle wrap
    rc(29, 48, 6, 2, '#a05a1e') +
    rc(29, 52, 6, 2, '#a05a1e') +
    // Pommel
    ci(32, 58, 3, '#d4af37') +
    // Slash effect
    p('M14 12 Q20 8 26 12 Q22 10 18 12Z', '#ffffff44') +
    p('M42 8 Q48 12 52 10 Q48 10 44 8Z', '#ffffff44')
  ),

  skill: C(
    // Shield body
    p('M12 10 L52 10 L50 40 L32 56 L14 40Z', '#4477bb') +
    // Shield inner
    p('M16 14 L48 14 L46 38 L32 50 L18 38Z', '#5588cc') +
    // Shield highlight
    p('M18 16 L32 16 L32 48 L20 36Z', '#6699dd') +
    // Center emblem
    ci(32, 28, 8, '#d4af37') +
    ci(32, 28, 6, '#f0d866') +
    // Cross on emblem
    rc(30, 22, 4, 12, '#d4af37') +
    rc(26, 26, 12, 4, '#d4af37') +
    // Rim
    p('M12 10 L52 10 L52 14 L12 14Z', '#667788') +
    // Rivets
    ci(16, 12, 1.5, '#aabbcc') +
    ci(48, 12, 1.5, '#aabbcc') +
    ci(14, 38, 1.5, '#aabbcc')
  ),

  power: C(
    // Outer glow
    ci(32, 32, 24, '#1a1a2e') +
    ci(32, 32, 18, '#2a2a4e') +
    // Gem body
    p('M32 8 L46 24 L46 40 L32 56 L18 40 L18 24Z', '#8844cc') +
    // Gem facet left
    p('M32 8 L18 24 L18 40 L32 34Z', '#9955dd') +
    // Gem facet right
    p('M32 8 L46 24 L46 40 L32 34Z', '#7733bb') +
    // Inner glow
    ci(32, 28, 6, '#bb88ff') +
    ci(32, 26, 3, '#ddbbff') +
    ci(31, 24, 1.5, '#ffffff') +
    // Energy rays
    p('M32 2 L34 8 L30 8Z', '#aa66ee') +
    p('M52 20 L46 22 L48 18Z', '#aa66ee') +
    p('M52 44 L46 42 L48 46Z', '#aa66ee') +
    p('M12 20 L18 22 L16 18Z', '#aa66ee') +
    p('M12 44 L18 42 L16 46Z', '#aa66ee')
  ),
};

// ─── CHAPTER ICONS ───────────────────────────────────────────

export const CHAPTER_SVG: Record<number, string> = {
  1: C(
    // Temple columns
    rc(12, 20, 6, 32, '#888888') +
    rc(46, 20, 6, 32, '#888888') +
    // Temple roof
    p('M8 20 L32 6 L56 20Z', '#999999') +
    p('M10 20 L32 8 L54 20Z', '#aaaaaa') +
    // Temple base
    rc(8, 52, 48, 4, '#777777') +
    // Inner dark
    rc(20, 22, 24, 30, '#333333') +
    // Altar inside
    rc(26, 40, 12, 8, '#666666') +
    // Ash/gray tint
    ci(32, 34, 3, '#aaaaaa') +
    // Column details
    rc(12, 20, 6, 3, '#999999') +
    rc(46, 20, 6, 3, '#999999')
  ),
  2: C(
    // Gear large
    p('M32 8 L36 14 L44 12 L42 20 L50 22 L46 28 L52 34 L46 36 L50 42 L42 44 L44 52 L36 50 L32 56 L28 50 L20 52 L22 44 L14 42 L18 36 L12 34 L18 28 L14 22 L22 20 L20 12 L28 14Z', '#888888') +
    // Gear inner
    ci(32, 32, 12, '#666666') +
    ci(32, 32, 8, '#555555') +
    // Gear teeth highlights
    ci(32, 32, 4, '#777777') +
    // Broken section
    p('M44 12 Q48 8 50 4 L52 6 L46 14Z', '#aa6644') +
    // Rust
    ci(24, 24, 3, '#aa6644') +
    ci(40, 40, 2, '#996644') +
    // Sparks
    ci(48, 16, 1.5, '#ffcc44') +
    ci(52, 10, 1, '#ffee66')
  ),
  3: C(
    // Void background
    ci(32, 32, 26, '#0a0a2a') +
    ci(32, 32, 20, '#101040') +
    // Rift crack
    p('M32 4 Q28 16 24 24 Q20 32 24 40 Q28 48 32 60', '#4422aa') +
    p('M32 4 Q36 16 40 24 Q44 32 40 40 Q36 48 32 60', '#4422aa') +
    // Rift inner
    p('M32 8 Q30 20 28 28 Q26 36 28 44 Q30 50 32 56', '#6644cc') +
    p('M32 8 Q34 20 36 28 Q38 36 36 44 Q34 50 32 56', '#6644cc') +
    // Stars
    ci(14, 12, 1.5, '#ffffff') +
    ci(50, 16, 1, '#ffffff') +
    ci(10, 44, 1, '#ffffff') +
    ci(52, 48, 1.5, '#ffffff') +
    ci(22, 54, 1, '#aaaaff') +
    // Core glow
    ci(32, 32, 4, '#8866ff') +
    ci(32, 32, 2, '#ccaaff')
  ),
  4: C(
    // Void
    ci(32, 32, 26, '#050510') +
    // Portal ring
    ci(32, 32, 20, '#3322aa') +
    ci(32, 32, 16, '#050510') +
    // Swirl
    p('M12 32 Q16 20 32 16 Q48 20 52 32', '#5544cc') +
    p('M52 32 Q48 44 32 48 Q16 44 12 32', '#5544cc') +
    // Inner swirl
    p('M20 32 Q22 24 32 22 Q42 24 44 32', '#7766dd') +
    p('M44 32 Q42 40 32 42 Q22 40 20 32', '#7766dd') +
    // Center eye
    ci(32, 32, 6, '#8844ff') +
    ci(32, 32, 3, '#cc88ff') +
    ci(32, 31, 1.5, '#ffffff') +
    // Star points
    p('M32 6 L34 12 L30 12Z', '#aa88ff') +
    p('M32 58 L34 52 L30 52Z', '#aa88ff')
  ),
};

export const TITLE_SVG: Record<string, string> = {

  // 🌱 초보 모험가 — sprouting seedling
  beginner: C(
    rc(4, 50, 56, 8, '#6B4226') +
    rc(8, 48, 48, 4, '#8B5A2B') +
    p('M30 48 L30 30 Q30 24 32 20 Q34 24 34 30 L34 48', '#228B22') +
    p('M32 28 Q38 18 44 20 Q40 26 34 28', '#32CD32') +
    p('M32 32 Q24 22 18 24 Q22 30 30 32', '#32CD32') +
    p('M32 20 Q34 14 38 16', '#44DD44') +
    ci(40, 18, 2, '#44DD44') +
    ci(22, 22, 2, '#44DD44') +
    ci(32, 16, 3, '#228B22') +
    ci(32, 16, 1.5, '#44DD44') +
    rc(26, 50, 12, 2, '#5A3A1A')
  ),

  // ⚔️ 숙련된 전사 — battle-worn sword
  veteran: C(
    p('M30 4 L34 4 L36 40 L28 40 Z', '#AAAAAA') +
    p('M30 4 L32 2 L34 4', '#CCCCCC') +
    p('M31 6 L31 38', '#CCCCCC') +
    p('M33 8 L33 36', '#DDDDDD') +
    rc(20, 38, 24, 5, '#8B6914') +
    rc(18, 40, 28, 3, '#6B4914') +
    rc(26, 43, 12, 14, '#5A3A1A') +
    rc(28, 43, 8, 14, '#6B4A2A') +
    p('M26 57 Q32 62 38 57', '#FFD700') +
    ci(32, 40, 2.5, '#CC0000') +
    ci(32, 40, 1.5, '#FF2222') +
    p('M22 10 L18 8 L20 14', '#CC4444') +
    p('M36 16 L40 14 L38 20', '#CC4444')
  ),

  // 🔥 던전 정복자 — flaming crown
  conqueror: C(
    p('M12 32 L18 16 L26 28 L32 12 L38 28 L46 16 L52 32 Z', '#FFD700') +
    rc(12, 32, 40, 12, '#FFD700') +
    rc(14, 34, 36, 8, '#FFE44D') +
    p('M18 16 Q20 6 24 12', '#FF4400') +
    p('M32 12 Q34 2 38 8', '#FF6600') +
    p('M46 16 Q48 6 52 12', '#FF4400') +
    ci(22, 38, 3, '#FF4400') +
    ci(32, 38, 3, '#FF6600') +
    ci(42, 38, 3, '#FF4400') +
    ci(22, 38, 1.5, '#FFCC00') +
    ci(32, 38, 1.5, '#FFCC00') +
    ci(42, 38, 1.5, '#FFCC00') +
    rc(12, 44, 40, 4, '#DAA520') +
    p('M14 8 Q16 2 20 6', '#FF9900')
  ),

  // 👑 전설의 영웅 — legendary golden crown with aura
  legend: C(
    ci(32, 32, 28, '#FFF8B0') +
    ci(32, 32, 24, '#FFE860') +
    p('M10 34 L16 14 L24 28 L32 8 L40 28 L48 14 L54 34 Z', '#FFD700') +
    rc(10, 34, 44, 14, '#FFD700') +
    rc(12, 36, 40, 10, '#FFE44D') +
    ci(20, 40, 3, '#FF0044') +
    ci(32, 40, 3, '#0066FF') +
    ci(44, 40, 3, '#00CC44') +
    ci(16, 18, 3, '#FFFFFF') +
    ci(32, 10, 3, '#FFFFFF') +
    ci(48, 18, 3, '#FFFFFF') +
    ci(20, 40, 1.5, '#FF4488') +
    ci(32, 40, 1.5, '#4488FF') +
    ci(44, 40, 1.5, '#44FF88') +
    rc(10, 48, 44, 4, '#DAA520')
  ),
};

// ── Inline UI Icons (16×16, currentColor, for text-inline use) ──

const I = (d: string) =>
  `<svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align:-0.125em" xmlns="http://www.w3.org/2000/svg">${d}</svg>`;
const Ic = (d: string, color: string) =>
  `<svg viewBox="0 0 16 16" width="1em" height="1em" style="vertical-align:-0.125em" xmlns="http://www.w3.org/2000/svg"><path d="${d}" fill="${color}"/></svg>`;

export const UI_ICON: Record<string, string> = {
  heart: Ic('M8 14s-5.5-3.5-6-7C1.5 4 3 2 5 2c1.2 0 2.3.7 3 1.8C8.7 2.7 9.8 2 11 2c2 0 3.5 2 3 5-.5 3.5-6 7-6 7z', '#e05050'),
  heart_broken: Ic('M8 14s-5.5-3.5-6-7C1.5 4 3 2 5 2c1.2 0 2.3.7 3 1.8C8.7 2.7 9.8 2 11 2c2 0 3.5 2 3 5-.5 3.5-6 7-6 7z', '#a04060'),
  gold: Ic('M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 2a4 4 0 1 1 0 8A4 4 0 0 1 8 4zm-1 2v4h2V6z', '#f0c040'),
  shield: Ic('M8 1L2 4v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4z', '#5090d0'),
  sword: Ic('M13 1l-1.5 1.5L8 6 6.5 4.5 5 6l1.5 1.5L3 11l-1 3 3-1 3.5-3.5L10 11l1.5-1.5L10 8l3.5-3.5L15 3z', '#d05060'),
  skull: Ic('M8 1C5 1 3 3 3 6c0 2 1 3.5 2.5 4.5L5 12h2v1h2v-1h2l-.5-1.5C12 9.5 13 8 13 6c0-3-2-5-5-5zM6 6a1 1 0 1 1 0 2A1 1 0 0 1 6 6zm4 0a1 1 0 1 1 0 2A1 1 0 0 1 10 6zM7 9h2v1H7z', '#c0c0c0'),
  fire: Ic('M8 1C6 4 4 5 4 8a4 4 0 0 0 8 0c0-1.5-.5-3-1-4-.5 1-1.5 2-3 2C9 4 8 1 8 1z', '#f08030'),
  key: Ic('M10 0a4 4 0 0 0-3.8 5.2L1 10.5V14h2v-2h2v-2l3.2-.8A4 4 0 1 0 10 0zm1 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z', '#e0b860'),
  lock: I('<path d="M5 7V5a3 3 0 0 1 6 0v2h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm1 0h4V5a2 2 0 0 0-4 0zm2 2a1.5 1.5 0 0 0-.5 2.9V13h1v-1.1A1.5 1.5 0 0 0 8 9z"/>'),
  unlock: Ic('M5 7h6V5a2 2 0 0 0-3.4-1.4L6.2 2.2A3 3 0 0 1 11 5v2h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z', '#80c060'),
  trophy: Ic('M4 2h8v2h2c0 2-1 3.5-3 4l.5 3H11l-.5-2.5c-.8.3-1.6.5-2.5.5s-1.7-.2-2.5-.5L5 11H4.5L5 8C3 7 2 5.5 2 4h2zm0 2H3c0 1 .5 2 1.5 2.5L4 4zm8 0v2.5C13 5.5 13 5 13 4z', '#f0c040'),
  medal: Ic('M8 0L6 4H2l3.5 3-1 4L8 9l3.5 2-1-4L14 4h-4z', '#f0c040'),
  star: Ic('M8 1l2.2 4.5L15 6l-3.5 3.4.8 4.6L8 11.5 3.7 14l.8-4.6L1 6l4.8-.5z', '#f0c040'),
  sparkle: Ic('M8 0l1 5 5 1-5 1-1 5-1-5-5-1 5-1z', '#f0d060'),
  lightning: Ic('M9 0L4 9h4l-1 7 6-9H9z', '#f0c040'),
  crown: Ic('M2 11l2-7 2 4 2-5 2 5 2-4 2 7H2zm0 1h12v2H2z', '#f0c040'),
  card: I('<path d="M4 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm1 2h6v2H5zm0 8h1v1H5zm5 0h1v1h-1z"/>'),
  gem: Ic('M4 5l4-4 4 4-4 10z', '#60b0e0'),
  potion_small: Ic('M6 1h4v2l1.5 3v6a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V6L6 3z', '#80d080'),
  cart: I('<path d="M1 1h2l1 2h10l-2 6H5L4 7 3 3H1zm4 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>'),
  trash: I('<path d="M5 2V1h6v1h3v2H2V2zm1 4h1v6H6zm3 0h1v6H9zM3 4h10l-1 10H4z"/>'),
  gear: I('<path d="M6.5 1l-.5 2-.8.3L3.5 2 2 3.5l1.3 1.7-.3.8-2 .5v2l2 .5.3.8L2 12.5 3.5 14l1.7-1.3.8.3.5 2h2l.5-2 .8-.3 1.7 1.3L14 12.5l-1.3-1.7.3-.8 2-.5v-2l-2-.5-.3-.8L14 3.5 12.5 2l-1.7 1.3-.8-.3L9.5 1zM8 5.5A2.5 2.5 0 1 1 8 10.5 2.5 2.5 0 0 1 8 5.5z"/>'),
  mountain: Ic('M1 14L5 4l2 4 1-2 1 2 2-4 4 10z', '#8090a0'),
  mask: I('<path d="M8 1C4.5 1 2 3.5 2 6c0 2 1 4 2.5 5L6 15l2-2 2 2 1.5-4C13 10 14 8 14 6c0-2.5-2.5-5-6-5zM5 6a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 5 6zm6 0a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 11 6z"/>'),
  box: I('<path d="M1 4l7-3 7 3v8l-7 3-7-3zm1 1v6.5L7 14V7.5zm6 2.5V14l5-2.1V5zm-.5-3L3 6.3 8 8.5l5-2.2z"/>'),
  warning: Ic('M8 1L1 14h14zM7 6h2v4H7zm0 5h2v2H7z', '#f0a030'),
  tip: Ic('M8 1a4 4 0 0 0-2 7.5V11h4V8.5A4 4 0 0 0 8 1zm-1 11h4v1H7zm.5 2h3v1h-3z', '#f0c040'),
  question: I('<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2a3 3 0 0 1 2.4 4.8L9 9H7l-.3-1.5 1.8-1.3A1 1 0 0 0 8 5a1 1 0 0 0-1 1H5a3 3 0 0 1 3-3zm-1 8h2v2H7z"/>'),
  poison: Ic('M8 1C6 1 5 2.5 5 4c0 1 .5 1.8 1 2.3-.8.4-2 1.5-2 3.2C4 12 6 14 8 14s4-2 4-4.5c0-1.7-1.2-2.8-2-3.2.5-.5 1-1.3 1-2.3 0-1.5-1-3-3-3zM6.5 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM7 10h2l-.3 2h-1.4z', '#80c060'),
  daily: `<svg viewBox="0 0 16 16" width="1em" height="1em" style="vertical-align:-0.125em" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v2m4.2.8l-1.4 1.4M15 9h-2M3 9H1m3.2-3.8L5.6 7.6" fill="none" stroke="#f0a030" stroke-width="1.5" stroke-linecap="round"/><path d="M8 6a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" fill="#f0a030"/><rect x="1" y="11" width="14" height="2" rx="1" fill="#f0a030"/></svg>`,
  progress: Ic('M8 1l2.2 4.5L15 6l-3.5 3.4.8 4.6L8 11.5 3.7 14l.8-4.6L1 6l4.8-.5z', '#c0a0e0'),
};

export function ic(name: string): string {
  return UI_ICON[name] ?? '';
}
