#!/usr/bin/env bash
# 동기화 계정을 진행도순으로 뽑는다. 캐시를 지워 계정을 잃은 사람을 찾을 때 쓴다.
#
#   bash tools/find-lost-user.sh              # 진행도 상위 10명
#   bash tools/find-lost-user.sh <userId>     # 그 계정의 복구 키 출력
#
# 필요: CLOUDFLARE_API_TOKEN(Workers KV Storage:Read) + CLOUDFLARE_ACCOUNT_ID, jq
#
# 주의: wrangler v4의 kv 명령은 기본이 로컬 저장소라, --remote 없이는 실제 KV에
#       데이터가 있어도 0개로 나온다.
set -euo pipefail

NS_TITLE="${NS_TITLE:-dungeoncard}"
WORKDIR="${WORKDIR:-./.kvdump}"

command -v jq >/dev/null || { echo "jq가 필요합니다" >&2; exit 1; }

# wrangler는 node 20 이상을 요구한다 (이 머신 기본은 18)
node_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
if [ "$node_major" -lt 20 ]; then
  echo "node 20 이상이 필요합니다 (현재 $(node -v 2>/dev/null || echo 없음))." >&2
  echo "  export PATH=/data/afk/.nvm/versions/node/v20.20.2/bin:\$PATH" >&2
  exit 1
fi

# wrangler 버전에 따라 'kv key' / 'kv:key' 두 형태가 있다
kv() {
  local sub="$1"; shift
  npx --yes wrangler kv "$sub" "$@" 2>/dev/null \
    || npx --yes wrangler "kv:$sub" "$@"
}

NS_ID="${NS_ID:-$(kv namespace list | jq -r --arg t "$NS_TITLE" '.[] | select(.title | contains($t)) | .id' | head -1)}"
[ -n "$NS_ID" ] || { echo "KV 네임스페이스를 못 찾았습니다. NS_ID=... 로 직접 지정하세요" >&2; exit 1; }
echo "네임스페이스: $NS_ID" >&2

# 복구 키 모드
if [ $# -ge 1 ]; then
  uid="$1"
  secret="$(kv key get "secret:$uid" --remote --namespace-id="$NS_ID")"
  [ -n "$secret" ] || { echo "secret:$uid 없음 (만료됐을 수 있음)" >&2; exit 1; }
  echo "$uid:$secret"
  exit 0
fi

mkdir -p "$WORKDIR"
kv key list --remote --namespace-id="$NS_ID" --prefix=user: > "$WORKDIR/keys.json"
total=$(jq length "$WORKDIR/keys.json")
echo "유저 레코드 $total개 내려받는 중..." >&2

for k in $(jq -r '.[].name' "$WORKDIR/keys.json"); do
  out="$WORKDIR/${k#user:}.json"
  [ -s "$out" ] || kv key get "$k" --remote --namespace-id="$NS_ID" > "$out"
done

printf 'userId\t총런\t승\t진엔딩\t도감\t업적\t등반\t마지막동기화\n'
for f in "$WORKDIR"/*.json; do
  [ "$(basename "$f")" = keys.json ] && continue
  jq -r --arg id "$(basename "$f" .json)" '
    .data.store as $s |
    [ $id,
      ($s.dod_stats.totalRuns // 0),
      ($s.dod_stats.totalWins // 0),
      ($s.dod_stats.totalTrueWins // 0),
      (($s.dod_codex.cards | length? // 0) + ($s.dod_codex.relics | length? // 0)),
      ($s.dod_achievements.unlocked | length? // 0),
      ($s.dod_ascension // 0),
      ((.updatedAt // 0) / 1000 | floor | strftime("%Y-%m-%d %H:%M"))
    ] | @tsv' "$f" 2>/dev/null || true
done | sort -k2 -nr | head -10

cat >&2 <<'HINT'

읽는 법: 진행도는 최상위인데 "마지막동기화"만 과거에서 멈춘 계정이 찾는 사람입니다.
         (캐시를 지운 뒤로는 푸시가 안 되므로 그 날짜에 얼어붙습니다)
복구 키:  bash tools/find-lost-user.sh <userId>
HINT
