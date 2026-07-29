# Next.js FSD: 핵심 원칙 & 전체 구조

## 🎯 FSD 핵심 원칙 5가지

### 1️⃣ **의존성은 위로만 흐른다**

```
app ↑ widgets ↑ features ↑ entities ↑ shared

shared는 아무도 의존 X
entities → shared만 의존
features → entities, shared만 의존
widgets → features, entities, shared 의존
app → 모두 의존 가능
```

### 2️⃣ **Features는 절대 Features를 임포트하지 않는다**

```typescript
// ❌ 절대 금지
features / auth / ui / LoginForm.tsx에서;
import { CommentForm } from "@/features/comments";

// ✅ 대신 widgets에서 조합
widgets / PostWithComments.tsx;
import { PostDetail } from "@/features/posts";
import { CommentForm } from "@/features/comments";
```

### 3️⃣ **Public API (index.ts)로만 임포트한다**

```typescript
// ❌ 절대 금지
import { authSlice } from "@/features/auth/model/slice";
import { loginAPI } from "@/features/auth/api/service";

// ✅ 항상 public API 사용
import { useAuth, LoginForm } from "@/features/auth";
```

### 4️⃣ **각 Feature는 자급자족한다**

```
features/auth/는 로그인 관련 모든 것 포함
- UI (LoginForm, LogoutButton)
- API 호출 (authService)
- 상태 관리 (authSlice)
- 커스텀 훅 (useAuth)
- 로직 (validators, tokenManager)

다른 feature에 의존하지 않고 혼자 동작!
```

### 5️⃣ **Shared는 정말 공유되는 것만**

```
shared/에 들어가는 것:
✅ Button, Input, Modal (모든 앱이 필요)
✅ API 클라이언트, 유틸 함수 (공용)
✅ 타입 정의 (공용)

❌ 비즈니스 로직 (특정 feature 관련)
❌ 특정 기능 (로그인, 포스트 등)
```

---

## 🏗️ 전체 구조 한눈에

```
src/
│
├── app/                    ← Next.js 라우팅 (조합만)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── api/
│   │   ├── auth/route.ts
│   │   └── posts/route.ts
│   └── globals.css
│
├── features/               ← 비즈니스 기능 (핵심!)
│   ├── auth/              (로그인/회원가입)
│   │   ├── ui/
│   │   │   ├── LoginForm.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── model/
│   │   │   ├── authSlice.ts
│   │   │   ├── selectors.ts
│   │   │   └── types.ts
│   │   ├── api/
│   │   │   └── authService.ts
│   │   ├── lib/
│   │   │   ├── tokenManager.ts
│   │   │   └── validators.ts
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── index.ts          ← ⭐ PUBLIC API
│   │
│   ├── posts/             (포스팅)
│   │   ├── ui/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── PostEditor.tsx
│   │   ├── model/
│   │   │   ├── postsSlice.ts
│   │   │   └── types.ts
│   │   ├── api/
│   │   │   └── postsService.ts
│   │   ├── hooks/
│   │   │   ├── usePosts.ts
│   │   │   └── useCreatePost.ts
│   │   └── index.ts          ← ⭐ PUBLIC API
│   │
│   ├── comments/          (댓글)
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── index.ts          ← ⭐ PUBLIC API
│   │
│   ├── likes/             (좋아요)
│   │   ├── ui/
│   │   ├── model/
│   │   ├── hooks/
│   │   └── index.ts          ← ⭐ PUBLIC API
│   │
│   └── notifications/     (알림)
│       ├── ui/
│       ├── model/
│       ├── hooks/
│       └── index.ts          ← ⭐ PUBLIC API
│
├── entities/               ← 기본 데이터 모델
│   ├── user/              (여러 features에서 공유)
│   │   ├── model/
│   │   │   ├── User.ts
│   │   │   └── UserId.ts
│   │   ├── ui/
│   │   │   ├── UserCard.tsx
│   │   │   └── UserAvatar.tsx
│   │   └── index.ts          ← ⭐ PUBLIC API
│   │
│   ├── post/
│   │   ├── model/
│   │   │   ├── Post.ts
│   │   │   └── PostId.ts
│   │   ├── ui/
│   │   │   └── PostHeader.tsx
│   │   └── index.ts          ← ⭐ PUBLIC API
│   │
│   └── comment/
│       ├── model/
│       ├── ui/
│       └── index.ts          ← ⭐ PUBLIC API
│
├── widgets/                ← Features 조합
│   ├── Header/            (네비 + 프로필 + 알림)
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   └── index.ts          ← ⭐ PUBLIC API
│   │
│   ├── Sidebar/           (추천 + 검색)
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   │
│   ├── PostWithComments/  (포스트 + 댓글 + 좋아요)
│   │   ├── PostWithComments.tsx
│   │   └── index.ts
│   │
│   └── Footer/
│       ├── Footer.tsx
│       └── index.ts
│
├── shared/                 ← 모두가 사용
│   ├── ui/                ← 디자인 시스템
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   └── index.ts
│   │   └── index.ts          ← ⭐ 모든 UI 컴포넌트
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   │   ├── useAsync.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── string.ts
│   │   │   ├── date.ts
│   │   │   └── index.ts
│   │   └── constants/
│   │       ├── config.ts
│   │       └── index.ts
│   │
│   ├── types/
│   │   └── common.ts
│   │
│   └── index.ts              ← ⭐ Shared의 Public API
│
└── config/                ← 앱 설정
    ├── store.ts           (전역 상태 관리)
    └── environment.ts     (환경 설정)
```

