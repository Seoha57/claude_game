import { el } from './dom';
import { setScreen } from '../state';
import {
  isLinked,
  getCredentials,
  clearCredentials,
  getLastSyncAt,
  createSync,
  pairSync,
  pullSync,
  pushSync,
} from '../sync/sync';

type Mode = 'idle' | 'busy' | 'showcode' | 'enter' | 'linked';

export function renderSync(): HTMLElement {
  const wrapper = el('div', { class: 'rest-screen' });
  let mode: Mode = isLinked() ? 'linked' : 'idle';
  let activeCode: string | null = null;
  let busyText = '';
  let errorText: string | null = null;
  let okText: string | null = null;

  const rebuild = () => {
    wrapper.innerHTML = '';
    append();
  };

  const append = () => {
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)' } }, '☁️ 동기화'));
    wrapper.appendChild(
      el(
        'div',
        { style: { color: 'var(--muted)', maxWidth: '480px', textAlign: 'center', lineHeight: '1.5', marginBottom: '16px' } },
        '여러 기기에서 같은 진행도(도전과제·도감·통계·세이브·설정)를 공유합니다. 로그인 없이 8자리 코드만 사용해요.',
      ),
    );

    if (errorText) {
      wrapper.appendChild(
        el('div', { style: { color: 'var(--bad)', marginBottom: '8px' } }, `⚠️ ${errorText}`),
      );
    }
    if (okText) {
      wrapper.appendChild(
        el('div', { style: { color: 'var(--good)', marginBottom: '8px' } }, `✓ ${okText}`),
      );
    }

    if (mode === 'busy') {
      wrapper.appendChild(
        el('div', { style: { color: 'var(--muted)', marginTop: '24px' } }, busyText || '동기화 중...'),
      );
      wrapper.appendChild(backButton());
      return;
    }

    if (mode === 'linked') {
      const creds = getCredentials();
      const lastAt = getLastSyncAt();
      wrapper.appendChild(
        el(
          'div',
          {
            style: {
              padding: '16px',
              background: 'rgba(80,180,80,0.10)',
              border: '1px solid rgba(80,180,80,0.4)',
              borderRadius: '8px',
              marginBottom: '16px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
            },
          },
          el('div', { style: { color: 'var(--good)', fontWeight: 'bold', marginBottom: '6px' } }, '✓ 동기화 켜짐'),
          el(
            'div',
            { style: { color: 'var(--muted)', fontSize: '12px', wordBreak: 'break-all', marginBottom: '6px' } },
            `사용자 ID: ${creds?.userId.slice(0, 8)}...`,
          ),
          el(
            'div',
            { style: { color: 'var(--muted)', fontSize: '12px' } },
            lastAt ? `마지막 동기화: ${formatAgo(Date.now() - lastAt)} 전` : '아직 동기화한 적 없음',
          ),
        ),
      );

      const row = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' } });
      row.appendChild(
        el(
          'button',
          {
            onClick: async () => {
              errorText = null;
              okText = null;
              busyText = '클라우드에서 받아오는 중...';
              mode = 'busy';
              rebuild();
              const r = await pullSync();
              mode = 'linked';
              if ('error' in r) errorText = r.error;
              else okText = '동기화 완료';
              rebuild();
            },
          },
          '⬇ 지금 받기 (Pull)',
        ),
      );
      row.appendChild(
        el(
          'button',
          {
            onClick: async () => {
              errorText = null;
              okText = null;
              busyText = '클라우드에 올리는 중...';
              mode = 'busy';
              rebuild();
              const r = await pushSync();
              mode = 'linked';
              if (r.error) errorText = r.error;
              else okText = '업로드 완료';
              rebuild();
            },
          },
          '⬆ 지금 올리기 (Push)',
        ),
      );
      row.appendChild(
        el(
          'button',
          {
            onClick: async () => {
              busyText = '새 페어링 코드 생성 중...';
              mode = 'busy';
              rebuild();
              try {
                const r = await createSync();
                activeCode = r.code;
                mode = 'showcode';
                okText = '코드 생성 완료 — 다른 기기에서 입력하세요';
              } catch (e) {
                errorText = String(e);
                mode = 'linked';
              }
              rebuild();
            },
          },
          '🔗 다른 기기 추가',
        ),
      );
      wrapper.appendChild(row);

      const dangerRow = el('div', { style: { display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' } });
      dangerRow.appendChild(
        el(
          'button',
          {
            style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
            onClick: () => {
              const ok = confirm('이 기기에서 동기화를 끕니다. 클라우드의 데이터는 그대로 남아 있으며, 코드를 알면 다시 연결 가능합니다.');
              if (!ok) return;
              clearCredentials();
              mode = 'idle';
              okText = '동기화가 꺼졌습니다';
              rebuild();
            },
          },
          '동기화 끄기',
        ),
      );
      wrapper.appendChild(dangerRow);
      wrapper.appendChild(backButton());
      return;
    }

    if (mode === 'showcode' && activeCode) {
      wrapper.appendChild(
        el(
          'div',
          {
            style: {
              padding: '20px 24px',
              background: 'rgba(212,160,91,0.10)',
              border: '2px solid var(--accent)',
              borderRadius: '12px',
              marginBottom: '12px',
              textAlign: 'center',
            },
          },
          el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '6px' } }, '다른 기기에서 아래 코드를 입력하세요'),
          el(
            'div',
            {
              style: {
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'var(--accent)',
                letterSpacing: '4px',
                fontFamily: 'monospace',
                margin: '8px 0',
              },
            },
            activeCode,
          ),
          el('div', { style: { color: 'var(--muted)', fontSize: '11px' } }, '1시간 동안 유효'),
        ),
      );
      const row = el('div', { style: { display: 'flex', gap: '8px' } });
      row.appendChild(
        el(
          'button',
          {
            onClick: async () => {
              try {
                await navigator.clipboard.writeText(activeCode!);
                okText = '코드 복사됨';
              } catch {
                errorText = '클립보드 복사 실패 — 직접 메모해주세요';
              }
              rebuild();
            },
          },
          '📋 코드 복사',
        ),
      );
      row.appendChild(
        el(
          'button',
          {
            style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
            onClick: () => { mode = isLinked() ? 'linked' : 'idle'; activeCode = null; rebuild(); },
          },
          '닫기',
        ),
      );
      wrapper.appendChild(row);
      wrapper.appendChild(backButton());
      return;
    }

    if (mode === 'enter') {
      const codeInput = el('input', {
        type: 'text',
        placeholder: 'DNC-XXXX',
        style: {
          fontSize: '20px',
          padding: '12px 16px',
          textAlign: 'center',
          letterSpacing: '3px',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          width: '240px',
          background: 'var(--card-bg, #1a1416)',
          color: 'var(--text)',
          border: '2px solid var(--border)',
          borderRadius: '8px',
        },
      }) as HTMLInputElement;
      wrapper.appendChild(
        el('div', { style: { color: 'var(--muted)', marginBottom: '12px', fontSize: '13px' } }, '다른 기기에서 생성한 8자리 코드 입력'),
      );
      wrapper.appendChild(codeInput);
      const row = el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } });
      row.appendChild(
        el(
          'button',
          {
            onClick: async () => {
              const code = codeInput.value.trim().toUpperCase();
              if (!/^DNC-[A-Z0-9]{4}$/.test(code)) {
                errorText = '형식이 맞지 않습니다. 예: DNC-4F2X';
                rebuild();
                return;
              }
              errorText = null;
              okText = null;
              busyText = '연결 중...';
              mode = 'busy';
              rebuild();
              try {
                const r = await pairSync(code);
                mode = 'linked';
                okText = r.merged ? '연결 및 기존 데이터 합치기 완료' : '연결 완료';
              } catch (e) {
                errorText = `연결 실패: ${e}`;
                mode = 'enter';
              }
              rebuild();
            },
          },
          '연결',
        ),
      );
      row.appendChild(
        el(
          'button',
          {
            style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
            onClick: () => { mode = 'idle'; rebuild(); },
          },
          '취소',
        ),
      );
      wrapper.appendChild(row);
      wrapper.appendChild(backButton());
      return;
    }

    // idle
    wrapper.appendChild(
      el(
        'button',
        {
          style: { fontSize: '16px', padding: '14px 28px', marginBottom: '8px' },
          onClick: async () => {
            errorText = null;
            okText = null;
            busyText = '새 동기화 코드 생성 중...';
            mode = 'busy';
            rebuild();
            try {
              const r = await createSync();
              activeCode = r.code;
              mode = 'showcode';
              okText = '코드가 생성되었습니다 — 다른 기기에서 입력하세요';
            } catch (e) {
              errorText = String(e);
              mode = 'idle';
            }
            rebuild();
          },
        },
        '🆕 새 동기화 시작',
      ),
    );
    wrapper.appendChild(
      el(
        'button',
        {
          style: { fontSize: '16px', padding: '14px 28px', marginBottom: '8px' },
          onClick: () => { mode = 'enter'; rebuild(); },
        },
        '🔑 코드 입력해서 연결',
      ),
    );
    wrapper.appendChild(backButton());
  };

  append();
  return wrapper;
}

function backButton(): HTMLElement {
  return el(
    'button',
    {
      style: { marginTop: '24px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
      onClick: () => setScreen('title'),
    },
    '← 제목으로',
  );
}

function formatAgo(ms: number): string {
  if (ms < 60_000) return '방금';
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}분`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간`;
  const day = Math.floor(hr / 24);
  return `${day}일`;
}
