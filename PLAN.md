# PLAN — ssr-base

> AI로 여러 프로젝트를 개발할 때 재사용할 **베이스 프로젝트**를 구축한다.
> 최소 핵심(프로젝트 구조·라이브러리·공통 컴포넌트·레이아웃·API 구조·Hook·유틸·폰트·CSS)을 완성한다.
> 출처: [requirement.md](./requirement.md), 구조 규칙: [.claude/rule/next-fsd-core.md](./.claude/rule/next-fsd-core.md)
>
> `/autoplan` 보강 이력: Codex CLI 미설치로 **단일 리뷰어(Claude) 모드**로 1회 실행.
> CEO/Design/Eng/DX 4단계 관점을 순차 적용해 전제·범위·아키텍처·테스트·DX를 점검하고 반영함.
> (Dual-voice 비교표는 Codex 부재로 생략 — 아래 각 절 결정은 6원칙 기반 단일 리뷰 결과)

## 0. 전제(Premise) 확인 — CEO 단계

요건은 사용자가 명시적으로 확정한 **필수 스택**(Next.js, Tailwind+shadcn/ui, 다크/라이트, Axios, Pretendard, 반응형/크로스브라우징, FSD)이므로 스택 자체는 재검토 대상이 아님. 다만 그 위에 깔린 암묵적 전제를 검증:

