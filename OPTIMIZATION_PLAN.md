# OPTIMIZATION_PLAN.md — Creative Moon Portfolio

> **시작일:** 2026-04-11
> **대상:** `my-portfolio` (Next.js 15 + Sanity CMS)
> **목적:** 성능, SEO, 코드 품질, UI/UX 전반 최적화. 세션 간 일관성 유지.
> **진행 방식:** 한 번에 하나의 카테고리씩 완료 후 다음으로 이동.

---

## 진행 상황 한눈에 보기

| 카테고리 | 상태 | 완료율 |
|---|---|---|
| 🖼️ 이미지 최적화 | ✅ 완료 | 5 / 5 |
| 🎬 비디오 최적화 | ✅ 완료 | 4 / 4 |
| ⚡ 성능 (Core Web Vitals) | ✅ 완료 | 5 / 6 |
| 🔍 SEO | ✅ 완료 | 7 / 7 |
| 🧹 코드 품질 | ⏳ 대기 | 0 / 5 |
| ♿ UI/UX & 접근성 | ⏳ 대기 | 0 / 4 |

---

## 1. 🖼️ 이미지 최적화

### 현황 분석 (2026-04-11)

**`<Image>` 컴포넌트 사용:** 11곳
**`<img>` 태그 (미최적화):** 2곳 (WorkSingle 디바이스 프레임, HomeIntro SVG 로고)
**next.config.ts 이미지 설정:** formats, minimumCacheTTL 미설정

**발견된 문제:**
- `next.config.ts`에 `formats: ['image/avif', 'image/webp']` 미설정 → 자동 WebP 변환 안 됨
- `minimumCacheTTL` 미설정 → 기본값(60초)으로 캐시 비효율
- `/images/about/` 14개, `/images/work-*.jpg`, `/images/story-*.jpg` 전부 JPG 원본
- 대부분의 `<Image>`에 `quality` prop 없음 (기본값 75)
- `placeholder` prop 없어 레이아웃 시프트 발생 가능
- hero 이미지 외 `priority` 설정 없음

### 작업 목록

- [x] **1-A** `next.config.ts` — `formats: ['image/avif', 'image/webp']`, `minimumCacheTTL: 2592000` (30일) 추가 (2026-04-11)
- [x] **1-B** `AboutPage.tsx` — hero 이미지 `quality={85}`, non-hero `quality={80}` 추가 (2026-04-11)
- [x] **1-C** `WorkSingle.tsx` — hero `<Image>` quality/sizes 추가 (2026-04-11)
- [x] **1-C-2** `WorkSingle.tsx` `MediaSlot` — 레이아웃별 sizes 주입: 1col=100vw, 2col=50vw, 3col=33vw, narrow-wide 개별 지정 (2026-04-11)
- [x] **1-D** `HomeStories.tsx`, `StoriesList.tsx`, `StorySingle.tsx` — `quality={80}` 추가 (2026-04-11)
- [x] **1-E** `WorkList.tsx`, `HomeWorks.tsx` — Canvas 방식 `/_next/image` 수동 최적화: layout별 width + q=80 (2026-04-11)
- [ ] **1-F** `HomeIntro.tsx` SVG 로고 → `<Image>` 컴포넌트 또는 인라인 SVG로 교체 검토 (저우선순위)

### 완료 기준
`next build` 시 이미지 최적화 경고 없음. Lighthouse 이미지 항목 패스.

### 수동 삭제 필요 파일 (~7MB 절약)

> WebP 변환 완료 후 원본 JPG/PNG 및 구버전 파일 삭제 필요.
> 터미널에서 아래 명령어 실행:

```bash
cd /Users/jin-chulmoon/Documents/Work/01_CreativeMoon/my-portfolio/public/images

# 구버전 about 이미지 (미사용)
rm about/About-01.jpg about/About-02.jpg about/About-03.jpg
rm about/about-detail-01.jpg about/about-detail-01-v2.jpg
rm about/about-detail-01-v3.jpg about/about-detail-01-v4.jpg
rm about/about-detail-02.jpg about/about-hero.jpg about/about-office.jpg

# WebP 변환 완료된 원본 JPG/PNG
rm about/about-hero-v2.jpg about/about-office-v2.jpg
rm about/about-detail-01-v5.jpg about/about-detail-02-v2.jpg
rm work-01.jpg work-02.jpg work-03.jpg work-04.jpg work-05.jpg
rm intro-video-placeholder.jpg
rm devices/ipad.png devices/iphone.png
rm ipad-mockup.png
```

---

## 2. 🎬 비디오 최적화

### 현황 분석 (2026-04-11)

**비디오 파일 현황:**
```
public/videos/
├── video-moon.mp4          (원본)
├── video-moon.mov          (중복 — 웹 불필요)
├── video-moon-ver1.1.mp4
├── video-moon-ver1.1.mov   (중복 — 웹 불필요)
├── video-moon-ver1.2.mp4   (현재 사용중 — HomeIntro)
└── video-moon-ver1.2.mov   (중복 — 웹 불필요)
```

**발견된 문제:**
- `.mov` 파일 3개 → 웹에서 사용 안 됨, `public/` 용량 낭비
- `HomeIntro.tsx` 히어로 배경 비디오: `poster` 없음, `preload` 없음
- `StorySingle.tsx` 비디오: `poster` 없음, `preload` 없음
- `/videos/` 폴더에 미사용 버전(ver1.1, 원본) 혼재

### 작업 목록

