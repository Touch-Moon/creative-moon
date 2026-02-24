# CLAUDE.md — Creative Moon Portfolio

## Code Edit Rules (토큰 절약 원칙)

- 전체 파일 재작성 금지. 수정이 필요한 함수/클래스/CSS 선택자 블록만 출력.
- 변경된 부분 앞뒤 2~3줄(context lines)만 포함.
- 코드 변경 이유는 한 줄 요약으로만.
- 단순 CSS 수정 시 Artifact 창 금지 → 채팅 코드블록으로만 제시.
- 생략 시 `/* ... existing code ... */` 주석 사용.

---

## currentDate

Today's date is 2026-02-24.

---

## Project Overview

**Creative Moon Portfolio** — Next.js 15 + TypeScript + SCSS + Sanity CMS
Dev server: `http://localhost:3000`
Style Guide page: `http://localhost:3000/style-guide`
CSS Doc (Manual) page: `http://localhost:3000/style-guide/guide`

---

## Ignore List (읽지 말 것 — 토큰 낭비)

Claude는 아래 경로/파일을 자동으로 무시한다. 사용자가 명시적으로 요청할 때만 읽는다.

### 빌드 / 의존성
```
node_modules/
.next/
dist/
build/
out/
.turbo/
.cache/
*.tsbuildinfo
```

### Lock 파일 (내용 불필요)
```
package-lock.json
yarn.lock
pnpm-lock.yaml
bun.lockb
```

### 압축·최소화 파일
```
**/*.min.js
**/*.min.css
**/*.map
```

### 정적 자산 (경로만 참조, 내용 불필요)
```
public/images/
public/fonts/
public/videos/
src/fonts/
static/
```

### WordPress 코어 (참조 불필요)
```
wp-includes/
wp-admin/
wp-content/plugins/
wp-content/upgrade/
wp-content/ai1wm-backups/
```

### 데이터베이스 / 백업
```
*.sql
*.dump
*.bak
app/sql/
```

### 로그
```
logs/
*.log
npm-debug.log*
```

---

## .gitignore — 보안 및 용량 (Git에 절대 올리지 말 것)

### 환경변수 / 시크릿
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production
.env.staging
```

### WordPress 민감 파일
```
wp-config.php
```

### 인증서 / 키
```
*.pem
*.key
*.p12
*.pfx
*.cert
*.crt
id_rsa
id_rsa.pub
.ssh/
```

### API 키 / 토큰 파일
```
secrets.json
credentials.json
serviceAccountKey.json
firebase-adminsdk*.json
```

### Sanity
```
.sanity/
sanity-studio-logs/
```

### 용량 큰 파일
```
wp-content/uploads/       ← WordPress 미디어 (CDN 또는 Sanity Assets으로 이전)
public/assets/videos/
*.zip
*.tar.gz
*.rar
*.7z
*.dmg
*.iso
*.mp4
*.mov
*.avi
*.mkv
```

### OS / IDE
```
.DS_Store
Thumbs.db
.idea/
.vscode/settings.json    ← .vscode/extensions.json은 공유 가능
*.swp
*.swo
```

---

## SCSS Architecture

### Folder Structure

```
src/styles/
├── primitives/          ← SCSS $변수 (빌드타임, CSS 미출력)
│   ├── _colors.scss     ← $m-white, $m-black, $m-accent, $m-grey-*
│   ├── _type.scss       ← fvw() 함수, $fs-*, $fw-*, $lh-*, $ls-*
│   └── _space.scss      ← $space-1 ~ $space-40
├── tokens/              ← CSS --변수 (런타임, :root 출력)
│   ├── _typography.scss ← --fs-*, --fw-*, --lh-*, --ls-*
│   └── _spacing.scss    ← --space-*
├── base/
│   └── _reset.scss      ← HTML/body reset, :root
├── type/
│   ├── _headlines.scss  ← .headline-1 ~ .headline-6
│   └── _body.scss       ← .body-text-1 ~ .body-text-caps
├── components/
│   ├── _button.scss     ← .button, variants, sizes
│   └── _form.scss       ← .form-group, states, checkbox
├── pages/
│   ├── _style-guide.scss ← .cm-* (style guide page)
│   └── _css-doc.scss    ← .cd-* (CSS doc page)
└── styles.scss          ← barrel index (미사용, 참조용)
```

### Key Rules

- **primitives/** → SCSS `$변수`만 — CSS로 출력 안 됨
- **tokens/** → CSS `--변수` — `:root`에 출력됨
- `@use` 시 필요한 primitive만 정확히 import

### Import Patterns

```scss
@use '@/styles/primitives/colors' as *;
@use '../primitives/type' as *;
@use '../primitives/space' as *;
```

### fvw() 함수

```scss
// 기준 viewport: 1440px
// fvw(32) → calc(32 / 1440 * 100vw)
// primitives/_type.scss 에 정의됨
```

### Breakpoints

| 이름 | 값 |
|---|---|
| Desktop (기준) | 1440px |
| Tablet | 1024px (`max-width: 1023.98px`) |
| Mobile | 576px (`max-width: 575.98px`) |

---

## Global Style Import

`src/app/layout.tsx` 에서 순서대로 직접 import:

```ts
import "@/styles/base/_reset.scss";
import "@/styles/tokens/_typography.scss";
import "@/styles/tokens/_spacing.scss";
import "@/styles/type/_body.scss";
import "@/styles/type/_headlines.scss";
import "@/styles/components/_button.scss";
import "@/styles/components/_form.scss";
import "@/styles/pages/_style-guide.scss";
import "@/styles/pages/_css-doc.scss";
```

Component SCSS는 해당 컴포넌트 파일 옆에 배치 후 직접 import.
파일명 케이스 주의 (Turbopack은 대소문자 구분 엄격):
`Hero.tsx` → `Hero.scss` (✓) / `hero.scss` (✗)

---

## Theme System

**Style Guide 전용** — `.cm-root[data-theme='dark|light']`

```css
--cm-bg, --cm-fg, --cm-border, --cm-soft-border
```

다크모드 오버라이드는 항상 `.cm-root[data-theme='dark']` 셀렉터로 작성.

---

## Style Guide Page (`/style-guide/guide`)

**파일:** `src/app/style-guide/guide.tsx`
**스타일:** `src/styles/pages/_css-doc.scss`

### 주요 기능
- 브레이크포인트 셀렉터: Desktop / Tablet / Mobile 토글
- 수치 표시: `calc(N / 1440 * 100vw)` 포맷 (기준 px값 `N`에 회색 하이라이트)
- 다크/라이트 모드 대응

### 데이터 구조

```ts
type BreakpointValues = {
  desktop: string;
  tablet: string;
  mobile: string;
};

