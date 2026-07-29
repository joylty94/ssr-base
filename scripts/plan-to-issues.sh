#!/usr/bin/env bash
# usage: plan-to-issues.sh todos.txt   (형식: 역할|제목|본문, 한 줄에 하나)
set -euo pipefail
file="$1"
while IFS='|' read -r role title body; do
  [ -z "${role:-}" ] && continue
  case "$role" in
    backend)  area="area:backend";;
    frontend) area="area:frontend";;
    design)   area="area:design";;
    *) echo "skip unknown role: $role" >&2; continue;;
  esac
  url=$(gh issue create --title "$title" --body "$body" \
        --label "$area" --label "stage:plan-review")
  echo "created: $area  $url"
done < "$file"
