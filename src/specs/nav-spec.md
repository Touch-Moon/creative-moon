# Navigation Spec — Plastic.design Reference

> **Source**: [plastic.design](https://plastic.design)
> **Font**: Neue Montreal (원본) → **Figtree** (스타일가이드 대체)
> **Design System**: Creative Moon v1.0 토큰 기준 매핑

---

## 1. Header Bar (Top Navigation)

### 1-1. 구조 (Structure)

```
header.header (.is-fixed .mix-blend)
└── .header__content (flex / space-between / align-center)
    ├── .header__logo (a 태그 → SVG 로고)
    ├── .header__copyright ("DIGITAL SOUL © 2026" — 중앙 absolute)
    └── .header__right (flex / align-center)
        ├── .header__talk (a.button → "Let's talk" CTA)
        └── .toggle (div × 2 = 햄버거 라인)
```

### 1-2. 레이아웃 & 포지셔닝

| 속성 | 원본 CSS (vw 기반) | 스타일가이드 토큰 매핑 |
|---|---|---|
| **position** | `fixed` (스크롤 후) / `absolute` (초기) | fixed |
| **z-index** | `100` | 100 |
| **mix-blend-mode** | `difference` | difference |
| **padding-top** | Desktop: `0.458vw` (~6.6px) | `var(--space-2)` (8px) |
| | Tablet (≤768): `2.604vw` (~20px) | `var(--space-6)` (24px) |
| | Mobile (≤575): `2.051vw` (~15px) | `var(--space-4)` (16px) |
| **left / right** | Desktop: `3.297vw` (~47.5px) | `var(--space-12)` (48px) |
| | Tablet (≤768): `2.604vw` (~20px) | `var(--space-6)` (24px) |
| | Mobile (≤575): `5.128vw` (~15px) | `var(--space-4)` (16px) |
| **width** | `calc(100% - left - right)` | `calc(100% - var(--space-12) * 2)` 등 |
| **background** | `transparent` | transparent |
| **transition** | `transform 0.3s ease-in-out` | 스크롤 show/hide 용 |

### 1-3. 스크롤 동작 (Scroll Behavior)

- 초기 상태: `position: absolute` → 페이지와 함께 스크롤
- 스크롤 후 `.is-fixed` 클래스 추가: `position: fixed`
- 스크롤 아래로 → `transform: translateY(-101%)` (헤더 숨김)
- 스크롤 위로 → `.is-visible` 추가 → `transform: translateY(0)` (헤더 표시)
- **transition**: `transform 0.3s ease-in-out`

---

## 2. 로고 (Logo)

| 속성 | Desktop (1440px) | Tablet (≤1024) | Mobile (≤575) |
|---|---|---|---|
| **SVG width** | `4.396vw` (~63px) | `5.266vw` (~54px) | `6.154vw` (~35px) |
| **height** | auto | auto | auto |
| **transform** | `translateY(-0.183vw)` | — | — |

- SVG viewBox: `0 0 96 31`
- Desktop에서는 "Plastic®" 워드마크 표시, 모바일에서도 동일한 워드마크 (축소)
- 메뉴 오버레이 내에서는 "P/" 심볼마크 표시 (desktop만 visible)

---

## 3. 카피라이트 텍스트 (Center Text)

| 속성 | 원본 | 스타일가이드 매핑 |
|---|---|---|
| **text** | "DIGITAL SOUL © 2026" | (커스텀 텍스트) |
| **font-size** | `0.733vw` (~10.5px) | `var(--fs-body-caps)` — calc(12/1440*100vw) |
| **font-weight** | 400 | `var(--fw-regular)` |
| **text-transform** | `uppercase` | uppercase |
| **letter-spacing** | normal → 원본 | `var(--ls-wide)` (0.04em) 권장 |
| **color** | `#fff` (mix-blend-mode: difference 적용) | white |
| **position** | `absolute`, `left: 50%`, `top: 50%`, `transform: translate(-50%, -50%)` | 절대 중앙 |

**반응형 숨김**:
- ≤575px: `display: none` (모바일에서 숨김)

---

## 4. "Let's talk" CTA 버튼

### 4-1. 기본 스타일 (`.button`)

| 속성 | 원본 | 스타일가이드 매핑 |
|---|---|---|
| **border-radius** | `9999em` | pill shape |
| **box-shadow** | `inset 0 0 0 1px #fff` | 1px 내부 보더 |
| **background** | `transparent` | transparent |
| **overflow** | `hidden` | hidden |
| **cursor** | `pointer` | pointer |

### 4-2. 텍스트 (`.button span`)

| 속성 | 원본 | 스타일가이드 매핑 |
|---|---|---|
| **font-size** | `0.916vw` (~13.2px) | `var(--fs-body-5)` — calc(14/1440*100vw) |
| **font-weight** | 300 | `var(--fw-light)` |
| **line-height** | `137%` | 137% |
| **mix-blend-mode** | `difference` | difference |
| **padding** | `0 1.099vw` (~16px) | `0 var(--space-4)` |
| **height** | `2.335vw` (~33.6px) | — |
| **color** | `#fff` | white |

### 4-3. 호버 애니메이션 (Fill Effect)

```
.button div (Fill Layer)
├── position: absolute
├── inset: 0
├── background: #fff
├── transform: scaleY(0) → hover: scaleY(1)
├── transform-origin: bottom (기본) → top (hover out)
└── transition: transform 0.3s cubic-bezier(0.52, 0.24, 0.08, 1)
```

**동작 순서**:
1. 기본 상태: `scaleY(0)` — 투명 배경, 흰색 텍스트 + 흰색 보더
2. 호버 IN: `scaleY(1)` — 흰색 배경이 아래→위로 채워짐
3. `mix-blend-mode: difference`로 텍스트 자동 반전 (흰→검)
4. 호버 OUT: `transform-origin` 변경으로 위→아래로 빠짐

### 4-4. 버튼 간격

| 속성 | Desktop | Tablet (≤768) | Mobile (≤575) |
|---|---|---|---|
| **margin-right** (toggle까지) | `2.885vw` (~41.5px) | `2.865vw` (~22px) | `7.179vw` (~41px) |
| → 토큰 매핑 | `var(--space-10)` (40px) | `var(--space-6)` (24px) | `var(--space-10)` (40px) |

---

## 5. 햄버거 토글 (Toggle / Burger)

### 5-1. 컨테이너

| 속성 | 원본 | 스타일가이드 매핑 |
|---|---|---|
| **width / height** | `2.060vw` (~30px), min: 35px | 35px |
| **display** | flex | flex |
| **flex-direction** | column | column |
| **align-items** | center | center |
| **justify-content** | center | center |
| **cursor** | pointer | pointer |
| **z-index** | 1000 | 1000 |

### 5-2. 라인 (`.toggle div` × 2)

| 속성 | Desktop | Tablet | Mobile |
|---|---|---|---|
| **width** | 100% (~47px) | 35px | 22.5px |
| **height** | 1px | 1.5px | 1px |
| **background** | `#fff` | `#fff` | `#fff` |
| **margin** | `3.5px 0` | `3.5px 0` | `3.5px 0` |
| **transition** | `transform 0.2s ease-in-out, background 0.2s ease-in-out` | 동일 | 동일 |

### 5-3. X (Close) 애니메이션 — `.toggle.is-opened`

```
Line 1: rotate(45deg) translateY(4.5px)
Line 2: rotate(-45deg) translateY(-4.5px)
```
- transform-origin: `center center`
- 컬러 유지: `#fff`
- transition: `transform 0.2s ease-in-out`

### 5-4. 호버 시 라인 복귀

메뉴 열린 상태에서 nav 링크 호버 시 → X 아이콘이 햄버거로 다시 변환 (rotate 해제)

---

## 6. 메뉴 오버레이 (Full-screen Nav)

### 6-1. 오버레이 컨테이너 (`.nav`)

| 속성 | 원본 | 스타일가이드 매핑 |
|---|---|---|
| **position** | `fixed` | fixed |
| **inset** | `0` | 0 (전체 화면) |
| **background** | `#000` | black |
| **color** | `#fff` | white |
| **z-index** | `500` | 500 |
| **overflow** | `auto` | auto |
| **display** | `flex` (align-items: center) | flex / center |

**패딩 (반응형)**:

| Breakpoint | padding-left | padding-right | 토큰 매핑 |
|---|---|---|---|
| Desktop (1440) | `23.260vw` (~335px) | `24.725vw` (~356px) | 커스텀 (컨텐츠 영역 ~50% 오프셋) |
| Tablet (≤768) | `14.063vw` (~108px) | `18.229vw` (~140px) | 커스텀 |
| Mobile (≤575) | `14.103vw` (~81px) | `18.269vw` (~105px) | 커스텀 |
| padding-bottom | `4.451vw` (~64px) | — | `var(--space-16)` (64px) |

### 6-2. Open/Close 애니메이션

**열기**:
1. `.nav` — `opacity: 0 → 1`, `visibility: hidden → visible`
2. Primary 링크 `<li>` — `clip-path: polygon(0 0, 100% 0, 100% 0, 0 60%)` → `polygon(0 0, 100% 0, 100% 100%, 0 100%)`
3. Primary 링크 `<a>` — `transform: translateY(100%) → translateY(0)` (아래에서 위로 슬라이드)
4. 각 링크 시차 등장 (staggered entrance)

**닫기**: 역순

### 6-3. 내부 레이아웃 (`.nav__container`)

```
.nav__container (flex / row / space-between)
├── .nav__left (flex-column / space-between)
│   ├── .nav__logo ("P/" SVG — desktop only)
│   └── .nav__secondary (소셜 링크 리스트)
└── .nav__right
    └── .nav__primary (메인 네비 링크)
```

**Desktop**: 좌-우 2컬럼 레이아웃
**Mobile (≤575)**: flex-direction 유지하되, `.nav__left`에 `order: 2` 적용

### 6-4. 메인 네비 링크 (`.nav__primary a`)

| 속성 | Desktop (1440) | Tablet (≤768) | Mobile (≤575) | 토큰 매핑 |
|---|---|---|---|---|
| **font-size** | `5.128vw` (~74px) | `7.813vw` (~60px) | `11.282vw` (~65px) | Desktop: `var(--fs-h3)` — calc(74/1440*100vw) |
| **font-weight** | 300 | 300 | 300 | `var(--fw-light)` |
| **line-height** | 100% | 100% | 100% | 100% |
| **color** | `#fff` | `#fff` | `#fff` | white |
| **letter-spacing** | normal | normal | normal | — |

**링크 목록**: Work · Services · About · Manifesto · Contact

**항목 간격 (li margin-bottom)**:

| Desktop | Tablet | Mobile | 토큰 매핑 |
|---|---|---|---|
| `0.366vw` (~5.3px) | `2.604vw` (~20px) | `2.051vw` (~12px) | Desktop: `var(--space-1)` (4px), Tablet: `var(--space-6)` (24px), Mobile: `var(--space-3)` (12px) |

### 6-5. 메뉴 호버 인터렉션

```css
/* 호버 시 나머지 링크 fade out */
.nav__primary ul:hover a:not(:hover) {
  opacity: 0.1;
}

/* 각 링크 개별 transition */
.nav__primary a {
  transition: opacity 0.4s ease-in-out;
}
```

**동작**: 하나의 링크에 호버하면 나머지 4개가 `opacity: 0.1`로 페이드 아웃.
**조건**: `(hover: hover) and (pointer: fine)` — 터치 디바이스 제외.

### 6-6. 소셜 링크 (`.nav__secondary`)

| 속성 | 값 | 토큰 매핑 |
|---|---|---|
| **font-size** | `var(--fs-body-5)` — calc(14/1440*100vw) | `var(--fs-body-5)` |
| **font-weight** | 400 | `var(--fw-regular)` |
| **line-height** | 150% | `var(--lh-body-5)` |
| **color** | `#fff` | white |
| **hover color** | `#6D6D6D` | — |
| **hover transition** | `color 0.3s ease-in-out` | — |

**링크**: Behance · Twitter · Instagram · Linkedin · Medium

### 6-7. 하단 영역

**Privacy / Policy 링크** (`.nav__policy`):
- Desktop: `position: absolute`, `bottom: 4.451vw` (~64px → `var(--space-16)`), `left: 3.297vw` (~48px → `var(--space-12)`)
- Mobile (≤575): `display: none`

**이메일** (`.nav__email`):
- Desktop: `position: absolute`, `bottom: 4.451vw`, `right: 3.297vw`
- 텍스트: "hello@plastic.design"
- Mobile (≤575): `position: static`

---

## 7. 반응형 브레이크포인트 요약

| Breakpoint | 원본 기준 | 스타일가이드 기준 |
|---|---|---|
| Desktop | > 1024px | > 1024px |
| Tablet | ≤ 1024px / ≤ 768px | ≤ 1024px |
| Mobile | ≤ 575px | ≤ 576px |

### 주요 반응형 변경사항

| 요소 | Desktop | Tablet (≤768) | Mobile (≤575) |
|---|---|---|---|
| Header 노출 | absolute → fixed on scroll | 항상 fixed | 항상 fixed |
| Copyright 텍스트 | visible | visible | **hidden** |
| 로고 SVG 크기 | ~63px | ~54px | ~35px |
| CTA 버튼 크기 | ~13px text, ~34px h | ~11px text, ~28px h | ~10px text, ~24px h |
| 햄버거 라인 너비 | ~47px | 35px | 22.5px |
| 메뉴 링크 크기 | ~74px | ~60px | ~65px |
| 메뉴 레이아웃 | 2-col (left: logo+social / right: nav) | 2-col | 2-col (left reordered) |
| 하단 Policy | visible | visible | **hidden** |

---

## 8. 토큰 매핑 종합표

### Typography

| 요소 | 원본 font-size | 매핑 토큰 |
|---|---|---|
| Copyright 텍스트 | 0.733vw (~10.5px) | `--fs-body-caps` (12px) |
| CTA 버튼 텍스트 | 0.916vw (~13.2px) | `--fs-body-5` (14px) |
| 메뉴 메인 링크 | 5.128vw (~74px) | `--fs-h3` (74px) |
| 소셜 링크 | body-text-5 | `--fs-body-5` (14px) |
| 하단 Policy/Email | body-text-5 | `--fs-body-5` (14px) |

### Spacing

| 용도 | 원본 값 | 매핑 토큰 |
|---|---|---|
| Header padding-top (desktop) | ~6.6px | `--space-2` (8px) |
| Header padding-top (tablet) | ~20px | `--space-6` (24px) |
| Header padding-top (mobile) | ~15px | `--space-4` (16px) |
| Header left/right (desktop) | ~47.5px | `--space-12` (48px) |
| Header left/right (tablet) | ~20px | `--space-6` (24px) |
| Header left/right (mobile) | ~15px | `--space-4` (16px) |
| CTA → Toggle 간격 | ~41.5px | `--space-10` (40px) |
| 메뉴 li 간격 (desktop) | ~5.3px | `--space-1` (4px) |
| 메뉴 li 간격 (tablet) | ~20px | `--space-6` (24px) |
| 메뉴 li 간격 (mobile) | ~12px | `--space-3` (12px) |
| 메뉴 하단 여백 | ~64px | `--space-16` (64px) |

### Animations & Transitions

| 요소 | 동작 | 이징 | 지속시간 |
|---|---|---|---|
| Header show/hide | translateY(-101% ↔ 0) | ease-in-out | 0.3s |
| CTA 버튼 fill | scaleY(0 ↔ 1) | cubic-bezier(0.52, 0.24, 0.08, 1) | 0.3s |
| 햄버거 ↔ X | rotate(±45deg) + translateY | ease-in-out | 0.2s |
| 메뉴 overlay | opacity 0 ↔ 1 | — | — |
| 메뉴 링크 entrance | translateY(100% → 0) + clip-path reveal | — | staggered |
| 메뉴 링크 hover fade | opacity 1 → 0.1 | ease-in-out | 0.4s |
| 소셜 링크 hover | color #fff → #6D6D6D | ease-in-out | 0.3s |

---

## 9. 컬러

| 요소 | 값 |
|---|---|
| Header 배경 | transparent |
| Header 텍스트/아이콘 | `#fff` (mix-blend-mode: difference 적용) |
| CTA 보더 | `#fff` (inset box-shadow) |
| CTA fill (hover) | `#fff` |
| 메뉴 오버레이 배경 | `#000` |
| 메뉴 텍스트 | `#fff` |
| 소셜 링크 hover | `#6D6D6D` |

---

## 10. 접근성 (Accessibility)

| 요소 | 속성 | 값 |
|---|---|---|
| Toggle 버튼 | `role` | `button` |
| | `aria-label` | `"메뉴 열기"` / `"메뉴 닫기"` |
| | `aria-expanded` | `false` / `true` |
| Nav 오버레이 | `aria-hidden` | `true` (닫힘) / `false` (열림) |
| Nav 오버레이 | `role` | `dialog` 또는 `navigation` |

**키보드 인터렉션**:
- `Enter` / `Space` — 토글 버튼으로 메뉴 열기/닫기
- `Escape` — 메뉴 닫기
- `Tab` — 메뉴 내 포커스 트랩 (열린 상태에서 배경 요소 접근 불가)
- 메뉴 열릴 때 → 첫 번째 링크에 포커스 이동
- 메뉴 닫힐 때 → 토글 버튼에 포커스 복귀

**메뉴 닫기 트리거**:
- X 버튼 클릭
- 링크 클릭 (페이지 이동)
- `Escape` 키
- 배경 클릭 (optional)

**스크롤 잠금**: 메뉴 열린 상태에서 `body { overflow: hidden }` 적용

---

## 11. 메뉴 Stagger 애니메이션 타이밍

```
메뉴 열기 시퀀스:
1. Nav overlay: opacity 0 → 1 (즉시)
2. Link 1 (Work):      delay 0.05s → translateY(100% → 0) + clip-path reveal, duration 0.4s
3. Link 2 (Services):  delay 0.10s → 동일
4. Link 3 (About):     delay 0.15s → 동일
5. Link 4 (Manifesto): delay 0.20s → 동일
6. Link 5 (Contact):   delay 0.25s → 동일
7. Social links + Logo: delay 0.30s → opacity 0 → 1, duration 0.3s
```

- clip-path 초기: `polygon(0 0, 100% 0, 100% 0, 0 60%)`
- clip-path 최종: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`
- link transform: `translateY(100%) → translateY(0)`
- 이징: ease-out 또는 cubic-bezier(0.33, 1, 0.68, 1)

---

## 12. 구현 참고사항

1. **mix-blend-mode: difference** — Header 전체에 적용. 배경색에 따라 텍스트/아이콘이 자동 반전됨. 밝은 배경 위에서는 검은색, 어두운 배경 위에서는 흰색으로 보임.

2. **스크롤 감지 로직** — IntersectionObserver 또는 scroll event로 스크롤 방향 감지. threshold: 이전 scrollY와 현재 scrollY 비교. 아래로 스크롤 시 숨기고 (`translateY(-101%)`), 위로 스크롤 시 보여줌 (`translateY(0)`). 최소 감지 delta: ~5px.

3. **메뉴 열기 시퀀스** — opacity fade → clip-path + translateY stagger로 각 링크 순차 등장. GSAP 또는 Framer Motion으로 구현 가능.

4. **hover: hover 미디어 쿼리** — 터치 디바이스에서 hover 효과 비활성화. `@media (hover: hover) and (pointer: fine)` 사용.

5. **Logo 전환** — Header에서는 "Plastic®" 워드마크, Menu overlay에서는 "P/" 심볼마크 사용. 프로젝트에 맞게 로고 에셋 교체 필요.

6. **z-index 계층** — header: 100, nav overlay: 500, toggle (메뉴 내): 1000. 토글이 메뉴 위에 항상 노출되어야 함.

7. **컬러 참고** — 원본 사이트는 별도 컬러 토큰 시스템이 없이 `#000`, `#fff`, `#6D6D6D`을 직접 사용. 프로젝트의 컬러 시스템에 맞게 변수화 권장.
