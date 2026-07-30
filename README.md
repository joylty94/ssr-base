# ssr-base

AI로 여러 프로젝트를 만들 때 재사용하는 **베이스 프로젝트**입니다. Next.js(App Router) + TypeScript + Tailwind CSS + shadcn/ui 스타일 컴포넌트 + 다크/라이트 테마 + Axios + FSD(Feature-Sliced Design) 구조 + 코드 컨벤션(ESLint/Prettier) + 테스트(Vitest) 가 이미 세팅되어 있습니다. 특정 서비스의 비즈니스 로직(로그인, 게시글 등)은 포함하지 않고, **구조·공통 자산·규칙**만 제공합니다.

## 기술 스택

| 영역        | 사용 기술                                                              |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | Next.js 16(App Router, Turbopack) + React 19 + TypeScript 5            |
| Styling     | Tailwind CSS v4 + shadcn/ui 스타일 컴포넌트, CSS 변수 기반 디자인 토큰 |
| Theme       | `next-themes` (기본값 = 브라우저 시스템 테마, 다크/라이트 토글)        |
| Font        | Pretendard(한글) CDN + 시스템 폰트 폴백, 영문 Geist(`next/font`)       |
| HTTP        | Axios + 요청/응답/에러 인터셉터                                        |
| 구조        | FSD(Feature-Sliced Design) + `eslint-plugin-boundaries` 로 경계 강제   |
| 코드 컨벤션 | ESLint(로직·경계) + Prettier(포맷) + `prettier-plugin-tailwindcss`     |
| 테스트      | Vitest + React Testing Library + jsdom                                 |

## 시작하기

```bash
npm install
npm run dev          # http://localhost:3000
```

| 스크립트                | 설명                       |
| ----------------------- | -------------------------- |
| `npm run dev`           | 개발 서버(Turbopack)       |
| `npm run build`         | 프로덕션 빌드              |
| `npm run start`         | 빌드 결과 실행             |
| `npm run lint`          | ESLint(FSD 경계 규칙 포함) |
| `npm run format`        | Prettier 전체 자동 포맷    |
| `npm run format:check`  | 포맷 위반 검사(CI/커밋 전) |
| `npm run test`          | Vitest 전체 실행           |
| `npm run test:watch`    | Vitest watch 모드          |
| `npm run test:coverage` | 커버리지 리포트            |

`/showcase` 라우트(`src/app/showcase`)에서 shared/ui 컴포넌트·테마 토글·FSD 예시 슬라이스를 한 번에 확인할 수 있습니다(데모용 — 실제 서비스에서는 삭제 가능).

### 새 프로젝트 시작하기

이 베이스로 새 프로젝트를 시작하려면: 저장소를 복제한 뒤 `package.json`의 `name`을 바꾸고, `src/app/layout.tsx`의 `SITE_TITLE`/`SITE_DESCRIPTION`, 예시 슬라이스(`src/app/showcase`, `src/{entities,features}/greeting`, `src/widgets/GreetingWidget`)를 프로젝트에 맞게 정리하세요.

---

## 1. 프로젝트 구조

```
ssr-base/
├── src/
│   ├── app/        # 라우팅·레이아웃·providers·loading/error/not-found·globals.css
│   ├── widgets/    # features 조합(Header, Footer, GreetingWidget) — 폴더 1개 = element 1개
│   ├── features/   # 비즈니스 기능(자급자족, feature끼리 임포트 금지) — 폴더 1개 = element 1개
│   ├── entities/   # 여러 feature가 공유하는 데이터 모델 — 폴더 1개 = element 1개
│   ├── shared/     # 모두가 쓰는 것(ui/lib) — shared 전체가 하나의 element
│   │   ├── ui/         # 디자인 시스템(Button/Input/Card/Dialog/DropdownMenu/Badge/Skeleton/Separator, Container, theme/*)
│   │   └── lib/
│   │       ├── api/    # axios 클라이언트 + 인터셉터(client/errors/types)
│   │       ├── hooks/  # useAsync/useDebounce/useMediaQuery
│   │       └── utils/  # cn/date/string
│   └── config/     # 전역 설정 자리(현재 비어 있음)
├── .claude/        # 에이전트 팀 워크플로(agents·hooks·rule·settings)
├── scripts/        # 이슈/라벨/브랜치 워크플로 + 구조 검증 스크립트
├── eslint.config.mjs / .prettierrc.json / vitest.config.ts   # 규칙·도구 설정
├── CLAUDE.md       # 팀 작업 규약(브랜치/워크트리/TDD)
└── DESIGN.md       # 디자인 토큰(색/타이포/스페이싱)·WCAG 대비 기준
```

