# 덱 오브 던전

브라우저에서 바로 하는 덱빌더 로그라이트. https://deck-of-dungeon.pages.dev

- 10개 직업, 200장이 넘는 카드, 4챕터 던전
- 등반 단계 A0~A10, 클리어 뒤 무한 던전과 리더보드
- 일일 도전, 도전 링크 공유, 도감·업적
- 한국어 / 영어
- PWA라서 설치하면 오프라인에서도 돈다
- 기기 간 진행도 동기화 (페어링 코드 또는 구글 로그인)

## 개발

Node 20이 필요하다. 18에서는 빌드 마지막 단계(서비스워커 생성)가 죽는다.

```bash
nvm use          # .nvmrc → 20
npm ci
npm run dev      # 개발 서버
npm run build    # 타입 검사 + 프로덕션 빌드
npm test         # 유닛 테스트 (vitest)
npm run test:e2e # 브라우저 테스트 (playwright, firefox)
```

## 밸런스 시뮬레이터

AI가 게임을 대신 수천 판 돌려 직업별 승률을 잰다. 밸런스를 바꿀 때는 감이 아니라 이 숫자로 판단한다.

| 명령 | 보는 것 |
|---|---|
| `npm run sim -- 200 [등반]` | 시작 덱만으로 전투. 시작 덱·시작 유물의 균형 |
| `npm run sim:run -- 100 [등반]` | 맵을 실제로 걸어 끝까지. 실제 플레이에 가장 가까운 승률 |
| `npm run sim:level -- 2000 <등반>` | 등반 단계 하나를 직업별로 비교 |
| `npm run sim:asc -- 200` | A0~A10 난이도 곡선 |
| `npm run sim:endless -- 100` | 무한 던전 생존 웨이브 |

직업끼리 비교할 때는 직업당 2000판 이상으로 잰다. 600판에서는 표준오차가 1%p를 넘어서 잡음을 결론으로 착각하기 쉽다. 지난 실험 기록은 `tools/` 아래 각 시뮬 파일 머리 주석에 있다.

## 구조

| 경로 | 내용 |
|---|---|
| `src/content/` | 카드·유물·적·이벤트·포션 정의와 영어 텍스트 |
| `src/combat/` | 전투 규칙과 효과 |
| `src/run/`, `src/map/` | 런 진행 규칙, 맵 생성 |
| `src/state.ts` | 런 상태, 저장, 화면 전환, 직업별 시작 HP·덱·유물 |
| `src/ui/` | 화면 |
| `src/sim/`, `tools/` | 밸런스 시뮬레이터 |
| `src/sync/` | 동기화 클라이언트 |
| `functions/` | Cloudflare Pages Functions (동기화 API, 무한 던전 리더보드) |
| `e2e/` | 브라우저 테스트 |

## 배포

`main`에 푸시하면 Cloudflare Pages가 빌드해 배포한다. GitHub Actions CI는 빌드, 유닛 테스트, 시뮬 스모크, e2e 테스트를 돌린다.

동기화 API를 쓰려면 Pages 프로젝트에 KV 바인딩이 있어야 한다. 처음 한 번 하는 설정은 [SYNC_SETUP.md](SYNC_SETUP.md)에 있다.
