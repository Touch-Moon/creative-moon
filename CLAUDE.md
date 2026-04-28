# CLAUDE.md — Creative Moon Portfolio

## Progress Tracker (세션 간 작업 현황)

> 세션이 바뀌어도 이 섹션을 읽어 현재 상태를 파악한다.
> 작업 완료/시작 시 Claude가 직접 업데이트한다.

### 현재 브랜치
`feature/scss-value-compile`

### 완료된 작업 ✅
- [x] Hero 섹션 (light 테마)
- [x] HomeIntro 섹션
- [x] HomeSkills 섹션
  - [x] 개별 아이템 스크롤 트리거 (SkillItem 분리)
  - [x] opacity 0.5 → 1 애니메이션 (once: true, 50% 트리거)
  - [x] 라인 애니메이션 (scaleX, 각 아이템 하단)
- [x] HomeMarquee 섹션 (dark 테마)
- [x] HomeWorks 섹션
  - [x] 라인 애니메이션 3단계 순차 (h-top → vertical → h-bottom)
  - [x] 이미지 경로 연결 (/images/work-01~05.jpg)
  - [x] card-img position: relative + overflow: hidden
- [x] HomeStories 섹션
- [x] Footer
- [x] ThemeBackground (viewport 기반 dark/light 전환)
- [x] CSS 변수 (--foreground, --foreground-muted, --foreground-dim)
- [x] ArrowButton 공통 컴포넌트

### 진행 중 🔄
- [ ] 없음

### 완료된 작업 ✅ (2026-02-28 추가)
- [x] /work List 페이지 (`src/app/work/page.tsx` + `WorkList.tsx` + `WorkList.scss`)
  - HALF/HALF/FULL 그리드 패턴 (index % 3)
  - 카테고리 필터 (클라이언트 사이드)
  - clipPath reveal 로드 애니메이션 (HomeWorks cardVariants 방식)
  - Canvas Wave 마우스오버 효과 (WaveImage 공통 컴포넌트)
  - Sanity 연동 + placehold.co 더미 fallback
- [x] /work/[slug] Single 페이지 (`src/app/work/[slug]/page.tsx` + `WorkSingle.tsx` + `WorkSingle.scss`)
  - Hero 텍스트/이미지/비디오
  - 프로젝트 정보 (What we do / Overview / Visit website)
  - 5종 Content Module 렌더러 (mediaModule, twoColImageModule, bgImageModule, textModule, fullBleedModule)
- [x] WaveImage 공통 컴포넌트 추출 (`src/components/common/WaveImage.tsx` + `WaveImage.scss`)
- [x] Sanity 스키마 (`schemaTypes/work.ts`, `schemaTypes/category.ts`)
  - my-portfolio + my-portfolio-sanity 양쪽 동기화
  - 기존 caseStudy, project, post, page 스키마 제거
- [x] Sanity GROQ 쿼리 (`src/sanity/queries.ts`)
  - WORKS_LIST_QUERY, WORK_BY_SLUG_QUERY, CATEGORIES_QUERY, urlFor()

### 완료된 작업 ✅ (2026-04-11 추가)
- [x] 배포 (Vercel) — main 브랜치 연동 완료
- [x] 이미지 최적화 — next.config.ts formats(avif/webp)+TTL, 전 컴포넌트 quality/sizes props 추가
- [x] 비디오 최적화 — HomeIntro poster+preload="none", StorySingle preload="metadata" 추가
- [x] OPTIMIZATION_PLAN.md 생성 — 전체 최적화 로드맵 (이미지→비디오→성능→SEO→코드→UX)

### 다음 예정 작업 📋
- [ ] 각 섹션 반응형 추가 세밀화 (Tablet / Mobile)
- [ ] HomeWorks 카드 → Sanity work 데이터 연동
- [ ] More Work 슬라이더 (Single 페이지 하단)
- [ ] Sanity에 실제 work 데이터 입력

