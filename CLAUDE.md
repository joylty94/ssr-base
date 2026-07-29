# 프로젝트 작업 규약 (Agent Team)

이슈는 "컨베이어 벨트 위의 물건", `stage:*` 라벨은 "지금 어느 작업대에 있는지"다.
각자 자기 작업대(라벨)에 온 이슈만 처리하고, 끝나면 라벨을 다음 작업대로 넘긴다.

## 라벨 상태머신
- 이슈 생성 시:  area:<역할>  +  stage:plan-review
- 흐름:  stage:plan-review  →  stage:impl  →  stage:qa  →  (close)
- QA 반려:  stage:qa 를 떼고  stage:impl 로 되돌리며  blocked 표시

## 역할별 담당 큐 (각자 이 목록만 반복 처리)
- plan-reviewer : gh issue list --label "stage:plan-review"
- backend       : gh issue list --label "area:backend"  --label "stage:impl"
- frontend      : gh issue list --label "area:frontend" --label "stage:impl"
- designer      : gh issue list --label "area:design"   --label "stage:impl"
- qa            : gh issue list --label "stage:qa"

## 공통 루프
1. 자기 큐에서 가장 오래된 이슈 1건을 고른다.
2. 각 단계의 시작/완료를 ./scripts/issue-log.sh 로 이슈 댓글에 남긴다.
3. 자기 단계가 끝나면 라벨을 다음 단계로 넘긴다(아래 각 역할 절차 참고).
4. 큐를 다시 확인한다. 비어 있으면 리더에게 "idle"이라고 알리고 대기한다.
- 자기 담당 라벨/파일만 건드린다. 애매하면 리더에게 물어본다.

## plan-reviewer
1. ./scripts/issue-log.sh <n> plan-review start
2. gstack 스킬로 접근방식·아키텍처·범위 점검: /plan-eng-review (디자인 이슈면 /plan-design-review, 요구가 모호하면 /spec)
3. 통과 → ./scripts/issue-log.sh <n> plan-review done "합의된 접근·주의점"
        → gh issue edit <n> --remove-label "stage:plan-review" --add-label "stage:impl"
   보류 → 문제점을 이슈 댓글로 남기고 리더에게 보고 (라벨은 그대로 둔다)
   ※ 구현·close 금지. 코드는 읽기만.

## backend / frontend  — TDD 필수 (반드시 이 순서)
1. gh issue view <n> --comments 로 plan-review 합의사항 확인
2. ./scripts/issue-log.sh <n> test-plan start
   → 구현 코드를 쓰기 전에 실패하는 테스트(Red)부터 작성 (먼저 실패하는 걸 확인)
   → ./scripts/issue-log.sh <n> test-plan done "작성한 테스트 목록/커버 범위"
3. ./scripts/issue-log.sh <n> implement start → 테스트를 통과시키는 최소 구현(Green) 후 리팩터
   → ./scripts/issue-log.sh <n> implement done "무엇을 바꿨는지"
4. ./scripts/issue-log.sh <n> test start → 전체 테스트 실행, 모두 통과 + 회귀 확인
   → ./scripts/issue-log.sh <n> test done "통과 N건 / 커버리지"  (실패가 남으면 done 금지, 3번으로)
5. gh issue edit <n> --remove-label "stage:impl" --add-label "stage:qa"
   → qa 팀원에게 SendMessage: "#<n> 구현·테스트 완료, QA 부탁"
   ※ close 금지. 테스트를 안 쓴 채 구현부터 시작하지 말 것.
   gstack: 모호하면 /spec, 어려운 버그는 /investigate, 구현 후 /review·/cso 로 자가점검.

## designer  — TDD 비대상
1. ./scripts/issue-log.sh <n> implement start → 스펙/에셋/컴포넌트 가이드 산출 (/design-consultation, /design-shotgun, /design-html)
   → ./scripts/issue-log.sh <n> implement done "산출물 링크"
2. ./scripts/issue-log.sh <n> test start → 디자인 일관성/접근성 리뷰 (/design-review) → ... test done "리뷰 결과"
3. gh issue edit <n> --remove-label "stage:impl" --add-label "stage:qa" → qa 에게 인계.
   ※ 여기서 '구현'=산출물 작성, '테스트'=디자인 리뷰. 코드 대신 문서/에셋을 이슈에 링크.

## qa
1. ./scripts/issue-log.sh <n> qa start
2. 이슈 댓글에서 앞 단계 done 기록 확인 + 실제 동작 검증 (/qa, 화면 /browse, 보안 /cso, 성능 /benchmark)
3. 통과 → ./scripts/issue-log.sh <n> qa done "검증 통과"
        → gh issue close <n> --comment "✅ 전체 단계 완료. QA 통과하여 종료합니다."
   반려 → ./scripts/issue-log.sh <n> qa done "반려: <사유>"
        → gh issue edit <n> --remove-label "stage:qa" --add-label "stage:impl" --add-label "blocked"
        → 담당 역할 팀원에게 SendMessage 로 반려 사유 전달
   ※ 소스 직접 수정 금지(읽기 위주).

## 공통 규칙
- 커밋 메시지는 conventional commits (feat/fix/refactor/test/docs/chore).
- 막히면 무리해서 완료 표시하지 말고 리더에게 보고.