---

## 📌 각 계층의 역할 (한줄 요약)

| 계층         | 역할                                   | 의존                       | 예시                         |
| ------------ | -------------------------------------- | -------------------------- | ---------------------------- |
| **shared**   | 모든 앱이 필요한 기본 요소             | 없음                       | Button, Input, API클라이언트 |
| **entities** | 여러 features에서 공유되는 데이터 모델 | shared                     | User, Post, Comment          |
| **features** | 하나의 비즈니스 기능 (자급자족)        | entities, shared           | auth, posts, comments        |
| **widgets**  | 여러 features를 조합한 컴포넌트        | features, entities, shared | Header, PostWithComments     |
| **app**      | 라우팅과 레이아웃                      | 모두                       | pages, layouts, API routes   |

---

## 🔄 의존성 흐름 (중요!)

```
                    ┌─────────────┐
                    │    app      │  ← 모두에서 임포트 가능
                    └──────▲──────┘
                           │
                    ┌──────┴──────┐
                    │   widgets   │  ← features만 결합
                    └──────▲──────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
   ┌────┴────────┐            ┌──────────────┴──────┐
   │  features   │            │   entities         │
   │(auth,posts) │  ❌ 서로    │  (user, post)      │
   │             │  임포트    │                     │
   │             │  금지      │                     │
   └────▲────────┘            └──────────▲──────────┘
        │                               │
        └───────────────┬───────────────┘
                        │
                   ┌────┴──────┐
                   │  shared   │  ← 아무것도 의존 X
                   │(Button,   │
                   │API,utils) │
                   └───────────┘
```

---

## ⚠️ 절대 금지 사항

### ❌ 1. Features가 Features를 임포트

```typescript
// features/auth에서
import { CommentForm } from "@/features/comments"; // ❌ 금지!

// 대신 widgets에서 조합
// widgets/PostWithComments.tsx
import { PostDetail } from "@/features/posts";
import { CommentForm } from "@/features/comments"; // ✅ 여기서는 OK
```

### ❌ 2. 구현 파일을 직접 임포트 (index.ts 우회)

```typescript
// ❌ 금지
import { authSlice } from "@/features/auth/model/slice";
import { loginAPI } from "@/features/auth/api/service";
import { validateEmail } from "@/features/auth/lib/validators";

// ✅ 항상 public API 사용
import { useAuth, LoginForm } from "@/features/auth";
```

### ❌ 3. Shared에서 다른 계층 임포트

```typescript
// shared/ui/Button.tsx에서
import { useAuth } from "@/features/auth"; // ❌ 금지!
// shared는 순수하고 의존성이 없어야 함
```

### ❌ 4. 순환 의존성

```typescript
// features/posts/api/postsService.ts에서
import { useComments } from "@/features/comments"; // ❌

// features/comments/hooks/useComments.ts에서
import { getPosts } from "@/features/posts/api"; // ❌
```

### ❌ 5. App에서 business logic 작성

```typescript
// app/posts/page.tsx
const [posts, setPosts] = useState([])
const fetchPosts = async () => { ... }  // ❌ 이건 features에서 해야 함

// ✅ 대신 features에서 가져오기
import { PostList } from '@/features/posts'

export default function PostsPage() {
  return <PostList />
}
```

---

## ✅ 올바른 임포트 패턴