---

## Git Workflow (자동 커밋 + Push 안내 규칙)

- **수정 완료 → 새 작업 시작 전에 반드시 커밋**
- 커밋 타이밍: 하나의 기능/수정이 끝난 직후, 다음 태스크로 넘어가기 전
- 커밋 메시지 형식: `feat|fix|refactor|style: 한 줄 요약 (영문)`
- `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` 항상 포함
- **새 작업 시작 전, 아래 형식으로 Push 안내 후 대기:**

```
📦 Push 먼저 해주세요
cd /Users/jin-chulmoon/Documents/Work/01_CreativeMoon/my-portfolio
git push origin <현재 브랜치명>
완료되면 말씀해 주시면 바로 시작하겠습니다.
```

- Remote: `https://github.com/Touch-Moon/creative-moon.git`

---

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

## Line Animation Convention (자동 적용 규칙)

섹션에 구분선(라인)이 존재하면 **반드시 자동으로** 아래 패턴의 애니메이션을 추가한다.

### 수평 라인 (border, hr, __rule, __line-h 등)
```tsx
// 트랙 (흐린 배경선) + 이너 (채움선)
<div className="__line">
  <motion.span
    className="__line-inner"
    initial={{ scaleX: 0 }}
    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
    transition={{ duration: 0.67, ease: EASE_OUT, delay }}
  />
</div>
```
```scss
.__line        { position: relative; height: 1px; width: 100%; background: var(--foreground-dim); }
.__line-inner  { position: absolute; inset: 0; background: var(--foreground); transform-origin: left center; will-change: transform; display: block; }
```

### 수직 라인 (__line-v)
```tsx
<motion.span
  className="__line-v"
  initial={{ scaleY: 0 }}
  animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
  transition={{ duration: 0.67, ease: EASE_OUT, delay }}
/>
```
```scss
.__line-v { position: absolute; width: 1px; height: ...; background: var(--foreground-dim); transform-origin: left top; will-change: transform; }
```

### 복수 라인 시퀀스
여러 라인이 함께 있으면 **순서대로 딜레이**를 주어 사각형을 그리듯 연출:
- top 수평선: `delay: 0`
- 수직선: `delay: 0.3`
- bottom 수평선: `delay: 0.67` (top 완료 시점)

### 적용 기준
- `border-top`, `border-bottom`, `border-right` 등 CSS border → 애니메이션 라인 span으로 교체
- `<hr>`, `__rule`, `__divider`, `__line` 등 구분선 역할 태그 → inner span 추가
- 트리거: 해당 섹션 또는 아이템의 `useInView` (`once: true`)에 연동

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

---

## Contact Form API Setup (환경변수)

**파일 위치:** `my-portfolio/.env.local`

### ⚠️ 중요: Git에서 절대 제외
- `.env.local` 은 **반드시** `.gitignore`에 포함되어야 함
- 커밋/푸시 시 이 파일이 포함되지 않도록 자동 확인
- 호스팅 배포 시: `.gitignore`가 제대로 설정되었으면, **호스팅 서비스 대시보드에서** 환경 변수를 따로 설정

### 필수 환경 변수 (로컬 개발)
```env
# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Resend (Email Service)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev (개발용 - 프로덕션에서는 검증된 도메인 사용)
CONTACT_TO_EMAIL=hello@creativemoon.com
```

### API 키 얻는 방법
1. **Google reCAPTCHA v3**: https://www.google.com/recaptcha/admin
   - Site Key (NEXT_PUBLIC_* = 클라이언트 노출 가능)
   - Secret Key (서버 환경변수만)

2. **Upstash Redis**: https://console.upstash.com
   - Redis 데이터베이스 생성 → REST API → URL + Token

3. **Resend**: https://resend.com/api-keys
   - API Key 생성

