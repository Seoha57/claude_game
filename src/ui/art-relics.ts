// 유물 아트. art.ts에서 떼어냈다 — 순수 데이터.
import { C, p, ci, rc } from './art-shapes';

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

  lucky_die: C(
    rc(18, 18, 28, 28, '#e8d8c0') +
    rc(20, 20, 24, 24, '#f0e8d8') +
    ci(26, 26, 2, '#d4af37') +
    ci(38, 26, 2, '#d4af37') +
    ci(26, 38, 2, '#d4af37') +
    ci(38, 38, 2, '#d4af37') +
    ci(32, 32, 2, '#d4af37') +
    ci(32, 32, 8, '#ffd70033')
  ),

  // ── UNCOMMON RELICS ──

  golden_chip: C(
    ci(32, 32, 18, '#c8a020') +
    ci(32, 32, 15, '#d4b030') +
    ci(32, 32, 12, '#e0c040') +
    rc(26, 26, 12, 12, '#f0d860') +
    p('M28 28 L36 28 L36 36 L28 36Z', '#c8a020') +
    ci(32, 32, 3, '#f0d860')
  ),

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

  // 🔧 공학자 유물
  drone_core: C(
    ci(32, 32, 20, '#3a3a3a') +
    ci(32, 32, 16, '#505050') +
    rc(24, 24, 16, 16, '#707070') +
    ci(32, 32, 8, '#ff8030') +
    ci(32, 32, 4, '#ffc060') +
    ci(32, 30, 2, '#ffffff') +
    p('M20 18 L26 14 L26 20 L20 22Z', '#808080') +
    p('M44 18 L38 14 L38 20 L44 22Z', '#808080') +
    p('M20 46 L26 50 L26 44 L20 42Z', '#808080') +
    p('M44 46 L38 50 L38 44 L44 42Z', '#808080')
  ),

  energy_battery: C(
    rc(18, 12, 28, 44, '#404040') +
    rc(20, 14, 24, 40, '#606060') +
    rc(26, 8, 12, 6, '#808080') +
    p('M22 20 L42 20 L42 28 L22 28Z', '#40c040') +
    p('M22 32 L42 32 L42 40 L22 40Z', '#30a030') +
    p('M22 44 L42 44 L42 50 L22 50Z', '#208020') +
    ci(32, 24, 2, '#80ff80') +
    p('M30 16 L34 16 L34 18 L30 18Z', '#ffcc00')
  ),

  prototype_chip: C(
    rc(14, 14, 36, 36, '#2a5030') +
    rc(16, 16, 32, 32, '#306038') +
    ci(32, 32, 10, '#404040') +
    ci(32, 32, 6, '#606060') +
    ci(32, 32, 3, '#ff6030') +
    p('M10 22 L14 22 L14 26 L10 26Z', '#808080') +
    p('M10 38 L14 38 L14 42 L10 42Z', '#808080') +
    p('M50 22 L54 22 L54 26 L50 26Z', '#808080') +
    p('M50 38 L54 38 L54 42 L50 42Z', '#808080') +
    p('M22 10 L26 10 L26 14 L22 14Z', '#808080') +
    p('M38 10 L42 10 L42 14 L38 14Z', '#808080') +
    p('M22 50 L26 50 L26 54 L22 54Z', '#808080') +
    p('M38 50 L42 50 L42 54 L38 54Z', '#808080')
  ),

  lucky_coin: C(
    ci(32, 32, 18, '#c8a020') +
    ci(32, 32, 15, '#e0c040') +
    ci(32, 32, 12, '#f0d860') +
    ci(32, 32, 3, '#c8a020') +
    p('M30 26 L34 26 L34 38 L30 38Z', '#c8a020') +
    p('M26 30 L38 30 L38 34 L26 34Z', '#c8a020')
  ),

  gamblers_instinct: C(
    rc(16, 16, 32, 32, '#2a1a30') +
    rc(18, 18, 28, 28, '#3a2a40') +
    ci(32, 28, 6, '#f0f0f0') +
    ci(29, 26, 1, '#222') +
    ci(35, 26, 1, '#222') +
    ci(32, 30, 1, '#222') +
    ci(32, 38, 4, '#c03030') +
    p('M28 42 L36 42 L34 48 L30 48Z', '#c03030')
  ),

  loaded_die: C(
    rc(14, 14, 36, 36, '#f0f0f0') +
    rc(16, 16, 32, 32, '#e8e0d0') +
    ci(24, 24, 2, '#c03030') +
    ci(40, 24, 2, '#c03030') +
    ci(24, 40, 2, '#c03030') +
    ci(40, 40, 2, '#c03030') +
    ci(32, 32, 2, '#c03030') +
    ci(24, 32, 2, '#c03030') +
    ci(40, 32, 2, '#c03030')
  ),

  // ── Blood Mage relics ──

  blood_chalice: C(
    // Chalice cup
    p('M22 16 L42 16 L40 36 L38 40 L26 40 L24 36Z', '#8b0000') +
    p('M24 18 L40 18 L38 34 L36 38 L28 38 L26 34Z', '#cc2020') +
    // Blood inside
    ci(32, 28, 6, '#ff2020') +
    ci(32, 26, 3, '#ff6060') +
    // Stem
    rc(30, 40, 4, 10, '#8b0000') +
    // Base
    p('M24 50 L40 50 L42 54 L22 54Z', '#8b0000')
  ),

  hemomancy_core: C(
    // Outer diamond
    p('M32 8 L52 32 L32 56 L12 32Z', '#3a0a0a') +
    p('M32 12 L48 32 L32 52 L16 32Z', '#5a1010') +
    // Inner core
    ci(32, 32, 10, '#8b0000') +
    ci(32, 32, 6, '#cc2020') +
    ci(32, 30, 3, '#ff4040') +
    // Blood veins
    p('M22 22 L28 28', '#cc202060') +
    p('M42 22 L36 28', '#cc202060') +
    p('M22 42 L28 36', '#cc202060') +
    p('M42 42 L36 36', '#cc202060')
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