| 계층       | 역할                                  | 의존 가능 대상                   |
| ---------- | ------------------------------------- | -------------------------------- |
| `shared`   | 모든 앱이 쓰는 기본 요소(UI·API·유틸) | (없음)                           |
| `entities` | 여러 feature가 공유하는 데이터 모델   | `shared`                         |
| `features` | 하나의 비즈니스 기능(자급자족)        | `shared`, `entities`             |
| `widgets`  | 여러 features 조합                    | `shared`, `entities`, `features` |
| `app`      | 라우팅·레이아웃                       | 모두                             |

---

## 2. FSD 전략

의존성은 **위로만** 흐릅니다: `shared ← entities ← features ← widgets ← app`.
원문 규칙은 [.claude/rule/next-fsd-core.md](./.claude/rule/next-fsd-core.md) 참고.

### 핵심 원칙

1. **의존성은 한 방향으로만** — 아래 계층은 위 계층을 절대 모른다.
2. **features는 features를 임포트하지 않는다** — 여러 기능의 조합은 오직 `widgets`에서.
3. **public API(index.ts)로만 임포트** — 슬라이스 내부 구현 파일을 직접 임포트하지 않는다.
4. **각 feature는 자급자족** — 자기 기능에 필요한 ui/model/api/hooks를 폴더 안에 모두 담는다.
5. **shared는 정말 공용인 것만** — 특정 도메인 로직을 넣지 않는다.

### 배럴(barrel) 정책 — 이 베이스의 선택

- **`shared`는 `@/shared` 하나의 배럴만 공개 API**로 취급합니다(`src/shared/index.ts`가 `ui`/`lib` 전체 재노출). `shared/ui/theme`처럼 깊은 하위 폴더를 만들어도 소비 측은 항상 `@/shared`에서 임포트하세요.
- **`widgets`는 위젯 폴더별로 각각 공개 API**를 둡니다(`@/widgets/Header`, `@/widgets/Footer`). widgets 전체를 묶는 배럴은 두지 않습니다.
- `entities`/`features`도 슬라이스 폴더별 `index.ts`가 공개 API입니다(`@/entities/<이름>`, `@/features/<이름>`).

### 경계 강제(자동)

`eslint-plugin-boundaries`(`eslint.config.mjs`)가 빌드 타임에 다음을 **에러로** 막습니다:

- 의존 방향 위반(예: `shared`가 `features`를 임포트)
- features 간 직접 임포트
- 각 계층을 index.ts(public API) 우회해서 임포트

`npm run lint`가 그린이면 경계를 지킨 것입니다.

### 새 FSD 슬라이스 추가하기

예시 참고: `src/entities/greeting` → `src/features/greeting` → `src/widgets/GreetingWidget`(그리고 `/showcase`).

1. **entities/\<이름\>** — 순수 데이터 모델/타입/함수. `shared`만 의존.
   `model/*.ts` + `index.ts`(public API)
2. **features/\<이름\>** — 하나의 기능을 자급자족 구현. `entities`·`shared`만 의존, **다른 feature 임포트 금지**.
   `ui/*.tsx` + `index.ts`
3. **widgets/\<이름\>** — 여러 features(+entities/shared) 조합.
   `<이름>.tsx` + `index.ts`
4. **app**에서 위젯을 조합해 라우트 구성: `import { X } from "@/widgets/X"`.

각 단계는 **먼저 실패하는 테스트(Red)** 부터 작성합니다(§4 테스트 전략).

---

## 3. 코드 컨벤션

포맷은 **Prettier**, 로직·구조 규칙은 **ESLint**가 담당합니다(역할 분리 — 서로 충돌하지 않도록 `eslint-config-prettier`가 포맷 관련 ESLint 규칙을 끕니다).