### Features에서

```typescript
// features/posts/ui/PostCard.tsx
import { Post } from '@/entities/post'           ✅ entities OK
import { Button } from '@/shared/ui'             ✅ shared OK
import { useAsync } from '@/shared/lib/hooks'    ✅ shared OK

// ❌ 다른 features 임포트 금지
// import { CommentForm } from '@/features/comments'
```

### Widgets에서

```typescript
// widgets/PostWithComments.tsx
import { PostDetail } from '@/features/posts'    ✅ features OK
import { CommentList } from '@/features/comments' ✅ features OK
import { Post } from '@/entities/post'           ✅ entities OK
import { Button } from '@/shared/ui'             ✅ shared OK
```

### Pages에서

```typescript
// app/posts/[id]/page.tsx
import { PostWithComments } from '@/widgets'     ✅ widgets OK
import { Button } from '@/shared/ui'             ✅ shared OK
```

---

## 🎯 실제 예시: 포스트 상세 페이지

### 구조

```
app/posts/[id]/page.tsx
    ↓ (임포트)
widgets/PostWithComments.tsx
    ├── ↓ (임포트)
    ├── features/posts → PostDetail
    ├── features/comments → CommentList, CommentForm
    ├── features/likes → LikeButton
    └── entities/user → UserAvatar
            ↓
        entities/post, entities/comment, entities/user
            ↓
        shared (Button, Input, API client 등)
```

### 코드

```typescript
// app/posts/[id]/page.tsx
import { PostWithComments } from '@/widgets'

export default function PostPage({ params }: { params: { id: string } }) {
  return <PostWithComments postId={params.id} />
}
```

```typescript
// widgets/PostWithComments/PostWithComments.tsx
import { PostDetail } from '@/features/posts'
import { CommentList, CommentForm } from '@/features/comments'
import { LikeButton } from '@/features/likes'

export function PostWithComments({ postId }: { postId: string }) {
  return (
    <div>
      <PostDetail postId={postId} />
      <LikeButton postId={postId} />
      <CommentForm postId={postId} />
      <CommentList postId={postId} />
    </div>
  )
}
```

각 features는 독립적:

```typescript
// features/posts/ui/PostDetail.tsx
import { Post } from "@/entities/post";
import { Button } from "@/shared/ui";
// ❌ 다른 features 없음 (widgets에서 조합)

// features/comments/ui/CommentList.tsx
import { Comment } from "@/entities/comment";
import { Button } from "@/shared/ui";
// ❌ 다른 features 없음 (widgets에서 조합)
```

---

## 🚀 시작하기: 3가지만 기억하세요

### 1️⃣ 의존성 방향

```
의존성은 위로만 흐른다
shared ← entities ← features ← widgets ← app
```

### 2️⃣ Public API

```
각 폴더의 index.ts로만 임포트
import { useAuth } from '@/features/auth'
```

### 3️⃣ Features는 독립적

```
features끼리는 절대 임포트하지 않기
widgets에서만 여러 features를 결합
```

---

## 📊 빠른 체크리스트

새로운 파일을 만들 때:

- [ ] Shared에 넣나요? → 아무것도 임포트 안 함
- [ ] Entities에 넣나요? → shared만 임포트
- [ ] Features에 넣나요? → shared, entities만 임포트
- [ ] 다른 features를 임포트 하려나요? → widgets에서 해야 함
- [ ] index.ts로 public API 정의했나요?

---

## 💡 핵심 요약

```
FSD의 모든 것 = 의존성 규칙

위 규칙을 지키면:
✅ 팀 협업이 쉬워짐 (충돌 없음)
✅ 기능 추가가 빨라짐 (위치 명확)
✅ 리팩토링이 간단 (영향 범위 제한)
✅ 테스트가 쉬움 (독립적)
✅ 마이크로 서비스로 확장 가능

이 규칙을 어기면:
❌ 스파게티 코드 (의존성 복잡)
❌ 순환 참조 (에러 디버깅 어려움)
❌ 팀 충돌 (Git conflict 증가)
❌ 변경이 두렵다 (어디가 깨질지 모름)
```

---

## 🎓 학습 순서

1. **의존성 흐름 이해** (이 문서)
2. **각 계층별 예시 코드** (이전 상세 가이드)
3. **ESLint로 규칙 강제** (linting 설정)
4. **작은 프로젝트로 연습** (auth + posts만)
5. **팀 가이드 문서 작성** (규칙 공유)