| # | 전제 | 판단 | 근거 |
|---|------|------|------|
| P1 | "베이스는 특정 도메인 로직 없이도 여러 프로젝트에 이식 가능해야 한다" | **수용** | 요건 1문단과 일치. 따라서 예시 feature는 auth/posts 같은 실제 도메인이 아니라 **도메인-불특정 데모**로 결정(§6 리스크 결정 참고). |
| P2 | "FSD 문서(next-fsd-core.md)의 계층 구조를 그대로 따르면 충분하다" | **수용, 단 검증 필요** | 문서는 예시 도메인(auth/posts)을 들고 있으나 이 프로젝트엔 도메인이 없음 → 최소 1개의 **FSD 슬라이스 실물 예제**(entities→features→widgets)가 없으면 ESLint 경계 규칙도 실제로 검증할 수 없음. → §4에 작업 추가(#13).|
| P3 | "테마 기본값 = 브라우저 설정이면 충분하다" | **수용 + 명확화** | `next-themes`의 `system` 모드로 구현 가능. SSR에서 첫 페인트 시 테마 깜빡임(FOUC) 리스크가 있어 별도 처리 필요(§7 실패 모드). |
| P4 | "베이스 프로젝트이므로 CI/배포는 범위 밖이다" | **수용** | 요건에 명시 없음, 사용자가 비목표로 이미 지정. 단, `npm run test`가 로컬에서 그린이어야 향후 CI 연결이 자연스러움 → DoD에 포함. |

결론: 전제 변경 없음(User Challenge 없음). 아래는 그 위에서의 **범위/설계 결정**.

## 1. 목표 & 비목표

### 목표 (In-scope)
- Next.js(App Router) + TypeScript 기반 SSR 베이스 스캐폴드
- **FSD(Feature-Sliced Design)** 파일 구조 및 의존성 규칙 강제(ESLint)
- Tailwind CSS + shadcn/ui, **다크/라이트 테마**(기본값=브라우저 테마)
- Axios + interceptors 기반 공용 API 클라이언트
- Pretendard(한글) 폰트 CDN 적용
- 반응형(모바일/PC) + 크로스브라우징(Safari/Chrome/Edge)
- 공통 컴포넌트·레이아웃·Hook·유틸리티 최소 세트
- **FSD 계층을 실제로 관통하는 도메인-불특정 예시 슬라이스 1개** (구조 검증 + 향후 참조 템플릿)
- **재사용 가이드(README)**: 이 베이스로 새 프로젝트를 시작하는 법, 새 FSD 슬라이스를 추가하는 법

### 비목표 (Out-of-scope)
- 실제 비즈니스 기능(auth/posts 등 도메인 로직) — 예시는 도메인-불특정 데모로 한정(§6)
- 백엔드 서버 구현(여기선 클라이언트 API 구조·mock 수준)
- 배포 파이프라인/CI 상세(별도 이슈), 다만 로컬 `npm run test`/`lint`는 그린 상태 유지
- 전역 상태관리 라이브러리(Redux/Zustand 등) 도입 — 필요 시 소비 프로젝트에서 추가(§6)
- 코드 생성기/플롭 스크립트 등 "슬라이스 자동 생성 툴링" — 12개월 관점의 스트레치 목표로 `TODOS.md`에 이관(§8)

## 2. 기술 스택 확정
- **Framework**: Next.js (App Router, SSR) + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui, CSS 변수 기반 테마 토큰
  - shadcn/ui 최소 컴포넌트 세트(범위 확정, §6 리스크 결정 참고): Button, Input, Card, Dialog, DropdownMenu, Badge, Skeleton, Separator
- **Theme**: `next-themes` (system 기본값, class 전략, 다크/라이트 토글, `suppressHydrationWarning`으로 FOUC 방지)
- **HTTP**: Axios + request/response interceptors
- **Font**: Pretendard CDN (`@font-face` 또는 link 프리로드) + 시스템 폰트 폴백(CDN 장애 대비)
- **FSD 경계 강제 도구**: `eslint-plugin-boundaries`(또는 `import/no-restricted-paths`) — 커스텀 규칙 대신 검증된 플러그인 사용(explicit-over-clever)
- **Lint/Quality**: ESLint (FSD 경계 규칙 포함), Prettier
- **Test**: Vitest + React Testing Library (TDD 워크플로우 대응), jsdom 환경

## 3. 디렉터리 구조 (FSD)
`.claude/rule/next-fsd-core.md` 를 따른다. 계층: `app → widgets → features → entities → shared`.
의존성은 위로만, features 간 임포트 금지, index.ts public API만 사용.

```
src/
├── app/            # 라우팅·레이아웃·globals.css·providers·loading/error/not-found·metadata
├── widgets/        # features 조합 (Header, Footer, GreetingWidget 등)
├── features/       # 비즈니스 기능(자급자족) — 베이스에선 도메인-불특정 예시 1개만
├── entities/       # 공유 데이터 모델 — 베이스에선 예시 슬라이스의 최소 모델만
├── shared/
│   ├── ui/         # shadcn/ui 래핑 디자인 시스템 (Button, Input, Card ...)
│   ├── lib/api/    # axios client + interceptors
│   ├── lib/hooks/  # useDebounce, useAsync, useMediaQuery ...
│   ├── lib/utils/  # cn, date, string ...
│   └── config/     # env(environment.ts) — 전역 상태 store는 베이스 범위 밖(§6)
└── config/         # 전역 설정(environment.ts) — store.ts는 미도입(결정 사유 §6)
```

### 아키텍처 의존 그래프 (Eng 단계 산출물)
```
            app (layout, providers, metadata, loading/error)
              │ imports
              ▼
           widgets (Header, Footer, GreetingWidget)
              │ imports (features 조합은 widgets에서만)
              ▼
           features (예시: greeting) ──✕── features (서로 임포트 금지)
              │ imports
              ▼
           entities (예시: greeting 모델)
              │ imports
              ▼
           shared (ui, lib/api, lib/hooks, lib/utils, config)
              (shared는 아무것도 의존하지 않음)
```
ESLint 경계 규칙이 위 화살표의 "거꾸로" 방향 및 features↔features 임포트를 빌드 타임 에러로 잡아야 한다(#2, #13에서 검증).

## 4. 작업 분해 (이슈 후보 → area/stage 라벨)

### A. 프로젝트 기반 (area:backend / frontend 공용)
1. **[frontend] 프로젝트 스캐폴드** — Next.js+TS+Tailwind init, 폴더 골격, tsconfig path alias(`@/*`), package.json 스크립트(dev/build/lint/test) 확정
2. **[frontend] ESLint FSD 경계 규칙** — `eslint-plugin-boundaries` 설정으로 계층 간 import 제약, features 간 임포트 금지, public API(index.ts) 강제. 규칙 위반 fixture 테스트 포함(의도적으로 위반하는 임시 파일로 ESLint가 실제로 에러 내는지 검증 후 제거)
3. **[frontend] 테마 시스템** — next-themes, CSS 변수 토큰, 다크/라이트, system 기본, 토글 컴포넌트, `suppressHydrationWarning`으로 SSR FOUC 방지
4. **[frontend] Pretendard 폰트** — CDN 로드 + Tailwind fontFamily 연결 + 시스템 폰트 폴백(CDN 장애/차단 대비)

### B. Shared 계층
5. **[frontend] shared/ui 디자인 시스템** — shadcn/ui 세팅 + Button/Input/Card/Dialog/DropdownMenu/Badge/Skeleton/Separator + index.ts
6. **[backend] axios 클라이언트 + interceptors** — `shared/lib/api/client.ts`, 요청/응답/에러 인터셉터, 타입, 인터셉터 실패 시 에러 형태 통일(오류 registry, §7)
7. **[frontend] 공용 Hook** — useAsync, useDebounce, useMediaQuery 등 + index.ts
8. **[frontend] 유틸리티** — cn, date, string 등 + index.ts

### C. 레이아웃 / 위젯
9. **[frontend] 루트 레이아웃 & Providers** — theme provider, 폰트, 반응형 컨테이너, 기본 metadata(title/description/OG) 설정
10. **[frontend] Header/Footer 위젯** — 반응형 네비 + 테마 토글 배치
14. **[frontend] App Router 베이스 라우트** — `loading.tsx`/`error.tsx`/`not-found.tsx` 기본 구현(빈 화면 방지), 접근성 있는 기본 상태 UI

### D. 구조 검증 & 예시
13. **[frontend] FSD 예시 슬라이스** — 도메인-불특정 데모(예: `entities/greeting` + `features/greeting` + `widgets/GreetingWidget`)로 entities→features→widgets 체인을 실제로 구현, ESLint 경계 규칙(#2)이 이 슬라이스에서 정상 동작함을 확인하는 근거 자료
11. **[frontend] 예시 페이지** — 컴포넌트·테마·반응형·FSD 슬라이스(#13) 데모 (베이스 사용법 showcase)

### E. 테스트 인프라
15. **[frontend] Vitest + RTL 테스트 인프라 셋업** — vitest.config.ts, jsdom, RTL 셋업 파일, `npm run test` 스크립트. 이후 모든 TDD 작업의 전제조건(#6, #7, #8, #13에 선행)

### F. 문서 & 디자인
12. **[designer] 디자인 토큰 가이드** — 색/타이포/스페이싱 토큰 문서, 접근성 대비 체크
16. **[frontend] README & 사용 가이드** — 이 베이스로 새 프로젝트 시작하는 법, 새 FSD 슬라이스 추가 절차(entities→features→widgets 순서, index.ts 규칙), shadcn 컴포넌트 추가법, 테마/폰트/axios 커스터마이징 지점 정리 (DX 단계 산출물, TTHW 단축 목적)

## 5. 마일스톤 순서 (의존관계)
1. 스캐폴드(1) → 테스트 인프라(15)
2. ESLint 경계(2) — #15 완료 후, fixture 테스트에 vitest 아님(ESLint CLI)이므로 병행 가능하나 문서상 순서는 유지
3. 테마(3) + 폰트(4)
4. shared(5~8) — 각 항목은 #15의 테스트 인프라를 전제로 TDD 진행
5. 레이아웃/위젯(9, 10, 14)
6. FSD 예시 슬라이스(13) — #2(ESLint 경계) + shared(5~8) 완료 후
7. 예시 페이지(11) — #13 완료 후
8. 문서/가이드(12, 16) — 전체 완료 후 마지막(가이드가 최종 산출물을 정확히 반영해야 하므로)

```
1 → 15 → 2 → (3,4) → (5,6,7,8) → (9,10,14) → 13 → 11 → (12,16)
```

## 6. 완료 기준 (DoD)
- [ ] `npm run dev` 로 SSR 페이지가 뜨고, 다크/라이트 토글 + 브라우저 테마 기본값 동작(새로고침 시 깜빡임 없음)
- [ ] Pretendard 폰트가 한글에 적용, CDN 접근 실패 시에도 레이아웃이 깨지지 않음(폴백 확인)
- [ ] axios interceptor로 공통 헤더/에러 처리 동작(테스트 포함), 에러 형태가 일관됨
- [ ] ESLint가 FSD 경계 위반(예: features→features, index.ts 우회)을 에러로 잡음 — 의도적 위반 fixture로 실증
- [ ] FSD 예시 슬라이스(entities→features→widgets)가 실제로 동작하며 ESLint 통과
- [ ] 모바일/PC 반응형, Safari/Chrome/Edge 크로스브라우징 확인
- [ ] shared/ui·hooks·utils가 public API(index.ts)로 노출
- [ ] 핵심 로직(interceptor/유틸/hook/예시 슬라이스)에 Vitest 테스트 존재, `npm run test` 전체 그린
- [ ] `npm run lint` 그린
- [ ] loading/error/not-found 라우트가 빈 화면 없이 렌더
- [ ] README만 보고 "새 프로젝트 시작 + 새 슬라이스 추가"를 5분 내 따라할 수 있음(TTHW 목표)

## 7. 테스트 계획 (코드패스 → 커버리지 매핑, Eng 단계 산출물)

| 코드패스 | 테스트 유형 | 비고 |
|---|---|---|
| axios interceptor: 요청 헤더 주입 | 단위(Vitest) | mock adapter |
| axios interceptor: 에러 응답 정규화 | 단위(Vitest) | 4xx/5xx/네트워크 에러 각각 |
| useAsync/useDebounce/useMediaQuery | 단위(Vitest+RTL) | 로딩/에러/타이밍 케이스 |
| 유틸(cn/date/string) | 단위(Vitest) | 경계값 |
| 테마 토글 | 컴포넌트(RTL) | system→dark→light 전환, SSR 초기 렌더 시 hydration mismatch 없음 |
| ESLint FSD 경계 | lint fixture | 의도적 위반 파일 추가 시 `lint` 실패 확인 후 제거 |
| FSD 예시 슬라이스(#13) | 컴포넌트(RTL) | entities 모델 → feature 훅 → widget 렌더 전체 체인 |
| Header/Footer 반응형 | 컴포넌트(RTL) + 수동 크로스브라우징 체크 | 뷰포트별 스냅샷/수동 확인 |

## 8. 리스크 & 결정 (§0 전제 확인 이후 확정)
| 항목 | 이전 상태 | 확정 결정 | 근거 |
|---|---|---|---|
| shadcn/ui 컴포넌트 범위 | 미정 | Button/Input/Card/Dialog/DropdownMenu/Badge/Skeleton/Separator로 한정(§2) | 완전성(P1) vs 무한 확장 방지 — 위젯/레이아웃/테마 토글에 실제로 필요한 최소 집합만 |
| 상태관리 라이브러리 | 미정 | **미도입.** React Context(테마) + 로컬 상태 + 커스텀 hook으로 충분. `config/store.ts`는 만들지 않음 | DRY/명시성(P4,P5) — 베이스에 특정 상태관리 강제 시 소비 프로젝트와 충돌 가능성. 필요 시 README(#16)에 "추가 지점"만 안내 |
| 예시 feature 도메인 | auth 데모 여부 미정 | **도메인-불특정 데모**(예: greeting) 채택, auth/posts 등 실제 도메인 배제 | 비목표(§1)와 정합 — 베이스는 도메인에 종속되면 안 됨 |
| 테마 FOUC | 미검토 | `next-themes` + `suppressHydrationWarning` + CSS 변수 선반영으로 처리(#3) | SSR 특성상 반드시 필요한 처리, 누락 시 첫 렌더 깜빡임 발생 |
| 슬라이스 생성 자동화(plop 등) | — | **베이스 범위 밖**, `TODOS.md`로 이관 | 12개월 관점의 스트레치 목표(boil-the-ocean 대상은 되지만 blast radius 밖, <1일 작업 아님) |

## 9. 자동 결정 감사 로그 (요약, Decision Audit Trail)
| # | 단계 | 결정 | 분류 | 원칙 |
|---|------|------|------|------|
| 1 | CEO | 스택 재검토 안 함(사용자 확정 요건) | Mechanical | P6(합리적 전제 수용) |
| 2 | CEO | 예시 도메인은 비-비즈니스(greeting)로 결정 | Mechanical | P4(DRY), 비목표 정합 |
| 3 | CEO | 상태관리 라이브러리 미도입 | Mechanical | P5(명시성) |
| 4 | Design | 테마 토글 FOUC 처리 필수화 | Mechanical | P1(완전성) |
| 5 | Eng | FSD 경계는 커스텀 규칙 대신 `eslint-plugin-boundaries` 사용 | Mechanical | P5(명시성) |
| 6 | Eng | FSD 예시 슬라이스 작업(#13) 신규 추가 | Mechanical | P2(blast radius 내, <1일) |
| 7 | Eng | Vitest 인프라를 별도 선행 작업(#15)으로 분리 | Mechanical | P3(실용성 — 모든 TDD 작업의 공통 전제) |
| 8 | DX | README/사용 가이드(#16) 신규 추가, TTHW 5분 목표 | Mechanical | P1(완전성) |
| 9 | Eng | 슬라이스 생성 자동화는 TODOS.md로 이관(범위 밖) | Mechanical | P2(boil lakes, blast radius 밖) |

이번 실행에서 코덱스 CLI 미탐지로 dual-voice 비교는 수행하지 않았음(단일 리뷰어 모드). Taste 성격의 갈림(예: shadcn 컴포넌트 목록 확장 여부)은 위 표에서 "확정 결정"으로 마감했으며, 이견이 있으면 구현 단계(`stage:impl`) 진입 전 plan-reviewer에게 재질의 가능.