### 포맷 규칙 (`.prettierrc.json`)

| 항목             | 값                                                 |
| ---------------- | -------------------------------------------------- |
| 세미콜론         | 사용(`;`)                                          |
| 따옴표           | 쌍따옴표(`"`)                                      |
| 후행 쉼표        | `all`                                              |
| 줄 너비          | 80                                                 |
| 들여쓰기         | 스페이스 2칸                                       |
| 화살표 함수 괄호 | 항상(`always`)                                     |
| 개행 문자        | `lf`                                               |
| 플러그인         | `prettier-plugin-tailwindcss`(className 자동 정렬) |

```bash
npm run format        # 저장 전 전체 자동 포맷
npm run format:check  # 위반만 검사(CI/커밋 전 게이트)
```

> 에디터에 Prettier "포맷 온 세이브"를 켜두면 편합니다.

### 린트 규칙 (`eslint.config.mjs`)

- `eslint-config-next`(core-web-vitals + TypeScript) — Next/React 권장 규칙
- `eslint-plugin-boundaries` — FSD 계층 경계 강제(§2)
- `eslint-config-prettier` — 포맷 규칙은 Prettier에 위임(맨 끝에 적용)

### 네이밍 / 파일 규칙

- **React 컴포넌트 파일**: PascalCase (`Header.tsx`, `GreetingMessage.tsx`). 단, `shared/ui`의 shadcn 스타일 프리미티브는 관례대로 소문자·케밥(`button.tsx`, `dropdown-menu.tsx`).
- **슬라이스 폴더**: `entities`/`features`는 소문자(`greeting`), `widgets`는 PascalCase(`Header`, `GreetingWidget`).
- **함수·변수**: camelCase / **타입·컴포넌트**: PascalCase / **모듈 상수**: UPPER_SNAKE(`SITE_TITLE`, `FSD_ELEMENTS`).
- **테스트 파일**: 대상 옆 `__tests__/<이름>.test.ts(x)`.
- **import**: 항상 public API로(`@/shared`, `@/widgets/X`, `@/entities/X`). 상대경로(`../lib/utils/cn`)는 **슬라이스 내부**에서만. 경로 별칭은 `@/*`(tsconfig).
- **클라이언트 컴포넌트**: Radix 프리미티브·리액트 state/effect를 쓰면 파일 최상단에 `"use client";` 필수(빠뜨리면 빌드 시 RSC 경계 에러).

### 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org)를 따릅니다. 형식:

```
<타입>(<범위 선택>): <요약>

예) feat(shared/ui): add Dialog component
    fix(api): normalize 401 error message
```

| 타입       | 언제 쓰나                                             | 예시                                 |
| ---------- | ----------------------------------------------------- | ------------------------------------ |
| `feat`     | **새 기능·컴포넌트·공개 API 추가** (동작이 늘어남)    | `feat(widgets): add Header`          |
| `fix`      | **버그 수정** (잘못된 동작을 바로잡음)                | `fix(utils): formatDate 타임존 오차` |
| `refactor` | 동작 변화 없이 **내부 구조 개선**(리네이밍·분리·정리) | `refactor(hooks): useAsync 정리`     |
| `test`     | **테스트 추가/수정**만(제품 코드 변화 없음)           | `test(ui): Button variant 케이스`    |
| `docs`     | **문서만** 변경(README·주석·가이드)                   | `docs: FSD 전략 보강`                |
| `chore`    | 빌드·설정·의존성·스크립트 등 **제품 코드 외 잡무**    | `chore: add prettier`                |

보조 타입(필요 시): `style`(포맷/세미콜론 등 로직 무관), `perf`(성능 개선), `build`/`ci`(빌드·파이프라인).

판단 팁 — **동작이 늘면 `feat`, 고치면 `fix`, 안 바뀌면 `refactor`/`test`/`docs`/`chore`**. 하나의 커밋은 한 타입으로 떨어지게 작게 나눕니다.

---

## 4. 테스트 전략

컴포넌트·훅·유틸·API를 **Vitest** 위에서 테스트합니다. "테스트"는 여러 도구가 역할을 나눕니다:

