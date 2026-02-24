# Creative Moon — WordPress → Next.js 리뉴얼 작업계획

> 기준일: 2026-02-24
> 전략: 섹션 단위 완성 방식 (Hero부터 페이지별로 순서대로)

---

## 사이트맵

| 순서 | URL | WP 소스 | Next.js 경로 | 상태 |
|---|---|---|---|---|
| 1 | `/` | `page-home.twig` | `src/app/page.tsx` | 🔨 진행중 |
| 2 | `/work/` | `page-work.twig` | `src/app/work/page.tsx` | ⬜ 미시작 |
| 3 | `/work/[slug]` | `single-portfolio.twig` | `src/app/work/[slug]/page.tsx` | ⬜ 미시작 |
| 4 | `/about/` | `page-about.twig` | `src/app/about/page.tsx` | ⬜ 미시작 |
| 5 | `/manifesto/` | `page-manifesto.twig` | `src/app/manifesto/page.tsx` | ⬜ 미시작 |
| 6 | `/contact/` | `page-contact.twig` | `src/app/contact/page.tsx` | ⬜ 미시작 |
| 7 | `/insight/` | `archive-insight.twig` | `src/app/insight/page.tsx` | ⬜ Phase 2 |
| 8 | `/insight/[slug]` | `single-insight.twig` | `src/app/insight/[slug]/page.tsx` | ⬜ Phase 2 |

> **Note:** `/projects/[slug]/` 경로는 `/work/[slug]/`로 통일. 기존 Next.js `projects/` 라우트는 제거 or 리다이렉트.

---

## Phase 1 — Home Page 완성

### 섹션 구성 (WP page-home.twig 기준)

| # | 섹션 | 컴포넌트 | WP 클래스 | 상태 |
|---|---|---|---|---|
| 1 | Hero 타이틀 | `Hero.tsx` | `.home--title` | ✅ 완료 |
| 2 | Moon 소개 (로고 + 텍스트) | `HomeMoon.tsx` | `.home--moon` | ⬜ |
| 3 | Work 하이라이트 (포트폴리오 3개) | `HomeWork.tsx` | `.work__container` | ⬜ |
| 4 | About 링크 (Manifesto / About 카드) | `HomeAbout.tsx` | `.home--about` | ⬜ |
| 5 | Footer | `Footer.tsx` | `footer.twig` | ⬜ 확인 필요 |

### 컴포넌트 경로 규칙
```
src/components/home/Hero.tsx + Hero.scss        ← ✅ 완료
src/components/home/HomeMoon.tsx + HomeMoon.scss
src/components/home/HomeWork.tsx + HomeWork.scss
src/components/home/HomeAbout.tsx + HomeAbout.scss
src/components/common/Header.tsx
src/components/common/Footer.tsx
```

---

## Phase 2 — Work 페이지

### Work 목록 (`/work/`)
- 카테고리 필터 (All / 카테고리별)
- 포트폴리오 그리드
- Sanity GROQ로 `project` 타입 fetch

### Work 상세 (`/work/[slug]`)
- 포트폴리오 Hero (타이틀 + 크레센트 로고)
- 상단 이미지 (bg_image + logo)
- 프로젝트 정보 (Client, Year, Role)
- 본문 콘텐츠 (Sanity portable text)

### Sanity 스키마 확정
- `project` = 포트폴리오 작업물 (썸네일, 클라이언트, URL, 본문)
- `caseStudy` = 케이스 스터디 (심층 분석, 별도 레이아웃)

---

## Phase 3 — About 페이지

### 섹션 구성 (WP page-about.twig 기준)
1. Hero (타이틀 애니메이션 + 크레센트 로고)
2. About 헤드 (애니메이션 텍스트 + "CREATIVE" 글자 분해)
3. About Me 3단 아코디언 (01. Who / 02. What / 03. Why Moon)
4. Skills 목록 (Front-end / Design)
5. 초상화 이미지 (sticky 사이드)

### 애니메이션 전환
- WP `textillate` (jQuery) → framer-motion `staggerChildren`
- WP `data-scroll-sticky` → framer-motion `useScroll` + `useTransform`

---

## Phase 4 — Manifesto 페이지

### 섹션 구성
1. Hero (다크 배경, 타이틀 애니메이션)
2. Manifesto 2컬럼 (이미지 sticky + 텍스트 scroll)
3. 항목별 스크롤 트리거 애니메이션

---

## Phase 5 — Contact 페이지

- 이메일 링크: `touch@creative-moon.com`
- CF7 폼 → Next.js API Route (`src/app/api/contact/route.ts`)
- 폼: 이름, 이메일, 메시지 → 이메일 발송 (nodemailer 또는 Resend)

---

## Phase 6 — Insight (블로그) — 후순위

- Sanity `post` 타입 연동
- 목록 + 상세 페이지

---

## 공통 작업 (모든 Phase에 걸쳐)

### 애니메이션 패턴 (framer-motion)

```tsx
// 1. 타이틀 마스크 언베일 (Hero에 적용됨 - 이 패턴 재사용)
clipPath: "polygon(0% 115%, 100% 115%, 100% 115%, 0% 115%)"
→ "polygon(0% -20%, 100% -20%, 100% 120%, 0% 120%)"

// 2. 스크롤 트리거 fade-in
useInView + motion.div (animate when in view)

// 3. Sticky 이미지 (About, Manifesto)
useScroll + useTransform
```

### 공유 HeroTitle 컴포넌트
About, Manifesto, Work, Contact 모두 동일한 Hero 패턴 사용 → 공유 컴포넌트로 추출
```
src/components/common/PageHero.tsx
```

### SCSS 클래스 네이밍
- 홈: `.home-*`
- 공통 Hero: `.page-hero`
- Work: `.work-*`
- About: `.about-*`
- Manifesto: `.manifesto-*`
- Contact: `.contact-*`

### SEO (Next.js metadata)
```ts
// 각 page.tsx에 추가
export const metadata: Metadata = {
  title: "페이지 제목 | Creative Moon",
  description: "...",
  openGraph: { ... }
}
```

---

## 미디어 처리 전략

| 항목 | 방법 |
|---|---|
| 포트폴리오 이미지 | Sanity Assets 업로드 후 `urlFor()` 사용 |
| 테마 고정 이미지 (portrait, bg_main.webp 등) | `/public/images/` 복사 후 `next/image` |
| WP uploads 구 이미지 | 필요한 것만 선별해서 이전 |

---

## 현재 Next.js 파일 현황 (참조용)

```
src/app/
├── page.tsx              ← Home (Hero✅, 나머지 미구현)
├── about/page.tsx        ← 빈 파일
├── contact/page.tsx      ← 빈 파일 (있는지 확인 필요)
├── projects/             ← /work/[slug]로 이전 예정
│   ├── page.tsx
│   └── [slug]/page.tsx
└── style-guide/          ← 완료 (기준 스타일 가이드)

src/components/
├── home/
│   ├── Hero.tsx + Hero.scss    ← ✅ 완료
│   └── about.tsx + about.scss ← 빈 컴포넌트
└── common/
    ├── Header.tsx
    └── Footer.tsx
```
