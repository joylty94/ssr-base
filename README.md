# ssr-base

AI로 여러 프로젝트를 만들 때 재사용하는 **베이스 프로젝트**입니다. Next.js(App Router) + TypeScript + Tailwind CSS + shadcn/ui 스타일 컴포넌트 + 다크/라이트 테마 + Axios + FSD(Feature-Sliced Design) 구조가 이미 세팅되어 있습니다. 특정 서비스의 비즈니스 로직(로그인, 게시글 등)은 포함하지 않고, 구조와 공통 컴포넌트만 제공합니다.

## 기술 스택

- **Framework**: Next.js 16(App Router, Turbopack) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui 스타일 컴포넌트, CSS 변수 기반 디자인 토큰
- **Theme**: `next-themes` (기본값 = 브라우저 시스템 테마, 다크/라이트 토글)
- **Font**: Pretendard(한글) CDN + 시스템 폰트 폴백
- **HTTP**: Axios + 요청/응답 인터셉터
- **Test**: Vitest + React Testing Library
- **FSD 경계 강제**: `eslint-plugin-boundaries`
- **구조**: FSD(Feature-Sliced Design) — [.claude/rule/next-fsd-core.md](./.claude/rule/next-fsd-core.md) 필독

## 새 프로젝트 시작하기

```bash
npm install
npm run dev      # http://localhost:3000
```

- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint(FSD 경계 규칙 포함)
- `npm run test` — Vitest 전체 실행
- `npm run test:watch` — Vitest watch 모드
- `npm run test:coverage` — 커버리지 리포트

`/showcase` 라우트(`src/app/showcase`)에서 버튼/입력/카드/다이얼로그/드롭다운메뉴 등 shared/ui 컴포넌트와 테마 토글, FSD 예시 슬라이스를 한 번에 확인할 수 있습니다.

이 베이스로 새 프로젝트를 시작하려면: 저장소를 복제한 뒤 `package.json`의 `name`을 바꾸고, `src/app/layout.tsx`의 `SITE_TITLE`/`SITE_DESCRIPTION`, `src/app/showcase`(데모용, 실제 서비스에서는 삭제 가능)를 프로젝트에 맞게 정리하세요.

## 디렉터리 구조 (FSD)

```
src/
├── app/        # 라우팅, 레이아웃, providers, loading/error/not-found, globals.css
├── widgets/    # features 조합(Header, Footer, GreetingWidget 등) — 폴더 1개 = element 1개
├── features/   # 비즈니스 기능(자급자족, feature끼리 서로 임포트 금지) — 폴더 1개 = element 1개
├── entities/   # 여러 feature가 공유하는 데이터 모델 — 폴더 1개 = element 1개
├── shared/     # 모두가 쓰는 것만(ui/lib/hooks/utils/api) — shared 전체가 하나의 element
│   ├── ui/     # 디자인 시스템(Button/Input/Card/Dialog/DropdownMenu/Badge/Skeleton/Separator, ThemeProvider/ThemeToggle, Container)
│   ├── lib/api/    # axios 클라이언트 + 인터셉터
│   ├── lib/hooks/  # useAsync/useDebounce/useMediaQuery
│   └── lib/utils/  # cn/date/string
└── config/     # 전역 설정(자리만 확보, 현재 비어 있음)
```

의존성은 **위로만** 흐릅니다: `shared ← entities ← features ← widgets ← app`. `eslint-plugin-boundaries`(`eslint.config.mjs`)가 이 방향과 "features끼리 서로 임포트 금지", "각 계층은 index.ts로만 임포트"를 빌드 타임에 강제합니다. 자세한 원칙은 [.claude/rule/next-fsd-core.md](./.claude/rule/next-fsd-core.md) 참고.

**중요한 설계 선택**: `shared`는 문서상 예시(`@/shared/ui`, `@/shared/lib/hooks` 등 하위 경로 개별 임포트)와 달리, 이 베이스에서는 **`@/shared` 하나의 배럴만 공개 API**로 취급합니다(`src/shared/index.ts`가 `ui`/`lib` 전체를 재노출). `shared/ui/theme`처럼 더 깊은 하위 폴더를 만들어도 항상 `@/shared`에서 최종적으로 임포트하세요. `widgets`는 반대로 위젯 폴더별로 각각 공개 API가 있어(`@/widgets/Header`, `@/widgets/Footer`), widgets 전체를 묶는 배럴은 두지 않았습니다.

## 새 FSD 슬라이스 추가하기

예시: `entities/greeting` → `features/greeting` → `widgets/GreetingWidget` (`src/entities/greeting`, `src/features/greeting`, `src/widgets/GreetingWidget`를 실제로 열어보세요. `/showcase` 페이지 하단에서 동작도 확인할 수 있습니다).

1. **entities/\<이름\>** — 순수 데이터 모델/타입/함수만 둡니다. `shared`만 의존할 수 있고, 다른 계층에 의존하면 안 됩니다.
   - `src/entities/<이름>/model/*.ts` + `src/entities/<이름>/index.ts`(public API)
