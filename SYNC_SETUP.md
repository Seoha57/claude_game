# 동기화 (Cloud Sync) 설정 가이드

이 문서는 Cloudflare Pages에서 KV 네임스페이스를 생성하고 프로젝트에 바인딩하는 1회성 설정을 안내합니다. 한 번만 하면 됩니다.

## 1. Cloudflare 대시보드에서 KV 네임스페이스 만들기

1. https://dash.cloudflare.com → 왼쪽 사이드바 **"Workers & Pages"** 클릭
2. 상단 탭에서 **"KV"** 선택
3. **"Create namespace"** 버튼 클릭
4. 이름: `dungeoncard-sync` (아무 이름이어도 됨, 기억만 하기)
5. **"Add"** 클릭

생성된 KV 네임스페이스가 목록에 나타납니다.

## 2. Pages 프로젝트에 KV 바인딩 추가

1. 왼쪽 사이드바 **"Workers & Pages"** → 상단 **"Overview"** 탭
2. 프로젝트 목록에서 **"dungeoncard"** (또는 본인 프로젝트명) 클릭
3. 상단 탭 **"Settings"** 클릭
4. 왼쪽 메뉴 **"Bindings"** 선택 (구버전이면 "Functions" → "KV namespace bindings")
5. **"Add binding"** → **"KV namespace"** 선택
6. 설정:
   - **Variable name**: `SYNC_KV` ← **이 이름 정확히 일치해야 함**
   - **KV namespace**: 방금 만든 `dungeoncard-sync` 선택
7. **"Save"**

> ⚠️ 변수명은 반드시 `SYNC_KV` (대문자, 언더스코어). 다른 이름이면 Functions가 KV를 못 찾아 500 에러 납니다.

## 3. Production / Preview 둘 다 바인딩

5번 단계에서 Production만 적용됩니다. Preview 환경에서도 동기화 테스트하려면:

1. 같은 화면에서 **Preview 환경** 탭으로 전환
2. 같은 KV 네임스페이스를 같은 `SYNC_KV` 이름으로 바인딩

대부분은 Production만 있어도 OK.

## 4. 재배포 트리거

KV 바인딩 변경은 다음 배포부터 적용됩니다. 새 커밋을 푸시하거나 대시보드에서 **"Retry deployment"** 누르세요.

## 5. 동작 확인

1. 배포 후 dungeoncard.pages.dev 접속
2. 타이틀 화면 → ☁️ 동기화 클릭
3. **"새 동기화 시작"** → `DNC-XXXX` 코드가 표시되면 성공
4. 다른 기기/시크릿 창에서 같은 페이지 → 동기화 → **"코드 입력해서 연결"** → 코드 입력
5. 양쪽이 합쳐진 상태가 됩니다

## 무료 한도

Cloudflare KV 무료 티어:
- **읽기**: 100,000/일
- **쓰기**: 1,000/일
- **저장**: 1GB

한 유저당 평균 1~10 쓰기/일 정도이므로, 단독 운영자/소수 친구 사용에는 차고 넘칩니다.

## 데이터가 저장되는 곳

- 키 `code:DNC-XXXX` → 페어링 정보 (1시간 후 자동 만료)
- 키 `secret:<userId>` → 인증 토큰
- 키 `user:<userId>` → 도전과제·도감·통계·세이브·설정 JSON

## 동기화 끄기 / 데이터 삭제

- 앱 안에서 "동기화 끄기" → 현재 기기에서만 비활성화. 클라우드 데이터는 남음.
- 완전 삭제는 Cloudflare 대시보드 → KV → 해당 키 수동 삭제.

## 트러블슈팅

**"500 Internal Server Error"**: KV 바인딩이 안 되어 있음. 위 2번 단계 확인.

**"code not found or expired"**: 코드가 1시간 지나서 만료. 새 코드 생성하세요.

**연결됐는데 데이터가 안 합쳐짐**: 페어링 후 "지금 받기 (Pull)"를 한 번 더 눌러보세요.
