import { el } from './dom';
import { setScreen } from '../state';
import { ic } from './art';
import { t } from '../i18n';
import {
  isLinked,
  getCredentials,
  clearCredentials,
  getLastSyncAt,
  createSync,
  pairSync,
  pullSync,
  pushSync,
  pullFirebase,
  pushFirebase,
} from '../sync/sync';
import {
  isFirebaseConfigured,
  isFirebaseLinked,
  getFirebaseUser,
  googleSignIn,
  googleSignOut,
} from '../sync/firebase';

type Mode = 'idle' | 'busy' | 'showcode' | 'enter' | 'linked' | 'firebase';

export function renderSync(): HTMLElement {
  const wrapper = el('div', { class: 'rest-screen' });
  let mode: Mode = isFirebaseLinked() ? 'firebase' : isLinked() ? 'linked' : 'idle';
  let activeCode: string | null = null;
  let busyText = '';
  let errorText: string | null = null;
  let okText: string | null = null;

  const rebuild = () => {
    wrapper.innerHTML = '';
    append();
  };

  const append = () => {
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)' } }, `☁️ ${t('동기화')}`));
    wrapper.appendChild(
      el(
        'div',
        { style: { color: 'var(--muted)', maxWidth: '480px', textAlign: 'center', lineHeight: '1.5', marginBottom: '16px' } },
        t('여러 기기에서 같은 진행도를 공유합니다.'),
      ),
    );

    if (errorText) {
      wrapper.appendChild(
        (() => { const d = el('div', { style: { color: 'var(--bad)', marginBottom: '8px' } }); d.innerHTML = `${ic('warning')} ${errorText}`; return d; })(),
      );
    }
    if (okText) {
      wrapper.appendChild(
        el('div', { style: { color: 'var(--good)', marginBottom: '8px' } }, `✓ ${okText}`),
      );
    }

    if (mode === 'busy') {
      wrapper.appendChild(
        el('div', { style: { color: 'var(--muted)', marginTop: '24px' } }, busyText || t('동기화 중...')),
      );
      wrapper.appendChild(backButton());
      return;
    }

    // ── Firebase 로그인 상태 ──────────────────────────────────────
    if (mode === 'firebase') {
      const user = getFirebaseUser();
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
          el('div', { style: { color: 'var(--good)', fontWeight: 'bold', marginBottom: '6px' } }, `✓ Google ${t('로그인')}`),
          el(
            'div',
            { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' } },
            user?.displayName ?? user?.email ?? '',
          ),
        ),
      );

      const row = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' } });
      row.appendChild(
        el('button', {
          onClick: async () => {
            errorText = null; okText = null;
            busyText = t('클라우드에서 받아오는 중...');
            mode = 'busy'; rebuild();
            const r = await pullFirebase();
            mode = 'firebase';
            if ('error' in r) errorText = r.error;
            else okText = t('동기화 완료');
            rebuild();
          },
        }, `⬇ ${t('지금 받기')}`),
      );
      row.appendChild(
        el('button', {
          onClick: async () => {
            errorText = null; okText = null;
            busyText = t('클라우드에 올리는 중...');
            mode = 'busy'; rebuild();
            const r = await pushFirebase();
            mode = 'firebase';
            if (r.error) errorText = r.error;
            else okText = t('업로드 완료');
            rebuild();
          },
        }, `⬆ ${t('지금 올리기')}`),
      );
      wrapper.appendChild(row);

      const dangerRow = el('div', { style: { display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' } });
      dangerRow.appendChild(
        el('button', {
          style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
          onClick: async () => {
            await googleSignOut();
            mode = 'idle'; okText = t('로그아웃 완료');
            rebuild();
          },
        }, t('로그아웃')),
      );
      wrapper.appendChild(dangerRow);
      wrapper.appendChild(backButton());
      return;
    }

    // ── 코드 기반 동기화 연결됨 ──────────────────────────────────
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
          el('div', { style: { color: 'var(--good)', fontWeight: 'bold', marginBottom: '6px' } }, `✓ ${t('코드 동기화 켜짐')}`),
          el(
            'div',
            { style: { color: 'var(--muted)', fontSize: '12px', wordBreak: 'break-all', marginBottom: '6px' } },
            `ID: ${creds?.userId.slice(0, 8)}...`,
          ),
          el(
            'div',
            { style: { color: 'var(--muted)', fontSize: '12px' } },
            lastAt ? `${t('마지막 동기화')}: ${formatAgo(Date.now() - lastAt)} ${t('전')}` : t('아직 동기화한 적 없음'),
          ),
        ),
      );

      const row = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' } });
      row.appendChild(
        el('button', {
          onClick: async () => {
            errorText = null; okText = null;
            busyText = t('클라우드에서 받아오는 중...');
            mode = 'busy'; rebuild();
            const r = await pullSync();
            mode = 'linked';
            if ('error' in r) errorText = r.error;
            else okText = t('동기화 완료');
            rebuild();
          },
        }, `⬇ ${t('지금 받기')}`),
      );
      row.appendChild(
        el('button', {
          onClick: async () => {
            errorText = null; okText = null;
            busyText = t('클라우드에 올리는 중...');
            mode = 'busy'; rebuild();
            const r = await pushSync();
            mode = 'linked';
            if (r.error) errorText = r.error;
            else okText = t('업로드 완료');
            rebuild();
          },
        }, `⬆ ${t('지금 올리기')}`),
      );
      row.appendChild(
        el('button', {
          onClick: async () => {
            busyText = t('새 코드 생성 중...');
            mode = 'busy'; rebuild();
            try {
              const r = await createSync();
              activeCode = r.code;
              mode = 'showcode';
              okText = t('코드 생성 완료');
            } catch (e) { errorText = String(e); mode = 'linked'; }
            rebuild();
          },
        }, `🔗 ${t('다른 기기 추가')}`),
      );
      wrapper.appendChild(row);

      const dangerRow = el('div', { style: { display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' } });
      dangerRow.appendChild(
        el('button', {
          style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
          onClick: () => {
            const ok = confirm(t('이 기기에서 동기화를 끕니다. 데이터는 그대로 남아 있습니다.'));
            if (!ok) return;
            clearCredentials();
            mode = 'idle'; okText = t('동기화가 꺼졌습니다');
            rebuild();
          },
        }, t('동기화 끄기')),
      );
      wrapper.appendChild(dangerRow);
      wrapper.appendChild(backButton());
      return;
    }

    // ── 코드 보여주기 ─────────────────────────────────────────────
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
          el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '6px' } }, t('다른 기기에서 아래 코드를 입력하세요')),
          el(
            'div',
            {
              style: {
                fontSize: '36px', fontWeight: 'bold', color: 'var(--accent)',
                letterSpacing: '4px', fontFamily: 'monospace', margin: '8px 0',
              },
            },
            activeCode,
          ),
          el('div', { style: { color: 'var(--muted)', fontSize: '11px' } }, t('1시간 동안 유효')),
        ),
      );
      const row = el('div', { style: { display: 'flex', gap: '8px' } });
      row.appendChild(
        el('button', {
          onClick: async () => {
            try { await navigator.clipboard.writeText(activeCode!); okText = t('코드 복사됨'); }
            catch { errorText = t('클립보드 복사 실패'); }
            rebuild();
          },
        }, `📋 ${t('코드 복사')}`),
      );
      row.appendChild(
        el('button', {
          style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
          onClick: () => { mode = isLinked() ? 'linked' : 'idle'; activeCode = null; rebuild(); },
        }, t('닫기')),
      );
      wrapper.appendChild(row);
      wrapper.appendChild(backButton());
      return;
    }

    // ── 코드 입력 ─────────────────────────────────────────────────
    if (mode === 'enter') {
      const codeInput = el('input', {
        type: 'text',
        placeholder: 'DNC-XXXX',
        style: {
          fontSize: '20px', padding: '12px 16px', textAlign: 'center',
          letterSpacing: '3px', fontFamily: 'monospace', textTransform: 'uppercase',
          width: '240px', background: 'var(--card-bg, #1a1416)',
          color: 'var(--text)', border: '2px solid var(--border)', borderRadius: '8px',
        },
      }) as HTMLInputElement;
      wrapper.appendChild(
        el('div', { style: { color: 'var(--muted)', marginBottom: '12px', fontSize: '13px' } }, t('다른 기기의 8자리 코드 입력')),
      );
      wrapper.appendChild(codeInput);
      const row = el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } });
      row.appendChild(
        el('button', {
          onClick: async () => {
            const code = codeInput.value.trim().toUpperCase();
            if (!/^DNC-[A-Z0-9]{4}$/.test(code)) {
              errorText = t('형식이 맞지 않습니다. 예: DNC-4F2X');
              rebuild(); return;
            }
            errorText = null; okText = null;
            busyText = t('연결 중...');
            mode = 'busy'; rebuild();
            try {
              const r = await pairSync(code);
              mode = 'linked';
              okText = r.merged ? t('연결 및 데이터 합치기 완료') : t('연결 완료');
            } catch (e) { errorText = `${t('연결 실패')}: ${e}`; mode = 'enter'; }
            rebuild();
          },
        }, t('연결')),
      );
      row.appendChild(
        el('button', {
          style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
          onClick: () => { mode = 'idle'; rebuild(); },
        }, t('취소')),
      );
      wrapper.appendChild(row);
      wrapper.appendChild(backButton());
      return;
    }

    // ── idle: 로그인/동기화 선택 ──────────────────────────────────
    if (isFirebaseConfigured()) {
      wrapper.appendChild(
        el('button', {
          style: { fontSize: '16px', padding: '14px 28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
          onClick: async () => {
            errorText = null; okText = null;
            busyText = t('Google 로그인 중...');
            mode = 'busy'; rebuild();
            try {
              await googleSignIn();
              const r = await pullFirebase();
              mode = 'firebase';
              if ('error' in r) errorText = r.error;
              else if (r.changed) okText = t('클라우드 데이터와 합침 완료');
              else {
                await pushFirebase();
                okText = t('로그인 완료 — 데이터 업로드됨');
              }
            } catch (e: any) {
              if (e?.code !== 'auth/popup-closed-by-user') errorText = String(e);
              mode = 'idle';
            }
            rebuild();
          },
        }, `🔵 Google ${t('로그인')}`),
      );

      wrapper.appendChild(
        el('div', { style: { color: 'var(--muted)', fontSize: '11px', marginBottom: '16px' } }, t('또는')),
      );
    }

    wrapper.appendChild(
      el('button', {
        style: { fontSize: '14px', padding: '12px 24px', marginBottom: '8px' },
        onClick: async () => {
          errorText = null; okText = null;
          busyText = t('새 코드 생성 중...');
          mode = 'busy'; rebuild();
          try {
            const r = await createSync();
            activeCode = r.code;
            mode = 'showcode';
            okText = t('코드 생성 완료');
          } catch (e) { errorText = String(e); mode = 'idle'; }
          rebuild();
        },
      }, `🆕 ${t('코드로 새 동기화')}`),
    );
    wrapper.appendChild(
      el('button', {
        style: { fontSize: '14px', padding: '12px 24px', marginBottom: '8px' },
        onClick: () => { mode = 'enter'; rebuild(); },
      }, `🔑 ${t('코드 입력해서 연결')}`),
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
    `← ${t('제목 화면으로')}`,
  );
}

function formatAgo(ms: number): string {
  if (ms < 60_000) return t('방금');
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}${t('분')}`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}${t('시간')}`;
  const day = Math.floor(hr / 24);
  return `${day}${t('일')}`;
}
