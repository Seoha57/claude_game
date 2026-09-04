import type { StatusKey } from '../types';

interface KeywordDef {
  cls: string;
  color: string;
}

const KEYWORD_DEFS: Record<string, KeywordDef> = {
  '취약': { cls: 'vulnerable', color: '#ff6b6b' },
  '약화': { cls: 'weak', color: '#ffa502' },
  '중독': { cls: 'poison', color: '#2ed573' },
  '화상': { cls: 'burn', color: '#ff6348' },
  '빙결': { cls: 'freeze', color: '#70a1ff' },
  '쇠약': { cls: 'frail', color: '#a29bfe' },
  '힘': { cls: 'strength', color: '#ff4757' },
  '민첩': { cls: 'dexterity', color: '#54a0ff' },
  '재생': { cls: 'regen', color: '#7bed9f' },
  '가시': { cls: 'thorns', color: '#ff9f43' },
  '의식': { cls: 'ritual', color: '#feca57' },
  '금속화': { cls: 'metallicize', color: '#c8d6e5' },
  '소멸': { cls: 'exhaust', color: '#a29bfe' },
  '선천': { cls: 'innate', color: '#ffeaa7' },
  '유지': { cls: 'retain', color: '#81ecec' },
  '영체': { cls: 'ethereal', color: '#dfe6e9' },
};

const keywords = Object.keys(KEYWORD_DEFS).sort((a, b) => b.length - a.length);
const KW_PATTERN = new RegExp(`(${keywords.join('|')})(\\s*[+\\-]\\d+)?`, 'g');

export function kwDesc(text: string): HTMLElement {
  const span = document.createElement('span');
  let lastIndex = 0;
  KW_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = KW_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      span.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const keyword = match[1];
    const suffix = match[2] || '';
    const def = KEYWORD_DEFS[keyword];
    const kwSpan = document.createElement('span');
    kwSpan.className = `kw kw-${def.cls}`;
    kwSpan.textContent = keyword + suffix;
    span.appendChild(kwSpan);
    lastIndex = KW_PATTERN.lastIndex;
  }
  if (lastIndex < text.length) {
    span.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  return span;
}

export const STATUS_ICON: Record<StatusKey, string> = {
  strength: '⚔',
  dexterity: '🛡',
  vulnerable: '💔',
  weak: '⬇',
  poison: '☠',
  thorns: '🌵',
  regen: '💚',
  frail: '🦴',
  ritual: '🕯',
  metallicize: '🔩',
  burn: '🔥',
  freeze: '❄',
  on_exhaust_str: '💀',
  on_exhaust_draw: '📤',
  on_exhaust_block: '🛡',
  on_exhaust_energy: '⚡',
};
