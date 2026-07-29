#!/usr/bin/env bash
# usage: issue-log.sh <issue-number> <stage> <start|done> [note]
#   stage: plan-review | test-plan | implement | test | qa
set -euo pipefail

issue="$1"; stage="$2"; status="$3"; note="${4:-}"

case "$stage" in
  plan-review) label="플랜 검토";;
  test-plan)   label="테스트 계획(Red)";;
  implement)   label="구현(Green)";;
  test)        label="테스트 실행";;
  qa)          label="QA";;
  *) echo "unknown stage: $stage" >&2; exit 1;;
esac

case "$status" in
  start) icon="▶️"; word="시작";;
  done)  icon="✅"; word="완료";;
  *) echo "status must be start|done" >&2; exit 1;;
esac

ts="$(date '+%Y-%m-%d %H:%M %Z')"
body="${icon} **${label} ${word}** — ${ts}"
[ -n "$note" ] && body="${body}
> ${note}"
# 숨은 마커: close 게이트가 이 마커로 단계 완료를 집계
body="${body}

<!-- STAGE:${stage}:${status} -->"

gh issue comment "$issue" --body "$body"
