import { el } from './dom';

const DISMISS_KEY = 'dod_pwa_dismiss';
const DISMISS_DAYS = 7;

let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner();
});

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true;
}

function isDismissed(): boolean {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < DISMISS_DAYS * 86400_000;
  } catch { return false; }
}

function showInstallBanner(): void {
  if (isStandalone() || isDismissed() || !deferredPrompt) return;

  const banner = el('div', {
    style: {
      position: 'fixed',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '1500',
      background: 'linear-gradient(135deg, #2a1f0e, #1a1010)',
      border: '1px solid var(--accent)',
      borderRadius: '12px',
      padding: '12px 16px',
      maxWidth: '360px',
      width: 'calc(100vw - 32px)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      animation: 'pwa-slide-up 0.3s ease',
    },
  });

  const text = el('div', { style: { flex: '1', minWidth: '0' } },
    el('div', { style: { fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)' } }, '홈 화면에 추가'),
    el('div', { style: { fontSize: '11px', color: 'var(--muted)', marginTop: '2px' } }, '앱처럼 바로 실행할 수 있어요'),
  );

  const installBtn = el('button', {
    style: {
      padding: '6px 14px',
      fontSize: '12px',
      fontWeight: 'bold',
      background: 'var(--accent)',
      color: '#1a1416',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    onClick: async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') {
        banner.remove();
      }
    },
  }, '설치');

  const closeBtn = el('button', {
    style: {
      padding: '4px',
      fontSize: '16px',
      background: 'none',
      border: 'none',
      color: 'var(--muted)',
      cursor: 'pointer',
      lineHeight: '1',
    },
    onClick: () => {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
      banner.style.animation = 'pwa-slide-down 0.25s ease forwards';
      setTimeout(() => banner.remove(), 260);
    },
  }, '✕');

  banner.appendChild(text);
  banner.appendChild(installBtn);
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);
}

export function initPwaInstall(): void {
  // iOS Safari doesn't fire beforeinstallprompt, show manual instructions
  if (isStandalone() || isDismissed()) return;
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  if (isIos && !isStandalone()) {
    setTimeout(() => showIosBanner(), 3000);
  }
}

function showIosBanner(): void {
  if (isDismissed() || isStandalone()) return;

  const banner = el('div', {
    style: {
      position: 'fixed',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '1500',
      background: 'linear-gradient(135deg, #2a1f0e, #1a1010)',
      border: '1px solid var(--accent)',
      borderRadius: '12px',
      padding: '12px 16px',
      maxWidth: '360px',
      width: 'calc(100vw - 32px)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      animation: 'pwa-slide-up 0.3s ease',
    },
  });

  const text = el('div', { style: { flex: '1', minWidth: '0' } },
    el('div', { style: { fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)' } }, '홈 화면에 추가'),
    el('div', { style: { fontSize: '11px', color: 'var(--muted)', marginTop: '2px', lineHeight: '1.4' } }, '공유 ↑ → "홈 화면에 추가"를 눌러주세요'),
  );

  const closeBtn = el('button', {
    style: {
      padding: '4px',
      fontSize: '16px',
      background: 'none',
      border: 'none',
      color: 'var(--muted)',
      cursor: 'pointer',
      lineHeight: '1',
    },
    onClick: () => {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
      banner.style.animation = 'pwa-slide-down 0.25s ease forwards';
      setTimeout(() => banner.remove(), 260);
    },
  }, '✕');

  banner.appendChild(text);
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);
}