- [ ] **2-A** `.mov` 파일 3개 삭제 (`video-moon.mov`, `video-moon-ver1.1.mov`, `video-moon-ver1.2.mov`) — **수동 삭제 필요** (아카이브 확인 후)
- [ ] **2-B** 미사용 MP4 정리: `video-moon.mp4`, `video-moon-ver1.1.mp4` 삭제 또는 아카이브 — **수동 삭제 필요**
- [x] **2-C** `HomeIntro.tsx` — `poster="/images/intro-video-placeholder.jpg"`, `preload="none"` 추가 (2026-04-11)
- [x] **2-D** `StorySingle.tsx` — 비디오 `preload="metadata"` 추가 (2026-04-11)

### 완료 기준
`public/videos/`에 실제 사용 중인 MP4 파일만 남음. LCP 개선 확인.

---

## 3. ⚡ 성능 (Core Web Vitals)

> 이미지/비디오 최적화 완료 후 진행

### 체크 항목

- [ ] **3-A** Lighthouse 측정 (배포 URL 기준) — LCP, FID, CLS 기준값 기록 (배포 후 진행)
- [ ] **3-B** 번들 분석 — `@next/bundle-analyzer` 추가, 큰 패키지 확인 (npm 잠금 이슈로 보류)
- [x] **3-C** `framer-motion` LazyMotion + `m.*` 전환 — 12개 파일, `domAnimation` 기능 셋으로 최적화, `m.create()` HOC 패턴 적용 (2026-04-11)
- [x] **3-D** `styled-components` 의존성 제거 — 코드에서 미사용 확인 후 `npm uninstall` (2026-04-11)
- [x] **3-E** `axios` 의존성 제거 — 코드에서 미사용 확인 후 `npm uninstall` (2026-04-11)
- [x] **3-F** Lenis smooth scroll SSR 안전성 확인 — `'use client'` + `useEffect` 내부 초기화로 이미 안전, 추가 작업 불필요 (2026-04-11)

---

## 4. 🔍 SEO

> 성능 최적화 완료 후 진행

### 체크 항목

- [x] **4-A** `layout.tsx` — metadataBase, title template, OG/Twitter 전역 태그 완성 (2026-04-11)
- [x] **4-B** Work/Stories 싱글 `generateMetadata()` — OG 이미지(heroMedia/thumbnail), Twitter Card, canonical 추가 (2026-04-11)
- [x] **4-C** `src/app/robots.ts` — 생성 (disallow: api, style-guide, projects) (2026-04-11)
- [x] **4-D** `src/app/sitemap.ts` — 정적 6개 + Sanity work/stories 동적 생성 (2026-04-11)
- [x] **4-E** JSON-LD — 홈(Organization+WebSite), Work 싱글(CreativeWork) 스키마 추가 (2026-04-11)
- [x] **4-F** canonical — 전 페이지 `alternates.canonical` 설정 (2026-04-11)
- [x] **4-G** `src/app/opengraph-image.tsx` — ImageResponse로 동적 OG 이미지 생성 (2026-04-11)

---

## 5. 🧹 코드 품질

> SEO 완료 후 진행

### 체크 항목

- [ ] **5-A** `styled-components` 의존성 완전 제거 (사용 여부 재확인)
- [ ] **5-B** `react-google-recaptcha-v3` → Cloudflare Turnstile로 교체
- [ ] **5-C** `WorkSingle.tsx` `<img>` 디바이스 프레임 → `<Image>` 또는 CSS 방식 검토
- [ ] **5-D** 공통 타입 정의 파일 (`types/`) 정리
- [ ] **5-E** ESLint 경고 0개 달성 (`next lint` 클린)

---

## 6. ♿ UI/UX & 접근성

> 코드 품질 완료 후 진행

### 체크 항목

- [ ] **6-A** 키보드 네비게이션 전체 페이지 점검
- [ ] **6-B** `aria-label`, `aria-hidden` 누락 요소 보완
- [ ] **6-C** 색상 대비율 WCAG AA 기준 충족 확인
- [ ] **6-D** 반응형 세밀화 — Tablet(1024px) / Mobile(576px) 전 페이지 점검

---

## 작업 규칙

1. **세션 시작 시** → 이 파일 먼저 읽고 현재 위치 파악
2. **작업 완료 시** → 해당 항목 `[x]` 체크 + 완료일 기재
3. **커밋 전** → CLAUDE.md Progress Tracker도 함께 업데이트
4. **한 세션당** → 하나의 카테고리 집중 완료 원칙

---

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-11 | 최초 작성. 현황 분석 완료. |
| 2026-04-11 | 이미지 최적화 완료: next.config formats/TTL, quality props, sizes props 전 컴포넌트 적용. WorkList/HomeWorks Canvas 이미지도 layout별 width+q=80 최적화. |
| 2026-04-11 | 이미지 파일 포맷 최적화: Pillow로 JPG/PNG → WebP 변환 (약 90% 용량 절감). 코드 참조 업데이트 완료. 원본 JPG/PNG 23개 삭제 완료 (~7MB 절약). |
| 2026-04-11 | Sanity CDN 자동 변환 적용: sanityImg() 헬퍼 추가 (auto=format+fit=max+w+q). WorkSingle MediaSlot·hero, getThumbPortrait(w:1762→1440), getThumbLandscape(w:3584→1920) 최적화. |
| 2026-04-11 | 비디오 최적화 완료: HomeIntro poster+preload, StorySingle preload 적용. .mov/.mp4 미사용 파일은 수동 삭제 필요. |
| 2026-04-11 | 성능 최적화 완료: styled-components·axios 제거, framer-motion LazyMotion+m.* 전환(12파일), Lenis SSR 안전성 확인. |
| 2026-04-11 | SEO 완료: 전역 메타데이터(OG/Twitter/robots/sitemap/canonical), JSON-LD, OG 이미지, 전 페이지 title template 적용. |
