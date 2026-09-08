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

  combat: C(
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

  elite: C(
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

  rest: C(
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

  reward: C(
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

  shop: C(
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
    // Crown base
    p('M10 36 L54 36 L52 44 L12 44Z', '#d4af37') +
    // Crown points
    p('M12 36 L18 12 L24 28 L32 8 L40 28 L46 12 L52 36Z', '#d4af37') +
    // Crown inner
    p('M14 36 L20 16 L24 26 L32 12 L40 26 L44 16 L50 36Z', '#f0d866') +
    // Center ruby
    ci(32, 30, 5, '#cc1122') +
    ci(32, 30, 3, '#ee3344') +
    ci(31, 28, 1.5, '#ff8899') +
    // Left sapphire
    ci(20, 28, 3, '#2244cc') +
    ci(20, 28, 1.5, '#6688ff') +
    // Right sapphire
    ci(44, 28, 3, '#2244cc') +
    ci(44, 28, 1.5, '#6688ff') +
    // Gold band detail
    rc(12, 40, 40, 2, '#e8cc66') +
    // Tip jewels
    ci(32, 10, 2, '#ffffff')
  ),

  event: C(
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

export const RELIC_SVG: Record<string, string> = {
  // ── STARTER RELICS ──

  burning_blood: C(
    // Blood drop body
    p('M32 8 Q38 20 42 30 Q44 38 42 44 Q40 52 32 54 Q24 52 22 44 Q20 38 22 30 Q26 20 32 8Z', '#cc2222') +
    // Inner highlight
    p('M32 14 Q36 22 38 30 Q39 34 38 38 Q36 44 32 46 Q30 44 29 40 Q28 36 30 30 Q32 22 32 14Z', '#e63e3e') +
    // Fire lick left
    p('M22 36 Q18 28 20 22 Q22 26 24 32 Q23 34 22 36Z', '#ff8800') +
    // Fire lick right
    p('M42 36 Q46 28 44 22 Q42 26 40 32 Q41 34 42 36Z', '#ff8800') +
    // Fire top left
    p('M26 20 Q22 14 24 10 Q26 14 28 18 Q27 19 26 20Z', '#ffcc00') +
    // Fire top right
    p('M38 20 Q42 14 40 10 Q38 14 36 18 Q37 19 38 20Z', '#ffcc00') +
    // Flame center top
    p('M32 8 Q30 4 32 2 Q34 4 32 8Z', '#ff6600') +
    // Inner glow spot
    ci(32, 34, 4, '#ff4444') +
    // Bright core
    ci(32, 32, 2, '#ffaa44') +
    // Drip at bottom
    p('M32 54 Q33 57 32 60 Q31 57 32 54Z', '#991111')
  ),

  vajra: C(
    // Center diamond body
    p('M32 6 L42 32 L32 58 L22 32Z', '#d4af37') +
    // Left prong
    p('M22 32 L12 24 L16 32 L12 40Z', '#4488cc') +
    // Right prong
    p('M42 32 L52 24 L48 32 L52 40Z', '#4488cc') +
    // Center highlight
    p('M32 12 L38 32 L32 52 L26 32Z', '#f0d060') +
    // Top jewel
    ci(32, 10, 3, '#6699ee') +
    // Bottom jewel
    ci(32, 54, 3, '#6699ee') +
    // Center orb
    ci(32, 32, 5, '#88bbff') +
    // Center orb highlight
    ci(31, 30, 2, '#ccddff') +
    // Lightning bolt left
    p('M14 28 L18 30 L15 32 L18 34 L14 36', '#aaddff') +
    // Lightning bolt right
    p('M50 28 L46 30 L49 32 L46 34 L50 36', '#aaddff') +
    // Top ring
    p('M28 8 Q32 5 36 8 Q32 10 28 8Z', '#d4af37') +
    // Bottom ring
    p('M28 56 Q32 59 36 56 Q32 54 28 56Z', '#d4af37')
  ),

  anchor: C(
    // Main shaft
    rc(30, 10, 4, 40, '#556677') +
    // Cross bar
    rc(20, 18, 24, 4, '#556677') +
    // Top ring
    ci(32, 8, 4, '#445566') +
    // Top ring inner
    ci(32, 8, 2, '#334455') +
    // Left hook
    p('M20 50 Q14 50 12 44 Q11 38 14 34 L18 36 Q16 40 16 44 Q17 47 20 48Z', '#667788') +
    // Right hook
    p('M44 50 Q50 50 52 44 Q53 38 50 34 L46 36 Q48 40 48 44 Q47 47 44 48Z', '#667788') +
    // Left flukes
    p('M12 44 L8 48 L14 46Z', '#556677') +
    // Right flukes
    p('M52 44 L56 48 L50 46Z', '#556677') +
    // Shaft highlight
    rc(31, 12, 2, 36, '#778899') +
    // Bottom point
    p('M30 50 L32 56 L34 50Z', '#556677') +
    // Crossbar shadow
    rc(20, 20, 24, 2, '#445566')
  ),

  bag_of_marbles: C(
    // Bag body
    p('M20 22 Q18 32 20 42 Q24 50 32 50 Q40 50 44 42 Q46 32 44 22Z', '#c9a96e') +
    // Bag top gathered
    p('M22 22 Q26 18 32 16 Q38 18 42 22 Q38 20 32 19 Q26 20 22 22Z', '#b8985a') +
    // Tie string
    p('M28 18 Q30 14 32 12 Q34 14 36 18', '#8b7355') +
    // String knot
    ci(32, 12, 2, '#8b7355') +
    // Bag fold line
    p('M24 28 Q32 26 40 28', '#b8985a') +
    // Red marble spilling
    ci(14, 46, 4, '#dd3333') +
    // Blue marble spilling
    ci(50, 48, 4, '#3366cc') +
    // Green marble spilling
    ci(22, 54, 4, '#33aa55') +
    // Yellow marble visible in bag
    ci(30, 36, 3, '#ddcc33') +
    // Purple marble visible
    ci(36, 34, 3, '#9944cc') +
    // Marble highlights
    ci(13, 44, 1.5, '#ff8888') +
    ci(49, 46, 1.5, '#88aaee') +
    ci(21, 52, 1.5, '#88dd99') +
    // Bag shadow
    p('M22 42 Q32 44 42 42 Q40 48 32 49 Q24 48 22 42Z', '#a68850')
  ),

  pen_nib: C(
    // Nib body
    p('M24 10 L40 10 L40 36 L32 58 L24 36Z', '#d4af37') +
    // Nib tip
    p('M30 50 L32 58 L34 50Z', '#c0c0c0') +
    // Ink slit center
    rc(31, 30, 2, 22, '#333333') +
    // Left edge detail
    p('M24 10 L24 36 L28 36 L28 12Z', '#c49b2f') +
    // Right edge detail
    p('M40 10 L40 36 L36 36 L36 12Z', '#c49b2f') +
    // Top flat
    rc(24, 8, 16, 4, '#e8cc66') +
    // Body highlight
    p('M30 14 L34 14 L34 34 L32 44 L30 34Z', '#f0d866') +
    // Left shoulder curve
    p('M24 36 Q26 40 30 48 L32 48 L28 38 L24 36Z', '#c49b2f') +
    // Right shoulder curve
    p('M40 36 Q38 40 34 48 L32 48 L36 38 L40 36Z', '#c49b2f') +
    // Ink drop at tip
    ci(32, 60, 2, '#222266') +
    // Silver accent
    rc(26, 10, 12, 2, '#e0e0e0')
  ),

  blood_vial: C(
    // Vial body
    p('M26 24 L26 50 Q26 56 32 56 Q38 56 38 50 L38 24Z', '#dddddd') +
    // Blood liquid
    p('M27 32 L27 50 Q27 55 32 55 Q37 55 37 50 L37 32Z', '#cc1111') +
    // Cork stopper
    rc(27, 18, 10, 8, '#8b6914') +
    // Cork top
    rc(28, 16, 8, 4, '#a07828') +
    // Vial neck
    rc(29, 22, 6, 4, '#eeeeee') +
    // Blood highlight
    p('M29 34 L29 48 Q29 52 32 52 L32 34Z', '#ee3333') +
    // Glass shine left
    p('M27 26 L28 26 L28 48 L27 48Z', '#ffffff') +
    // Glass shine right
    p('M36 28 L37 28 L37 46 L36 46Z', '#eeeeff') +
    // Blood bubble
    ci(33, 42, 2, '#dd4444') +
    // Label band
    rc(26, 38, 12, 3, '#f5e6c8') +
    // Label cross
    p('M31 37 L33 37 L33 42 L31 42Z', '#cc1111')
  ),

  oddly_smooth_stone: C(
    // Stone body
    p('M16 28 Q14 36 18 44 Q24 54 36 54 Q48 52 50 42 Q52 34 48 26 Q44 18 34 16 Q22 18 16 28Z', '#5ba8a0') +
    // Inner lighter area
    p('M20 30 Q20 38 24 44 Q28 50 36 50 Q44 48 46 40 Q48 34 44 28 Q40 22 34 20 Q26 22 20 30Z', '#72c2b8') +
    // Top highlight
    p('M26 22 Q30 18 38 20 Q42 22 44 28 Q40 22 34 20 Q28 20 26 22Z', '#a0e8dd') +
    // Central glow
    ci(34, 34, 8, '#88d4ca') +
    // Bright spot
    ci(30, 28, 4, '#b0ece2') +
    // Tiny sparkle
    ci(28, 26, 1.5, '#e0fff8') +
    // Shadow underneath
    p('M20 48 Q28 56 40 54 Q48 50 46 44 Q44 50 36 52 Q26 52 20 48Z', '#4a8e86') +
    // Surface line
    p('M22 36 Q28 34 36 36 Q42 38 46 36', '#6ab8ae') +
    // Polish shine
    ci(38, 26, 2, '#c0f0e8') +
    // Jade vein
    p('M24 40 Q30 38 38 42 Q42 44 44 40', '#4a9a90')
  ),

  meat_on_the_bone: C(
    // Bone shaft
    p('M14 50 L44 20', '#f0e6d0') +
    rc(13, 46, 6, 8, '#f0e6d0') +
    // Bone knob top
    ci(46, 18, 5, '#f0e6d0') +
    ci(44, 14, 4, '#f0e6d0') +
    ci(48, 14, 3, '#e8dcc4') +
    // Bone knob bottom
    ci(12, 52, 4, '#f0e6d0') +
    ci(16, 54, 3, '#e8dcc4') +
    // Meat chunk
    p('M24 22 Q20 26 22 34 Q24 42 32 44 Q40 44 44 36 Q46 28 42 22 Q38 18 30 18 Q26 18 24 22Z', '#aa3322') +
    // Meat highlight
    p('M28 24 Q26 28 28 34 Q30 38 34 38 Q38 36 38 30 Q36 24 32 22 Q30 22 28 24Z', '#cc4433') +
    // Fat marbling
    p('M30 28 Q32 30 34 28', '#dd8877') +
    p('M28 34 Q30 36 34 34', '#dd8877') +
    // Grill mark
    p('M26 30 L38 26', '#882211') +
    p('M28 36 L40 32', '#882211')
  ),

  fighting_spirit: C(
    // Fist body
    p('M22 28 L22 44 Q22 50 28 50 L40 50 Q44 50 44 44 L44 34 Q44 30 40 28Z', '#dd6644') +
    // Fingers curled
    p('M22 28 Q20 24 24 22 L40 22 Q44 22 44 28Z', '#cc5533') +
    // Thumb
    p('M22 32 Q18 30 18 34 Q18 38 22 38Z', '#dd6644') +
    // Knuckle lines
    p('M28 28 L28 24', '#bb4422') +
    p('M33 28 L33 24', '#bb4422') +
    p('M38 28 L38 24', '#bb4422') +
    // Fire behind - large
    p('M18 44 Q12 32 16 20 Q20 28 22 24 Q18 30 18 38Z', '#ff6600') +
    p('M46 44 Q52 32 48 20 Q44 28 42 24 Q46 30 46 38Z', '#ff6600') +
    // Fire top
    p('M28 22 Q26 14 30 8 Q32 14 32 20Z', '#ffaa00') +
    p('M36 22 Q38 12 36 6 Q34 12 34 18Z', '#ff8800') +
    // Fire center top
    p('M32 20 Q32 10 34 4 Q36 10 34 18Z', '#ffcc44') +
    // Wrist
    rc(26, 50, 14, 6, '#cc5533') +
    // Fist highlight
    p('M26 30 L38 30 L38 44 L26 44Z', '#ee7755')
  ),

  mage_orb: C(
    // Outer glow
    ci(32, 32, 24, '#2a1a4e') +
    // Orb body
    ci(32, 32, 18, '#5533aa') +
    // Inner glow
    ci(32, 32, 14, '#7744cc') +
    // Core
    ci(32, 30, 8, '#9966ee') +
    // Bright highlight
    ci(28, 26, 4, '#bb99ff') +
    // Top sparkle
    ci(26, 24, 2, '#ddc0ff') +
    // Energy swirl 1
    p('M18 32 Q22 24 32 22 Q42 24 46 32', '#8855dd') +
    // Energy swirl 2
    p('M18 36 Q24 44 32 44 Q40 44 46 36', '#6644bb') +
    // Stand base
    p('M22 52 L42 52 L38 48 L26 48Z', '#c0a040') +
    // Stand neck
    rc(29, 46, 6, 4, '#d4af37') +
    // Star sparkle
    p('M44 18 L46 22 L48 18 L46 14Z', '#ddbbff') +
    // Bottom reflection
    ci(34, 40, 3, '#6644bb')
  ),

  holy_chalice: C(
    // Cup bowl
    p('M18 16 Q16 32 22 38 Q26 42 32 42 Q38 42 42 38 Q48 32 46 16Z', '#d4af37') +
    // Cup inner
    p('M22 18 Q20 30 26 36 Q28 38 32 38 Q36 38 38 36 Q44 30 42 18Z', '#f0d866') +
    // Stem
    rc(29, 42, 6, 10, '#d4af37') +
    // Base
    p('M20 54 L44 54 L40 52 L24 52Z', '#d4af37') +
    // Base top
    p('M24 52 L40 52 L38 50 L26 50Z', '#e8cc66') +
    // Glow above
    p('M26 10 Q32 4 38 10 Q34 8 32 7 Q30 8 26 10Z', '#fff8cc') +
    // Holy light rays
    p('M32 6 L33 2 L31 2Z', '#fff4aa') +
    p('M24 10 L22 6 L20 8Z', '#fff4aa') +
    p('M40 10 L42 6 L44 8Z', '#fff4aa') +
    // Cup highlight
    p('M24 20 L26 20 L24 34 L22 30Z', '#f5e088') +
    // Jewel on cup
    ci(32, 28, 3, '#ff4444') +
    // Jewel highlight
    ci(31, 27, 1, '#ff8888') +
    // Liquid surface
    p('M24 22 Q32 20 40 22 Q38 24 32 24 Q26 24 24 22Z', '#ffee88')
  ),

  gwihon_charm: C(
    // Blade
    p('M30 4 L34 4 L36 40 L32 48 L28 40Z', '#a0b8d0') +
    // Blade edge highlight
    p('M31 6 L33 6 L34 38 L32 44 L30 38Z', '#c0d8ee') +
    // Guard cross
    p('M20 40 L44 40 L44 44 L20 44Z', '#4466aa') +
    // Guard gem center
    ci(32, 42, 3, '#66aaff') +
    // Handle
    rc(29, 44, 6, 12, '#334488') +
    // Handle wrap
    rc(29, 46, 6, 2, '#5577bb') +
    rc(29, 50, 6, 2, '#5577bb') +
    // Pommel
    ci(32, 58, 3, '#4466aa') +
    // Spirit energy left
    p('M20 20 Q16 28 18 36 Q20 30 22 24Z', '#88ccff') +
    // Spirit energy right
    p('M44 20 Q48 28 46 36 Q44 30 42 24Z', '#88ccff') +
    // Blade tip glow
    ci(32, 6, 2, '#aaddff') +
    // Spirit wisps
    p('M24 14 Q20 10 22 6', '#66aaff') +
    p('M40 14 Q44 10 42 6', '#66aaff')
  ),

  gunner_magazine: C(
    // Magazine body
    p('M22 8 L38 8 L40 52 L20 52Z', '#444444') +
    // Magazine side panel
    p('M22 8 L24 8 L26 52 L20 52Z', '#555555') +
    // Top feed lip
    rc(20, 6, 22, 4, '#555555') +
    // Bullet 1
    p('M26 14 L36 14 L36 18 L26 18Z', '#c8a832') +
    ci(37, 16, 2, '#dd6644') +
    // Bullet 2
    p('M26 22 L36 22 L36 26 L26 26Z', '#c8a832') +
    ci(37, 24, 2, '#dd6644') +
    // Bullet 3
    p('M26 30 L36 30 L36 34 L26 34Z', '#c8a832') +
    ci(37, 32, 2, '#dd6644') +
    // Bullet 4
    p('M27 38 L37 38 L37 42 L27 42Z', '#c8a832') +
    // Window slot
    rc(28, 12, 4, 34, '#333333') +
    // Bottom plate
    rc(19, 52, 24, 4, '#555555') +
    // Rivet
    ci(24, 10, 1.5, '#777777')
  ),

  one_mind_belt: C(
    // Belt body curved
    p('M8 28 Q8 36 16 40 L48 40 Q56 36 56 28 Q56 22 48 20 L16 20 Q8 22 8 28Z', '#f0f0f0') +
    // Belt inner
    p('M12 26 Q12 34 18 36 L46 36 Q52 34 52 26 Q52 22 46 22 L18 22 Q12 22 12 26Z', '#e0e0e0') +
    // Gold trim top
    p('M16 20 L48 20 Q52 20 52 22 L12 22 Q12 20 16 20Z', '#d4af37') +
    // Gold trim bottom
    p('M18 36 L46 36 Q52 36 52 38 L12 38 Q12 36 18 36Z', '#d4af37') +
    // Center medallion
    ci(32, 30, 7, '#d4af37') +
    // Medallion inner
    ci(32, 30, 5, '#f0d866') +
    // Korean character hint (一)
    rc(27, 29, 10, 2, '#aa8822') +
    // Belt end left
    p('M8 28 L4 28 L4 32 L8 32Z', '#e0e0e0') +
    // Belt end right
    p('M56 28 L60 28 L60 32 L56 32Z', '#e0e0e0') +
    // Stitching dots
    ci(20, 30, 1, '#cccccc') +
    ci(44, 30, 1, '#cccccc')
  ),

  elemental_resonance: C(
    // Crystal body
    p('M32 4 L44 20 L44 44 L32 60 L20 44 L20 20Z', '#aabbcc') +
    // Fire facet (top-right)
    p('M32 4 L44 20 L32 24Z', '#ff4422') +
    // Water facet (bottom-right)
    p('M44 20 L44 44 L32 36Z', '#2266ff') +
    // Earth facet (bottom-left)
    p('M32 60 L20 44 L32 36Z', '#44aa22') +
    // Wind facet (top-left)
    p('M32 4 L20 20 L32 24Z', '#ccddff') +
    // Center core
    ci(32, 32, 6, '#ffffff') +
    // Center inner glow
    ci(32, 32, 3, '#ffddaa') +
    // Fire spark
    ci(38, 14, 2, '#ff8844') +
    // Water drop
    ci(42, 38, 2, '#4488ff') +
    // Earth node
    ci(24, 48, 2, '#66cc44') +
    // Wind swirl
    ci(22, 14, 2, '#aaccff') +
    // Crystal edge highlights
    p('M32 4 L33 4 L44 20 L43 20Z', '#ddeeff') +
    p('M20 20 L21 20 L32 5 L32 4Z', '#eeeeff')
  ),

  holy_seal: C(
    // Outer ring
    ci(32, 32, 24, '#d4af37') +
    // Inner ring
    ci(32, 32, 20, '#f0d866') +
    // Inner circle
    ci(32, 32, 16, '#fffff0') +
    // Cross vertical
    rc(29, 18, 6, 28, '#d4af37') +
    // Cross horizontal
    rc(18, 29, 28, 6, '#d4af37') +
    // Cross center
    ci(32, 32, 4, '#f5e888') +
    // Holy rays
    p('M32 10 L34 14 L30 14Z', '#fff8cc') +
    p('M32 54 L34 50 L30 50Z', '#fff8cc') +
    p('M10 32 L14 30 L14 34Z', '#fff8cc') +
    p('M54 32 L50 30 L50 34Z', '#fff8cc') +
    // Corner decorations
    ci(20, 20, 2, '#e8cc66') +
    ci(44, 20, 2, '#e8cc66') +
    ci(20, 44, 2, '#e8cc66') +
    ci(44, 44, 2, '#e8cc66')
  ),

  venom_fang: C(
    // Fang body
    p('M26 8 Q24 20 22 36 Q20 48 24 56 Q26 60 28 56 Q30 48 30 36 Q30 20 28 8Z', '#e0e8d8') +
    // Second fang
    p('M36 8 Q34 20 32 36 Q30 48 34 56 Q36 60 38 56 Q40 48 40 36 Q40 20 38 8Z', '#e0e8d8') +
    // Fang highlights
    p('M27 10 Q26 20 24 34 Q24 24 26 12Z', '#f0f4ee') +
    p('M37 10 Q36 20 34 34 Q34 24 36 12Z', '#f0f4ee') +
    // Venom drip left
    p('M24 56 Q23 58 24 62 Q25 60 24 56Z', '#44cc44') +
    // Venom drip right
    p('M34 56 Q33 58 34 62 Q35 60 34 56Z', '#44cc44') +
    // Gum/root area
    p('M22 8 Q26 4 32 4 Q38 4 42 8 Q38 12 32 14 Q26 12 22 8Z', '#cc6688') +
    // Venom coating left
    p('M24 40 Q22 48 24 54 Q26 50 26 42Z', '#66dd66') +
    // Venom coating right
    p('M36 40 Q34 48 34 54 Q38 50 38 42Z', '#66dd66') +
    // Purple tint
    p('M26 30 Q24 38 26 44 Q28 38 28 30Z', '#8844aa') +
    p('M36 30 Q34 38 34 44 Q38 38 38 30Z', '#8844aa')
  ),

  spirit_contract: C(
    // Scroll body
    p('M16 12 L48 12 L48 52 L16 52Z', '#e8dcc4') +
    // Scroll top roll
    p('M14 10 Q14 6 18 6 L46 6 Q50 6 50 10 Q50 14 46 14 L18 14 Q14 14 14 10Z', '#d4c8a8') +
    // Scroll bottom roll
    p('M14 52 Q14 48 18 48 L46 48 Q50 48 50 52 Q50 56 46 56 L18 56 Q14 56 14 52Z', '#d4c8a8') +
    // Text lines
    rc(22, 20, 20, 2, '#88bbcc') +
    rc(22, 26, 18, 2, '#88bbcc') +
    rc(22, 32, 20, 2, '#88bbcc') +
    rc(22, 38, 16, 2, '#88bbcc') +
    // Glowing seal
    ci(36, 42, 4, '#44dddd') +
    // Seal inner glow
    ci(36, 42, 2, '#aaffff') +
    // Spirit energy wisps
    p('M12 20 Q8 16 10 12 Q12 16 14 18Z', '#66eeff') +
    p('M52 20 Q56 16 54 12 Q52 16 50 18Z', '#66eeff') +
    // Cyan glow around scroll
    p('M14 30 Q10 30 10 26 Q10 30 14 32Z', '#44ccdd')
  ),

  // ── COMMON RELICS ──

  frozen_dart: C(
    // Shuriken body - 4 pointed star
    p('M32 4 L38 26 L60 32 L38 38 L32 60 L26 38 L4 32 L26 26Z', '#88ccee') +
    // Inner star
    p('M32 14 L36 28 L50 32 L36 36 L32 50 L28 36 L14 32 L28 28Z', '#aaddff') +
    // Center
    ci(32, 32, 5, '#cceeff') +
    // Center crystal
    ci(32, 32, 3, '#e8f4ff') +
    // Ice cracks
    p('M32 4 L33 14 L31 14Z', '#66aacc') +
    p('M60 32 L50 33 L50 31Z', '#66aacc') +
    p('M32 60 L33 50 L31 50Z', '#66aacc') +
    p('M4 32 L14 33 L14 31Z', '#66aacc') +
    // Frost particles
    ci(20, 16, 2, '#ddeeff') +
    ci(44, 16, 2, '#ddeeff') +
    ci(44, 48, 2, '#ddeeff') +
    ci(20, 48, 2, '#ddeeff')
  ),

  thick_hide: C(
    // Hide body
    p('M12 14 Q8 20 10 32 Q12 46 16 52 Q24 56 32 56 Q40 56 48 52 Q52 46 54 32 Q56 20 52 14 Q44 10 32 8 Q20 10 12 14Z', '#8b6b3e') +
    // Inner lighter area
    p('M16 18 Q14 26 16 36 Q18 46 24 50 Q28 52 32 52 Q36 52 40 50 Q46 46 48 36 Q50 26 48 18 Q42 14 32 12 Q22 14 16 18Z', '#a07d4e') +
    // Texture lines
    p('M20 24 Q26 22 32 24 Q38 26 44 24', '#7a5c30') +
    p('M18 32 Q24 30 32 32 Q40 34 46 32', '#7a5c30') +
    p('M20 40 Q26 38 34 40 Q40 42 44 40', '#7a5c30') +
    // Edge stitching
    ci(16, 20, 1.5, '#5a4020') +
    ci(20, 14, 1.5, '#5a4020') +
    ci(44, 14, 1.5, '#5a4020') +
    ci(48, 20, 1.5, '#5a4020') +
    // Thickness visible on edge
    p('M12 14 Q10 14 10 16 Q12 16 14 14Z', '#6b5230') +
    // Center tough spot
    ci(32, 32, 4, '#967048') +
    // Highlight
    p('M28 18 Q32 16 36 18 Q34 20 30 20Z', '#b89060')
  ),

  holy_charm: C(
    // Talisman body
    p('M22 10 L42 10 L44 48 L20 48Z', '#f5e6c8') +
    // Top string hole
    ci(32, 8, 3, '#d4c8a8') +
    // String
    p('M32 5 Q28 2 24 4 Q28 3 32 5Z', '#cc9944') +
    // Cross symbol
    rc(29, 18, 6, 20, '#d4af37') +
    rc(24, 24, 16, 6, '#d4af37') +
    // Cross center jewel
    ci(32, 27, 3, '#ffee88') +
    // Border decoration
    rc(22, 12, 20, 2, '#d4af37') +
    rc(22, 44, 20, 2, '#d4af37') +
    rc(22, 12, 2, 34, '#d4af37') +
    rc(40, 12, 2, 34, '#d4af37') +
    // Corner accents
    ci(24, 14, 1.5, '#f0d866') +
    ci(40, 14, 1.5, '#f0d866') +
    // Holy glow
    ci(32, 27, 5, '#fff8cc')
  ),

  spiked_armor: C(
    // Chest plate body
    p('M16 16 Q14 20 14 32 Q14 48 20 52 L32 56 L44 52 Q50 48 50 32 Q50 20 48 16Z', '#667788') +
    // Inner plate
    p('M20 20 Q18 24 18 32 Q18 44 24 48 L32 52 L40 48 Q46 44 46 32 Q46 24 44 20Z', '#778899') +
    // Center ridge
    p('M30 18 L34 18 L34 50 L30 50Z', '#8899aa') +
    // Spike top
    p('M32 16 L36 6 L28 6Z', '#556677') +
    // Spike left
    p('M14 28 L4 24 L14 32Z', '#556677') +
    // Spike right
    p('M50 28 L60 24 L50 32Z', '#556677') +
    // Spike lower left
    p('M16 40 L6 42 L16 44Z', '#556677') +
    // Spike lower right
    p('M48 40 L58 42 L48 44Z', '#556677') +
    // Neck guard
    p('M22 16 Q32 12 42 16 Q38 14 32 13 Q26 14 22 16Z', '#778899') +
    // Plate highlight
    p('M22 22 L24 22 L24 44 L22 44Z', '#8899aa') +
    // Rivet
    ci(32, 32, 2, '#556677')
  ),

  sturdy_boots: C(
    // Left boot body
    p('M10 20 L10 46 L6 48 L6 54 L24 54 L24 46 L22 20Z', '#5c3a1e') +
    // Right boot body
    p('M34 20 L34 46 L30 48 L30 54 L48 54 L48 46 L46 20Z', '#5c3a1e') +
    // Left boot top cuff
    p('M8 18 L24 18 L24 24 L8 24Z', '#7a4e2e') +
    // Right boot top cuff
    p('M32 18 L48 18 L48 24 L32 24Z', '#7a4e2e') +
    // Left sole
    rc(4, 54, 22, 4, '#3a2410') +
    // Right sole
    rc(28, 54, 22, 4, '#3a2410') +
    // Left boot highlight
    p('M14 24 L16 24 L16 46 L14 46Z', '#6e462a') +
    // Right boot highlight
    p('M38 24 L40 24 L40 46 L38 46Z', '#6e462a') +
    // Left lace
    p('M12 28 L20 28 M12 34 L20 34 M12 40 L20 40', '#8b6914') +
    // Right lace
    p('M36 28 L44 28 M36 34 L44 34 M36 40 L44 40', '#8b6914') +
    // Metal toe cap left
    p('M6 50 Q10 48 24 50 L24 54 L6 54Z', '#888888') +
    // Metal toe cap right
    p('M30 50 Q34 48 48 50 L48 54 L30 54Z', '#888888')
  ),

  kinetic_belt: C(
    // Belt body
    p('M6 26 Q4 32 6 38 L58 38 Q60 32 58 26Z', '#2a6e2a') +
    // Belt inner
    p('M8 28 Q6 32 8 36 L56 36 Q58 32 56 28Z', '#3a8e3a') +
    // Buckle frame
    rc(10, 24, 12, 16, '#888888') +
    // Buckle inner
    rc(12, 26, 8, 12, '#aaaaaa') +
    // Buckle prong
    rc(18, 26, 2, 12, '#888888') +
    // Energy node 1
    ci(30, 32, 3, '#66ff66') +
    // Energy node 2
    ci(40, 32, 3, '#44dd44') +
    // Energy node 3
    ci(50, 32, 3, '#66ff66') +
    // Energy line connecting nodes
    rc(30, 31, 20, 2, '#44cc44') +
    // Belt holes
    ci(34, 32, 1, '#2a5e2a') +
    ci(38, 32, 1, '#2a5e2a') +
    ci(42, 32, 1, '#2a5e2a') +
    // Energy glow
    ci(40, 32, 5, '#88ff8844')
  ),

  // ── UNCOMMON RELICS ──

  rich_seal: C(
    // Seal body
    ci(32, 32, 22, '#d4af37') +
    // Inner ring
    ci(32, 32, 18, '#e8cc66') +
    // Center shield
    p('M24 20 L40 20 L42 38 L32 46 L22 38Z', '#d4af37') +
    // Shield inner
    p('M26 22 L38 22 L40 36 L32 42 L24 36Z', '#f0d866') +
    // Coin stack left
    ci(14, 50, 5, '#d4af37') +
    ci(14, 47, 5, '#e8cc66') +
    ci(14, 44, 5, '#d4af37') +
    // Coin stack right
    ci(50, 50, 5, '#d4af37') +
    ci(50, 47, 5, '#e8cc66') +
    // Dollar/S symbol on shield
    p('M30 26 Q34 24 36 26 Q34 28 30 30 Q34 32 36 34 Q34 36 30 38', '#aa8822') +
    rc(31, 24, 2, 16, '#aa8822') +
    // Edge notches
    ci(32, 10, 2, '#c49b2f') +
    ci(32, 54, 2, '#c49b2f')
  ),

  herb_pouch: C(
    // Pouch body
    p('M18 28 Q16 38 18 48 Q22 56 32 56 Q42 56 46 48 Q48 38 46 28Z', '#8b6b3e') +
    // Pouch gathered top
    p('M20 28 Q26 24 32 22 Q38 24 44 28 Q38 26 32 25 Q26 26 20 28Z', '#7a5c30') +
    // Tie string
    p('M28 24 Q30 20 32 18 Q34 20 36 24', '#5a4020') +
    // Herb 1 - leaf sticking out
    p('M28 22 Q24 16 20 10 Q22 14 26 18Z', '#44aa44') +
    // Herb 2 - another leaf
    p('M36 22 Q40 14 44 10 Q40 16 38 20Z', '#55bb55') +
    // Herb 3 - flower
    ci(32, 16, 3, '#dd88cc') +
    ci(32, 16, 1.5, '#ffaadd') +
    // Herb stem
    p('M32 18 L32 22', '#338833') +
    // Pouch texture
    p('M22 34 Q32 32 42 34', '#7a5c30') +
    p('M22 42 Q32 40 42 42', '#7a5c30') +
    // Cross stitching
    p('M24 36 L28 40 M28 36 L24 40', '#5a4020') +
    // Pouch shadow
    p('M20 48 Q28 54 40 52 Q44 48 44 44 Q38 52 28 52 Q22 50 20 48Z', '#6b5230')
  ),

  fury_banner: C(
    // Pole
    rc(12, 4, 3, 56, '#8b6914') +
    // Pole top finial
    p('M13.5 4 L10 2 L17 2Z', '#aa8822') +
    // Banner body
    p('M15 8 L52 12 L48 32 L52 52 L15 48Z', '#cc2222') +
    // Banner darker fold
    p('M15 8 L20 10 L20 46 L15 48Z', '#aa1818') +
    // Banner inner fold
    p('M30 14 L48 18 L46 32 L48 46 L30 44Z', '#dd3333') +
    // Skull/rage symbol
    ci(34, 30, 6, '#ffcc44') +
    // Symbol inner
    p('M30 28 L34 24 L38 28 L36 34 L32 36 L28 34Z', '#ee4444') +
    // Banner fringe bottom
    p('M15 48 L20 52 L28 48 L36 52 L44 48 L52 52 L52 54 L15 50Z', '#aa1818') +
    // Wind ripple lines
    p('M22 20 Q30 18 40 20', '#bb2020') +
    p('M22 40 Q32 38 44 40', '#bb2020') +
    // Tattered edge
    p('M48 18 Q52 16 50 12 L52 12Z', '#cc2222')
  ),

  soul_lantern: C(
    // Handle arch
    p('M22 8 Q22 2 32 2 Q42 2 42 8 L40 10 Q40 6 32 6 Q24 6 24 10Z', '#888888') +
    // Lantern top
    p('M22 12 L42 12 L40 16 L24 16Z', '#777777') +
    // Lantern body (glass)
    p('M24 16 L40 16 L42 44 L22 44Z', '#224466') +
    // Soul flame
    p('M32 20 Q36 26 36 32 Q36 38 32 40 Q28 38 28 32 Q28 26 32 20Z', '#44dddd') +
    // Inner flame
    p('M32 24 Q34 28 34 32 Q34 36 32 38 Q30 36 30 32 Q30 28 32 24Z', '#aaffff') +
    // Flame core
    ci(32, 30, 3, '#ffffff') +
    // Lantern base
    p('M22 44 L42 44 L40 48 L24 48Z', '#777777') +
    // Base bottom
    rc(26, 48, 12, 3, '#666666') +
    // Glass panel lines
    p('M30 16 L29 44', '#336688') +
    p('M34 16 L35 44', '#336688') +
    // Ghost wisps
    p('M20 24 Q16 20 18 14', '#66eeff') +
    p('M44 24 Q48 20 46 14', '#66eeff') +
    // Glow effect
    ci(32, 32, 10, '#44dddd33')
  ),

  phoenix_feather: C(
    // Feather shaft
    p('M32 58 Q30 40 28 30 Q26 20 30 10 Q32 6 34 10 Q36 16 34 24', '#aa6622') +
    // Left barbs lower
    p('M28 40 Q18 44 12 40 Q18 38 24 36 Q26 38 28 40Z', '#ff4422') +
    // Right barbs lower
    p('M34 36 Q44 40 52 36 Q44 34 38 32 Q36 34 34 36Z', '#ff4422') +
    // Left barbs mid
    p('M26 30 Q16 32 10 28 Q16 26 22 24 Q24 26 26 30Z', '#ff6622') +
    // Right barbs mid
    p('M34 26 Q44 28 50 24 Q44 22 38 20 Q36 22 34 26Z', '#ff6622') +
    // Left barbs upper
    p('M28 20 Q20 20 14 16 Q20 14 24 14 Q26 16 28 20Z', '#ffaa22') +
    // Right barbs upper
    p('M34 16 Q42 14 46 10 Q42 10 38 12 Q36 14 34 16Z', '#ffaa22') +
    // Feather tip
    p('M30 10 Q32 4 34 10 Q33 8 32 6 Q31 8 30 10Z', '#ffcc44') +
    // Central vein highlight
    p('M31 14 L31 50 L32 50 L32 14Z', '#cc7722') +
    // Ember particles
    ci(16, 34, 2, '#ffcc44') +
    ci(48, 28, 2, '#ffcc44') +
    ci(22, 18, 1.5, '#ffdd66')
  ),

  storm_banner: C(
    // Pole
    rc(12, 4, 3, 56, '#666688') +
    // Pole top crystal
    p('M13.5 4 L10 1 L17 1Z', '#8866cc') +
    // Banner body
    p('M15 8 L52 12 L48 32 L52 52 L15 48Z', '#4422aa') +
    // Banner darker fold
    p('M15 8 L20 10 L20 46 L15 48Z', '#331888') +
    // Lightning bolt on banner
    p('M30 16 L38 26 L34 26 L42 40 L32 30 L36 30 L28 18Z', '#ffdd44') +
    // Lightning glow
    p('M32 20 L36 28 L34 28 L38 36 L34 30 L36 30 L30 22Z', '#ffee88') +
    // Storm cloud top
    p('M22 14 Q26 10 34 12 Q40 10 44 14 Q42 12 36 12 Q30 10 22 14Z', '#556688') +
    // Banner fringe
    p('M15 48 L20 52 L28 48 L36 52 L44 48 L52 52 L52 54 L15 50Z', '#331888') +
    // Rain streaks
    p('M26 36 L24 42', '#8888cc') +
    p('M38 34 L36 40', '#8888cc') +
    p('M44 38 L42 44', '#8888cc') +
    // Wind ripple
    p('M22 24 Q30 22 40 24', '#5533bb')
  ),

  // ── RARE RELICS ──

  hourglass: C(
    // Top frame
    rc(16, 6, 32, 4, '#d4af37') +
    // Bottom frame
    rc(16, 54, 32, 4, '#d4af37') +
    // Top glass bulb
    p('M20 10 Q20 28 32 32 Q44 28 44 10Z', '#ddeeee') +
    // Bottom glass bulb
    p('M20 54 Q20 36 32 32 Q44 36 44 54Z', '#ddeeee') +
    // Sand in top (partial)
    p('M24 10 Q24 22 32 26 Q40 22 40 10Z', '#e8c84a') +
    // Sand in bottom (accumulated)
    p('M22 54 Q22 44 32 40 Q42 44 42 54Z', '#e8c84a') +
    // Sand stream
    rc(31, 28, 2, 12, '#e8c84a') +
    // Glass shine left
    p('M22 12 L23 12 L23 26 L22 24Z', '#eef8ff') +
    // Frame decorations
    ci(18, 8, 2, '#e8cc66') +
    ci(46, 8, 2, '#e8cc66') +
    ci(18, 56, 2, '#e8cc66') +
    ci(46, 56, 2, '#e8cc66') +
    // Frame connectors
    rc(18, 10, 2, 44, '#c49b2f') +
    rc(44, 10, 2, 44, '#c49b2f')
  ),

  demon_seal: C(
    // Outer dark circle
    ci(32, 32, 24, '#1a0a0a') +
    // Red ring
    ci(32, 32, 20, '#881111') +
    // Inner dark
    ci(32, 32, 16, '#220808') +
    // Pentagram lines
    p('M32 14 L42 44 L18 26 L46 26 L22 44Z', '#cc2222') +
    // Center eye
    p('M26 30 Q32 24 38 30 Q32 36 26 30Z', '#ff3333') +
    // Eye pupil
    ci(32, 30, 3, '#ffcc00') +
    // Pupil slit
    rc(31.5, 27, 1, 6, '#110000') +
    // Demonic runes around
    p('M32 10 L34 12 L30 12Z', '#cc4444') +
    p('M50 26 L52 28 L48 28Z', '#cc4444') +
    p('M50 38 L52 40 L48 40Z', '#cc4444') +
    p('M14 26 L16 28 L12 28Z', '#cc4444') +
    p('M14 38 L16 40 L12 40Z', '#cc4444') +
    // Dark aura
    ci(32, 32, 22, '#33000033')
  ),

  eternal_hourglass: C(
    // Ornate top frame
    p('M14 6 L50 6 L48 10 L16 10Z', '#d4af37') +
    // Ornate bottom frame
    p('M14 58 L50 58 L48 54 L16 54Z', '#d4af37') +
    // Top bulb
    p('M18 10 Q18 28 32 32 Q46 28 46 10Z', '#aaccdd') +
    // Bottom bulb
    p('M18 54 Q18 36 32 32 Q46 36 46 54Z', '#aaccdd') +
    // Glowing sand top
    p('M22 10 Q22 22 32 26 Q42 22 42 10Z', '#88ddff') +
    // Glowing sand bottom
    p('M20 54 Q20 42 32 38 Q44 42 44 54Z', '#66bbee') +
    // Magic stream
    rc(31, 26, 2, 12, '#aaeeff') +
    // Glow particles
    ci(32, 30, 2, '#ffffff') +
    ci(28, 46, 1.5, '#aaeeff') +
    ci(36, 48, 1.5, '#aaeeff') +
    // Frame jewels
    ci(14, 6, 3, '#ff4488') +
    ci(50, 6, 3, '#ff4488') +
    ci(14, 58, 3, '#4488ff') +
    ci(50, 58, 3, '#4488ff') +
    // Ornate side pillars
    rc(16, 10, 3, 44, '#e8cc66') +
    rc(45, 10, 3, 44, '#e8cc66')
  ),

  storm_core: C(
    // Outer energy field
    ci(32, 32, 24, '#1a1a3e') +
    // Mid glow
    ci(32, 32, 18, '#332266') +
    // Core orb
    ci(32, 32, 12, '#6644aa') +
    // Inner core
    ci(32, 32, 8, '#8866cc') +
    // Bright center
    ci(32, 30, 4, '#aa88ee') +
    // Highlight
    ci(29, 27, 2, '#ddbbff') +
    // Lightning bolt 1
    p('M32 8 L34 20 L30 22 L36 32', '#44aaff') +
    // Lightning bolt 2
    p('M52 22 L42 26 L44 30 L36 32', '#44aaff') +
    // Lightning bolt 3
    p('M12 38 L22 34 L20 30 L28 32', '#44aaff') +
    // Lightning bolt 4
    p('M42 52 L38 42 L42 40 L36 34', '#44aaff') +
    // Electric sparks
    ci(20, 16, 2, '#88ccff') +
    ci(46, 44, 2, '#88ccff') +
    ci(18, 46, 1.5, '#88ccff')
  ),

  champion_belt: C(
    // Belt strap
    p('M4 28 Q4 36 8 38 L56 38 Q60 36 60 28 Q60 24 56 24 L8 24 Q4 24 4 28Z', '#8b6914') +
    // Belt inner
    p('M8 26 Q6 30 8 34 L56 34 Q58 30 56 26Z', '#a07828') +
    // Center plate
    p('M20 20 L44 20 L46 42 L18 42Z', '#d4af37') +
    // Plate inner
    p('M22 22 L42 22 L44 40 L20 40Z', '#f0d866') +
    // Center gem
    ci(32, 31, 6, '#ff2244') +
    // Gem highlight
    ci(30, 29, 2.5, '#ff6688') +
    // Gem sparkle
    ci(29, 27, 1, '#ffaacc') +
    // Side rivets
    ci(12, 31, 2, '#c49b2f') +
    ci(52, 31, 2, '#c49b2f') +
    // Decorative corners
    ci(22, 22, 2, '#e8cc66') +
    ci(42, 22, 2, '#e8cc66') +
    ci(22, 40, 2, '#e8cc66') +
    ci(42, 40, 2, '#e8cc66') +
    // Star engrave on plate
    p('M32 24 L34 28 L38 28 L35 31 L36 35 L32 33 L28 35 L29 31 L26 28 L30 28Z', '#c49b2f')
  ),

  // ── ELITE RELICS ──

  war_drum: C(
    // Drum body
    p('M14 22 Q14 42 14 46 Q18 52 32 52 Q46 52 50 46 Q50 42 50 22Z', '#8b4513') +
    // Drum top skin
    p('M14 22 Q18 16 32 16 Q46 16 50 22 Q46 26 32 26 Q18 26 14 22Z', '#e8d8b0') +
    // Drum body highlight
    p('M16 24 L16 44 Q18 48 26 50 L26 26 Q18 24 16 24Z', '#a05a1e') +
    // Drum body bands
    p('M14 30 Q18 28 32 28 Q46 28 50 30 Q46 32 32 32 Q18 32 14 30Z', '#cc8844') +
    p('M14 40 Q18 38 32 38 Q46 38 50 40 Q46 42 32 42 Q18 42 14 40Z', '#cc8844') +
    // Left drumstick
    p('M4 8 L8 12 L24 28 L22 30 L6 14 L2 10Z', '#d4af37') +
    // Right drumstick
    p('M60 8 L56 12 L40 28 L42 30 L58 14 L62 10Z', '#d4af37') +
    // Stick ball left
    ci(5, 9, 3, '#e8cc66') +
    // Stick ball right
    ci(59, 9, 3, '#e8cc66') +
    // Rope details
    p('M18 26 L22 46', '#8b6914') +
    p('M46 26 L42 46', '#8b6914')
  ),

  trophy_necklace: C(
    // Necklace cord
    p('M8 12 Q12 8 20 6 Q28 4 32 4 Q36 4 44 6 Q52 8 56 12 Q54 16 50 20 Q46 24 40 28 L38 30 Q34 32 32 34 Q30 32 26 30 L24 28 Q18 24 14 20 Q10 16 8 12Z', '#8b6914') +
    // Tooth 1
    p('M16 18 L18 30 L14 30Z', '#f0e6d0') +
    // Tooth 2
    p('M24 14 L26 28 L22 28Z', '#e8dcc4') +
    // Fang center
    p('M30 10 L33 32 L27 32Z', '#f0e6d0') +
    // Tooth 4
    p('M38 14 L40 28 L36 28Z', '#e8dcc4') +
    // Tooth 5
    p('M46 18 L48 30 L44 30Z', '#f0e6d0') +
    // Claw trophy
    p('M32 34 Q28 40 26 48 Q28 46 32 42 Q36 46 38 48 Q36 40 32 34Z', '#aa8866') +
    // Bone bead
    ci(12, 14, 3, '#e8dcc4') +
    ci(52, 14, 3, '#e8dcc4') +
    // Red gem pendant
    ci(32, 38, 4, '#cc2244') +
    ci(32, 38, 2, '#ee4466') +
    // String wraps
    ci(20, 10, 1.5, '#aa7722') +
    ci(44, 10, 1.5, '#aa7722')
  ),

  master_scabbard: C(
    // Scabbard body
    p('M26 6 L38 6 L36 54 L32 60 L28 54Z', '#cc2222') +
    // Gold tip
    p('M28 54 L32 62 L36 54Z', '#d4af37') +
    // Gold mouth
    rc(24, 4, 16, 6, '#d4af37') +
    // Body detail panels
    p('M28 10 L36 10 L34 50 L32 56 L30 50Z', '#dd3333') +
    // Gold band upper
    rc(26, 16, 12, 3, '#e8cc66') +
    // Gold band middle
    rc(27, 30, 10, 3, '#e8cc66') +
    // Gold band lower
    rc(28, 44, 8, 3, '#e8cc66') +
    // Dragon engraving
    p('M30 20 Q28 24 30 28 Q32 24 34 28 Q36 24 34 20', '#aa1818') +
    // Jewel on mouth
    ci(32, 7, 2.5, '#44aaff') +
    ci(32, 7, 1.5, '#88ccff') +
    // Hanging cord
    p('M24 8 Q20 10 18 14 Q16 18 18 22', '#d4af37') +
    ci(18, 22, 2, '#e8cc66') +
    // Edge highlight
    p('M28 8 L29 8 L29 52 L28 52Z', '#ee5555')
  ),

  incendiary_round: C(
    // Casing body
    p('M24 28 L24 54 Q24 58 32 58 Q40 58 40 54 L40 28Z', '#c8a832') +
    // Bullet head
    p('M24 28 Q24 14 32 8 Q40 14 40 28Z', '#cc3322') +
    // Bullet tip
    ci(32, 10, 4, '#dd4433') +
    // Tip highlight
    ci(31, 9, 2, '#ee6655') +
    // Casing band
    rc(23, 28, 18, 3, '#aa8822') +
    // Casing highlight
    p('M26 32 L28 32 L28 52 L26 52Z', '#ddc044') +
    // Primer circle
    ci(32, 56, 3, '#888888') +
    // Primer center
    ci(32, 56, 1.5, '#666666') +
    // Fire symbol on bullet
    p('M30 18 Q28 14 30 12 Q32 16 34 12 Q36 14 34 18 Q32 16 30 18Z', '#ff8844') +
    // Heat glow
    ci(32, 16, 6, '#ff664433') +
    // Casing texture
    p('M26 36 L38 36', '#b89828') +
    p('M26 42 L38 42', '#b89828') +
    p('M26 48 L38 48', '#b89828')
  ),

  iron_gauntlet: C(
    // Hand back plate
    p('M18 18 L46 18 L46 38 L42 42 L22 42 L18 38Z', '#778899') +
    // Finger 1 (index)
    p('M20 42 L26 42 L26 56 Q23 58 20 56Z', '#8899aa') +
    // Finger 2 (middle)
    p('M26 42 L34 42 L34 58 Q30 60 26 58Z', '#8899aa') +
    // Finger 3 (ring)
    p('M34 42 L40 42 L40 56 Q37 58 34 56Z', '#8899aa') +
    // Finger 4 (pinky)
    p('M40 42 L46 42 L46 52 Q43 54 40 52Z', '#8899aa') +
    // Thumb
    p('M18 28 L12 32 L10 40 Q12 44 16 42 L18 36Z', '#8899aa') +
    // Knuckle plates
    rc(19, 38, 8, 6, '#667788') +
    rc(27, 38, 8, 6, '#667788') +
    rc(35, 38, 8, 6, '#667788') +
    // Back plate ridges
    rc(18, 22, 28, 3, '#8899aa') +
    rc(18, 28, 28, 3, '#8899aa') +
    rc(18, 34, 28, 3, '#8899aa') +
    // Rivets
    ci(22, 20, 1.5, '#aabbcc') +
    ci(42, 20, 1.5, '#aabbcc') +
    // Wrist guard
    rc(16, 14, 32, 6, '#667788')
  ),

  arcane_focus: C(
    // Lens frame outer
    ci(32, 28, 16, '#d4af37') +
    // Lens glass
    ci(32, 28, 13, '#6644aa') +
    // Lens inner glow
    ci(32, 28, 10, '#8866cc') +
    // Lens bright center
    ci(30, 26, 5, '#aa88ee') +
    // Lens highlight
    ci(28, 24, 2.5, '#ddbbff') +
    // Handle
    p('M28 42 L36 42 L38 58 L26 58Z', '#d4af37') +
    // Handle detail
    rc(30, 44, 4, 12, '#e8cc66') +
    // Rune 1
    p('M26 14 L28 18 L24 18Z', '#ffcc44') +
    // Rune 2
    p('M38 14 L40 18 L36 18Z', '#ffcc44') +
    // Magic particles
    ci(18, 20, 2, '#cc88ff') +
    ci(46, 22, 2, '#cc88ff') +
    ci(22, 38, 1.5, '#cc88ff') +
    ci(42, 36, 1.5, '#cc88ff') +
    // Pupil/Eye in lens
    ci(32, 28, 4, '#ffcc44') +
    rc(31.5, 24, 1, 8, '#331166')
  ),

  blessed_water: C(
    // Bottle body
    p('M24 22 L24 50 Q24 56 32 56 Q40 56 40 50 L40 22Z', '#88bbdd') +
    // Water inside
    p('M25 28 L25 50 Q25 55 32 55 Q39 55 39 50 L39 28Z', '#4488cc') +
    // Cork
    rc(27, 16, 10, 8, '#8b6914') +
    // Bottle neck
    rc(29, 20, 6, 4, '#99ccee') +
    // Cross label
    rc(28, 34, 8, 12, '#d4af37') +
    // Cross on label
    rc(31, 35, 2, 10, '#ffffff') +
    rc(28, 38, 8, 2, '#ffffff') +
    // Glass shine
    p('M25 24 L26 24 L26 48 L25 48Z', '#aaddee') +
    // Holy glow
    ci(32, 40, 8, '#ffee4433') +
    // Water bubbles
    ci(30, 46, 1.5, '#66aadd') +
    ci(34, 42, 1, '#66aadd') +
    // Gold cap
    rc(28, 14, 8, 4, '#d4af37')
  ),

  lethal_poison: C(
    // Bottle body
    p('M22 24 Q20 28 20 36 Q20 48 24 52 Q28 56 32 56 Q36 56 40 52 Q44 48 44 36 Q44 28 42 24Z', '#224422') +
    // Poison liquid
    p('M24 30 Q22 34 22 40 Q22 48 26 52 Q28 54 32 54 Q36 54 38 52 Q42 48 42 40 Q42 34 40 30Z', '#44aa44') +
    // Bottle neck
    rc(28, 16, 8, 10, '#336633') +
    // Cork
    rc(27, 12, 10, 6, '#6b4e2e') +
    // Skull symbol
    ci(32, 38, 5, '#228822') +
    // Skull eyes
    ci(30, 36, 1.5, '#112211') +
    ci(34, 36, 1.5, '#112211') +
    // Skull mouth
    rc(30, 40, 4, 2, '#112211') +
    // Dripping poison
    p('M26 52 Q25 56 26 60', '#66cc66') +
    p('M38 52 Q39 56 38 60', '#66cc66') +
    // Bubbles
    ci(28, 44, 2, '#66dd66') +
    ci(36, 48, 1.5, '#66dd66') +
    // Purple tint vapor
    p('M24 16 Q20 12 22 8', '#8844aa') +
    p('M40 16 Q44 12 42 8', '#8844aa')
  ),

  soul_crystal: C(
    // Outer glow
    ci(32, 32, 22, '#1a3344') +
    // Crystal body
    p('M32 6 L46 22 L46 42 L32 58 L18 42 L18 22Z', '#44bbcc') +
    // Crystal facet left
    p('M32 6 L18 22 L18 42 L32 32Z', '#55ccdd') +
    // Crystal facet right
    p('M32 6 L46 22 L46 42 L32 32Z', '#33aabb') +
    // Crystal facet bottom
    p('M18 42 L32 58 L46 42 L32 32Z', '#44aabb') +
    // Inner glow
    ci(32, 30, 8, '#88eeff') +
    // Core light
    ci(32, 28, 4, '#ccffff') +
    // Bright sparkle
    ci(30, 26, 2, '#ffffff') +
    // Soul wisps inside
    p('M26 34 Q28 28 32 26 Q36 28 38 34', '#99eeff') +
    p('M28 40 Q30 36 34 34 Q38 36 40 40', '#77ddee') +
    // Edge highlights
    p('M32 6 L33 8 L19 22 L18 22Z', '#88eeff') +
    // Floating particles
    ci(22, 16, 1.5, '#aaeeff') +
    ci(44, 18, 1.5, '#aaeeff') +
    ci(20, 48, 1.5, '#aaeeff')
  ),

  // ── BOSS RELICS ──

  energy_core: C(
    // Outer containment ring
    ci(32, 32, 24, '#334455') +
    // Inner containment
    ci(32, 32, 20, '#445566') +
    // Energy field
    ci(32, 32, 16, '#224488') +
    // Core sphere
    ci(32, 32, 10, '#ffcc22') +
    // Core inner
    ci(32, 30, 6, '#ffdd66') +
    // Core highlight
    ci(30, 28, 3, '#ffffaa') +
    // Lightning arc 1
    p('M32 12 Q28 16 26 20 Q30 18 32 16', '#44aaff') +
    // Lightning arc 2
    p('M48 28 Q44 24 40 22 Q44 26 46 30', '#44aaff') +
    // Lightning arc 3
    p('M16 36 Q20 40 24 42 Q20 38 18 34', '#44aaff') +
    // Lightning arc 4
    p('M40 48 Q36 44 34 42 Q38 44 42 46', '#44aaff') +
    // Ring details
    ci(32, 8, 2, '#6688aa') +
    ci(32, 56, 2, '#6688aa') +
    ci(8, 32, 2, '#6688aa') +
    ci(56, 32, 2, '#6688aa')
  ),

  iron_will: C(
    // Heart outline
    p('M32 14 Q24 6 16 14 Q8 22 14 34 Q18 42 32 54 Q46 42 50 34 Q56 22 48 14 Q40 6 32 14Z', '#778899') +
    // Heart inner
    p('M32 18 Q26 12 20 18 Q14 24 18 34 Q22 40 32 48 Q42 40 46 34 Q50 24 44 18 Q38 12 32 18Z', '#8899aa') +
    // Steel texture lines
    p('M22 22 Q28 20 32 22 Q36 24 42 22', '#99aabb') +
    p('M20 30 Q26 28 32 30 Q38 32 44 30', '#99aabb') +
    p('M24 38 Q28 36 32 38 Q36 40 40 38', '#99aabb') +
    // Red glow center
    ci(32, 30, 6, '#cc3344') +
    // Red inner
    ci(32, 28, 3, '#ee5566') +
    // Bright spot
    ci(30, 26, 1.5, '#ff8899') +
    // Bolt/rivet left
    ci(22, 24, 2, '#667788') +
    // Bolt/rivet right
    ci(42, 24, 2, '#667788') +
    // Edge highlight
    p('M32 14 Q26 8 20 14 Q26 10 32 16Z', '#aabbcc') +
    // Crack detail (showing strength)
    p('M28 34 Q30 36 32 34 Q34 32 36 34', '#667788')
  ),

  dragon_scale: C(
    // Scale body
    p('M12 16 Q8 24 10 36 Q14 48 22 54 Q30 58 38 56 Q48 52 54 42 Q58 32 56 22 Q52 14 44 10 Q36 8 28 10 Q18 12 12 16Z', '#1a5a2a') +
    // Scale inner
    p('M16 20 Q14 28 16 38 Q20 46 26 50 Q32 54 38 52 Q46 48 50 40 Q54 32 52 24 Q48 18 42 14 Q36 12 30 14 Q22 16 16 20Z', '#2a7a3a') +
    // Scale ridge lines
    p('M18 24 Q26 20 36 22 Q44 24 50 28', '#1a6a2a') +
    p('M16 32 Q24 28 34 30 Q44 32 52 34', '#1a6a2a') +
    p('M18 40 Q26 36 36 38 Q44 40 50 42', '#1a6a2a') +
    // Gold edge
    p('M12 16 Q18 12 28 10 Q36 8 44 10 Q48 12 52 14 Q50 16 44 12 Q36 10 28 12 Q20 14 14 18Z', '#d4af37') +
    // Gold edge bottom
    p('M22 54 Q30 58 38 56 Q42 54 46 50 Q42 56 36 58 Q28 58 22 54Z', '#d4af37') +
    // Scale texture bump
    ci(30, 28, 3, '#3a8a4a') +
    ci(38, 34, 3, '#3a8a4a') +
    ci(28, 40, 3, '#3a8a4a') +
    // Highlight
    p('M20 20 Q26 16 34 18 Q30 20 22 22Z', '#4aaa5a')
  ),

  warriors_heart: C(
    // Heart shape
    p('M32 14 Q24 4 14 14 Q4 24 14 38 Q22 48 32 58 Q42 48 50 38 Q60 24 50 14 Q40 4 32 14Z', '#cc2222') +
    // Heart inner highlight
    p('M32 18 Q26 10 18 18 Q10 26 18 36 Q24 44 32 52 Q40 44 46 36 Q54 26 46 18 Q38 10 32 18Z', '#dd3333') +
    // Fire top left
    p('M18 14 Q14 8 16 2 Q18 8 20 12Z', '#ff6622') +
    // Fire top right
    p('M46 14 Q50 8 48 2 Q46 8 44 12Z', '#ff6622') +
    // Fire left
    p('M10 26 Q4 20 6 14 Q8 20 12 24Z', '#ff8844') +
    // Fire right
    p('M54 26 Q60 20 58 14 Q56 20 52 24Z', '#ff8844') +
    // Heart center glow
    ci(32, 32, 8, '#ff4444') +
    // Inner fire
    ci(32, 30, 4, '#ff8844') +
    // Bright core
    ci(31, 28, 2, '#ffcc66') +
    // Pulse lines
    p('M20 28 L24 28 L26 24 L28 32 L30 26 L32 30', '#ff8866') +
    // Arterial details
    p('M32 42 L30 48 L28 44', '#aa1818') +
    p('M32 42 L34 48 L36 44', '#aa1818')
  ),

  doom_ring: C(
    // Outer dark aura
    ci(32, 32, 26, '#1a0a20') +
    // Ring body outer
    ci(32, 32, 20, '#333344') +
    // Ring hole
    ci(32, 32, 12, '#0a0510') +
    // Ring metal highlight
    p('M12 32 Q12 20 20 14 Q28 10 32 12 Q24 12 18 18 Q12 24 14 32Z', '#555566') +
    // Dark gem on ring
    ci(32, 12, 5, '#8822aa') +
    // Gem inner
    ci(32, 12, 3, '#aa44cc') +
    // Gem glow
    ci(31, 11, 1.5, '#cc88ee') +
    // Ominous runes around ring
    p('M14 26 L16 22 L18 26Z', '#8822aa') +
    p('M46 26 L48 22 L50 26Z', '#8822aa') +
    p('M14 38 L16 42 L18 38Z', '#8822aa') +
    p('M46 38 L48 42 L50 38Z', '#8822aa') +
    // Purple energy wisps
    p('M24 8 Q20 4 22 2', '#aa44cc') +
    p('M40 8 Q44 4 42 2', '#aa44cc') +
    // Inner darkness
    ci(32, 32, 10, '#05020a') +
    // Sinister eye in center
    p('M26 32 Q32 26 38 32 Q32 38 26 32Z', '#6622aa') +
    ci(32, 32, 2, '#cc44ff')
  ),

  adrenaline_surge: C(
    // Syringe barrel
    p('M26 12 L38 12 L38 44 L26 44Z', '#ccddcc') +
    // Plunger top
    rc(29, 4, 6, 10, '#888888') +
    // Plunger handle
    rc(24, 2, 16, 4, '#999999') +
    // Liquid (green/red gradient effect)
    p('M27 20 L37 20 L37 42 L27 42Z', '#44cc44') +
    // Red portion of liquid
    p('M27 32 L37 32 L37 42 L27 42Z', '#cc3322') +
    // Needle
    rc(31, 44, 2, 14, '#cccccc') +
    // Needle tip
    p('M31 58 L33 58 L32 62Z', '#aaaaaa') +
    // Barrel markings
    p('M26 22 L28 22', '#aabbaa') +
    p('M26 28 L28 28', '#aabbaa') +
    p('M26 34 L28 34', '#aabbaa') +
    p('M26 40 L28 40', '#aabbaa') +
    // Syringe flange
    rc(22, 44, 20, 3, '#aaaaaa') +
    // Glass shine
    p('M28 14 L29 14 L29 42 L28 42Z', '#eeffee') +
    // Energy burst left
    p('M22 28 L16 24 L22 32Z', '#ffcc22') +
    // Energy burst right
    p('M42 28 L48 24 L42 32Z', '#ffcc22')
  ),
};

// ─── EVENT ENCOUNTER ICONS ───────────────────────────────────────────

export const EVENT_SVG: Record<string, string> = {

  // 🗿 낡은 제단 — ancient stone altar
  old_altar: C(
    rc(12, 36, 40, 6, '#6B6B6B') +
    rc(16, 28, 32, 8, '#7D7D7D') +
    rc(22, 18, 20, 10, '#8A8A8A') +
    p('M28 12 L32 4 L36 12 Z', '#B0A0D0') +
    rc(24, 14, 16, 4, '#9A9A9A') +
    ci(32, 8, 3, '#D4B0FF') +
    ci(32, 8, 1.5, '#F0E0FF') +
    rc(10, 42, 44, 4, '#5A5A5A') +
    rc(14, 46, 36, 4, '#4A4A4A') +
    p('M20 28 L20 36 M44 28 L44 36', '#555555') +
    ci(26, 32, 1, '#B0A0D0') +
    ci(38, 32, 1, '#B0A0D0')
  ),

  // 🏆 황금 우상 — golden idol statue
  golden_idol: C(
    rc(22, 44, 20, 6, '#8B7332') +
    rc(18, 50, 28, 4, '#6B5322') +
    p('M26 44 L28 30 L36 30 L38 44 Z', '#FFD700') +
    p('M28 30 L30 20 L34 20 L36 30 Z', '#FFC800') +
    ci(32, 16, 6, '#FFD700') +
    ci(32, 16, 4, '#FFE44D') +
    ci(30, 15, 1, '#FFF8B0') +
    ci(34, 15, 1, '#FFF8B0') +
    p('M30 18 L34 18', '#CC9900') +
    p('M24 30 L20 38 M40 30 L44 38', '#FFD700') +
    ci(32, 12, 1.5, '#FFF8B0') +
    rc(26, 50, 12, 2, '#FFD700')
  ),

  // ⚗️ 비밀 실험실 — alchemy lab flask
  secret_lab: C(
    rc(8, 50, 48, 6, '#3A3A3A') +
    p('M26 20 L26 32 L18 48 L46 48 L38 32 L38 20 Z', '#D4EDDA') +
    p('M26 32 L18 48 L46 48 L38 32 Z', '#28A745') +
    rc(24, 14, 16, 6, '#AAAAAA') +
    rc(26, 12, 12, 4, '#CCCCCC') +
    ci(28, 40, 3, '#50FF50') +
    ci(36, 42, 2, '#80FF80') +
    ci(32, 38, 2.5, '#40DD40') +
    ci(24, 44, 1.5, '#90FF90') +
    p('M30 10 Q32 4 34 10', '#90EE90') +
    p('M28 8 Q30 2 32 8', '#70DD70') +
    ci(38, 36, 1.5, '#B0FFB0')
  ),

  // 🕳️ 저주받은 동굴 — dark cave entrance
  cursed_cavern: C(
    p('M4 56 Q8 20 32 12 Q56 20 60 56 Z', '#4A3060') +
    p('M10 56 Q14 28 32 20 Q50 28 54 56 Z', '#2A1040') +
    p('M16 56 Q20 36 32 28 Q44 36 48 56 Z', '#1A0828') +
    p('M22 56 L32 36 L42 56 Z', '#0D0418') +
    ci(26, 38, 2, '#9040D0') +
    ci(38, 40, 1.5, '#8030C0') +
    p('M8 52 L12 46 L16 52', '#5A3870') +
    p('M48 52 L52 46 L56 52', '#5A3870') +
    ci(32, 32, 1, '#B060FF') +
    ci(20, 44, 1, '#7030A0') +
    ci(44, 42, 1, '#7030A0') +
    p('M4 56 L60 56', '#3A2050')
  ),

  // 🩸 부상당한 용병 — bandaged warrior
  wounded_mercenary: C(
    ci(32, 16, 8, '#D4A574') +
    rc(26, 24, 12, 18, '#8B6914') +
    rc(24, 24, 4, 14, '#D4A574') +
    rc(36, 24, 4, 14, '#D4A574') +
    rc(28, 42, 4, 12, '#6B4914') +
    rc(32, 42, 4, 12, '#6B4914') +
    p('M28 12 L36 12 L36 16 L28 16 Z', '#EEEEEE') +
    ci(29, 15, 1.5, '#333333') +
    ci(35, 15, 1.5, '#333333') +
    rc(30, 28, 4, 6, '#CC2200') +
    p('M26 30 L22 32 L24 28 Z', '#CC2200') +
    rc(28, 10, 8, 2, '#EEEEEE') +
    ci(38, 30, 2, '#CC2200')
  ),

  // 💧 치유의 샘 — spring water pool
  healing_spring: C(
    p('M8 40 Q16 28 32 26 Q48 28 56 40 Q56 52 32 54 Q8 52 8 40 Z', '#66CCFF') +
    p('M12 42 Q20 32 32 30 Q44 32 52 42 Q50 50 32 50 Q14 50 12 42 Z', '#88DDFF') +
    ci(32, 38, 8, '#AAEEFF') +
    ci(32, 38, 4, '#CCFFFF') +
    p('M30 18 Q32 10 34 18', '#88DDFF') +
    p('M26 22 Q28 16 30 22', '#AAEEFF') +
    p('M34 20 Q36 14 38 22', '#AAEEFF') +
    ci(24, 36, 1.5, '#FFFFFF') +
    ci(40, 40, 1, '#FFFFFF') +
    ci(32, 34, 1, '#FFFFFF') +
    ci(28, 42, 1, '#FFFFFF') +
    ci(36, 36, 0.8, '#FFFFFF')
  ),

  // 📜 고대의 기록 — ancient scroll/book
  ancient_tome: C(
    p('M14 12 Q12 10 12 14 L12 50 Q12 54 16 54 L48 54 Q52 54 52 50 L52 14 Q52 10 48 12 Z', '#C4A265') +
    rc(16, 14, 32, 38, '#E8D5A8') +
    rc(18, 18, 28, 2, '#8B6914') +
    rc(18, 24, 28, 2, '#8B6914') +
    rc(18, 30, 20, 2, '#8B6914') +
    rc(18, 36, 24, 2, '#8B6914') +
    rc(18, 42, 28, 2, '#8B6914') +
    ci(42, 34, 4, '#FFD700') +
    p('M40 32 L44 32 M42 30 L42 36', '#CC9900') +
    p('M12 12 Q12 16 16 16 L48 16 Q52 16 52 12', '#B08840') +
    rc(14, 48, 36, 2, '#B0944A')
  ),

  // 🪙 오래된 동전 — old coin
  old_coin: C(
    ci(32, 32, 20, '#B8860B') +
    ci(32, 32, 17, '#DAA520') +
    ci(32, 32, 14, '#FFD700') +
    ci(32, 32, 12, '#FFDF40') +
    p('M26 22 L28 20 L32 28 L36 20 L38 22 L34 30 L38 38 L36 40 L32 32 L28 40 L26 38 L30 30 Z', '#DAA520') +
    ci(32, 30, 4, '#FFE860') +
    p('M18 32 Q18 18 32 18', '#FFE860') +
    p('M46 32 Q46 46 32 46', '#B8860B') +
    ci(24, 24, 1.5, '#FFF8B0') +
    ci(40, 40, 1, '#8B6914') +
    rc(28, 44, 8, 2, '#B8860B')
  ),

  // 💼 떠돌이 상인 — merchant's bag
  merchant_deal: C(
    p('M16 28 L16 52 L48 52 L48 28 Z', '#8B4513') +
    p('M16 28 Q32 22 48 28', '#A0522D') +
    rc(18, 30, 28, 20, '#A0522D') +
    p('M24 20 Q32 14 40 20 L40 28 L24 28 Z', '#6B3410') +
    rc(28, 24, 8, 6, '#DAA520') +
    ci(32, 27, 2, '#FFD700') +
    rc(20, 34, 24, 2, '#6B3410') +
    rc(14, 52, 36, 4, '#654321') +
    ci(20, 42, 3, '#FFD700') +
    ci(44, 42, 3, '#FFD700') +
    p('M30 26 L34 26', '#FFE860')
  ),

  // 🎁 수상한 보물함 — ornate mystery chest
  mysterious_chest: C(
    rc(10, 30, 44, 24, '#6A0DAD') +
    rc(10, 28, 44, 6, '#8B00FF') +
    rc(8, 26, 48, 4, '#9B30FF') +
    rc(28, 32, 8, 8, '#FFD700') +
    ci(32, 36, 3, '#FFE44D') +
    p('M10 30 L10 54 L54 54 L54 30', '#5A0D9D') +
    rc(12, 34, 4, 4, '#FFD700') +
    rc(48, 34, 4, 4, '#FFD700') +
    p('M32 24 L28 18 L36 18 Z', '#DA70D6') +
    ci(32, 20, 2, '#FFD700') +
    rc(12, 44, 40, 2, '#5A0D9D') +
    rc(8, 54, 48, 3, '#4A0080')
  ),

  // ⛺ 버려진 야영지 — abandoned tent
  abandoned_camp: C(
    rc(4, 50, 56, 6, '#3B5B28') +
    p('M16 50 L32 18 L48 50 Z', '#6B8E5A') +
    p('M20 50 L32 24 L44 50 Z', '#8BAA7A') +
    p('M30 50 L32 24 L34 50 Z', '#4A6A3A') +
    p('M32 14 L32 18 L34 16 Z', '#8B6914') +
    rc(46, 40, 4, 10, '#8B6914') +
    rc(44, 38, 8, 4, '#6B4914') +
    ci(50, 36, 3, '#FF6600') +
    ci(50, 34, 2, '#FF9900') +
    ci(50, 32, 1, '#FFCC00') +
    p('M8 48 Q12 44 16 48', '#4A6A3A') +
    p('M48 48 Q52 44 56 48', '#4A6A3A')
  ),

  // 🌑 암시장 — dark marketplace
  black_market: C(
    rc(4, 4, 56, 56, '#1A1A2E') +
    rc(8, 20, 48, 34, '#16213E') +
    p('M8 20 L32 8 L56 20', '#0F3460') +
    rc(24, 30, 16, 24, '#2A1A4A') +
    rc(26, 32, 12, 20, '#3A2A5A') +
    ci(36, 42, 1.5, '#FFD700') +
    rc(10, 36, 10, 8, '#2A1A3A') +
    rc(44, 36, 10, 8, '#2A1A3A') +
    ci(15, 38, 2, '#FF4444') +
    ci(49, 38, 2, '#44FF44') +
    p('M28 20 L32 14 L36 20', '#6A4ABA') +
    ci(32, 16, 1.5, '#FFD700')
  ),

  // ⛲ 신성한 우물 — holy well with light
  sacred_well: C(
    p('M16 30 Q16 52 32 54 Q48 52 48 30 Z', '#4488CC') +
    p('M12 28 Q32 22 52 28 L52 32 Q32 26 12 32 Z', '#888888') +
    ci(32, 40, 8, '#66AADD') +
    ci(32, 40, 5, '#88CCFF') +
    p('M30 14 L32 4 L34 14', '#FFD700') +
    ci(32, 8, 4, '#FFD700') +
    ci(32, 8, 2, '#FFF8B0') +
    p('M26 10 L24 6 M38 10 L40 6', '#FFD700') +
    rc(10, 28, 44, 4, '#777777') +
    ci(32, 38, 2, '#FFFFFF') +
    p('M20 30 L20 50 M44 30 L44 50', '#666666') +
    ci(28, 42, 1, '#FFFFFF')
  ),

  // 🌊 마법의 샘 — magical fountain
  mystic_fountain: C(
    p('M12 48 Q12 54 32 56 Q52 54 52 48 Z', '#4488CC') +
    p('M16 44 Q32 38 48 44 L48 48 Q32 42 16 48 Z', '#6699BB') +
    p('M28 44 L28 24 Q32 16 36 24 L36 44', '#AAAAAA') +
    p('M26 24 Q32 8 38 24', '#88DDFF') +
    ci(32, 12, 4, '#AAEEFF') +
    ci(32, 12, 2, '#CCFFFF') +
    p('M24 24 Q20 32 16 44', '#88DDFF') +
    p('M40 24 Q44 32 48 44', '#88DDFF') +
    ci(20, 36, 1.5, '#DA70D6') +
    ci(44, 36, 1.5, '#DA70D6') +
    ci(32, 48, 1, '#FFFFFF') +
    p('M30 8 Q32 2 34 8', '#CCFFFF')
  ),

  // 🧒 길 잃은 아이 — small child silhouette
  lost_child: C(
    rc(4, 50, 56, 8, '#5A4A3A') +
    ci(32, 18, 7, '#E8C8A0') +
    rc(26, 25, 12, 16, '#FF8866') +
    rc(24, 28, 4, 10, '#E8C8A0') +
    rc(36, 28, 4, 10, '#E8C8A0') +
    rc(28, 41, 4, 10, '#5588CC') +
    rc(32, 41, 4, 10, '#5588CC') +
    p('M28 14 Q32 8 36 14 L36 18 L28 18 Z', '#6B4226') +
    ci(30, 17, 1.5, '#333333') +
    ci(34, 17, 1.5, '#333333') +
    p('M30 20 Q32 22 34 20', '#CC8866') +
    ci(44, 44, 3, '#FFD700') +
    ci(44, 44, 1.5, '#FFE860')
  ),

  // 🔨 대장장이 — hammer and anvil
  forge_master: C(
    p('M18 36 L46 36 L50 44 L14 44 Z', '#555555') +
    rc(16, 44, 32, 8, '#444444') +
    rc(26, 28, 12, 8, '#666666') +
    p('M20 10 L24 10 L24 32 L20 32 Z', '#8B6914') +
    p('M14 6 L30 6 L30 14 L14 14 Z', '#888888') +
    rc(14, 8, 16, 4, '#999999') +
    ci(40, 20, 3, '#FF6600') +
    ci(36, 24, 2, '#FF9900') +
    ci(44, 16, 2, '#FFCC00') +
    ci(38, 28, 1.5, '#FF4400') +
    ci(42, 22, 1, '#FFEE00') +
    p('M14 44 L14 52 L50 52 L50 44', '#333333')
  ),

  // 🎭 가면의 예언자 — theatrical mask
  masked_oracle: C(
    p('M16 14 Q16 8 32 6 Q48 8 48 14 L48 38 Q48 50 32 52 Q16 50 16 38 Z', '#EEEEEE') +
    p('M16 14 Q32 10 48 14 L48 18 Q32 14 16 18 Z', '#FFD700') +
    p('M22 22 Q26 18 30 22 Q26 26 22 22 Z', '#1A1A2E') +
    p('M34 22 Q38 18 42 22 Q38 26 34 22 Z', '#1A1A2E') +
    ci(26, 22, 2, '#4488FF') +
    ci(38, 22, 2, '#4488FF') +
    p('M28 34 Q32 40 36 34', '#CC3333') +
    p('M24 30 L26 28 M38 28 L40 30', '#CCCCCC') +
    rc(14, 4, 4, 12, '#FFD700') +
    rc(46, 4, 4, 12, '#FFD700') +
    p('M30 42 Q32 46 34 42', '#DDDDDD') +
    ci(32, 12, 2, '#FFD700')
  ),

  // 👺 고블린 여행자 — goblin face
  goblin_traveler: C(
    ci(32, 28, 16, '#4A8B3A') +
    ci(32, 28, 13, '#5CA84A') +
    p('M20 18 L18 10 L26 18 Z', '#4A8B3A') +
    p('M44 18 L46 10 L38 18 Z', '#4A8B3A') +
    ci(26, 24, 4, '#FFFF88') +
    ci(38, 24, 4, '#FFFF88') +
    ci(26, 24, 2, '#CC2200') +
    ci(38, 24, 2, '#CC2200') +
    ci(32, 30, 4, '#CC3333') +
    p('M24 36 Q32 42 40 36', '#3A6A2A') +
    rc(26, 36, 2, 3, '#EEEEEE') +
    rc(36, 36, 2, 3, '#EEEEEE') +
    rc(22, 44, 20, 10, '#8B6914') +
    p('M30 44 L34 44 L34 54 L30 54', '#6B4914')
  ),

  // ⛩️ 잊혀진 사당 — torii gate shrine
  forgotten_shrine: C(
    rc(4, 50, 56, 6, '#6B6B6B') +
    rc(12, 18, 6, 32, '#CC3333') +
    rc(46, 18, 6, 32, '#CC3333') +
    rc(8, 14, 48, 6, '#DD4444') +
    p('M6 12 L58 12 L56 14 L8 14 Z', '#EE5555') +
    p('M4 10 L60 10 L58 12 L6 12 Z', '#CC3333') +
    rc(18, 24, 28, 4, '#BB2222') +
    rc(28, 28, 8, 22, '#AA8866') +
    p('M30 34 Q32 30 34 34 Q32 38 30 34 Z', '#FFD700') +
    ci(32, 34, 1.5, '#FF6600') +
    p('M22 48 Q20 44 18 48 M46 48 Q44 44 42 48', '#4A8B3A') +
    p('M8 18 Q6 14 4 10', '#CC3333')
  ),

  // 🪞 거울의 연못 — mirror reflecting pool
  mirror_pool: C(
    p('M8 32 Q8 50 32 52 Q56 50 56 32 Q56 26 32 24 Q8 26 8 32 Z', '#C0C0C0') +
    p('M12 34 Q12 48 32 50 Q52 48 52 34 Q52 28 32 26 Q12 28 12 34 Z', '#E8E8FF') +
    p('M16 36 Q16 44 32 46 Q48 44 48 36 Q48 30 32 28 Q16 30 16 36 Z', '#D0D0FF') +
    ci(32, 36, 6, '#B8B8FF') +
    ci(32, 36, 3, '#EEEEFF') +
    ci(28, 34, 1, '#FFFFFF') +
    ci(36, 38, 1, '#FFFFFF') +
    p('M24 20 Q28 14 32 20', '#C0C0E0') +
    p('M32 20 Q36 14 40 20', '#C0C0E0') +
    ci(32, 16, 2, '#E0E0FF') +
    ci(24, 40, 1.5, '#FFFFFF') +
    ci(40, 34, 1.5, '#FFFFFF')
  ),

  // 🗡️ 저주받은 검 — dark cursed sword
  cursed_blade: C(
    p('M30 4 L34 4 L34 40 L30 40 Z', '#4A2060') +
    p('M30 4 L32 2 L34 4 Z', '#8B00FF') +
    rc(22, 38, 20, 4, '#333333') +
    rc(28, 42, 8, 12, '#2A1A3A') +
    rc(30, 42, 4, 12, '#3A2A4A') +
    p('M30 54 Q32 58 34 54', '#FFD700') +
    p('M31 8 L31 36', '#8B00FF') +
    p('M33 10 L33 34', '#6A00CC') +
    ci(32, 40, 2, '#CC0000') +
    ci(32, 40, 1, '#FF0000') +
    p('M26 36 L22 32 M38 36 L42 32', '#8B00FF') +
    ci(28, 20, 1.5, '#FF0044')
  ),

  // ⛲ 성스러운 샘 — holy spring with cross
  holy_spring: C(
    p('M10 46 Q10 54 32 56 Q54 54 54 46 Z', '#4488CC') +
    p('M14 44 Q32 38 50 44 L50 46 Q32 40 14 46 Z', '#6699BB') +
    ci(32, 48, 6, '#88CCFF') +
    ci(32, 48, 3, '#AAEEFF') +
    rc(30, 10, 4, 28, '#FFD700') +
    rc(24, 18, 16, 4, '#FFD700') +
    ci(32, 14, 3, '#FFF8B0') +
    ci(32, 14, 1.5, '#FFFFFF') +
    p('M26 22 L24 18 M38 22 L40 18', '#FFE44D') +
    ci(24, 48, 1, '#FFFFFF') +
    ci(40, 48, 1, '#FFFFFF') +
    ci(32, 46, 1.5, '#FFFFFF')
  ),

  // 📕 저주받은 서적 — dark book with red glow
  cursed_tome: C(
    p('M14 10 Q12 8 10 12 L10 52 Q12 56 16 54 L50 54 Q54 56 54 52 L54 12 Q54 8 50 10 Z', '#2A0A0A') +
    rc(16, 12, 32, 40, '#3A1010') +
    rc(18, 16, 28, 2, '#880000') +
    rc(18, 22, 28, 2, '#880000') +
    rc(18, 28, 20, 2, '#880000') +
    p('M28 34 L36 34 L36 44 L28 44 Z', '#660000') +
    ci(32, 39, 3, '#FF0000') +
    ci(32, 39, 1.5, '#FF4444') +
    p('M10 10 Q10 14 14 14 L50 14 Q54 14 54 10', '#4A1A1A') +
    p('M24 48 L40 48', '#660000') +
    ci(20, 20, 1, '#FF0000') +
    ci(44, 20, 1, '#FF0000')
  ),

  // 🎲 도박꾼의 소굴 — dice and cards
  gambler_den: C(
    rc(8, 28, 20, 20, '#EEEEEE') +
    ci(14, 34, 2, '#222222') +
    ci(22, 42, 2, '#222222') +
    ci(18, 38, 2, '#222222') +
    p('M36, 24 L56 24 L56 48 L36 48 Z', '#CC2222') +
    rc(38, 26, 16, 20, '#DD3333') +
    p('M44 28 L46 28 L48 34 L46 36 L44 36 L42 34 Z', '#FFD700') +
    p('M44 38 L46 38 L48 44 L46 46 L44 46 L42 44 Z', '#FFD700') +
    rc(6, 12, 16, 12, '#DDDDDD') +
    ci(10, 16, 1.5, '#222222') +
    ci(18, 20, 1.5, '#222222') +
    rc(32, 8, 20, 12, '#228822') +
    ci(42, 14, 3, '#FFD700')
  ),

  // 🌀 차원의 틈 — swirling portal
  dimensional_rift: C(
    ci(32, 32, 24, '#1A0A3A') +
    p('M32 8 Q56 16 56 32 Q56 48 32 56 Q8 48 8 32 Q8 16 32 8 Z', '#3A1A6A') +
    p('M32 12 Q50 18 50 32 Q50 46 32 52 Q14 46 14 32 Q14 18 32 12 Z', '#5A2A9A') +
    p('M32 16 Q46 20 46 32 Q46 44 32 48 Q18 44 18 32 Q18 20 32 16 Z', '#7A3ACA') +
    p('M32 20 Q42 24 42 32 Q42 40 32 44 Q22 40 22 32 Q22 24 32 20 Z', '#9A4AEA') +
    ci(32, 32, 8, '#BA6AFF') +
    ci(32, 32, 4, '#DAAOFF') +
    ci(32, 32, 2, '#FFFFFF') +
    ci(22, 20, 1.5, '#88DDFF') +
    ci(42, 44, 1.5, '#88DDFF') +
    ci(20, 40, 1, '#FF88DD') +
    ci(44, 24, 1, '#FF88DD')
  ),

  // 🎵 방랑 음유시인 — lute/harp instrument
  wandering_bard: C(
    p('M24 18 Q24 40 32 48 Q40 40 40 18 Z', '#A0522D') +
    p('M26 20 Q26 36 32 42 Q38 36 38 20 Z', '#C4733B') +
    ci(32, 30, 4, '#3A2010') +
    rc(30, 8, 4, 12, '#8B6914') +
    rc(28, 6, 8, 4, '#A07828') +
    ci(29, 8, 1.5, '#FFD700') +
    ci(35, 8, 1.5, '#FFD700') +
    p('M30 10 L30 20 M34 10 L34 20', '#DAA520') +
    p('M32 10 L32 30', '#FFD700') +
    ci(18, 14, 2, '#88DDFF') +
    ci(46, 14, 2, '#88DDFF') +
    ci(14, 20, 1.5, '#FFD700') +
    ci(50, 20, 1.5, '#FFD700')
  ),

  // 🗽 고대 수호자 — stone guardian statue
  ancient_guardian: C(
    rc(20, 40, 24, 14, '#6B6B6B') +
    rc(24, 22, 16, 18, '#7D7D7D') +
    ci(32, 16, 10, '#8A8A8A') +
    ci(32, 16, 8, '#7D7D7D') +
    ci(28, 14, 3, '#1A1A2E') +
    ci(36, 14, 3, '#1A1A2E') +
    ci(28, 14, 1.5, '#00FF88') +
    ci(36, 14, 1.5, '#00FF88') +
    p('M24 22 L18 34 L22 34 L24 26', '#7D7D7D') +
    p('M40 22 L46 34 L42 34 L40 26', '#7D7D7D') +
    rc(16, 54, 32, 4, '#5A5A5A') +
    p('M28 18 L36 18', '#6B6B6B') +
    ci(32, 8, 2, '#00FF88')
  ),

  // 📜 피의 계약 — blood-signed scroll
  blood_pact: C(
    p('M16 8 Q14 6 12 10 L12 54 Q14 58 18 56 L46 56 Q50 58 52 54 L52 10 Q50 6 46 8 Z', '#D4C8A0') +
    rc(18, 12, 28, 40, '#E8DCC0') +
    rc(20, 16, 24, 2, '#880000') +
    rc(20, 22, 24, 2, '#880000') +
    rc(20, 28, 16, 2, '#880000') +
    p('M28 34 L36 34 L40 46 L24 46 Z', '#660000') +
    ci(32, 40, 4, '#CC0000') +
    ci(32, 40, 2, '#FF2222') +
    p('M30 38 L34 42 M34 38 L30 42', '#FF0000') +
    p('M12 8 Q12 12 16 12 L46 12 Q52 12 52 8', '#C0B080') +
    ci(22, 48, 2, '#CC0000') +
    ci(42, 48, 2, '#CC0000')
  ),

  // 🧚 요정의 정원 — fairy wings with sparkle
  fairy_garden: C(
    rc(4, 50, 56, 8, '#2A6B2A') +
    p('M12 50 Q16 40 24 42 Q20 36 28 38 Q24 30 32 34', '#44AA44') +
    p('M52 50 Q48 40 40 42 Q44 36 36 38 Q40 30 32 34', '#44AA44') +
    ci(32, 28, 4, '#FFAACC') +
    p('M28 24 Q22 16 26 22 Z', '#FF88DD') +
    p('M36 24 Q42 16 38 22 Z', '#FF88DD') +
    p('M26 28 Q18 24 24 30 Z', '#FFAAEE') +
    p('M38 28 Q46 24 40 30 Z', '#FFAAEE') +
    ci(32, 28, 2, '#FFD4E8') +
    ci(20, 38, 1.5, '#FFFF44') +
    ci(44, 38, 1.5, '#FFFF44') +
    ci(28, 20, 1, '#FFFFFF') +
    ci(36, 20, 1, '#FFFFFF') +
    ci(16, 44, 2, '#FF66AA')
  ),

  // 📦 보물 미믹 — chest with teeth/eyes
  treasure_mimic: C(
    rc(10, 32, 44, 22, '#8B5A2B') +
    p('M10 30 L54 30 L54 36 L10 36 Z', '#A06B3A') +
    rc(8, 28, 48, 4, '#6B3A1A') +
    p('M14 30 L18 24 L22 30 L26 24 L30 30 L34 24 L38 30 L42 24 L46 30 L50 24 L54 30', '#EEEEEE') +
    ci(22, 22, 5, '#FFFF00') +
    ci(42, 22, 5, '#FFFF00') +
    ci(22, 22, 3, '#CC0000') +
    ci(42, 22, 3, '#CC0000') +
    ci(22, 22, 1.5, '#000000') +
    ci(42, 22, 1.5, '#000000') +
    p('M14 36 L18 42 L22 36 L26 42 L30 36 L34 42 L38 36 L42 42 L46 36 L50 42', '#EEEEEE') +
    rc(28, 34, 8, 6, '#FFD700')
  ),

  // 👻 영혼 상인 — ghostly merchant figure
  soul_merchant: C(
    p('M24 10 Q18 10 18 20 L16 50 Q24 56 32 56 Q40 56 48 50 L46 20 Q46 10 40 10 Z', '#88EEFF') +
    p('M26 12 Q22 12 22 20 L20 48 Q28 52 32 52 Q36 52 44 48 L42 20 Q42 12 38 12 Z', '#AAFFFF') +
    ci(28, 22, 3, '#0088AA') +
    ci(36, 22, 3, '#0088AA') +
    ci(28, 22, 1.5, '#CCFFFF') +
    ci(36, 22, 1.5, '#CCFFFF') +
    p('M28 30 Q32 34 36 30', '#0088AA') +
    p('M22 34 L18 40 L24 38', '#88EEFF') +
    p('M42 34 L46 40 L40 38', '#88EEFF') +
    ci(32, 42, 3, '#FFD700') +
    ci(32, 42, 1.5, '#FFF8B0') +
    p('M20 50 Q18 54 16 50 M48 50 Q46 54 44 50', '#66CCDD')
  ),

  // 🌀 정령의 시련 — spirit energy test
  spirit_trial: C(
    ci(32, 32, 22, '#0A1A3A') +
    p('M32 10 Q54 16 54 32 Q54 48 32 54 Q10 48 10 32 Q10 16 32 10 Z', '#1A3A6A') +
    p('M32 14 Q48 20 48 32 Q48 44 32 50 Q16 44 16 32 Q16 20 32 14 Z', '#2A5A9A') +
    p('M32 18 Q44 22 44 32 Q44 42 32 46 Q20 42 20 32 Q20 22 32 18 Z', '#3A7ACC') +
    ci(32, 32, 8, '#4A9AEE') +
    ci(32, 32, 4, '#88CCFF') +
    ci(32, 32, 2, '#CCFFFF') +
    ci(20, 18, 2, '#FFFF44') +
    ci(44, 46, 2, '#FFFF44') +
    ci(18, 42, 1.5, '#FF8844') +
    ci(46, 22, 1.5, '#FF8844') +
    p('M32 10 L32 14 M32 50 L32 54', '#4A9AEE')
  ),

  // 🕳️ 영혼의 우물 — dark well with ghost
  soul_well: C(
    p('M12 36 Q12 52 32 54 Q52 52 52 36 Z', '#2A2A3A') +
    p('M8 34 Q32 26 56 34 L56 38 Q32 30 8 38 Z', '#555555') +
    rc(8, 34, 48, 4, '#666666') +
    ci(32, 44, 6, '#1A1A2E') +
    p('M28 28 Q26 14 32 10 Q38 14 36 28', '#88EEFF') +
    ci(32, 14, 4, '#88EEFF') +
    ci(32, 14, 2, '#CCFFFF') +
    ci(30, 13, 1, '#0088AA') +
    ci(34, 13, 1, '#0088AA') +
    p('M28 20 Q24 24 26 28', '#66CCDD') +
    p('M36 20 Q40 24 38 28', '#66CCDD') +
    ci(32, 42, 2, '#4A0080')
  ),

  // ⭕ 파괴된 마법진 — broken magic circle
  ruined_circle: C(
    rc(4, 48, 56, 10, '#4A4A3A') +
    ci(32, 40, 20, '#3A3050') +
    p('M12 40 Q22 20 32 20 Q42 20 52 40', '#5A3080') +
    p('M18 40 Q26 26 32 26 Q38 26 46 40', '#6A40A0') +
    p('M28 26 L24 20 M36 26 L40 20', '#8A60C0') +
    ci(32, 34, 4, '#9A70D0') +
    ci(32, 34, 2, '#BA90F0') +
    p('M26 38 L22 44 L20 40', '#4A3060') +
    p('M38 38 L42 44 L44 40', '#4A3060') +
    p('M30 42 L34 42', '#8A60C0') +
    rc(20, 48, 4, 4, '#5A5A4A') +
    rc(40, 48, 4, 4, '#5A5A4A') +
    ci(32, 20, 1.5, '#DA70D6')
  ),

  // 😈 계약의 악마 — demon face with contract
  contract_demon: C(
    ci(32, 24, 14, '#CC2222') +
    ci(32, 24, 11, '#DD3333') +
    p('M20 14 L16 4 L24 12 Z', '#AA0000') +
    p('M44 14 L48 4 L40 12 Z', '#AA0000') +
    ci(26, 20, 3, '#FFFF00') +
    ci(38, 20, 3, '#FFFF00') +
    ci(26, 20, 1.5, '#000000') +
    ci(38, 20, 1.5, '#000000') +
    p('M24 30 Q32 36 40 30', '#000000') +
    rc(22, 40, 20, 16, '#D4C8A0') +
    rc(24, 42, 16, 12, '#E8DCC0') +
    p('M28 46 L36 46', '#CC0000') +
    ci(32, 50, 1.5, '#CC0000')
  ),
};

// ─── ACHIEVEMENT ICONS ───────────────────────────────────────────────

export const ACHIEVEMENT_SVG: Record<string, string> = {

  // 🏆 첫 영웅 — golden trophy
  first_win: C(
    p('M18 14 L14 36 Q14 42 22 42 L26 42 L26 46 L20 48 L20 52 L44 52 L44 48 L38 46 L38 42 L42 42 Q50 42 50 36 L46 14 Z', '#FFD700') +
    p('M22 18 L42 18 L44 32 Q44 38 38 38 L26 38 Q20 38 20 32 Z', '#FFE44D') +
    rc(24, 48, 16, 4, '#DAA520') +
    rc(20, 52, 24, 4, '#CC9900') +
    p('M14 22 L8 20 L10 28 L14 26', '#FFD700') +
    p('M50 22 L56 20 L54 28 L50 26', '#FFD700') +
    ci(32, 28, 4, '#DAA520') +
    p('M30 24 L32 22 L34 24 L34 30 L32 32 L30 30 Z', '#CC9900') +
    ci(32, 16, 2, '#FFF8B0')
  ),

  // ✨ 진정한 영웅 — shining star with sparkles
  true_win: C(
    p('M32 4 L36 22 L54 22 L40 34 L44 52 L32 42 L20 52 L24 34 L10 22 L28 22 Z', '#FFD700') +
    p('M32 10 L35 22 L46 22 L38 32 L40 44 L32 38 L24 44 L26 32 L18 22 L29 22 Z', '#FFE44D') +
    ci(32, 24, 4, '#FFF8B0') +
    ci(32, 24, 2, '#FFFFFF') +
    ci(14, 12, 2, '#FFD700') +
    ci(50, 12, 2, '#FFD700') +
    ci(14, 48, 1.5, '#FFD700') +
    ci(50, 48, 1.5, '#FFD700') +
    ci(8, 30, 1, '#FFE44D') +
    ci(56, 30, 1, '#FFE44D') +
    p('M30 22 L32 18 L34 22', '#FFFFFF')
  ),

  // 🎭 만능 모험가 — multiple mask faces
  all_classes_win: C(
    p('M8 16 Q8 10 18 10 L30 10 Q34 10 34 16 L34 32 Q34 38 28 38 L14 38 Q8 38 8 32 Z', '#EEEEEE') +
    ci(16, 20, 2.5, '#333333') +
    ci(26, 20, 2.5, '#333333') +
    p('M16 28 Q21 32 26 28', '#CC3333') +
    p('M30 22 Q30 16 38 14 L50 14 Q56 14 56 22 L56 40 Q56 48 48 48 L38 48 Q30 48 30 40 Z', '#FFD700') +
    ci(38, 26, 2.5, '#333333') +
    ci(48, 26, 2.5, '#333333') +
    p('M38 34 Q43 38 48 34', '#CC3333') +
    rc(6, 42, 22, 14, '#88AAFF') +
    ci(12, 48, 2, '#333333') +
    ci(22, 48, 2, '#333333') +
    p('M14 52 Q17 54 20 52', '#CC3333')
  ),

  // 👑 경지에 오르다 — grand crown with gems
  all_classes_true: C(
    p('M10 28 L14 12 L22 24 L32 8 L42 24 L50 12 L54 28 Z', '#FFD700') +
    rc(10, 28, 44, 16, '#FFD700') +
    rc(12, 30, 40, 12, '#FFE44D') +
    ci(20, 36, 4, '#CC0000') +
    ci(32, 36, 4, '#0066CC') +
    ci(44, 36, 4, '#00AA44') +
    ci(20, 36, 2, '#FF4444') +
    ci(32, 36, 2, '#4488FF') +
    ci(44, 36, 2, '#44CC66') +
    ci(14, 16, 3, '#FF0044') +
    ci(32, 10, 3, '#FFD700') +
    ci(50, 16, 3, '#FF0044') +
    rc(10, 44, 44, 4, '#DAA520')
  ),

  // ⚔️ 검사 클리어 — crossed swords
  sword_clear: C(
    p('M14 8 L18 8 L42 48 L38 52 Z', '#AAAAAA') +
    p('M50 8 L46 8 L22 48 L26 52 Z', '#AAAAAA') +
    p('M16 10 L18 6 L42 46 L40 50 Z', '#CCCCCC') +
    p('M48 10 L46 6 L22 46 L24 50 Z', '#CCCCCC') +
    rc(26, 44, 12, 4, '#8B6914') +
    rc(26, 44, 12, 4, '#8B6914') +
    p('M12 14 L22 14 L22 18 L12 18 Z', '#8B6914') +
    p('M42 14 L52 14 L52 18 L42 18 Z', '#8B6914') +
    ci(32, 30, 3, '#FFD700') +
    p('M30 28 L32 24 L34 28 L34 32 L32 34 L30 32 Z', '#FFF8B0') +
    rc(14, 52, 8, 4, '#6B4914') +
    rc(42, 52, 8, 4, '#6B4914')
  ),

  // 🔫 사수 클리어 — pistol/gun
  gun_clear: C(
    rc(10, 24, 34, 10, '#555555') +
    rc(8, 22, 6, 14, '#666666') +
    rc(44, 24, 12, 8, '#444444') +
    p('M26 34 L30 34 L30 52 L22 52 L22 46 L26 46 Z', '#6B4914') +
    rc(12, 26, 28, 6, '#777777') +
    ci(52, 28, 3, '#333333') +
    ci(52, 28, 1.5, '#222222') +
    rc(34, 30, 6, 4, '#444444') +
    p('M36 34 L38 34 L36 40 L34 40 Z', '#888888') +
    ci(14, 28, 2, '#999999') +
    rc(8, 20, 4, 4, '#777777') +
    p('M56 26 L60 24 L60 32 L56 30', '#FFCC00')
  ),

  // 🥊 격투가 클리어 — boxing glove
  fight_clear: C(
    p('M18 14 Q10 14 10 24 L10 36 Q10 44 18 44 L26 44 L26 52 L22 52 Q18 52 18 48', '#CC2222') +
    p('M18 14 L40 14 Q48 14 48 24 L48 36 Q48 44 40 44 L26 44', '#DD3333') +
    p('M20 16 L38 16 Q44 16 44 24 L44 34 Q44 40 38 40 L22 40 Q14 40 14 34 L14 24 Q14 16 20 16 Z', '#EE4444') +
    rc(24, 44, 14, 8, '#CC2222') +
    p('M26 52 L36 52 L38 58 L24 58 Z', '#AA1111') +
    p('M18 24 L44 24', '#FF6666') +
    ci(22, 30, 2, '#FF8888') +
    ci(30, 30, 2, '#FF8888') +
    ci(38, 30, 2, '#FF8888') +
    p('M14 20 Q18 16 22 20', '#FF6666')
  ),

  // 🔮 마법사 클리어 — crystal ball
  mage_clear: C(
    ci(32, 28, 16, '#6A0DAD') +
    ci(32, 28, 14, '#8B00FF') +
    ci(32, 28, 11, '#9B30FF') +
    ci(28, 22, 4, '#DA70D6') +
    ci(26, 20, 2, '#FFFFFF') +
    p('M20 42 L16 54 L48 54 L44 42', '#8B6914') +
    rc(18, 52, 28, 4, '#A07828') +
    rc(14, 56, 36, 4, '#6B4914') +
    ci(32, 32, 2, '#FF88DD') +
    ci(38, 26, 1.5, '#CCFFFF') +
    p('M24 34 Q28 38 32 34', '#BA55D3') +
    ci(32, 28, 6, '#9B30FF')
  ),

  // ⛪ 성직자 클리어 — church/chapel
  priest_clear: C(
    rc(14, 30, 36, 26, '#C4A265') +
    p('M14 30 L32 14 L50 30 Z', '#DAA520') +
    rc(30, 10, 4, 8, '#FFD700') +
    rc(26, 14, 12, 4, '#FFD700') +
    rc(26, 40, 12, 16, '#6B4914') +
    p('M26 40 Q32 34 38 40', '#8B6914') +
    ci(24, 34, 3, '#88CCFF') +
    ci(40, 34, 3, '#88CCFF') +
    ci(24, 34, 1.5, '#CCFFFF') +
    ci(40, 34, 1.5, '#CCFFFF') +
    rc(12, 56, 40, 4, '#8B7332') +
    ci(32, 12, 2, '#FFF8B0')
  ),

  // 🗡️ 도적 클리어 — dagger
  thief_clear: C(
    p('M30 4 L34 4 L34 32 L30 32 Z', '#CCCCCC') +
    p('M30 4 L32 2 L34 4', '#EEEEEE') +
    p('M31 6 L31 30', '#EEEEEE') +
    rc(24, 30, 16, 4, '#8B6914') +
    rc(22, 32, 20, 3, '#6B4914') +
    rc(28, 35, 8, 16, '#4A3010') +
    rc(30, 35, 4, 16, '#5A4020') +
    p('M28 51 Q32 56 36 51', '#FFD700') +
    ci(32, 32, 2, '#FF0044') +
    ci(32, 32, 1, '#FF4488') +
    p('M22 30 L20 26 M42 30 L44 26', '#AAAAAA') +
    p('M26 42, L24 44 M38 42 L40 44', '#3A2010')
  ),

  // 🪬 정령술사 클리어 — spirit orb/nazar
  summoner_clear: C(
    ci(32, 32, 20, '#1A3A6A') +
    ci(32, 32, 16, '#2255AA') +
    ci(32, 32, 12, '#4488FF') +
    ci(32, 32, 8, '#FFFFFF') +
    ci(32, 32, 5, '#000000') +
    ci(30, 30, 2, '#FFFFFF') +
    p('M12 12 Q8 8 12 4 L16 8 Q12 12 16 16 Z', '#00CCFF') +
    p('M52 12 Q56 8 52 4 L48 8 Q52 12 48 16 Z', '#00CCFF') +
    p('M12 52 Q8 56 12 60 L16 56 Q12 52 16 48 Z', '#00CCFF') +
    p('M52 52 Q56 56 52 60 L48 56 Q52 52 48 48 Z', '#00CCFF') +
    ci(32, 32, 2, '#0066FF')
  ),

  // ⛰ 등반자 — mountain
  asc5: C(
    p('M4 56 L28 12 L38 28 L48 16 L60 56 Z', '#6B8E5A') +
    p('M8 56 L28 16 L36 30 L48 20 L56 56 Z', '#7AA06A') +
    p('M28 12 L22 24 L34 24 Z', '#EEEEEE') +
    p('M48 16 L42 26 L54 26 Z', '#EEEEEE') +
    rc(4, 56, 56, 4, '#5A4A3A') +
    ci(28, 18, 2, '#FFFFFF') +
    ci(48, 20, 1.5, '#FFFFFF') +
    p('M16 44 Q20 38 24 44', '#5A7A4A') +
    p('M40 44 Q44 38 48 44', '#5A7A4A') +
    p('M32 36 L34 32 L36 36', '#7AA06A')
  ),

  // 🏔 정상 정복 — mountain with flag
  asc10: C(
    p('M4 56 L32 8 L60 56 Z', '#6B8E5A') +
    p('M8 56 L32 12 L56 56 Z', '#7AA06A') +
    p('M32 8 L24 22 L40 22 Z', '#EEEEEE') +
    rc(30, 4, 4, 12, '#8B6914') +
    p('M34 4 L48 10 L34 16 Z', '#CC2222') +
    p('M34 4 L48 10 L34 10 Z', '#DD3333') +
    rc(4, 56, 56, 4, '#5A4A3A') +
    p('M18 44 Q22 38 26 44', '#5A7A4A') +
    p('M38 44 Q42 38 46 44', '#5A7A4A') +
    ci(32, 14, 1.5, '#FFFFFF')
  ),

  // 💥 일격필살 — explosion/impact
  one_shot: C(
    p('M32 2 L36 18 L52 6 L42 22 L62 24 L44 32 L58 46 L38 38 L42 58 L32 42 L22 58 L26 38 L6 46 L20 32 L2 24 L22 22 L12 6 L28 18 Z', '#FF6600') +
    p('M32 10 L35 20 L46 12 L40 24 L54 26 L42 32 L50 42 L38 36 L40 50 L32 38 L24 50 L26 36 L14 42 L22 32 L10 26 L24 24 L18 12 L29 20 Z', '#FF9900') +
    ci(32, 30, 8, '#FFCC00') +
    ci(32, 30, 5, '#FFE44D') +
    ci(32, 30, 3, '#FFFFFF') +
    ci(30, 28, 1.5, '#FFFFFF')
  ),

  // 🛡 철벽 — iron shield
  iron_wall: C(
    p('M12 10 L52 10 L52 36 Q52 56 32 60 Q12 56 12 36 Z', '#888888') +
    p('M16 14 L48 14 L48 34 Q48 52 32 56 Q16 52 16 34 Z', '#AAAAAA') +
    p('M20 18 L44 18 L44 32 Q44 48 32 52 Q20 48 20 32 Z', '#BBBBBB') +
    p('M32 18 L32 52', '#999999') +
    p('M20 32 L44 32', '#999999') +
    ci(32, 28, 4, '#FFD700') +
    ci(32, 28, 2, '#FFF8B0') +
    p('M20 18 L44 18', '#CCCCCC') +
    rc(10, 8, 44, 4, '#777777') +
    p('M16 14 L12 10 M48 14 L52 10', '#777777')
  ),

  // 💨 신속 처리 — speed dash
  quick_kill: C(
    p('M42 12 L56 20 L50 22 L56 28 L48 28 L54 34 L40 30 L44 36 L34 28 Z', '#44AAFF') +
    p('M40 14 L52 20 L46 22 L52 26 L44 28 L50 32 L38 30 Z', '#88CCFF') +
    rc(6, 22, 24, 4, '#66BBFF') +
    rc(6, 30, 18, 3, '#66BBFF') +
    rc(6, 36, 12, 3, '#66BBFF') +
    rc(10, 42, 20, 3, '#88CCFF') +
    ci(38, 24, 2, '#FFFFFF') +
    ci(44, 20, 1.5, '#CCFFFF') +
    ci(30, 28, 1.5, '#AAEEFF') +
    p('M46 16 L50 14', '#CCFFFF')
  ),

  // 💪 강해지다 — flexing arm
  mighty: C(
    p('M24 14 Q20 14 18 20 L14 34 Q12 38 16 40 L20 40 Q24 40 24 36 L26 26 L32 30 L36 22 Q38 14 34 12 L28 12 Z', '#D4A574') +
    p('M18 20 Q16 18 14 22 L12 32 Q10 38 16 40', '#D4A574') +
    p('M26 18 Q28 14 32 14 Q36 14 36 18 L36 22 L32 30 L26 26 Z', '#E8C8A0') +
    ci(30, 22, 5, '#E85050') +
    ci(30, 22, 3, '#FF6666') +
    p('M20 40 L22 52 L30 52 L28 40', '#5588CC') +
    p('M14 34 L10 40 L16 40', '#D4A574') +
    ci(42, 20, 3, '#FFD700') +
    ci(48, 16, 2, '#FFD700') +
    ci(46, 24, 1.5, '#FFD700') +
    p('M40 18 L44 14 M44 24 L48 22', '#FFE44D')
  ),

  // 🔥 불의 마스터 — fire/flame
  pyromaniac: C(
    p('M32 4 Q40 16 44 24 Q48 32 44 40 Q40 48 32 52 Q24 48 20 40 Q16 32 20 24 Q24 16 32 4 Z', '#FF4400') +
    p('M32 8 Q38 18 42 26 Q44 32 42 38 Q38 44 32 48 Q26 44 22 38 Q20 32 22 26 Q26 18 32 8 Z', '#FF6600') +
    p('M32 14 Q36 22 38 28 Q40 34 38 38 Q36 42 32 44 Q28 42 26 38 Q24 34 26 28 Q28 22 32 14 Z', '#FF9900') +
    p('M32 20 Q34 26 36 30 Q38 34 36 38 Q34 40 32 42 Q30 40 28 38 Q26 34 28 30 Q30 26 32 20 Z', '#FFCC00') +
    ci(32, 32, 4, '#FFEE44') +
    ci(32, 30, 2, '#FFFFFF') +
    ci(26, 22, 1.5, '#FF8800') +
    ci(38, 22, 1.5, '#FF8800')
  ),

  // ❄ 얼음의 지배자 — snowflake/ice crystal
  cryomancer: C(
    rc(30, 4, 4, 56, '#88DDFF') +
    rc(4, 30, 56, 4, '#88DDFF') +
    p('M12 12 L16 8 L52 44 L48 48 Z', '#AAEEFF') +
    p('M52 12 L48 8 L12 44 L16 48 Z', '#AAEEFF') +
    ci(32, 32, 6, '#CCFFFF') +
    ci(32, 32, 3, '#FFFFFF') +
    p('M30 10 L26 6 M34 10 L38 6', '#66CCFF') +
    p('M30 54 L26 58 M34 54 L38 58', '#66CCFF') +
    p('M10 30 L6 26 M10 34 L6 38', '#66CCFF') +
    p('M54 30 L58 26 M54 34 L58 38', '#66CCFF') +
    ci(20, 20, 2, '#DDEEFF') +
    ci(44, 44, 2, '#DDEEFF') +
    ci(20, 44, 2, '#DDEEFF') +
    ci(44, 20, 2, '#DDEEFF')
  ),

  // ☠️ 맹독술사 — skull with crossbones
  venomous: C(
    ci(32, 24, 14, '#EEEEEE') +
    ci(32, 24, 12, '#DDDDDD') +
    ci(26, 20, 4, '#333333') +
    ci(38, 20, 4, '#333333') +
    ci(26, 20, 2, '#111111') +
    ci(38, 20, 2, '#111111') +
    p('M28 30 L30 28 L32 30 L34 28 L36 30', '#333333') +
    rc(28, 36, 8, 4, '#DDDDDD') +
    p('M8 44 L18 40 L46 56 L56 52 L46 56 L18 40 Z', '#DDDDDD') +
    p('M56 44 L46 40 L18 56 L8 52 L18 56 L46 40 Z', '#DDDDDD') +
    ci(32, 28, 2, '#333333') +
    ci(32, 16, 2, '#44DD44') +
    p('M24 38 L28 38 L28 40 L24 40', '#CCCCCC')
  ),

  // 🌟 필살의 일격 — big shining star burst
  big_hit: C(
    p('M32 0 L36 24 L60 16 L42 32 L60 48 L36 40 L32 64 L28 40 L4 48 L22 32 L4 16 L28 24 Z', '#FFD700') +
    p('M32 8 L35 24 L52 18 L40 32 L52 46 L35 38 L32 56 L29 38 L12 46 L24 32 L12 18 L29 24 Z', '#FFE44D') +
    ci(32, 32, 6, '#FFEE88') +
    ci(32, 32, 4, '#FFF8B0') +
    ci(32, 32, 2, '#FFFFFF') +
    ci(28, 28, 1, '#FFFFFF') +
    p('M30 30 L32 26 L34 30 L34 34 L32 36 L30 34 Z', '#FFFFFF')
  ),

  // 🪬 정령의 주인 — spirit orbs orbiting
  spirit_master: C(
    ci(32, 32, 8, '#2A5A9A') +
    ci(32, 32, 5, '#3A7ACC') +
    ci(32, 32, 2, '#88CCFF') +
    ci(32, 12, 5, '#00CCFF') +
    ci(32, 12, 3, '#66EEFF') +
    ci(14, 40, 5, '#44FF88') +
    ci(14, 40, 3, '#88FFAA') +
    ci(50, 40, 5, '#FF8844') +
    ci(50, 40, 3, '#FFAA66') +
    p('M32 17 Q44 20 46 32 Q48 44 40 48', '#2244AA') +
    p('M24 48 Q12 44 10 32 Q8 20 18 16', '#2244AA') +
    p('M46 16 Q54 20 54 28', '#2244AA') +
    ci(32, 12, 1.5, '#FFFFFF')
  ),

  // 💀 유리 대포 — skull with cracks
  glass_cannon: C(
    ci(32, 26, 16, '#DDDDDD') +
    ci(32, 26, 13, '#EEEEEE') +
    ci(26, 22, 4, '#333333') +
    ci(38, 22, 4, '#333333') +
    ci(26, 22, 2, '#CC0000') +
    ci(38, 22, 2, '#CC0000') +
    p('M28 32 L30 30 L32 32 L34 30 L36 32', '#555555') +
    rc(28, 38, 8, 6, '#CCCCCC') +
    p('M20 16 L14 8 L18 14', '#BBBBBB') +
    p('M44 16 L50 8 L46 14', '#BBBBBB') +
    p('M32 10 L30 4 L28 12 M36 12 L38 6 L34 10', '#BBBBBB') +
    p('M22 30 L16 36 L20 32', '#BBBBBB') +
    ci(32, 24, 1.5, '#FF4444')
  ),

  // 🌀 영혼 포식자 — swirling vortex eating souls
  soul_eater: C(
    ci(32, 32, 22, '#1A0A3A') +
    p('M32 10 Q54 16 54 32 Q54 48 32 54 Q10 48 10 32 Q10 16 32 10 Z', '#2A1A4A') +
    p('M32 14 Q48 20 48 32 Q48 44 32 50 Q16 44 16 32 Q16 20 32 14 Z', '#3A2A6A') +
    p('M32 20 Q42 24 42 32 Q42 40 32 44 Q22 40 22 32 Q22 24 32 20 Z', '#5A3A9A') +
    ci(32, 32, 6, '#7A4ACA') +
    ci(32, 32, 3, '#AA6AFF') +
    ci(32, 32, 1.5, '#DDAAFF') +
    ci(20, 18, 3, '#88EEFF') +
    ci(44, 46, 3, '#88EEFF') +
    ci(16, 40, 2, '#88EEFF') +
    ci(48, 24, 2, '#88EEFF')
  ),

  // 📖 카드 수집가 — open book with cards
  cards_30: C(
    p('M8 16 L32 12 L56 16 L56 48 L32 52 L8 48 Z', '#C4A265') +
    p('M8 16 L32 12 L32 52 L8 48 Z', '#E8D5A8') +
    p('M32 12 L56 16 L56 48 L32 52 Z', '#D4C090') +
    rc(14, 22, 12, 16, '#FF6644') +
    rc(16, 24, 8, 12, '#FFAA88') +
    rc(38, 22, 12, 16, '#4488FF') +
    rc(40, 24, 8, 12, '#88BBFF') +
    ci(20, 28, 2, '#FFD700') +
    ci(44, 28, 2, '#FFD700') +
    p('M8 16 L8 48', '#8B6914') +
    p('M56 16 L56 48', '#8B6914') +
    p('M32 12 L32 52', '#B0944A')
  ),

  // 📚 카드 박사 — stack of books
  cards_60: C(
    rc(12, 38, 40, 8, '#CC2222') +
    rc(10, 30, 44, 8, '#2255AA') +
    rc(14, 22, 36, 8, '#228822') +
    rc(12, 14, 40, 8, '#CC8800') +
    rc(14, 16, 36, 4, '#DDAA22') +
    rc(16, 24, 32, 4, '#44AA44') +
    rc(12, 32, 40, 4, '#4488CC') +
    rc(14, 40, 36, 4, '#DD4444') +
    p('M10 30 L10 38', '#1A3388') +
    p('M54 30 L54 38', '#1A3388') +
    rc(12, 46, 40, 4, '#8B6914') +
    ci(32, 18, 2, '#FFD700')
  ),

  // 🃏 카드 마스터 — playing card (joker style)
  cards_120: C(
    rc(14, 6, 36, 52, '#EEEEEE') +
    rc(16, 8, 32, 48, '#FFFFFF') +
    p('M14 6 L50 6 L50 58 L14 58 Z', 'none') +
    ci(32, 20, 6, '#FFD700') +
    ci(32, 20, 4, '#FF4444') +
    p('M28 16 L32 10 L36 16', '#FFD700') +
    p('M28 24 L32 30 L36 24', '#FFD700') +
    rc(24, 34, 16, 2, '#333333') +
    p('M26 38 L32 48 L38 38 Z', '#9B30FF') +
    p('M28 40 L32 46 L36 40 Z', '#BA55D3') +
    ci(20, 12, 3, '#CC2222') +
    ci(44, 50, 3, '#CC2222') +
    p('M18 10 L22 14 M42 48 L46 52', '#CC2222')
  ),

  // 💎 유물 탐험가 — single gem
  relics_5: C(
    p('M32 8 L48 24 L42 52 L22 52 L16 24 Z', '#00AACC') +
    p('M32 8 L48 24 L32 34 L16 24 Z', '#00CCEE') +
    p('M16 24 L32 34 L22 52 Z', '#0088AA') +
    p('M48 24 L32 34 L42 52 Z', '#0099BB') +
    p('M22 52 L32 34 L42 52 Z', '#007799') +
    p('M32 8 L32 34 L16 24', '#44DDFF') +
    ci(28, 22, 3, '#88EEFF') +
    ci(26, 20, 1.5, '#CCFFFF') +
    p('M32 34 L42 52', '#005566') +
    p('M24 16 L22 14 M40 16 L42 14', '#44DDFF')
  ),

  // 👑 유물 수집가 — crown with gems
  relics_15: C(
    p('M10 32 L16 14 L24 26 L32 10 L40 26 L48 14 L54 32 Z', '#FFD700') +
    rc(10, 32, 44, 14, '#FFD700') +
    rc(12, 34, 40, 10, '#FFE44D') +
    ci(22, 38, 4, '#CC0000') +
    ci(32, 38, 4, '#00AA44') +
    ci(42, 38, 4, '#0044CC') +
    ci(22, 38, 2, '#FF4444') +
    ci(32, 38, 2, '#44CC66') +
    ci(42, 38, 2, '#4488FF') +
    ci(16, 18, 2.5, '#FFFFFF') +
    ci(32, 12, 2.5, '#FFFFFF') +
    ci(48, 18, 2.5, '#FFFFFF') +
    rc(10, 46, 44, 4, '#DAA520')
  ),

  // 🏛️ 유물의 군주 — temple/palace
  relics_30: C(
    p('M8 20 L32 6 L56 20', '#DAA520') +
    rc(8, 20, 48, 4, '#FFD700') +
    rc(12, 24, 6, 28, '#E8D5A8') +
    rc(24, 24, 6, 28, '#E8D5A8') +
    rc(34, 24, 6, 28, '#E8D5A8') +
    rc(46, 24, 6, 28, '#E8D5A8') +
    rc(6, 52, 52, 6, '#DAA520') +
    rc(8, 50, 48, 4, '#FFD700') +
    ci(32, 36, 5, '#FFD700') +
    ci(32, 36, 3, '#FFF8B0') +
    p('M32 6 L30 10 L34 10 Z', '#FFE44D') +
    rc(28, 24, 8, 12, '#6B4914')
  ),
};

// ─── TITLE ICONS (Player Rank) ───────────────────────────────────────

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
  sunrise: `<svg viewBox="0 0 16 16" width="1em" height="1em" style="vertical-align:-0.125em" xmlns="http://www.w3.org/2000/svg"><path d="M8 3v2m4.2.8l-1.4 1.4M15 10h-2M3 10H1m3.2-3.8L5.6 7.6M8 7a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" fill="none" stroke="#f0a030" stroke-width="1.5" stroke-linecap="round"/><rect x="1" y="12" width="14" height="2" rx="1" fill="#f0a030"/></svg>`,
  warning: Ic('M8 1L1 14h14zM7 6h2v4H7zm0 5h2v2H7z', '#f0a030'),
  ban: Ic('M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-4 7a4 4 0 0 1 6.5-3.1L4.9 10.5A3.9 3.9 0 0 1 4 8zm4 4a3.9 3.9 0 0 1-2.5-.9l5.6-5.6A4 4 0 0 1 8 12z', '#e05050'),
  tip: Ic('M8 1a4 4 0 0 0-2 7.5V11h4V8.5A4 4 0 0 0 8 1zm-1 11h4v1H7zm.5 2h3v1h-3z', '#f0c040'),
  question: I('<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2a3 3 0 0 1 2.4 4.8L9 9H7l-.3-1.5 1.8-1.3A1 1 0 0 0 8 5a1 1 0 0 0-1 1H5a3 3 0 0 1 3-3zm-1 8h2v2H7z"/>'),
  poison: Ic('M8 1C6 1 5 2.5 5 4c0 1 .5 1.8 1 2.3-.8.4-2 1.5-2 3.2C4 12 6 14 8 14s4-2 4-4.5c0-1.7-1.2-2.8-2-3.2.5-.5 1-1.3 1-2.3 0-1.5-1-3-3-3zM6.5 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM7 10h2l-.3 2h-1.4z', '#80c060'),
  daily: `<svg viewBox="0 0 16 16" width="1em" height="1em" style="vertical-align:-0.125em" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v2m4.2.8l-1.4 1.4M15 9h-2M3 9H1m3.2-3.8L5.6 7.6" fill="none" stroke="#f0a030" stroke-width="1.5" stroke-linecap="round"/><path d="M8 6a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" fill="#f0a030"/><rect x="1" y="11" width="14" height="2" rx="1" fill="#f0a030"/></svg>`,
  progress: Ic('M8 1l2.2 4.5L15 6l-3.5 3.4.8 4.6L8 11.5 3.7 14l.8-4.6L1 6l4.8-.5z', '#c0a0e0'),
};

export function ic(name: string): string {
  return UI_ICON[name] ?? '';
}