| 도구                            | 역할                                                    |
| ------------------------------- | ------------------------------------------------------- |
| **Vitest**                      | 테스트 러너·구성(`describe/it`)·단언(`expect`)·커버리지 |
| **@testing-library/react**      | 컴포넌트 렌더링 + 사용자 관점 조회(`render`, `screen`)  |
| **@testing-library/jest-dom**   | DOM 매처(`toBeInTheDocument` 등)                        |
| **@testing-library/user-event** | 클릭·입력 등 상호작용 시뮬레이션                        |
| **jsdom**                       | 브라우저 없이 DOM 제공(테스트 환경)                     |

### 계층별 테스트 관점

| 대상                            | 무엇을 검증                                     |
| ------------------------------- | ----------------------------------------------- |
| `shared/ui`                     | 렌더링·variant·상호작용(클릭/열림), 접근성 role |
| `shared/lib/hooks`              | 상태 전이·경합 방지·타이머(fake timers)         |
| `shared/lib/utils`              | 입출력·엣지케이스(예: 날짜 타임존)              |
| `shared/lib/api`                | 인터셉터·에러 정규화(`axios-mock-adapter`)      |
| `entities`/`features`/`widgets` | 도메인 로직·컴포넌트 동작                       |
| `app`                           | loading/error/not-found·레이아웃 배선           |

### TDD 흐름 (필수)

1. **Red** — 실패하는 테스트부터 작성(`__tests__/*.test.tsx`)하고 실패를 확인.
2. **Green** — 테스트를 통과시키는 최소 구현.
3. **Refactor** — 전체 스위트 통과 유지하며 정리.

> 상세 절차·역할별 브랜치 규약은 `CLAUDE.md` 참고.

### 모킹 / 환경

- `next/font/google`, `window.matchMedia`, `localStorage`는 순수 Vitest 환경에서 그대로 동작하지 않아 **`vitest.setup.ts`** 에서 모킹/폴리필합니다. 새 브라우저 전용 API를 테스트할 때 이 파일을 참고하세요.
- 환경 설정은 `vitest.config.ts`(environment=jsdom, setup 파일 연결).

### 구조 검증 스크립트

`scripts/verify-scaffold.mjs`, `scripts/verify-readme.mjs`는 vitest가 아닌 **순수 Node 스크립트**입니다 — 폴더 구조·문서처럼 "실행"이 아니라 "존재/형태"를 검증할 때 이 패턴을 씁니다.

---

## 커스터마이징 지점 (빠른 참조)

| 무엇                            | 어디                                                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 색/타이포 토큰, 다크모드        | `src/app/globals.css`(`:root`/`.dark`/`@theme inline`) — 규칙은 [DESIGN.md](./DESIGN.md)                                                             |
| 테마 프로바이더/토글, 기본 테마 | `src/shared/ui/theme/*` — `defaultTheme`(기본 `"system"`)                                                                                            |
| 한글/영문 폰트                  | `globals.css`의 Pretendard `@import`·`--font-sans`, `layout.tsx`의 `next/font`(Geist)                                                                |
| Axios(헤더·baseURL·에러)        | `src/shared/lib/api/{client,errors,types}.ts`                                                                                                        |
| shadcn 컴포넌트 추가            | `src/shared/ui/<컴포넌트>.tsx` 작성 → `src/shared/ui/index.ts`에 `export * from "./<컴포넌트>"` → 테스트 작성. Radix/state 쓰면 `"use client";` 필수 |
| 사이트 메타                     | `src/app/layout.tsx`의 `SITE_TITLE`/`SITE_DESCRIPTION`                                                                                               |

---

## 문서

- [.claude/rule/next-fsd-core.md](./.claude/rule/next-fsd-core.md) — FSD 계층/의존성 규칙 원문
- [DESIGN.md](./DESIGN.md) — 디자인 토큰(색/타이포/스페이싱), 접근성(WCAG) 대비 기준
- [CLAUDE.md](./CLAUDE.md) — 에이전트 팀 작업 규약(브랜치/워크트리/TDD)

---

## 프로젝트 파일 권한
chmod +x .claude/hooks/*.sh scripts/*.sh