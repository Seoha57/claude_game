import { el } from './dom';

const NOTICE_KEY = 'dod_rebrand_seen';

export function showRebrandNotice(): void {
  if (localStorage.getItem(NOTICE_KEY)) return;

  const backdrop = el('div', {
    style: {
      position: 'fixed',
      inset: '0',
      zIndex: '2000',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'rebrand-fade-in 0.3s ease',
    },
  });

  const card = el(
    'div',
    {
      style: {
        background: 'linear-gradient(135deg, #2a1f0e, #1a1010)',
        border: '2px solid var(--accent)',
        borderRadius: '14px',
        padding: '28px 24px',
        maxWidth: '340px',
        width: '90vw',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 30px rgba(212,160,91,0.3)',
      },
    },
    el('div', { style: { fontSize: '42px', marginBottom: '12px' } }, '⚔️✨'),
    el('div', {
      style: { fontSize: '18px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '8px' },
    }, '덱 오브 던전'),
    el('div', {
      style: { fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: '1.6' },
    }, '던전앤카드가 덱 오브 던전으로 새롭게 태어났습니다!\n캐릭터와 카드 이름이 판타지 세계관에 맞게 변경되었어요.'),
    el('div', {
      style: {
        fontSize: '12px',
        color: 'var(--fg)',
        background: 'rgba(212,160,91,0.08)',
        border: '1px solid rgba(212,160,91,0.25)',
        borderRadius: '8px',
        padding: '10px 12px',
        marginBottom: '20px',
        lineHeight: '1.5',
      },
    }, '📱 바로가기 이름이 예전 그대로라면,\n삭제 후 다시 추가해 주세요.\n(세이브는 유지됩니다)'),
    el('button', {
      style: {
        marginTop: '4px',
        padding: '10px 32px',
        fontSize: '15px',
        fontWeight: 'bold',
      },
      onClick: () => {
        localStorage.setItem(NOTICE_KEY, '1');
        backdrop.style.animation = 'rebrand-fade-out 0.25s ease forwards';
        setTimeout(() => backdrop.remove(), 260);
      },
    }, '확인'),
  );

  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
}