2. **features/\<이름\>** — 하나의 비즈니스 기능을 자급자족으로 구현합니다. `entities`, `shared`만 의존하고, **다른 feature는 절대 임포트하지 않습니다**(조합은 widgets에서).
   - `src/features/<이름>/ui/*.tsx` + `src/features/<이름>/index.ts`
3. **widgets/\<이름\>** — 여러 features(+entities/shared)를 조합합니다.
   - `src/widgets/<이름>/<이름>.tsx` + `src/widgets/<이름>/index.ts`
4. **app**에서 위젯을 조합해 라우트를 만듭니다: `import { X } from "@/widgets/X"`.

각 단계는 반드시 **먼저 실패하는 테스트(Red)** 를 작성한 뒤 구현하세요(`CLAUDE.md`의 TDD 절차). `npm run lint`가 계속 그린이면 경계 규칙을 지킨 것입니다.

## shadcn 스타일 컴포넌트 추가/커스터마이징

이 베이스는 shadcn CLI 대신 컴포넌트를 **직접 작성**했습니다(`src/shared/ui/*.tsx`: button/input/card/badge/skeleton/separator/dialog/dropdown-menu). 새 컴포넌트를 추가하려면:

1. `src/shared/ui/<컴포넌트>.tsx`에 [shadcn/ui](https://ui.shadcn.com) 공식 소스를 참고해 작성하되, import 경로를 이 프로젝트에 맞게 바꿉니다.
   - `cn` 유틸: `import { cn } from "../lib/utils/cn"`
   - Radix 프리미티브를 쓰거나 리액트 state/effect를 쓰면 파일 최상단에 `"use client";`를 반드시 추가하세요(빠뜨리면 `npm run build`에서 "You're importing a module that depends on ... into a Server Component" 에러가 납니다 — 이 저장소에서도 두 번 실제로 겪은 문제입니다).
2. 필요한 디자인 토큰이 없으면 `src/app/globals.css`의 `:root`/`.dark`에 CSS 변수를 추가하고 `@theme inline`에 `--color-*`로 매핑합니다(색은 DESIGN.md의 HSL 팔레트 규칙을 따르세요).
3. `src/shared/ui/index.ts`에 `export * from "./<컴포넌트>"` 한 줄을 추가합니다(그래야 `@/shared`에서 쓸 수 있습니다).
4. 렌더링/상호작용 테스트를 `src/shared/ui/__tests__/<컴포넌트>.test.tsx`에 먼저 작성(Red)한 뒤 구현(Green)하세요.

## 테마 커스터마이징 지점

- 색/타이포 토큰: `src/app/globals.css`(`:root`, `.dark`, `@theme inline`) — 다크모드는 `next-themes`의 `attribute="class"` 전략이라 `.dark` 클래스 선택자를 기준으로 합니다.
- 테마 프로바이더/토글: `src/shared/ui/theme/{ThemeProvider,ThemeToggle}.tsx` — 이미 `src/app/layout.tsx`에 배선되어 있습니다.
- 기본값을 "항상 라이트/다크"로 고정하려면 `ThemeProvider`의 `defaultTheme`을 바꾸세요(기본은 `"system"` = 브라우저 설정).

## 폰트 커스터마이징 지점

- Pretendard CDN + 폴백 체인: `src/app/globals.css`의 `@import url(...)`와 `--font-sans` 변수.
- 영문 폰트(Geist)는 `src/app/layout.tsx`의 `next/font/google` 호출로 로드되며 `--font-geist-sans`/`--font-geist-mono`로 노출됩니다. 다른 폰트로 바꾸려면 이 부분을 교체하세요.

## Axios 커스터마이징 지점

- 클라이언트/인터셉터: `src/shared/lib/api/{client,errors,types}.ts` (`@/shared`에서 임포트).
- 공통 헤더, baseURL, 에러 정규화 규칙은 이 폴더 안에서 바꿉니다.

## 테스트(TDD) 규칙

- 컴포넌트/훅은 Vitest + React Testing Library로 테스트합니다(`src/**/__tests__/*.test.tsx`).
- `next/font/google`, `window.matchMedia`, `localStorage`는 순수 Vitest 환경에서 그대로 동작하지 않아 `vitest.setup.ts`에서 모킹/폴리필합니다. 새로운 브라우저 전용 API를 쓰는 코드를 테스트할 때 비슷한 문제가 생기면 이 파일을 참고하세요.
- 구조 검증용 스크립트(`scripts/verify-scaffold.mjs`, `scripts/verify-readme.mjs`)는 vitest가 아닌 순수 Node 스크립트입니다 — 폴더 구조나 문서처럼 "실행"이 아니라 "존재/형태"를 검증할 때 이 패턴을 참고하세요.

## 문서

- [PLAN.md](./PLAN.md) — 전체 작업 계획/결정 로그
- [DESIGN.md](./DESIGN.md) — 디자인 토큰(색/타이포/스페이싱), 접근성(WCAG) 대비 기준
- [.claude/rule/next-fsd-core.md](./.claude/rule/next-fsd-core.md) — FSD 계층/의존성 규칙 원문