type ManualItem = {
  name: string;
  note?: string;
  spec: string | BreakpointValues;
};
```

### Spec 포맷 규칙

```
Desktop: "calc(140 / 1440 * 100vw) · 400 · lh 96% · ls −0.01em"
Tablet:  "calc(64 / 1024 * 100vw) · 400 · lh 96%"
Mobile:  "calc(40 / 576 * 100vw) · 400 · lh 96%"
```

### CSS 클래스 prefix
- `.cm-*` → Style Guide 페이지 레이아웃/테마
- `.cd-*` → CSS Doc 문서 아이템

---

## Component Files

| 컴포넌트 | 경로 |
|---|---|
| Hero | `src/components/home/Hero.tsx` + `Hero.scss` |
| About | `src/components/home/About.tsx` + `about.scss` |
| Header | `src/components/common/Header.tsx` |
| Footer | `src/components/common/Footer.tsx` |
| Style Guide | `src/app/style-guide/page.tsx` |
| CSS Doc | `src/app/style-guide/guide.tsx` |

---

## Tech Stack & Skills

### Frontend
- **Next.js 15** — App Router, RSC 우선 (`'use client'` 최소화)
- **TypeScript** — strict mode
- **SCSS** — 위 아키텍처 준수, BEM 변형
- **Sanity CMS** — 콘텐츠 관리 (my-portfolio-sanity)
- **next/image** — 모든 이미지는 반드시 사용 (LCP 최적화)
- **next/font** — Google Fonts 자체 호스팅

### Backend / API
- **Next.js Route Handlers** → `src/app/api/`
- **Sanity GROQ** — 데이터 쿼리
- **환경변수** — `.env.local` (로컬), Vercel env (프로덕션)

### 추천 패턴
- 서버 컴포넌트에서 데이터 fetch → 클라이언트 컴포넌트에 props 전달
- 인터랙션 필요한 leaf 컴포넌트에만 `'use client'` 적용
- API Route는 외부 서비스 연동, form action, webhook 처리에만 사용

---

## WordPress → Next.js 마이그레이션 참조

- **콘텐츠 소스:** `wp-content/themes/creative-moon/`
- **미디어:** `wp-content/uploads/` → Sanity Assets 또는 `/public`으로 이전
- **라우팅:** WordPress permalink → Next.js App Router 경로로 매핑
- **DB:** `app/sql/` 덤프 파일 → Sanity 스키마로 변환