### 배포 시 환경변수 설정
| 호스팅 서비스 | 설정 위치 |
|---|---|
| **Vercel** | Settings → Environment Variables |
| **Netlify** | Site settings → Build & deploy → Environment |
| **AWS Amplify** | App settings → Environment variables |
| **Railway** | Project → Variables |

**주의:** Resend `RESEND_FROM_EMAIL`은 프로덕션에서 반드시 검증된 도메인으로 변경할 것

---

## 배포 전략 (2026-03-02 확정)

### 최종 결정 구조
```
Next.js 앱      →  Vercel (무료 Hobby 플랜)
콘텐츠 DB       →  Sanity 클라우드 (무료, 별도 배포 불필요)
Sanity Studio   →  sanity deploy (무료)
도메인          →  Cloudflare로 이전 (원가 갱신, 무료 이메일 포워딩 포함)
이메일 발송     →  Resend 무료 플랜 (하루 100건)
이메일 수신     →  Gmail (무제한)
```

### Hostinger 관련
- **Premium Web Hosting**: 만료 후 갱신 안 함 (Node.js 미지원 공유호스팅이라 Next.js 불가)
- **도메인 `creative-moon.com`**: External domains로 별도 관리 중 → 호스팅 해지해도 도메인 유지됨
- **이메일**: 호스팅 해지 시 같이 없어짐 → Cloudflare Email Routing으로 대체

### Cloudflare 이전 이유
- 도메인 원가 갱신 (마진 0%)
- 무료 이메일 포워딩 (`hello@creative-moon.com` → Gmail)
- 무료 DNS, DDoS 방어
- Vercel 연결이 편함

### Vercel 배포 순서 (사이트 완성 후)
```
1. GitHub에 코드 push
2. vercel.com → GitHub 로그인 → 레포 선택
3. 환경변수 입력 (SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN, RESEND_API_KEY 등)
4. Deploy 클릭
5. Vercel에서 custom domain 추가 → Cloudflare DNS A레코드 변경
```

### 이메일 주소
```
보내는 사람: hello@creative-moon.com  (Resend 도메인 연결)
받는 사람:   Moon님 Gmail             (Cloudflare Email Routing 포워딩)
```

### 왜 Sanity는 DB 배포가 필요 없는가
- Sanity 데이터는 Sanity 클라우드에 항상 존재
- Next.js 앱은 API로 가져다 쓰는 구조
- WordPress처럼 MySQL 덤프/업로드 작업 없음

---

## Contact Page API 연동 (배포 직전에 작업)

> ⚠️ 사이트 완성 후 배포 직전에 설정할 것. 지금은 건드리지 않음.

### 최종 결정 스택
```
스팸 차단   →  Cloudflare Turnstile (무료, 무제한) + Honeypot 방식 병행
이메일 발송 →  Resend (무료, 하루 100건)
Rate Limit  →  Upstash Redis (무료)
```

### reCAPTCHA 대신 Cloudflare Turnstile을 쓰는 이유
- 완전 무료 (제한 없음)
- 사용자가 아무것도 안 해도 됨 (체크박스, 이미지 선택 없음)
- Google에 데이터 안 넘어감 (개인정보 보호)
- 어차피 Cloudflare로 도메인 이전하므로 연동이 자연스러움

### Honeypot 방식 (코드만으로 봇 1차 차단)
```tsx
// 폼에 숨겨진 필드 추가 (사람 눈에 안 보임, 봇은 채움)
<input name="honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

// API Route에서 체크
if (body.honeypot) return res.status(400).json({ error: 'Bot detected' })
```

### 환경변수 (배포 직전 설정)
```env
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Resend
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=hello@creative-moon.com
CONTACT_TO_EMAIL=Moon님_Gmail주소

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

### API 키 발급 위치
- Cloudflare Turnstile: Cloudflare 대시보드 → Turnstile
- Resend: resend.com/api-keys
- Upstash Redis: console.upstash.com
