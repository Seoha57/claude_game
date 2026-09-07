// ── Character Art (detailed, used in select screen + UI) ──

const C = (parts: string) =>
  `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${parts}</svg>`;
const p = (d: string, f: string) => `<path d="${d}" fill="${f}"/>`;
const ci = (cx: number, cy: number, r: number, f: string) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/>`;
const rc = (x: number, y: number, w: number, h: number, f: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;

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
};


// ── Enemy Art (compact icons for combat screen) ──

export const ENEMY_SVG: Record<string, string> = {
  // ── Ch1 Easy ──

  jaw_worm: C([
    // Body - main segmented worm
    p('M12 40 Q16 24 24 28 Q28 20 32 28 Q36 20 40 28 Q48 24 52 40 Q44 48 32 46 Q20 48 12 40Z', '#8a6050'),
    // Underbelly lighter
    p('M16 42 Q24 38 32 40 Q40 38 48 42 Q44 48 32 46 Q20 48 16 42Z', '#a88070'),
    // Segment grooves
    p('M24 26 Q24 34 22 42', '#704838'),
    p('M32 24 Q32 34 30 44', '#704838'),
    p('M40 26 Q40 34 38 44', '#704838'),
    // Single large eye
    ci(34, 28, 5, '#fff'),
    ci(34, 29, 3, '#402020'),
    ci(35, 28, 1.2, '#fff'),
    // Upper jaw
    p('M8 34 L2 30 L6 26 L14 30Z', '#9a7060'),
    // Lower jaw
    p('M8 42 L2 46 L6 50 L14 46Z', '#7a5040'),
    // Upper teeth
    p('M6 30 L8 28 L10 31Z', '#fff'),
    p('M10 29 L12 27 L14 31Z', '#fff'),
    // Lower teeth
    p('M6 46 L8 48 L10 45Z', '#fff'),
    p('M10 47 L12 49 L14 44Z', '#fff'),
  ].join('')),

  cultist: C([
    // Robe body
    p('M22 22 L20 48 L26 56 L38 56 L44 48 L42 22Z', '#8a4090'),
    // Hood outer
    p('M26 8 L20 16 L18 22 L46 22 L44 16 L38 8Z', '#6a3070'),
    // Hood inner shadow
    p('M28 12 L24 18 L22 22 L42 22 L40 18 L36 12Z', '#3a1840'),
    // Face void
    p('M26 16 L24 22 L40 22 L38 16Z', '#1a0a20'),
    // Glowing eyes
    ci(30, 18, 2, '#c060ff'),
    ci(36, 18, 2, '#c060ff'),
    // Eye glow aura
    ci(30, 18, 3.5, '#c060ff30'),
    ci(36, 18, 3.5, '#c060ff30'),
    // Ritual symbol on chest (inverted triangle + eye)
    p('M28 28 L36 28 L32 38Z', '#c060ff40'),
    ci(32, 31, 1.5, '#c060ff'),
    // Robe hem
    p('M20 48 L26 56 L38 56 L44 48 L44 50 L38 58 L26 58 L20 50Z', '#5a2060'),
    // Skeletal hands from sleeves
    p('M20 34 L16 32 L14 36 L18 38Z', '#a08890'),
    p('M44 34 L48 32 L50 36 L46 38Z', '#a08890'),
  ].join('')),

  fungi_beast: C([
    // Mushroom cap dome
    p('M14 28 Q10 10 32 6 Q54 10 50 28Z', '#c06040'),
    // Cap underside gills
    p('M18 28 L22 24 L26 28 L30 24 L34 28 L38 24 L42 28 L46 24 L50 28', '#a04830'),
    // Spots on cap
    ci(24, 14, 3, '#ffe0a0'),
    ci(36, 12, 2.5, '#ffe0a0'),
    ci(42, 18, 2, '#ffe0a0'),
    ci(20, 20, 2, '#ffe0a0'),
    // Stem body
    p('M24 28 L22 48 L26 52 L38 52 L42 48 L40 28Z', '#d8c0a0'),
    // Stem belly lighter
    p('M28 30 L36 30 L38 46 L26 46Z', '#e8d0b0'),
    // Small beady eyes
    ci(28, 34, 2, '#fff'),
    ci(36, 34, 2, '#fff'),
    ci(28, 34.5, 1.2, '#302020'),
    ci(36, 34.5, 1.2, '#302020'),
    // Root feet
    p('M22 48 L18 56 L24 54 L26 52Z', '#b0a080'),
    p('M42 48 L46 56 L40 54 L38 52Z', '#b0a080'),
    p('M30 52 L28 58 L36 58 L34 52Z', '#b0a080'),
  ].join('')),

  wandering_swordsman: C([
    // Body armor
    p('M24 20 L20 28 L18 46 L26 54 L38 54 L46 46 L44 28 L40 20Z', '#607090'),
    // Chest plate
    p('M28 22 L36 22 L38 34 L26 34Z', '#7080a0'),
    // Belt
    p('M20 38 L44 38 L44 42 L20 42Z', '#506070'),
    rc(30, 38, 4, 4, '#8090a0'),
    // Head
    ci(32, 14, 8, '#d0b898'),
    // Bandana
    p('M24 10 L40 10 L42 14 L22 14Z', '#a03828'),
    p('M40 10 L48 8 L46 12 L42 11Z', '#a03828'),
    // Weary half-lidded eyes
    p('M27 14 L31 13 L31 16 L27 15.5Z', '#384050'),
    p('M33 13 L37 14 L37 15.5 L33 16Z', '#384050'),
    // Sword blade
    p('M48 10 L50 8 L52 10 L51 36 L49 36Z', '#a0b0c0'),
    p('M49.5 10 L50 8 L51 10 L50.5 36 L49.5 36Z', '#c0d0e0'),
    // Sword guard + handle
    p('M46 36 L54 36 L54 38 L46 38Z', '#c0a050'),
    rc(49, 38, 2, 5, '#604020'),
    // Legs
    p('M26 54 L24 62 L30 62 L32 54Z', '#506070'),
    p('M32 54 L34 62 L40 62 L38 54Z', '#506070'),
  ].join('')),

  goblin_berserker: C([
    // Body
    p('M26 24 L22 32 L20 48 L28 54 L36 54 L44 48 L42 32 L38 24Z', '#60a040'),
    // Belly
    p('M28 30 L36 30 L38 44 L26 44Z', '#80c060'),
    // Head
    ci(32, 18, 8, '#60a040'),
    // Big pointy ears
    p('M24 14 L14 6 L20 18Z', '#80c060'),
    p('M40 14 L50 6 L44 18Z', '#80c060'),
    // Inner ears
    p('M22 14 L16 8 L20 17Z', '#408030'),
    p('M42 14 L48 8 L44 17Z', '#408030'),
    // Wild eyes
    ci(28, 17, 2.5, '#ffe040'),
    ci(36, 17, 2.5, '#ffe040'),
    ci(29, 17, 1.5, '#402020'),
    ci(37, 17, 1.5, '#402020'),
    // Sharp toothy grin
    p('M27 22 L29 20 L31 23 L33 20 L35 23 L37 20 L39 22', '#fff'),
    // Crude axe head + handle
    p('M8 10 L4 8 L2 14 L6 18 L12 14Z', '#808080'),
    p('M10 14 L14 28 L16 28 L12 14Z', '#604020'),
  ].join('')),

  poison_spider: C([
    // Abdomen (back body)
    p('M26 30 Q22 22 32 20 Q42 22 38 30 L40 40 Q36 46 32 44 Q28 46 24 40Z', '#30602a'),
    // Cephalothorax (front)
    p('M28 22 Q30 16 32 18 Q34 16 36 22 L38 28 L26 28Z', '#406838'),
    // Legs - left 4
    p('M24 26 L16 18 L10 14', '#40803a'),
    p('M24 30 L14 26 L6 24', '#40803a'),
    p('M24 34 L14 34 L6 36', '#40803a'),
    p('M24 38 L16 42 L10 48', '#40803a'),
    // Legs - right 4
    p('M40 26 L48 18 L54 14', '#40803a'),
    p('M40 30 L50 26 L58 24', '#40803a'),
    p('M40 34 L50 34 L58 36', '#40803a'),
    p('M40 38 L48 42 L54 48', '#40803a'),
    // Red eyes (cluster)
    ci(30, 19, 1.5, '#ff2020'),
    ci(34, 19, 1.5, '#ff2020'),
    ci(32, 17, 1, '#ff4040'),
    // Fangs
    p('M30 22 L29 26 L31 24Z', '#c0c0c0'),
    p('M34 22 L35 26 L33 24Z', '#c0c0c0'),
  ].join('')),

  frenzy_gremlin: C([
    // Body
    p('M28 22 L22 30 L20 46 L28 52 L36 52 L44 46 L42 30 L36 22Z', '#905020'),
    // Belly
    p('M28 28 L36 28 L38 42 L26 42Z', '#b06830'),
    // Head
    ci(32, 16, 7, '#905020'),
    // Huge bat-like ears
    p('M24 12 L14 4 L18 16Z', '#b06030'),
    p('M40 12 L50 4 L46 16Z', '#b06030'),
    // Inner ears
    p('M23 13 L16 6 L19 15Z', '#703818'),
    p('M41 13 L48 6 L45 15Z', '#703818'),
    // Crazy red glowing eyes
    ci(28, 15, 2.5, '#ff4040'),
    ci(36, 15, 2.5, '#ff4040'),
    ci(28, 15, 1.2, '#ffff80'),
    ci(36, 15, 1.2, '#ffff80'),
    // Sharp teeth grin
    p('M27 20 L29 18 L31 21 L33 18 L35 21 L37 18 L39 20', '#fff'),
    p('M28 20 Q32 24 36 20', '#c03030'),
    // Clawed hands
    p('M20 32 L16 30 L14 34 L18 36Z', '#905020'),
    p('M44 32 L48 30 L50 34 L46 36Z', '#905020'),
  ].join('')),

  // ── Ch1 Elite ──

  gremlin_nob: C([
    // Large muscular body
    p('M22 16 L16 26 L14 48 L22 58 L42 58 L50 48 L48 26 L42 16Z', '#704020'),
    // Chest muscles
    p('M26 22 L32 20 L38 22 L40 34 L32 36 L24 34Z', '#8a5030'),
    // Abs definition
    p('M28 36 L36 36 L36 46 L28 46Z', '#906040'),
    // Head
    ci(32, 12, 8, '#704020'),
    // Tusks
    p('M26 16 L24 22 L28 20Z', '#e8e0c0'),
    p('M38 16 L40 22 L36 20Z', '#e8e0c0'),
    // Angry brow + eyes
    p('M25 9 L30 11 L30 13 L26 12Z', '#602810'),
    p('M39 9 L34 11 L34 13 L38 12Z', '#602810'),
    ci(28, 12, 1.5, '#ff4040'),
    ci(36, 12, 1.5, '#ff4040'),
    // Scars
    p('M36 8 L40 14', '#904030'),
    // Massive arms
    p('M16 28 L8 24 L4 30 L8 36 L14 34Z', '#906040'),
    p('M48 28 L56 24 L60 30 L56 36 L50 34Z', '#906040'),
    // Bone club weapon
    p('M2 18 L6 14 L10 16 L10 30 L6 32 L2 28Z', '#e8dcc0'),
    p('M4 16 L8 14 L8 18 L4 20Z', '#d0c8a0'),
    // Club spikes
    p('M2 20 L0 18 L2 16Z', '#c0b890'),
    p('M8 14 L10 12 L10 16Z', '#c0b890'),
    // Legs thick
    p('M24 58 L22 63 L30 63 L30 58Z', '#704020'),
    p('M34 58 L34 63 L42 63 L40 58Z', '#704020'),
  ].join('')),

  sentinel: C([
    // Main stone body
    p('M22 12 L18 22 L16 48 L24 58 L40 58 L48 48 L46 22 L42 12Z', '#506880'),
    // Stone chest plate
    p('M26 16 L38 16 L40 36 L24 36Z', '#6888a0'),
    // Chest rune line
    p('M30 20 L34 20 L34 32 L30 32Z', '#80c0ff40'),
    // Helmet/head block
    p('M26 6 L38 6 L40 14 L24 14Z', '#607890'),
    // Single glowing eye slit
    p('M28 9 L36 9 L36 12 L28 12Z', '#1a1a2e'),
    ci(32, 10.5, 2, '#80c0ff'),
    ci(32, 10.5, 3.5, '#80c0ff30'),
    // Heavy shield arm (left)
    p('M16 22 L8 18 L4 24 L4 44 L12 48 L18 40Z', '#6888a0'),
    // Shield face
    p('M4 24 L4 44 L12 48 L12 22Z', '#90b0c8'),
    // Shield emblem
    ci(8, 34, 3, '#80c0ff40'),
    // Right arm - stone fist
    p('M46 24 L52 20 L56 26 L54 34 L48 32Z', '#607890'),
    // Shoulder plates
    p('M18 18 L24 14 L26 20 L20 22Z', '#708898'),
    p('M46 18 L40 14 L38 20 L44 22Z', '#708898'),
    // Stone legs
    p('M24 58 L22 63 L30 63 L30 58Z', '#506880'),
    p('M34 58 L34 63 L42 63 L40 58Z', '#506880'),
    // Stone crack detail
    p('M36 30 L42 42', '#405868'),
  ].join('')),

  // ── Ch1 Boss ──

  hexaghost: C([
    // Outer hexagonal body
    p('M32 4 L14 14 L8 32 L14 50 L32 58 L50 50 L56 32 L50 14Z', '#4a3060'),
    // Inner hex body
    p('M32 10 L18 18 L14 32 L18 46 L32 52 L46 46 L50 32 L46 18Z', '#6a4890'),
    // Skull-like face - eye sockets
    p('M24 24 L28 20 L32 24 L28 28Z', '#1a0a20'),
    p('M36 20 L40 24 L36 28 L32 24Z', '#1a0a20'),
    // Glowing eye lights
    ci(28, 24, 2, '#80ffff'),
    ci(36, 24, 2, '#80ffff'),
    ci(28, 24, 3.5, '#80ffff30'),
    ci(36, 24, 3.5, '#80ffff30'),
    // Nose hole
    p('M30 28 L32 26 L34 28 L32 30Z', '#1a0a20'),
    // Jaw/teeth
    p('M26 32 L28 30 L30 33 L32 30 L34 33 L36 30 L38 32 L36 36 L28 36Z', '#c0b8d0'),
    // Flame wisp 1 (top-left)
    p('M12 8 Q8 4 10 2 Q14 4 12 8Z', '#ff604080'),
    ci(11, 5, 2, '#ff806060'),
    // Flame wisp 2 (top-right)
    p('M52 8 Q56 4 54 2 Q50 4 52 8Z', '#ff604080'),
    ci(53, 5, 2, '#ff806060'),
    // Flame wisp 3 (left)
    p('M4 30 Q0 26 2 24 Q6 26 4 30Z', '#80ffff60'),
    ci(3, 27, 2, '#80ffff40'),
    // Flame wisp 4 (right)
    p('M60 30 Q64 26 62 24 Q58 26 60 30Z', '#80ffff60'),
    ci(61, 27, 2, '#80ffff40'),
    // Flame wisp 5 (bottom-left)
    p('M10 52 Q6 56 8 58 Q12 56 10 52Z', '#c060ff60'),
    ci(9, 55, 2, '#c060ff40'),
    // Flame wisp 6 (bottom-right)
    p('M54 52 Q58 56 56 58 Q52 56 54 52Z', '#c060ff60'),
    ci(55, 55, 2, '#c060ff40'),
  ].join('')),

  // ── Ch2 ──

  blue_slaver: C([
    // Body armor
    p('M24 16 L20 26 L18 46 L26 56 L38 56 L46 46 L44 26 L40 16Z', '#3060a0'),
    // Chest plate detail
    p('M28 20 L36 20 L38 34 L26 34Z', '#4080c0'),
    // Belt + buckle
    p('M20 38 L44 38 L44 42 L20 42Z', '#203860'),
    rc(30, 38, 4, 4, '#6090d0'),
    // Helmet
    p('M24 6 L22 10 L22 18 L42 18 L42 10 L40 6Z', '#3060a0'),
    // Visor slit
    p('M26 12 L38 12 L38 15 L26 15Z', '#0a1830'),
    ci(30, 13.5, 1, '#80c0ff'),
    ci(34, 13.5, 1, '#80c0ff'),
    // Helmet crest
    p('M30 4 L32 2 L34 4 L34 8 L30 8Z', '#4080c0'),
    // Whip arm
    p('M46 28 L52 24 L54 28 L50 32Z', '#3060a0'),
    // Whip
    p('M54 26 Q58 20 60 16 Q62 12 58 10', '#806040'),
    p('M58 10 L60 8 L62 10', '#a08060'),
    // Legs
    p('M26 56 L24 62 L30 62 L30 56Z', '#3060a0'),
    p('M34 56 L34 62 L40 62 L38 56Z', '#3060a0'),
  ].join('')),

  red_slaver: C([
    // Body armor
    p('M24 16 L20 26 L18 46 L26 56 L38 56 L46 46 L44 26 L40 16Z', '#a03030'),
    // Chest plate detail
    p('M28 20 L36 20 L38 34 L26 34Z', '#c04040'),
    // Belt + buckle
    p('M20 38 L44 38 L44 42 L20 42Z', '#601818'),
    rc(30, 38, 4, 4, '#d06050'),
    // Helmet
    p('M24 6 L22 10 L22 18 L42 18 L42 10 L40 6Z', '#a03030'),
    // Visor slit
    p('M26 12 L38 12 L38 15 L26 15Z', '#300808'),
    ci(30, 13.5, 1, '#ff6040'),
    ci(34, 13.5, 1, '#ff6040'),
    // Helmet crest
    p('M30 4 L32 2 L34 4 L34 8 L30 8Z', '#c04040'),
    // Whip arm
    p('M46 28 L52 24 L54 28 L50 32Z', '#a03030'),
    // Whip
    p('M54 26 Q58 20 60 16 Q62 12 58 10', '#806040'),
    p('M58 10 L60 8 L62 10', '#a08060'),
    // Legs
    p('M26 56 L24 62 L30 62 L30 56Z', '#a03030'),
    p('M34 56 L34 62 L40 62 L38 56Z', '#a03030'),
  ].join('')),

  shield_gremlin: C([
    // Oversized shield (covers most of body)
    p('M10 16 L8 20 L6 44 L10 52 L30 54 L32 48 L32 18Z', '#8090a0'),
    // Shield face highlight
    p('M12 20 L10 40 L26 48 L28 22Z', '#a0b0c0'),
    // Shield boss/center emblem
    ci(18, 34, 4, '#c0d0e0'),
    ci(18, 34, 2, '#8090a0'),
    // Shield rim
    p('M10 16 L32 18 L32 20 L10 18Z', '#607080'),
    // Gremlin body peeking behind shield
    p('M32 22 L36 20 L42 24 L44 44 L38 50 L32 48Z', '#607040'),
    // Head peeking over shield
    ci(38, 16, 6, '#607040'),
    // Pointy ears
    p('M36 12 L34 6 L38 10Z', '#708050'),
    p('M42 10 L48 4 L44 12Z', '#708050'),
    // Nervous yellow eyes
    ci(36, 15, 2, '#ffff40'),
    ci(40, 14, 2, '#ffff40'),
    ci(36, 15.5, 1.2, '#302020'),
    ci(40, 14.5, 1.2, '#302020'),
    // Little legs
    p('M34 50 L32 58 L38 58 L38 50Z', '#607040'),
    p('M38 50 L40 58 L46 58 L44 50Z', '#607040'),
  ].join('')),

  taskmaster: C([
    // Large imposing body
    p('M22 16 L16 26 L14 48 L22 56 L42 56 L50 48 L48 26 L42 16Z', '#604040'),
    // Chest armor plate
    p('M26 20 L38 20 L40 36 L24 36Z', '#705050'),
    // Belt with studs
    p('M16 40 L48 40 L48 44 L16 44Z', '#402828'),
    ci(24, 42, 1, '#808080'),
    ci(32, 42, 1, '#808080'),
    ci(40, 42, 1, '#808080'),
    // Imposing helmet
    p('M22 6 L20 10 L20 18 L44 18 L44 10 L42 6Z', '#504040'),
    p('M24 4 L40 4 L42 6 L22 6Z', '#705050'),
    // Visor - dark menacing
    p('M24 12 L40 12 L40 16 L24 16Z', '#1a0808'),
    ci(30, 14, 1.5, '#c06060'),
    ci(36, 14, 1.5, '#c06060'),
    // Whip arm extended
    p('M48 28 L54 24 L56 28 L52 32Z', '#604040'),
    // Long whip trailing
    p('M56 26 Q60 18 58 12 Q56 6 60 2', '#806060'),
    p('M60 2 L62 0 L63 3', '#a08080'),
    // Legs
    p('M24 56 L22 63 L30 63 L30 56Z', '#504040'),
    p('M34 56 L34 63 L42 63 L40 56Z', '#504040'),
  ].join('')),

  book_of_stabbing: C([
    // Book cover (back)
    p('M14 8 L12 56 L52 56 L50 8Z', '#8b4513'),
    // Book pages
    p('M16 10 L16 54 L50 54 L50 10Z', '#f5deb3'),
    // Book spine
    p('M12 8 L14 8 L14 56 L12 56Z', '#6a3410'),
    // Page lines
    p('M20 22 L44 22', '#8b451340'),
    p('M20 28 L44 28', '#8b451340'),
    p('M20 34 L44 34', '#8b451340'),
    p('M20 40 L38 40', '#8b451340'),
    // Glowing rune symbols on pages
    p('M24 16 L28 14 L32 16 L28 18Z', '#c0404060'),
    p('M36 16 L40 14 L44 16 L40 18Z', '#c0404060'),
    // Dagger 1 - sticking out top
    p('M26 10 L28 0 L30 10Z', '#a0a0a0'),
    p('M27 10 L28 2 L29 10Z', '#c0c0c0'),
    // Dagger 2 - sticking out right
    p('M50 24 L60 22 L50 26Z', '#a0a0a0'),
    p('M50 24.5 L58 23 L50 25.5Z', '#c0c0c0'),
    // Dagger 3 - sticking out top-right
    p('M42 10 L48 2 L44 10Z', '#a0a0a0'),
    // Evil eye on cover center
    ci(32, 46, 4, '#c04040'),
    ci(32, 46, 2, '#200808'),
    ci(33, 45, 1, '#ff6060'),
  ].join('')),

  the_collector: C([
    // Dark robe body
    p('M24 14 L18 24 L14 48 L22 58 L42 58 L50 48 L46 24 L40 14Z', '#2a2040'),
    // Robe front
    p('M30 16 L34 16 L34 56 L30 56Z', '#3a3050'),
    // Hood
    p('M26 6 L20 14 L18 20 L46 20 L44 14 L38 6Z', '#2a2040'),
    // Hood inner
    p('M28 10 L24 16 L40 16 L36 10Z', '#0a0818'),
    // Glowing cyan eyes
    ci(30, 14, 2, '#80ffff'),
    ci(36, 14, 2, '#80ffff'),
    // Eye glow
    ci(30, 14, 3, '#80ffff30'),
    ci(36, 14, 3, '#80ffff30'),
    // Floating orb - left
    ci(8, 24, 4, '#80ffff30'),
    ci(8, 24, 2.5, '#80ffff60'),
    ci(8, 23, 1, '#c0ffff'),
    // Floating orb - right
    ci(56, 20, 3.5, '#c080ff30'),
    ci(56, 20, 2, '#c080ff60'),
    ci(56, 19, 1, '#e0c0ff'),
    // Floating orb - top
    ci(44, 6, 3, '#80ffc030'),
    ci(44, 6, 1.5, '#80ffc060'),
  ].join('')),

  looter: C([
    // Body - ragged clothes
    p('M26 18 L22 26 L20 46 L28 54 L36 54 L44 46 L42 26 L38 18Z', '#706050'),
    // Vest/tunic front
    p('M28 20 L36 20 L36 42 L28 42Z', '#807060'),
    // Belt
    p('M22 40 L42 40 L42 44 L22 44Z', '#504030'),
    // Hood
    p('M24 8 L18 14 L22 20 L32 16 L42 20 L46 14 L40 8Z', '#504030'),
    p('M26 10 L22 16 L32 14 L42 16 L38 10Z', '#604838'),
    // Shadowed face
    ci(32, 16, 5, '#c0a888'),
    // Shifty eyes
    ci(30, 15, 1.5, '#fff'),
    ci(34, 15, 1.5, '#fff'),
    ci(30.5, 15.5, 0.8, '#302020'),
    ci(34.5, 15.5, 0.8, '#302020'),
    // Sack over shoulder
    p('M40 18 L48 10 L56 14 L52 24 L44 22Z', '#a09070'),
    p('M50 12 L54 10 L56 14 L52 16Z', '#908060'),
    // Knife in hand
    p('M18 32 L14 28 L12 32 L14 42Z', '#a0a8b0'),
    p('M14 42 L12 46 L16 46Z', '#604020'),
  ].join('')),

  dark_slime: C([
    // Main amorphous body
    p('M14 36 Q12 20 24 18 Q28 16 32 20 Q36 16 40 18 Q52 20 50 36 Q48 48 32 46 Q16 48 14 36Z', '#302830'),
    // Body highlight
    p('M20 28 Q24 22 32 24 Q40 22 44 28 Q42 38 32 36 Q22 38 20 28Z', '#403840'),
    // Dripping tendrils
    p('M18 44 L16 52 L20 50 L20 46Z', '#282028'),
    p('M36 44 L38 54 L40 50 L38 46Z', '#282028'),
    p('M44 42 L46 50 L48 46 L46 42Z', '#282028'),
    // Glowing eyes
    ci(26, 28, 3, '#60506080'),
    ci(38, 26, 3, '#60506080'),
    ci(26, 28, 1.5, '#a090a0'),
    ci(38, 26, 1.5, '#a090a0'),
    // Gaping mouth
    p('M28 34 Q32 38 36 34 Q34 40 30 40Z', '#1a1018'),
    // Bubble/blister detail
    ci(22, 22, 2, '#40383c'),
    ci(42, 24, 1.5, '#40383c'),
    ci(30, 40, 1.5, '#40383c'),
  ].join('')),

  centurion: C([
    // Body armor (lorica)
    p('M22 18 L18 26 L16 46 L24 56 L40 56 L48 46 L46 26 L42 18Z', '#8a7050'),
    // Armor segments
    p('M20 26 L44 26 L44 30 L20 30Z', '#9a8060'),
    p('M20 32 L44 32 L44 36 L20 36Z', '#9a8060'),
    // Plumed helmet
    p('M24 8 L22 14 L22 20 L42 20 L42 14 L40 8Z', '#8a7050'),
    // Helmet plume (red crest)
    p('M28 2 L32 0 L36 2 L36 10 L28 10Z', '#c04040'),
    p('M30 0 L32 -2 L34 0 L34 8 L30 8Z', '#e05050'),
    // Visor
    p('M26 14 L38 14 L38 18 L26 18Z', '#604830'),
    ci(30, 16, 1, '#402020'),
    ci(34, 16, 1, '#402020'),
    // Shield (left arm)
    p('M14 22 L6 20 L4 38 L10 42 L18 34Z', '#8a7050'),
    p('M6 22 L4 38 L10 40 L12 24Z', '#a08860'),
    ci(8, 30, 3, '#c04040'),
    // Sword (right arm)
    p('M48 14 L50 10 L52 14 L51 32 L49 32Z', '#a0a8b0'),
    p('M46 32 L54 32 L54 34 L46 34Z', '#c0a050'),
    // Legs
    p('M24 56 L22 62 L30 62 L30 56Z', '#8a7050'),
    p('M34 56 L34 62 L42 62 L40 56Z', '#8a7050'),
  ].join('')),

  vampiric_bat: C([
    // Body center
    p('M28 24 Q30 18 32 20 Q34 18 36 24 L38 36 Q36 42 32 40 Q28 42 26 36Z', '#402040'),
    // Left wing spread
    p('M26 24 L18 16 L8 12 L4 18 L6 24 L12 22 L16 26 L22 28Z', '#603060'),
    // Left wing membrane detail
    p('M10 14 L6 20 L12 22 L16 18Z', '#502850'),
    // Right wing spread
    p('M38 24 L46 16 L56 12 L60 18 L58 24 L52 22 L48 26 L42 28Z', '#603060'),
    // Right wing membrane detail
    p('M54 14 L58 20 L52 22 L48 18Z', '#502850'),
    // Fur chest
    p('M28 26 L36 26 L36 34 L28 34Z', '#503050'),
    // Head
    ci(32, 20, 5, '#402040'),
    // Ears
    p('M28 16 L26 10 L30 14Z', '#603060'),
    p('M36 16 L38 10 L34 14Z', '#603060'),
    // Red glowing eyes
    ci(30, 19, 1.5, '#ff4040'),
    ci(34, 19, 1.5, '#ff4040'),
    ci(30, 19, 2.5, '#ff404040'),
    ci(34, 19, 2.5, '#ff404040'),
    // Fangs
    p('M30 23 L31 27 L32 23Z', '#fff'),
    p('M32 23 L33 27 L34 23Z', '#fff'),
  ].join('')),

  // ── Ch2 Elite ──

  writhing_mass: C([
    // Main amorphous body mass
    p('M18 22 Q14 14 24 12 Q32 8 40 12 Q50 14 46 22 L50 38 Q46 48 32 46 Q18 48 14 38Z', '#504860'),
    // Body surface texture
    p('M22 18 Q28 14 34 16 Q42 14 44 20 L46 34 Q42 42 32 40 Q22 42 18 34Z', '#605870'),
    // Tentacle left-upper
    p('M14 20 Q8 14 4 10 Q2 8 4 6', '#706878'),
    // Tentacle left-lower
    p('M14 38 Q8 42 4 48 Q2 52 6 54', '#706878'),
    // Tentacle right-upper
    p('M50 18 Q56 12 60 8 Q62 4 60 2', '#706878'),
    // Tentacle right-lower
    p('M50 36 Q56 40 58 46 Q60 52 58 56', '#706878'),
    // Tentacle bottom
    p('M26 46 Q22 52 24 58 Q26 62 28 60', '#706878'),
    p('M38 46 Q42 52 40 58 Q38 62 36 60', '#706878'),
    // Multiple green eyes scattered
    ci(24, 22, 2.5, '#80ff80'),
    ci(24, 22, 1.2, '#204020'),
    ci(36, 20, 3, '#80ff80'),
    ci(36, 20, 1.5, '#204020'),
    ci(30, 30, 2, '#80ff80'),
    ci(30, 30, 1, '#204020'),
    ci(42, 28, 2, '#80ff80'),
    ci(42, 28, 1, '#204020'),
    ci(20, 34, 1.5, '#80ff80'),
    ci(20, 34, 0.8, '#204020'),
    // Mouth/maw
    p('M28 36 Q32 40 36 36 Q34 42 30 42Z', '#302830'),
  ].join('')),

  // ── Ch2 Boss ──

  void_heart: C([
    // Void energy tendrils (behind heart)
    p('M16 16 Q8 10 4 14 Q0 18 4 22', '#80408060'),
    p('M48 16 Q56 10 60 14 Q64 18 60 22', '#80408060'),
    p('M20 48 Q12 52 8 56 Q4 60 8 62', '#80408060'),
    p('M44 48 Q52 52 56 56 Q60 60 56 62', '#80408060'),
    p('M26 8 Q22 2 18 4', '#80408040'),
    p('M38 8 Q42 2 46 4', '#80408040'),
    // Outer heart shell - dark crystalline
    p('M32 10 L18 22 L14 38 L22 52 L32 56 L42 52 L50 38 L46 22Z', '#201020'),
    // Inner heart shape
    p('M32 14 L22 24 L18 36 L24 48 L32 52 L40 48 L46 36 L42 24Z', '#402040'),
    // Crystal facet lines
    p('M32 14 L22 24 L24 26 L32 16Z', '#502858'),
    p('M32 14 L42 24 L40 26 L32 16Z', '#502858'),
    p('M18 36 L24 48 L26 46 L20 36Z', '#381838'),
    p('M46 36 L40 48 L38 46 L44 36Z', '#381838'),
    // Magenta pulsing core
    ci(32, 34, 8, '#c040c060'),
    ci(32, 34, 5, '#c040c0'),
    ci(32, 34, 3, '#ff60ff'),
    ci(32, 33, 1.5, '#ffa0ff'),
    // Core pulse rings
    ci(32, 34, 10, '#c040c020'),
    ci(32, 34, 14, '#c040c010'),
    // Void energy veins from core
    p('M27 30 Q22 26 18 28', '#c040c040'),
    p('M37 30 Q42 26 46 28', '#c040c040'),
    p('M30 40 Q26 46 22 48', '#c040c040'),
    p('M34 40 Q38 46 42 48', '#c040c040'),
  ].join('')),

  abyss_lord: C([
    // Cape/wings spread behind
    p('M18 18 L8 14 L4 24 L6 50 L18 54 L22 44Z', '#3a1840'),
    p('M46 18 L56 14 L60 24 L58 50 L46 54 L42 44Z', '#3a1840'),
    // Cape inner
    p('M18 20 L10 18 L8 44 L18 50Z', '#2a1030'),
    p('M46 20 L54 18 L56 44 L46 50Z', '#2a1030'),
    // Main body armor
    p('M24 14 L18 24 L16 46 L24 56 L40 56 L48 46 L46 24 L40 14Z', '#2a1030'),
    // Chest plate
    p('M28 18 L36 18 L38 34 L26 34Z', '#3a2040'),
    // Chest emblem - inverted pentagram
    p('M32 20 L29 28 L35 24 L29 24 L35 28Z', '#ff406060'),
    // Belt
    p('M18 38 L46 38 L46 42 L18 42Z', '#1a0820'),
    // Head
    ci(32, 10, 7, '#2a1030'),
    // Dark crown
    p('M22 6 L24 0 L28 4 L30 -1 L32 3 L34 -1 L36 4 L40 0 L42 6 L40 8 L24 8Z', '#4a2050'),
    // Horns - large curved
    p('M22 8 L16 2 L14 6 L20 10Z', '#604060'),
    p('M42 8 L48 2 L50 6 L44 10Z', '#604060'),
    // Glowing red eyes
    ci(29, 10, 2, '#ff4060'),
    ci(35, 10, 2, '#ff4060'),
    ci(29, 10, 3, '#ff406040'),
    ci(35, 10, 3, '#ff406040'),
    // Demonic mouth
    p('M28 14 L30 13 L32 15 L34 13 L36 14', '#ff2040'),
    // Gauntlet fists
    p('M16 28 L10 26 L8 30 L12 34Z', '#4a2050'),
    p('M48 28 L54 26 L56 30 L52 34Z', '#4a2050'),
    // Legs
    p('M24 56 L22 62 L30 62 L30 56Z', '#1a0820'),
    p('M34 56 L34 62 L42 62 L40 56Z', '#1a0820'),
  ].join('')),

  // Ch3 Regular
  mad_butcher: C([
    // Body with bloody apron
    p('M26 12 L20 22 L18 46 L26 56 L38 56 L44 46 L42 22 L36 12Z', '#804040'),
    // Apron front
    p('M26 26 L24 50 L40 50 L38 26Z', '#c8a890'),
    // Blood stains on apron
    p('M28 32 Q30 30 32 34 Q34 30 36 32 L35 40 L29 40Z', '#a02020'),
    p('M26 42 L28 38 L30 44 L28 46Z', '#a02020'),
    // Stitched mask/head
    ci(32, 14, 8, '#e0c0a0'),
    p('M26 10 L24 14 L26 18 L38 18 L40 14 L38 10Z', '#604030'),
    // Stitch lines on mask
    p('M28 12 L28 16 M32 11 L32 17 M36 12 L36 16', '#302020'),
    // Eyes through mask holes
    ci(29, 14, 1.5, '#ff4040'),
    ci(35, 14, 1.5, '#ff4040'),
    // Large cleaver blade
    p('M46 6 L56 4 L58 8 L56 24 L48 26 L46 22Z', '#b0b8c0'),
    p('M48 8 L54 6 L56 10 L54 22 L50 24 L48 20Z', '#d0d8e0'),
    // Cleaver handle
    p('M44 22 L48 20 L50 26 L46 28Z', '#5a3018'),
    // Belt with hooks
    p('M22 38 L42 38 L42 42 L22 42Z', '#403020'),
    rc(30, 38, 4, 4, '#808080'),
    // Legs
    p('M26 50 L24 60 L30 60 L32 50Z', '#603030'),
    p('M32 50 L34 60 L40 60 L38 50Z', '#603030'),
  ].join('')),

  obsidian_golem: C([
    // Massive body
    p('M22 14 L14 24 L12 46 L22 58 L42 58 L52 46 L50 24 L42 14Z', '#303030'),
    // Chest cracks with orange glow
    p('M28 22 L30 18 L32 24 L34 18 L36 22 L34 30 L30 30Z', '#ff804040'),
    p('M26 34 L30 30 L34 30 L38 34 L36 40 L28 40Z', '#ff602040'),
    // Single glowing eye
    ci(32, 18, 3, '#ff6020'),
    ci(32, 18, 1.5, '#ffcc40'),
    // Left bulky arm
    p('M14 24 L6 22 L4 34 L8 40 L14 38Z', '#383838'),
    // Left fist
    p('M4 34 L2 40 L8 44 L10 38Z', '#404040'),
    // Right bulky arm
    p('M50 24 L58 22 L60 34 L56 40 L50 38Z', '#383838'),
    // Right fist
    p('M58 34 L62 40 L56 44 L54 38Z', '#404040'),
    // Rocky shoulder plates
    p('M20 14 L16 18 L18 24 L24 20Z', '#484848'),
    p('M44 14 L48 18 L46 24 L40 20Z', '#484848'),
    // Glowing cracks on legs
    p('M24 46 L26 42 L28 48 L26 54Z', '#ff804030'),
    p('M38 46 L40 42 L42 48 L40 54Z', '#ff804030'),
    // Legs
    p('M22 52 L20 62 L28 62 L30 52Z', '#2a2a2a'),
    p('M34 52 L36 62 L44 62 L42 52Z', '#2a2a2a'),
  ].join('')),

  karnak_runemaster: C([
    // Robe body
    p('M28 16 L22 24 L18 50 L28 58 L36 58 L46 50 L42 24 L36 16Z', '#4a3070'),
    // Robe front panel
    p('M30 20 L34 20 L34 56 L30 56Z', '#5a4080'),
    // Rune trim on robe
    p('M22 36 L42 36 L42 38 L22 38Z', '#c090ff40'),
    p('M20 46 L44 46 L44 48 L20 48Z', '#c090ff40'),
    // Hood
    p('M24 12 L28 4 L36 4 L40 12 L40 18 L38 14 L26 14 L24 18Z', '#3a2060'),
    // Shadowed face
    ci(32, 16, 6, '#1a1030'),
    // Glowing eyes in shadow
    ci(29, 16, 1.2, '#c090ff'),
    ci(35, 16, 1.2, '#c090ff'),
    // Glowing staff
    rc(8, 10, 2.5, 46, '#6b4830'),
    // Staff orb
    ci(9.25, 10, 4, '#c090ff60'),
    ci(9.25, 10, 2.5, '#c090ff'),
    ci(9.25, 9, 1, '#f0d0ff'),
    // Floating runes around
    p('M50 12 L52 10 L54 12 L52 14Z', '#c090ff80'),
    p('M54 22 L56 20 L58 22 L56 24Z', '#c090ff60'),
    p('M48 6 L50 4 L52 6 L50 8Z', '#c090ff40'),
  ].join('')),

  sirocco_phantom: C([
    // Flowing ghostly body
    p('M28 8 L18 18 L12 36 L16 50 L24 56 L32 58 L40 56 L48 50 L52 36 L46 18 L36 8Z', '#40506080'),
    // Inner translucent form
    p('M30 12 L22 22 L18 36 L22 48 L32 52 L42 48 L46 36 L42 22 L34 12Z', '#50607060'),
    // Flowing wisps left
    p('M12 36 L6 30 L4 38 L8 44 L16 42Z', '#40506050'),
    p('M8 44 L2 48 L6 54 L14 50Z', '#40506030'),
    // Flowing wisps right
    p('M52 36 L58 30 L60 38 L56 44 L48 42Z', '#40506050'),
    p('M56 44 L62 48 L58 54 L50 50Z', '#40506030'),
    // Cyan glowing eyes
    ci(29, 20, 2, '#80c0ff'),
    ci(35, 20, 2, '#80c0ff'),
    ci(29, 20, 1, '#c0e0ff'),
    ci(35, 20, 1, '#c0e0ff'),
    // Ghostly mouth
    p('M29 26 Q32 30 35 26', '#80c0ff40'),
    // Wind swirl details
    p('M20 32 Q16 28 14 32 Q12 36 16 38', '#80c0ff20'),
    p('M44 32 Q48 28 50 32 Q52 36 48 38', '#80c0ff20'),
  ].join('')),

  death_apostle: C([
    // Dark robes body
    p('M28 10 L22 20 L18 48 L26 58 L38 58 L46 48 L42 20 L36 10Z', '#282028'),
    // Robe front
    p('M30 14 L34 14 L34 56 L30 56Z', '#322830'),
    // Hood
    p('M24 6 L28 0 L36 0 L40 6 L40 14 L38 10 L26 10 L24 14Z', '#201820'),
    // Skull mask face
    ci(32, 12, 6, '#d0c8b0'),
    // Skull eye sockets
    ci(29, 12, 2, '#201020'),
    ci(35, 12, 2, '#201020'),
    // Red eye glow
    ci(29, 12, 1, '#ff2020'),
    ci(35, 12, 1, '#ff2020'),
    // Skull teeth
    p('M28 16 L30 16 L30 18 L28 18Z', '#d0c8b0'),
    p('M31 16 L33 16 L33 18 L31 18Z', '#d0c8b0'),
    p('M34 16 L36 16 L36 18 L34 18Z', '#d0c8b0'),
    // Scythe handle
    p('M48 4 L50 4 L52 50 L50 50Z', '#4a3020'),
    // Scythe blade
    p('M42 4 L48 2 L50 4 L48 8 L42 10Z', '#808890'),
    p('M44 4 L48 3 L49 5 L46 8Z', '#a0a8b0'),
    // Dark aura
    p('M16 30 Q12 26 14 22 M48 30 Q52 26 50 22', '#40203060'),
  ].join('')),

  isaris_overlord: C([
    // Dark purple robes body
    p('M24 16 L18 26 L14 48 L24 58 L40 58 L50 48 L46 26 L40 16Z', '#2a1030'),
    // Robe front
    p('M30 20 L34 20 L35 56 L29 56Z', '#3a1840'),
    // Robe trim
    p('M14 48 L24 58 L40 58 L50 48 L50 50 L40 60 L24 60 L14 50Z', '#e0c040'),
    // Golden crown
    p('M24 10 L26 2 L30 6 L32 0 L34 6 L38 2 L40 10Z', '#ffd700'),
    p('M24 10 L40 10 L40 12 L24 12Z', '#e0b800'),
    // Crown jewels
    ci(32, 4, 1.2, '#ff2020'),
    ci(27, 5, 0.8, '#4040ff'),
    ci(37, 5, 0.8, '#4040ff'),
    // Head
    ci(32, 14, 6, '#e0c0a0'),
    // Glowing red eyes
    ci(29, 14, 1.5, '#ff2040'),
    ci(35, 14, 1.5, '#ff2040'),
    ci(29, 14, 0.7, '#ff8080'),
    ci(35, 14, 0.7, '#ff8080'),
    // Stern mouth
    p('M30 18 L34 18', '#1a0810'),
    // Shoulder pauldrons
    p('M16 24 L22 20 L24 26 L18 30Z', '#3a1840'),
    p('M48 24 L42 20 L40 26 L46 30Z', '#3a1840'),
  ].join('')),

  dark_knight: C([
    // Dark armor body
    p('M26 12 L20 22 L18 46 L26 56 L38 56 L44 46 L42 22 L36 12Z', '#282838'),
    // Chest plate detail
    p('M28 22 L36 22 L35 36 L29 36Z', '#323248'),
    // Armor line
    p('M31 22 L33 22 L33 36 L31 36Z', '#3a3a50'),
    // Helmet
    p('M22 8 L24 4 L40 4 L42 8 L42 16 L40 14 L24 14 L22 16Z', '#303048'),
    // Visor with blue glow
    p('M26 10 L38 10 L38 13 L26 13Z', '#202030'),
    p('M27 11 L37 11 L37 12 L27 12Z', '#4060ff'),
    ci(32, 11.5, 0.5, '#80a0ff'),
    // Shoulder armor
    p('M18 20 L14 18 L12 24 L16 28 L22 24Z', '#323248'),
    p('M46 20 L50 18 L52 24 L48 28 L42 24Z', '#323248'),
    // Dark sword blade
    p('M48 8 L50 4 L52 8 L51 30 L49 30Z', '#404860'),
    p('M49 8 L50 5 L51 8 L50.5 28 L49.5 28Z', '#505878'),
    // Sword guard
    p('M46 28 L54 28 L54 30 L46 30Z', '#383850'),
    // Belt
    p('M22 38 L42 38 L42 42 L22 42Z', '#222238'),
    // Legs
    p('M26 50 L24 60 L30 60 L32 50Z', '#282838'),
    p('M32 50 L34 60 L40 60 L38 50Z', '#282838'),
    // Boots
    p('M23 58 L22 62 L31 62 L30 58Z', '#222230'),
    p('M33 58 L34 62 L42 62 L41 58Z', '#222230'),
  ].join('')),

  corrupted_beast: C([
    // Corrupted body
    p('M20 18 Q14 10 28 8 Q36 6 44 10 Q54 14 48 22 L50 38 Q46 48 32 46 Q18 48 14 38Z', '#504030'),
    // Corrupted flesh patches
    p('M22 22 Q24 18 28 20 L30 28 L24 30Z', '#604838'),
    p('M40 20 Q44 16 46 22 L44 30 L38 28Z', '#604838'),
    // Horns
    p('M22 14 L16 4 L20 8 L24 12Z', '#6a5840'),
    p('M42 14 L48 4 L44 8 L40 12Z', '#6a5840'),
    // Red glowing eyes
    ci(28, 18, 2, '#ff2020'),
    ci(38, 18, 2, '#ff2020'),
    ci(28, 18, 1, '#ff8080'),
    ci(38, 18, 1, '#ff8080'),
    // Snarling mouth
    p('M28 24 L30 22 L32 24 L34 22 L36 24 L34 28 L30 28Z', '#402020'),
    // Teeth
    p('M29 24 L30 26 L31 24 M33 24 L34 26 L35 24', '#e0d0c0'),
    // Corruption veins
    p('M18 30 L16 34 L20 38 L22 34Z', '#80404040'),
    p('M44 30 L48 34 L46 38 L42 34Z', '#80404040'),
    // Clawed feet
    p('M16 42 L12 46 L14 48 L20 44Z', '#5a4830'),
    p('M48 42 L52 46 L50 48 L44 44Z', '#5a4830'),
  ].join('')),

  dragonling: C([
    // Body
    p('M28 16 L22 24 L20 42 L28 50 L36 50 L44 42 L42 24 L36 16Z', '#406030'),
    // Belly lighter
    p('M28 26 L36 26 L36 44 L28 44Z', '#608848'),
    // Left wing
    p('M20 22 L8 12 L4 18 L6 26 L14 28 L18 26Z', '#508040'),
    p('M8 12 L6 18 M10 14 L8 22 M14 16 L12 24', '#40702890'),
    // Right wing
    p('M44 22 L56 12 L60 18 L58 26 L50 28 L46 26Z', '#508040'),
    p('M56 12 L58 18 M54 14 L56 22 M50 16 L52 24', '#40702890'),
    // Head
    ci(32, 18, 7, '#4a7038'),
    // Eyes
    ci(29, 17, 1.5, '#ff8020'),
    ci(35, 17, 1.5, '#ff8020'),
    ci(29, 17, 0.7, '#ffd040'),
    ci(35, 17, 0.7, '#ffd040'),
    // Nostrils
    ci(30, 22, 0.8, '#304020'),
    ci(34, 22, 0.8, '#304020'),
    // Fire breath
    p('M28 22 L24 20 L20 24 L22 28 L26 26Z', '#ff602080'),
    p('M22 22 L18 20 L16 26 L20 28Z', '#ff804060'),
    // Tail
    p('M32 46 L28 52 L26 58 L30 56 L34 58 L32 52Z', '#406030'),
    // Tail spike
    p('M26 58 L24 62 L28 60 L30 62 L34 58Z', '#4a7038'),
  ].join('')),

  flame_wisp: C([
    // Outer flame
    p('M26 34 Q20 22 26 12 Q30 6 32 8 Q34 6 38 12 Q44 22 38 34 Q36 44 32 46 Q28 44 26 34Z', '#ff6020'),
    // Mid flame
    p('M28 30 Q24 20 28 14 Q30 10 32 12 Q34 10 36 14 Q40 20 36 30 Q34 38 32 40 Q30 38 28 30Z', '#ff8030'),
    // Inner flame
    p('M30 28 Q28 20 30 16 Q32 12 34 16 Q36 20 34 28 Q32 34 30 28Z', '#ffa040'),
    // Bright core
    p('M31 24 Q32 18 33 24 Q32 28 31 24Z', '#ffe080'),
    ci(32, 22, 2, '#fff8e0'),
    // Eyes
    ci(30, 22, 1.2, '#fff'),
    ci(34, 22, 1.2, '#fff'),
    ci(30, 22, 0.6, '#402000'),
    ci(34, 22, 0.6, '#402000'),
    // Flame wisps floating off
    p('M22 10 Q20 6 22 4 Q24 2 24 6', '#ff602060'),
    p('M42 10 Q44 6 42 4 Q40 2 40 6', '#ff602060'),
    p('M18 18 Q16 14 18 12', '#ff602040'),
    p('M46 18 Q48 14 46 12', '#ff602040'),
  ].join('')),

  charging_boar: C([
    // Muscular body
    p('M16 24 Q10 16 22 12 Q32 8 42 12 Q54 16 48 24 L50 36 Q46 46 32 44 Q18 46 14 36Z', '#6a4030'),
    // Belly
    p('M22 30 Q28 26 38 26 Q44 28 42 36 Q38 42 28 42 Q22 40 22 30Z', '#7a5040'),
    // Head / snout
    p('M16 22 L8 20 L6 26 L8 30 L16 28Z', '#7a5040'),
    // Nostril
    ci(8, 25, 1, '#402020'),
    // Large tusks
    p('M10 28 L6 32 L8 34 L12 30Z', '#f0e8d0'),
    p('M10 22 L6 18 L8 16 L12 20Z', '#f0e8d0'),
    // Angry eyes
    p('M18 20 L22 18 L22 22 L18 22Z', '#fff'),
    ci(21, 20, 1.2, '#ff2020'),
    p('M16 18 L24 17', '#402020'),
    // Ears
    p('M24 10 L22 4 L26 8Z', '#7a5040'),
    p('M36 10 L38 4 L34 8Z', '#7a5040'),
    // Hooves
    p('M18 42 L16 48 L22 48 L22 42Z', '#302020'),
    p('M42 42 L44 48 L48 48 L46 42Z', '#302020'),
    // Fur texture on back
    p('M28 12 L30 10 L32 12 L34 10 L36 12 L38 10 L40 12', '#5a3020'),
  ].join('')),

  curse_priest: C([
    // Dark robes
    p('M28 12 L22 22 L18 48 L28 58 L36 58 L46 48 L42 22 L36 12Z', '#402020'),
    // Robe front
    p('M30 16 L34 16 L34 56 L30 56Z', '#4a2828'),
    // Hood
    p('M24 8 L28 2 L36 2 L40 8 L40 16 L38 12 L26 12 L24 16Z', '#301818'),
    // Glowing eyes under hood
    ci(29, 12, 1.5, '#ff2020'),
    ci(35, 12, 1.5, '#ff2020'),
    // Red aura glow
    ci(32, 34, 14, '#ff202018'),
    ci(32, 34, 10, '#ff202010'),
    // Inverted cross staff
    rc(50, 6, 2.5, 48, '#4a2020'),
    // Cross (inverted)
    p('M47 40 L55 40 L55 42 L47 42Z', '#c04040'),
    p('M50 36 L52.5 36 L52.5 50 L50 50Z', '#c04040'),
    // Hands
    p('M22 30 L18 34 L20 38 L24 34Z', '#e0c0a0'),
    p('M42 30 L46 34 L44 38 L40 34Z', '#e0c0a0'),
    // Robe trim
    p('M18 48 L28 58 L36 58 L46 48 L46 50 L36 60 L28 60 L18 50Z', '#301818'),
  ].join('')),

  mech_scout: C([
    // Metal body
    p('M24 16 L20 24 L18 44 L24 52 L40 52 L46 44 L44 24 L40 16Z', '#506070'),
    // Chest panel
    p('M28 22 L36 22 L36 38 L28 38Z', '#607888'),
    // Chest light
    ci(32, 30, 2, '#40ff40'),
    ci(32, 30, 1, '#80ff80'),
    // Head / helmet
    p('M24 12 L26 8 L38 8 L40 12 L40 18 L24 18Z', '#607080'),
    // Green visor
    p('M26 12 L38 12 L38 16 L26 16Z', '#203020'),
    p('M27 13 L37 13 L37 15 L27 15Z', '#40ff40'),
    // Antenna
    p('M32 8 L32 2 L34 2 L34 8Z', '#708090'),
    ci(33, 2, 1.5, '#ff4040'),
    // Left arm mechanical
    p('M18 24 L12 22 L10 34 L14 38 L20 34Z', '#607080'),
    // Right arm mechanical
    p('M46 24 L52 22 L54 34 L50 38 L44 34Z', '#607080'),
    // Joint circles
    ci(14, 28, 2, '#708890'),
    ci(50, 28, 2, '#708890'),
    // Legs mechanical
    p('M26 48 L24 58 L30 58 L30 48Z', '#506070'),
    p('M34 48 L34 58 L40 58 L38 48Z', '#506070'),
    // Knee joints
    ci(28, 48, 1.5, '#708890'),
    ci(36, 48, 1.5, '#708890'),
  ].join('')),

  exorcist_hunter: C([
    // Leather armor body
    p('M26 16 L22 24 L20 46 L28 54 L36 54 L44 46 L42 24 L38 16Z', '#705030'),
    // Vest front
    p('M28 20 L36 20 L36 42 L28 42Z', '#604020'),
    // Belt
    p('M22 40 L42 40 L42 44 L22 44Z', '#403020'),
    rc(30, 40, 4, 4, '#c0a060'),
    // Cross pendant on chest
    p('M31 24 L33 24 L33 30 L31 30Z', '#c0a060'),
    p('M29 26 L35 26 L35 28 L29 28Z', '#c0a060'),
    // Head
    ci(32, 14, 7, '#e0c0a0'),
    // Short hair
    p('M25 10 L28 6 L36 6 L39 10 L38 14 L26 14Z', '#4a3020'),
    // Determined eyes
    ci(29, 14, 1.3, '#2a2040'),
    ci(35, 14, 1.3, '#2a2040'),
    // Holy water vial in hand
    p('M48 30 L50 28 L52 30 L52 38 L48 38Z', '#80a0c0'),
    p('M49 32 L51 32 L51 36 L49 36Z', '#60c0ff'),
    ci(50, 29, 1, '#c0a060'),
    // Shoulder guard
    p('M20 22 L16 20 L14 26 L18 28Z', '#806040'),
    p('M44 22 L48 20 L50 26 L46 28Z', '#806040'),
  ].join('')),

  forest_spirit: C([
    // Bark body (tree trunk)
    p('M28 16 L24 20 L22 40 Q24 50 32 52 Q40 50 42 40 L40 20 L36 16Z', '#30804a'),
    // Bark texture
    p('M26 24 L28 22 L28 32 L26 34Z', '#28703e'),
    p('M36 22 L38 20 L38 30 L36 32Z', '#28703e'),
    // Leaf crown
    p('M22 14 L26 6 L28 10 L32 4 L36 10 L38 6 L42 14Z', '#40a060'),
    p('M24 12 L28 8 L32 6 L36 8 L40 12Z', '#50c070'),
    // Face on trunk
    ci(29, 24, 2, '#80ff80'),
    ci(35, 24, 2, '#80ff80'),
    ci(29, 24, 1, '#40c050'),
    ci(35, 24, 1, '#40c050'),
    // Wooden mouth
    p('M29 30 Q32 34 35 30', '#286840'),
    // Branch arms
    p('M22 28 L14 22 L10 24 L12 28 L18 32Z', '#2a6838'),
    p('M42 28 L50 22 L54 24 L52 28 L46 32Z', '#2a6838'),
    // Leaf tips on branches
    p('M10 22 L6 20 L8 18 L12 20Z', '#50c070'),
    p('M54 22 L58 20 L56 18 L52 20Z', '#50c070'),
    // Root feet
    p('M24 48 L20 56 L26 58 L30 52Z', '#28703e'),
    p('M34 48 L38 56 L44 58 L40 52Z', '#28703e'),
    // Green glow
    ci(32, 30, 10, '#40ff4018'),
  ].join('')),

  dimension_sorcerer: C([
    // Dark robe body
    p('M28 12 L22 22 L18 48 L28 58 L36 58 L46 48 L42 22 L36 12Z', '#1a1040'),
    // Robe front
    p('M30 16 L34 16 L34 56 L30 56Z', '#241850'),
    // Hood
    p('M24 8 L28 0 L36 0 L40 8 L40 14 L38 10 L26 10 L24 14Z', '#120830'),
    // Glowing purple eyes
    ci(29, 12, 1.5, '#a060ff'),
    ci(35, 12, 1.5, '#a060ff'),
    ci(29, 12, 0.7, '#d0a0ff'),
    ci(35, 12, 0.7, '#d0a0ff'),
    // Portal effect behind
    ci(32, 32, 12, '#4030a030'),
    ci(32, 32, 8, '#6040c040'),
    p('M20 32 Q24 24 32 22 Q40 24 44 32 Q40 40 32 42 Q24 40 20 32Z', '#8060ff20'),
    // Floating in void - no legs visible, robe fades
    p('M18 48 L22 54 L26 58 L32 60 L38 58 L42 54 L46 48 L44 52 L36 56 L28 56 L20 52Z', '#1a104040'),
    // Hands with magic
    p('M20 30 L16 28 L14 32 L18 34Z', '#e0c0a0'),
    p('M44 30 L48 28 L50 32 L46 34Z', '#e0c0a0'),
    // Sparkle effects
    p('M10 20 L12 18 L14 20 L12 22Z', '#8060ff60'),
    p('M50 14 L52 12 L54 14 L52 16Z', '#8060ff40'),
  ].join('')),

  titan_golem: C([
    // VERY LARGE body
    p('M18 10 L10 22 L8 48 L18 60 L46 60 L56 48 L54 22 L46 10Z', '#504840'),
    // Rocky texture plates
    p('M22 18 L18 22 L20 30 L26 28Z', '#5a5248'),
    p('M42 18 L46 22 L44 30 L38 28Z', '#5a5248'),
    p('M28 32 L36 32 L38 42 L26 42Z', '#5a5248'),
    // Left massive arm
    p('M10 22 L2 20 L0 36 L4 42 L10 38Z', '#484038'),
    // Left fist
    p('M0 36 L-2 42 L6 46 L8 40Z', '#504840'),
    // Right massive arm
    p('M54 22 L62 20 L64 36 L60 42 L54 38Z', '#484038'),
    // Right fist
    p('M62 36 L66 42 L58 46 L56 40Z', '#504840'),
    // Glowing eyes
    ci(28, 18, 2.5, '#ff6020'),
    ci(40, 18, 2.5, '#ff6020'),
    ci(28, 18, 1.2, '#ffa040'),
    ci(40, 18, 1.2, '#ffa040'),
    // Rocky brow ridge
    p('M22 14 L26 12 L32 14 L38 12 L42 14 L42 16 L22 16Z', '#605848'),
    // Chest crack glow
    p('M30 26 L34 26 L33 36 L31 36Z', '#ff602030'),
    // Legs - thick pillar
    p('M22 54 L18 64 L30 64 L30 54Z', '#484038'),
    p('M34 54 L34 64 L46 64 L42 54Z', '#484038'),
  ].join('')),

  mirror_knight: C([
    // Polished armor body
    p('M26 12 L20 22 L18 46 L26 56 L38 56 L44 46 L42 22 L36 12Z', '#708090'),
    // Armor chest highlight
    p('M28 22 L36 22 L34 38 L30 38Z', '#90a8b8'),
    p('M30 24 L34 24 L33 34 L31 34Z', '#b0c8d8'),
    // Helmet
    p('M22 8 L26 4 L38 4 L42 8 L42 16 L24 16Z', '#8090a0'),
    // Visor reflected light
    p('M26 10 L38 10 L38 14 L26 14Z', '#607080'),
    p('M28 11 L36 11 L36 13 L28 13Z', '#80c0ff'),
    // Polished tower shield
    p('M8 18 L4 16 L2 40 L6 44 L14 42 L16 20Z', '#a0b0c0'),
    p('M6 20 L4 22 L4 38 L6 40 L12 38 L14 22Z', '#c0d0e0'),
    // Shield reflection shine
    p('M6 24 L8 22 L8 34 L6 36Z', '#e0f0ff'),
    // Shield cross emblem
    p('M8 28 L10 28 L10 34 L8 34Z', '#708090'),
    p('M6 30 L12 30 L12 32 L6 32Z', '#708090'),
    // Sword
    p('M48 6 L50 4 L52 6 L51 26 L49 26Z', '#c0d0e0'),
    p('M49.5 6 L50 5 L50.5 6 L50.2 24 L49.8 24Z', '#e0f0ff'),
    // Shoulder pauldrons
    p('M18 20 L14 18 L12 24 L16 26Z', '#8090a0'),
    p('M46 20 L50 18 L52 24 L48 26Z', '#8090a0'),
    // Legs
    p('M26 50 L24 60 L30 60 L32 50Z', '#708090'),
    p('M32 50 L34 60 L40 60 L38 50Z', '#708090'),
  ].join('')),

  arcane_scholar: C([
    // Blue robe body
    p('M26 18 L22 26 L18 48 L28 58 L36 58 L46 48 L42 26 L38 18Z', '#304060'),
    // Robe front
    p('M30 22 L34 22 L34 56 L30 56Z', '#3a5070'),
    // Pointed hat
    p('M22 14 L32 -2 L42 14 L40 18 L24 18Z', '#2a3858'),
    // Hat brim
    p('M18 17 L46 17 L44 20 L20 20Z', '#304060'),
    // Hat band
    p('M24 14 L40 14 L40 16 L24 16Z', '#c0a060'),
    // Head
    ci(32, 18, 6, '#f0c8a0'),
    // Spectacles
    p('M26 17 L30 17 L30 20 L26 20Z', '#c0a060'),
    p('M34 17 L38 17 L38 20 L34 20Z', '#c0a060'),
    p('M30 18 L34 18', '#c0a060'),
    // Eyes behind spectacles
    ci(28, 18.5, 1, '#1a1a2e'),
    ci(36, 18.5, 1, '#1a1a2e'),
    // Open book in hands
    p('M10 34 L8 30 L18 28 L20 32Z', '#8b4513'),
    p('M10 34 L8 30 L4 32 L6 36Z', '#f5deb3'),
    p('M10 34 L18 28 L22 30 L14 36Z', '#f5deb3'),
    // Book text
    p('M6 33 L8 32 M7 34 L10 33', '#30406060'),
    // Robe trim
    p('M18 48 L28 58 L36 58 L46 48 L46 50 L36 60 L28 60 L18 50Z', '#c0a060'),
  ].join('')),

  // Ch3 Elite
  black_butcher: C([
    // Large dark body
    p('M22 10 L16 20 L14 48 L24 58 L40 58 L50 48 L48 20 L42 10Z', '#302020'),
    // Chain mail overlay
    p('M24 20 L20 24 L18 40 L28 48 L36 48 L46 40 L44 24 L40 20Z', '#40383840'),
    // Chain mail pattern
    p('M24 26 L26 24 L28 26 L30 24 L32 26 L34 24 L36 26 L38 24 L40 26', '#50484840'),
    p('M22 32 L24 30 L26 32 L28 30 L30 32 L32 30 L34 32 L36 30 L38 32 L40 30 L42 32', '#50484840'),
    // Bloody apron
    p('M26 28 L24 52 L40 52 L38 28Z', '#a08070'),
    // Heavy blood stains
    p('M28 34 Q32 30 36 34 L35 44 L29 44Z', '#801010'),
    p('M26 44 L30 40 L32 48 L28 50Z', '#801010'),
    p('M34 40 L38 42 L36 50 L32 48Z', '#801010'),
    // Terrifying stitched mask head
    ci(32, 14, 8, '#403030'),
    // Stitch lines
    p('M26 12 L26 18 M30 10 L30 18 M34 10 L34 18 M38 12 L38 18', '#201010'),
    // Glowing red eyes
    ci(29, 14, 2, '#ff2020'),
    ci(35, 14, 2, '#ff2020'),
    ci(29, 14, 1, '#ff6060'),
    ci(35, 14, 1, '#ff6060'),
    // Massive cleaver
    p('M48 4 L60 2 L62 8 L60 28 L52 30 L48 26Z', '#909898'),
    p('M50 6 L58 4 L60 10 L58 26 L54 28 L52 24Z', '#b0b8c0'),
    // Cleaver blood
    p('M54 14 L58 12 L58 20 L54 22Z', '#80101060'),
    // Cleaver handle
    p('M46 24 L50 22 L54 30 L50 32Z', '#3a1808'),
    // Belt with hooks
    p('M18 40 L46 40 L46 44 L18 44Z', '#282020'),
    // Meat hooks on belt
    p('M22 44 L20 48 L22 50 L24 46Z', '#808080'),
    p('M38 44 L40 48 L38 50 L36 46Z', '#808080'),
  ].join('')),

  heavy_armored: C([
    // Massive plate armor body
    p('M20 10 L14 22 L12 48 L22 58 L42 58 L52 48 L50 22 L44 10Z', '#505060'),
    // Chest plate
    p('M24 18 L40 18 L38 40 L26 40Z', '#585868'),
    p('M28 22 L36 22 L35 36 L29 36Z', '#606070'),
    // Armor line center
    p('M31 18 L33 18 L33 40 L31 40Z', '#686878'),
    // Helmet with visor
    p('M20 6 L24 0 L40 0 L44 6 L44 16 L20 16Z', '#585868'),
    p('M22 8 L42 8 L42 14 L22 14Z', '#404050'),
    // Visor slit - blue glow
    p('M24 10 L40 10 L40 12 L24 12Z', '#3060a0'),
    p('M26 10.5 L38 10.5 L38 11.5 L26 11.5Z', '#4080ff'),
    // Spike on helmet
    p('M30 0 L32 -4 L34 0Z', '#606070'),
    // Tower shield
    p('M6 16 L2 14 L0 42 L4 46 L14 44 L16 18Z', '#505060'),
    p('M4 18 L2 20 L2 40 L4 42 L12 40 L14 20Z', '#585868'),
    // Shield emblem (cross)
    p('M6 28 L10 28 L10 34 L6 34Z', '#404050'),
    p('M6 30 L10 30 L10 32 L6 32Z', '#606070'),
    // Right arm with mace/weapon
    p('M50 22 L56 20 L58 30 L54 34 L50 30Z', '#505060'),
    // Shoulder spikes
    p('M14 20 L10 14 L12 16 L16 20Z', '#606070'),
    p('M50 20 L54 14 L52 16 L48 20Z', '#606070'),
    // Legs heavy plated
    p('M24 52 L22 62 L30 62 L32 52Z', '#484858'),
    p('M32 52 L34 62 L42 62 L40 52Z', '#484858'),
    // Knee guards
    p('M24 50 L22 52 L30 52 L30 50Z', '#585868'),
    p('M34 50 L34 52 L42 52 L40 50Z', '#585868'),
  ].join('')),

  // Ch3 Boss
  void_echo: C([
    // Farthest echo (faded)
    p('M38 6 Q52 12 52 28 Q52 44 44 50 Q38 54 38 48 Q42 42 42 28 Q42 14 38 6Z', '#20182810'),
    p('M26 6 Q12 12 12 28 Q12 44 20 50 Q26 54 26 48 Q22 42 22 28 Q22 14 26 6Z', '#20182810'),
    // Middle echo (semi-faded)
    p('M36 8 Q48 14 48 30 Q48 44 40 50 Q36 52 36 46 Q42 40 42 30 Q42 16 36 8Z', '#20182830'),
    p('M28 8 Q16 14 16 30 Q16 44 24 50 Q28 52 28 46 Q22 40 22 30 Q22 16 28 8Z', '#20182830'),
    // Main spectral body
    p('M32 8 Q18 14 14 30 Q12 46 20 52 Q28 58 32 54 Q36 58 44 52 Q52 46 50 30 Q46 14 32 8Z', '#201828'),
    // Inner body
    p('M32 14 Q22 18 20 30 Q18 42 24 46 Q30 50 32 48 Q34 50 40 46 Q46 42 44 30 Q42 18 32 14Z', '#302838'),
    // Void face
    p('M26 24 L30 20 L34 20 L38 24 L36 30 L28 30Z', '#181420'),
    // Multiple echoing eyes (main)
    ci(29, 26, 2, '#8080ff'),
    ci(35, 26, 2, '#8080ff'),
    ci(29, 26, 1, '#c0c0ff'),
    ci(35, 26, 1, '#c0c0ff'),
    // Echoing eyes (faded copy right)
    ci(43, 26, 1.5, '#8080ff30'),
    ci(47, 26, 1.5, '#8080ff30'),
    // Echoing eyes (faded copy left)
    ci(17, 26, 1.5, '#8080ff30'),
    ci(21, 26, 1.5, '#8080ff30'),
    // Void particles
    ci(10, 18, 1, '#8080ff40'),
    ci(54, 18, 1, '#8080ff40'),
    ci(8, 38, 1.2, '#8080ff30'),
    ci(56, 38, 1.2, '#8080ff30'),
    // Wispy tendrils
    p('M20 48 Q16 52 12 50 Q8 48 10 44', '#30283840'),
    p('M44 48 Q48 52 52 50 Q56 48 54 44', '#30283840'),
  ].join('')),

  dimensional_warden: C([
    // Crystalline armor body
    p('M24 10 L18 20 L14 44 L22 56 L42 56 L50 44 L46 20 L40 10Z', '#203040'),
    // Crystal facets on armor
    p('M26 18 L32 16 L38 18 L36 28 L28 28Z', '#304858'),
    p('M28 28 L36 28 L38 38 L26 38Z', '#284050'),
    // Crystal shoulder left
    p('M14 18 L8 14 L6 22 L10 26 L16 24Z', '#405868'),
    p('M8 16 L6 20 L10 22 L12 18Z', '#508898'),
    // Crystal shoulder right
    p('M50 18 L56 14 L58 22 L54 26 L48 24Z', '#405868'),
    p('M56 16 L58 20 L54 22 L52 18Z', '#508898'),
    // Helmet with crystal crest
    p('M22 6 L26 2 L38 2 L42 6 L42 14 L22 14Z', '#283848'),
    p('M30 2 L32 -4 L34 2Z', '#40c0ff'),
    p('M32 -4 L31 -2 L33 -2Z', '#80e0ff'),
    // Eyes - rift energy
    p('M26 8 L30 8 L30 12 L26 12Z', '#203040'),
    p('M34 8 L38 8 L38 12 L34 12Z', '#203040'),
    ci(28, 10, 1.5, '#40c0ff'),
    ci(36, 10, 1.5, '#40c0ff'),
    ci(28, 10, 0.7, '#a0e0ff'),
    ci(36, 10, 0.7, '#a0e0ff'),
    // Twin blades - left
    p('M6 6 L8 2 L10 6 L9 24 L7 24Z', '#40c0ff80'),
    p('M7.5 4 L8 3 L8.5 4 L8.2 22 L7.8 22Z', '#80e0ff'),
    // Twin blades - right
    p('M54 6 L56 2 L58 6 L57 24 L55 24Z', '#40c0ff80'),
    p('M55.5 4 L56 3 L56.5 4 L56.2 22 L55.8 22Z', '#80e0ff'),
    // Rift energy effects
    ci(32, 32, 8, '#40c0ff18'),
    ci(32, 32, 5, '#40c0ff28'),
    p('M22 40 Q18 36 20 32 M42 40 Q46 36 44 32', '#40c0ff30'),
    // Legs crystal-plated
    p('M24 50 L22 60 L30 60 L30 50Z', '#283848'),
    p('M34 50 L34 60 L42 60 L40 50Z', '#283848'),
  ].join('')),

  whispering_madness: C([
    // Amorphous horror body
    p('M18 16 Q12 8 24 6 Q32 4 40 6 Q52 8 46 16 L52 36 Q48 50 32 48 Q16 50 12 36Z', '#302028'),
    // Undulating inner mass
    p('M22 18 Q18 12 28 10 Q34 8 38 10 Q46 12 42 18 L46 34 Q42 44 32 42 Q22 44 18 34Z', '#3a2830'),
    // Tentacle left front
    p('M12 36 L6 40 L2 48 L4 52 L8 50 L10 44 L14 38Z', '#382430'),
    p('M2 48 L0 54 L4 56 L6 52Z', '#402830'),
    // Tentacle right front
    p('M52 36 L58 40 L62 48 L60 52 L56 50 L54 44 L50 38Z', '#382430'),
    p('M62 48 L64 54 L60 56 L58 52Z', '#402830'),
    // Tentacle left back
    p('M14 40 L8 46 L6 54 L10 56 L14 48Z', '#30202840'),
    // Tentacle right back
    p('M50 40 L56 46 L58 54 L54 56 L50 48Z', '#30202840'),
    // Too many eyes - main pair
    ci(28, 20, 2.5, '#ff4080'),
    ci(36, 20, 2.5, '#ff4080'),
    ci(28, 20, 1.2, '#ff80a0'),
    ci(36, 20, 1.2, '#ff80a0'),
    // Extra eyes
    ci(24, 24, 1.5, '#ff408080'),
    ci(40, 24, 1.5, '#ff408080'),
    ci(32, 16, 1.8, '#ff4080'),
    ci(32, 16, 0.8, '#ff80a0'),
    ci(26, 14, 1, '#ff408060'),
    ci(38, 14, 1, '#ff408060'),
    // Maddening whisper effects
    p('M6 20 Q4 16 8 14 Q12 12 14 16', '#c0406020'),
    p('M50 20 Q52 16 56 14 Q60 12 58 16', '#c0406020'),
    p('M4 28 Q2 24 6 22', '#c0406010'),
    p('M60 28 Q62 24 58 22', '#c0406010'),
    // Gaping maw
    p('M26 28 Q28 24 32 26 Q36 24 38 28 Q36 34 32 36 Q28 34 26 28Z', '#1a1018'),
    // Teeth in maw
    p('M27 28 L29 30 L31 28 M33 28 L35 30 L37 28', '#d0c0b0'),
    p('M28 34 L30 32 L32 34 L34 32 L36 34', '#d0c0b0'),
  ].join('')),

  // Ch4
  rift_titan: C([
    // Massive void body
    p('M18 6 L8 18 L6 46 L16 60 L48 60 L58 46 L56 18 L46 6Z', '#302040'),
    // Inner rift energy
    p('M22 12 L14 22 L12 44 L20 56 L44 56 L52 44 L50 22 L42 12Z', '#3a2850'),
    // Rift cracks on body
    p('M26 20 L28 16 L30 22 L28 30Z', '#8040c040'),
    p('M38 18 L40 14 L42 20 L40 28Z', '#8040c040'),
    p('M30 36 L34 32 L36 38 L32 44Z', '#8040c040'),
    // Towering head
    p('M24 4 L28 -2 L36 -2 L40 4 L42 12 L22 12Z', '#3a2850'),
    // Glowing rift eyes
    ci(30, 8, 2.5, '#ff60ff'),
    ci(38, 8, 2.5, '#ff60ff'),
    ci(30, 8, 1.2, '#ffa0ff'),
    ci(38, 8, 1.2, '#ffa0ff'),
    // Left massive arm
    p('M6 18 L-2 16 L-4 32 L0 38 L8 34Z', '#382848'),
    p('M-4 32 L-6 38 L2 42 L4 36Z', '#302040'),
    // Right massive arm
    p('M56 18 L64 16 L66 32 L62 38 L56 34Z', '#382848'),
    p('M66 32 L68 38 L60 42 L58 36Z', '#302040'),
    // Rift energy glow on fists
    ci(-2, 38, 3, '#ff60ff30'),
    ci(66, 38, 3, '#ff60ff30'),
    // Legs - pillar-like
    p('M20 54 L16 64 L28 64 L30 54Z', '#2a1838'),
    p('M34 54 L36 64 L48 64 L44 54Z', '#2a1838'),
    // Void aura
    ci(32, 34, 16, '#8040c018'),
    ci(32, 34, 10, '#a060e018'),
  ].join('')),

  time_sovereign: C([
    // Regal robes
    p('M26 12 L20 22 L16 48 L26 58 L38 58 L48 48 L44 22 L38 12Z', '#2a2050'),
    // Robe front
    p('M30 16 L34 16 L34 56 L30 56Z', '#3a3070'),
    // Robe trim - gold
    p('M16 48 L26 58 L38 58 L48 48 L48 50 L38 60 L26 60 L16 50Z', '#c0a040'),
    // Clock pattern on robe
    ci(32, 36, 6, '#ffd70030'),
    p('M32 31 L32 36 L36 36', '#ffd70060'),
    p('M32 32 L32 36 L30 38', '#c0a04060'),
    // Hourglass motif on chest
    p('M30 20 L34 20 L33 26 L31 26Z', '#ffd700'),
    p('M31 26 L33 26 L34 32 L30 32Z', '#ffd700'),
    ci(32, 26, 1, '#ffe880'),
    // Crown with clock elements
    p('M22 8 L26 2 L30 6 L32 0 L34 6 L38 2 L42 8Z', '#c0a040'),
    p('M22 8 L42 8 L42 12 L22 12Z', '#2a2050'),
    // Clock hands on crown
    p('M32 4 L32 8', '#ffd700'),
    p('M32 6 L35 6', '#ffd700'),
    // Head
    ci(32, 14, 6, '#e0c0a0'),
    // Wise eyes - golden glow
    ci(29, 14, 1.5, '#ffd700'),
    ci(35, 14, 1.5, '#ffd700'),
    ci(29, 14, 0.7, '#fff8e0'),
    ci(35, 14, 0.7, '#fff8e0'),
    // Time staff
    rc(50, 4, 2.5, 50, '#c0a040'),
    // Hourglass staff top
    p('M47 2 L55 2 L53 6 L49 6Z', '#ffd700'),
    p('M49 6 L53 6 L55 10 L47 10Z', '#ffd700'),
    ci(51, 6, 1, '#ffe880'),
    // Time particles
    ci(12, 18, 1, '#ffd70040'),
    ci(8, 28, 0.8, '#ffd70030'),
    ci(56, 16, 1, '#ffd70040'),
  ].join('')),

  void_avatar: C([
    // Cosmic body - outer
    p('M32 2 L14 14 L8 34 L16 54 L32 62 L48 54 L56 34 L50 14Z', '#100818'),
    // Inner starfield body
    p('M32 8 L18 18 L14 34 L20 48 L32 54 L44 48 L50 34 L46 18Z', '#1a1028'),
    // Star dots in body
    ci(24, 28, 0.8, '#fff'),
    ci(38, 22, 0.6, '#fff'),
    ci(28, 40, 0.7, '#fff'),
    ci(42, 36, 0.5, '#fff'),
    ci(20, 34, 0.4, '#fff'),
    ci(36, 44, 0.5, '#fff'),
    ci(32, 18, 0.6, '#fff'),
    ci(44, 28, 0.4, '#fff'),
    // Cosmic eyes - main
    ci(28, 24, 3, '#c040ff'),
    ci(38, 24, 3, '#c040ff'),
    ci(28, 24, 1.5, '#e080ff'),
    ci(38, 24, 1.5, '#e080ff'),
    ci(28, 24, 0.6, '#fff'),
    ci(38, 24, 0.6, '#fff'),
    // Third eye (forehead)
    ci(33, 16, 2, '#c040ff80'),
    ci(33, 16, 1, '#e080ff'),
    // Reality-bending distortion effects
    p('M8 34 Q4 28 6 22 Q8 16 14 14', '#c040ff18'),
    p('M56 34 Q60 28 58 22 Q56 16 50 14', '#c040ff18'),
    // Void tendrils
    p('M16 48 L10 52 L6 50 L4 54 L8 58 L14 54Z', '#18102060'),
    p('M48 48 L54 52 L58 50 L60 54 L56 58 L50 54Z', '#18102060'),
    // Cosmic aura rings
    ci(32, 32, 20, '#c040ff0c'),
    ci(32, 32, 15, '#c040ff10'),
    ci(32, 32, 10, '#c040ff14'),
    // Crown of void energy
    p('M22 12 L26 4 L30 8 L32 2 L34 8 L38 4 L42 12', '#c040ff30'),
  ].join('')),
};

export const CHAR_NAMES: Record<string, string> = {
  swordmaster: '검사',
  gunner: '사수',
  fighter: '격투가',
  magician: '마법사',
  priest: '성직자',
  thief: '도적',
  summoner: '정령술사',
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
