import type { RunState } from '../types';
import { CHAR_NAMES } from './art';
import { RELIC_DEFS } from '../content/relics';
import { getEffectiveDef } from '../content/cards';
import { isCurseLike } from './deck-overlay';
import { t } from '../i18n';

function drawShareCard(run: RunState, won: boolean): HTMLCanvasElement {
  const W = 600;
  const H = 400;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext('2d')!;

  // Background
  const grad = c.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a1416');
  grad.addColorStop(1, '#2a1f22');
  c.fillStyle = grad;
  c.fillRect(0, 0, W, H);

  // Border
  c.strokeStyle = won ? '#d4a05b' : '#c84030';
  c.lineWidth = 3;
  c.strokeRect(2, 2, W - 4, H - 4);

  // Title
  c.font = 'bold 28px system-ui, sans-serif';
  c.fillStyle = won ? '#d4a05b' : '#c84030';
  c.textAlign = 'center';
  c.fillText(won ? t('승리!') : t('패배...'), W / 2, 48);

  // Game name
  c.font = '12px system-ui, sans-serif';
  c.fillStyle = '#8a7a82';
  c.fillText(t('덱 오브 던전'), W / 2, 68);

  // Divider
  c.strokeStyle = '#50404a';
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(40, 80);
  c.lineTo(W - 40, 80);
  c.stroke();

  // Character info
  c.textAlign = 'left';
  c.font = 'bold 18px system-ui, sans-serif';
  c.fillStyle = '#e8dac8';
  const charName = CHAR_NAMES[run.characterClass] ?? run.characterClass;
  c.fillText(charName, 40, 110);

  if (run.ascension > 0) {
    c.font = '14px system-ui, sans-serif';
    c.fillStyle = '#d4a05b';
    c.fillText(`A${run.ascension}`, 40 + c.measureText(charName).width + 12, 110);
  }

  // Chapter/Floor
  c.font = '14px system-ui, sans-serif';
  c.fillStyle = '#8a7a82';
  c.fillText(`챕터 ${run.chapter} · ${run.floor}층`, 40, 134);

  // Stats grid
  const stats = [
    ['HP', `${run.player.hp}/${run.player.maxHp}`],
    ['덱', `${run.player.deck.length}장`],
    ['골드', `${run.player.gold}`],
    ['유물', `${run.player.relics.length}개`],
  ];

  const attacks = run.player.deck.filter(cd => { const d = getEffectiveDef(cd); return !isCurseLike(d.id) && d.type === 'attack'; }).length;
  const skills = run.player.deck.filter(cd => { const d = getEffectiveDef(cd); return !isCurseLike(d.id) && d.type === 'skill'; }).length;
  const powers = run.player.deck.filter(cd => { const d = getEffectiveDef(cd); return !isCurseLike(d.id) && d.type === 'power'; }).length;

  const combats = run.map.filter(n => n.visited && (n.kind === 'combat' || n.kind === 'elite' || n.kind === 'boss')).length;

  c.font = 'bold 14px system-ui, sans-serif';
  let sx = 40;
  const sy = 170;
  for (const [label, value] of stats) {
    c.fillStyle = '#8a7a82';
    c.fillText(label, sx, sy);
    c.fillStyle = '#e8dac8';
    c.fillText(value, sx, sy + 20);
    sx += 130;
  }

  // Deck composition + combats
  c.font = '13px system-ui, sans-serif';
  c.fillStyle = '#8a7a82';
  c.fillText(`공격 ${attacks} · 방어 ${skills} · 효과 ${powers} · ${combats}전투`, 40, sy + 52);

  // Relics
  c.strokeStyle = '#50404a';
  c.beginPath();
  c.moveTo(40, sy + 68);
  c.lineTo(W - 40, sy + 68);
  c.stroke();

  c.font = 'bold 13px system-ui, sans-serif';
  c.fillStyle = '#d4a05b';
  c.fillText(`유물 (${run.player.relics.length})`, 40, sy + 90);

  c.font = '12px system-ui, sans-serif';
  c.fillStyle = '#e8dac8';
  let rx = 40;
  let ry = sy + 110;
  for (const id of run.player.relics) {
    const def = RELIC_DEFS[id];
    if (!def) continue;
    const tw = c.measureText(def.name).width + 16;
    if (rx + tw > W - 40) {
      rx = 40;
      ry += 24;
    }
    c.fillStyle = '#362a30';
    c.beginPath();
    if (c.roundRect) {
      c.roundRect(rx, ry - 14, tw, 20, 4);
    } else {
      c.rect(rx, ry - 14, tw, 20);
    }
    c.fill();
    c.fillStyle = '#e8dac8';
    c.fillText(def.name, rx + 8, ry);
    rx += tw + 6;
  }

  // Watermark
  c.font = '11px system-ui, sans-serif';
  c.fillStyle = '#50404a';
  c.textAlign = 'right';
  c.fillText('deck-of-dungeon.pages.dev', W - 20, H - 16);

  return canvas;
}

export async function shareRun(run: RunState, won: boolean): Promise<void> {
  const canvas = drawShareCard(run, won);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;

  const charName = CHAR_NAMES[run.characterClass] ?? run.characterClass;
  const title = won ? '승리!' : '패배...';
  const text = `${title} ${charName} · 챕터${run.chapter} ${run.floor}층 · 덱 오브 던전`;

  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'run-result.png', { type: 'image/png' });
    const shareData = { text, files: [file] };
    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch { /* user cancelled or error */ }
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    showCopyToast();
  } catch {
    // Final fallback: open in new tab
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

function showCopyToast(): void {
  const toast = document.createElement('div');
  toast.textContent = t('결과 이미지가 클립보드에 복사되었습니다!');
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--accent)',
    color: '#1a1416',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    zIndex: '2000',
    animation: 'pwa-slide-up 0.3s ease',
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'pwa-slide-down 0.25s ease forwards';
    setTimeout(() => toast.remove(), 260);
  }, 2000);
}
