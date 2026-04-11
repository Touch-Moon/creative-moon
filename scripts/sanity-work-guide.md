# Sanity — Work 필드 가이드

> **프로젝트:** MyPortfolio2026 (`9z8k2qza` / `production`)
> **Studio 접속:** `npm run sanity` → `http://localhost:3333`

---

## 빠른 시작 — Seed 스크립트로 데이터 자동 입력

plastic.design 기반 16개 Work 데이터를 자동으로 Sanity에 넣을 수 있습니다.

```bash
# 1. Sanity API 토큰 발급
#    sanity.io/manage → 프로젝트 → API → Tokens → Add API token (Editor 권한)

# 2. .env.local 에 추가
echo "SANITY_API_TOKEN=your_token_here" >> .env.local

# 3. 스크립트 실행
node scripts/seed-works.mjs
```

스크립트는 이미지를 plastic.design에서 자동 다운로드해 Sanity asset으로 업로드하고,
이미 같은 slug의 문서가 있으면 건너뜁니다.

---

## 필드 설명

### 기본 정보

| 필드 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| **Title** | string | ✅ | 작업 제목 (마침표 포함) | `Hyundai annual convention.` |
| **Slug** | slug | ✅ | URL 경로. Generate 버튼 클릭 또는 직접 입력 | `hyundai` |
| **Year** | string | | 연도 | `2025` |
| **Subtitle** | text | | 제목 아래 한 줄 설명 | `Designing the visual concept...` |
| **Overview** | text | | 프로젝트 전체 소개 (3~5문장 권장) | |
| **Services** | string[] | | What We Do 태그 목록 | `Strategic Design`, `Branding` |
| **External URL** | url | | Visit Website 링크 | `https://example.com` |
| **Display Order** | number | | 목록 정렬 순서. 낮을수록 먼저 표시 | `1` |

---

### 이미지 — Work List 썸네일

> `/work` 그리드 페이지에 표시되는 이미지

| 필드 | 설명 |
|---|---|
| **Thumbnail — Work List** | 비율 자유. 세로/가로/정사각형 모두 가능 |
| **List Description** | 썸네일 아래 표시되는 짧은 설명 (Subtitle과 동일해도 무방) |

**plastic.design 이미지 네이밍 규칙 (참고용):**
- `_p` — Portrait (세로형)
- `_l` — Landscape (가로형)
- `_s` — Square (정사각형)

---

### 이미지 — Selected Works 캐러셀

> 홈페이지 Selected Works 섹션 + 싱글 페이지 Related Works 캐러셀에 사용

| 필드 | 설명 |
|---|---|
| **Thumbnail — Selected Works** | 캐러셀 카드 이미지. **세로형(portrait) 권장** |
| **Card Size** | 카드의 가로 비율 선택 (아래 옵션 참고) |

#### Card Size 옵션

| 값 | 비율 | 사용 권장 상황 |
|---|---|---|
| `Large` (1.27 : 1) | 약간 가로형 | 주력 프로젝트, 기본값 |
| `Wide` (1.5 : 1) | 넓은 가로형 | 랜드스케이프 이미지, UI 스크린샷 |
| `Compact` (1 : 1) | 정사각형 | 로고/브랜딩 중심 프로젝트 |
| `Tall` (0.8 : 1) | 세로형 | 포스터/앱 스크린 느낌 |

**캐러셀 리듬을 위한 카드 사이즈 믹스 예시:**
```
large → compact → wide → tall → large → compact → wide → tall ...
```

---

### Hero 미디어

> 싱글 페이지 상단 풀스크린 영역

| 필드 | 설명 |
|---|---|
| **Media Type** | `image` 또는 `video` 선택 |
| **Image** | Hero 이미지. 권장 크기: 1440 × 900px 이상 |
| **Video File** | Media Type이 video일 때만 사용 |

---

### Content Modules

싱글 페이지 본문을 블록 단위로 조합합니다.

| 모듈 타입 | 설명 |
|---|---|
| **Media (Full Width)** | 이미지 또는 영상을 풀 너비로 표시 |
| **2-Column Images** | 좌우 이미지 2장을 나란히 배치 |
| **Background Media** | 배경에 이미지/영상을 깔고 텍스트 오버레이 |
| **Text Block** | 소제목 + 본문 텍스트. 컬럼 너비(6~8) 조절 가능 |
| **Full Bleed Image** | 여백 없이 화면 가득 채우는 이미지 |

---

## 현재 등록된 16개 Work 목록

| # | Slug | 제목 | Year | Card Size |
|---|---|---|---|---|
| 1 | `hyundai` | Hyundai annual convention. | 2025 | large |
| 2 | `hitachi-digital-brand-ecosystem` | Hitachi digital brand ecosystem. | 2024 | compact |
| 3 | `lobelia` | Lobelia Website. | 2023 | wide |
| 4 | `iberia-cards` | Iberia Cards. | 2023 | compact |
| 5 | `digital-twin-ocean` | Digital Twin Ocean. | 2023 | tall |
| 6 | `bbva` | BBVA. | 2016 | wide |
| 7 | `strabe` | Sträbe. | 2022 | tall |
| 8 | `tech-innovation-effective-healthcare` | Healthcare projects story. | 2022 | compact |
| 9 | `hitachi-global-website` | Hitachi Cooling & Heating. | 2018 | wide |
| 10 | `massimo-dutti` | Massimo Dutti. | 2019 | compact |
| 11 | `bsm` | Barcelona School of Management. | 2021 | tall |
| 12 | `nimble-payments` | BBVA - Nimble Payments. | 2020 | wide |
| 13 | `desigual-digital-lookbook` | Desigual Lookbook. | 2019 | tall |
| 14 | `iota` | IOTA Foundation. | 2018 | compact |
| 15 | `marangoni` | Marangoni. | 2019 | wide |
| 16 | `a-fashion-ecommerce` | Arvind. | 2017 | compact |

---

## 이미지 소스 (plastic.design 원본 URL)

seed 스크립트가 자동으로 업로드하지만, 수동으로 교체하려면 아래 URL 참고.

| Slug | List Thumbnail | Selected / Hero |
|---|---|---|
| hyundai | `/uploads/works/hyundai/hyundai_p.webp` | `/uploads/hyundai/hyundai-header.webp` |
| hitachi-digital-brand-ecosystem | `/uploads/works/hitachi-brand/hitachi-brand_s.svg` | `/uploads/hitachi-brand/hitachi-brand_header.jpg` |
| lobelia | `/uploads/works/lobelia/lobelia_l.jpg` | `/uploads/lobelia/lobelia01_1441_1x-blur.jpg` |
| iberia-cards | `/uploads/works/iberia-cards/iberia-cards_s.webp` | `/uploads/iberia-cards/iberia-cards-header.webp` |
| digital-twin-ocean | `/uploads/works/digital-twin-ocean/digital-twin-ocean_p.webp` | `/uploads/digital-twin-ocean/digital-twin-ocean-header.webp` |
| bbva | `/uploads/works/bbva/bbva_l.jpg` | `/uploads/bbva/bbva_header.jpg` |
| strabe | `/uploads/works/strabe/strabe_p.jpg` | `/uploads/works/strabe/strabe_p.jpg` |
| tech-innovation-effective-healthcare | `/uploads/works/tech-innovation-effective-healthcare/..._s.webp` | (동일) |
| hitachi-global-website | `/uploads/works/hitachi-web/hitachi-web_l.jpg` | `/uploads/hitachi-website/hitachi-website_header.jpg` |
| massimo-dutti | `/uploads/works/massimo-dutti/massimo_dutti_s.jpg` | `/uploads/massimo-dutti/massimo-dutti_header.jpg` |
| bsm | `/uploads/works/bsm/bsm_p.jpg` | `/uploads/bsm/bsm_header.jpg` |
| nimble-payments | `/uploads/works/nimble/nimble-payments_l.jpg` | `/uploads/nimble/nimble-payments-header.jpg` |
| desigual-digital-lookbook | `/uploads/works/desigual-look-book/desigual-look-book_p.webp` | `/uploads/desigual-look-book/desigual-look-book-header.webp` |
| iota | `/uploads/works/iota/iota_s.svg` | `/uploads/iota/iota_header.svg` |
| marangoni | `/uploads/works/marangoni/marangoni_l.jpg` | `/uploads/marangoni/marangoni_header.jpg` |
| a-fashion-ecommerce | `/uploads/works/arvind/arvind_s.jpg` | `/uploads/arvind/arvind_header.jpg` |

> **Base URL:** `https://plastic.design`

---

## 자주 묻는 질문

**Q. Slug를 /work 페이지의 기존 더미 데이터와 맞춰야 하나요?**
A. 더미 데이터는 Sanity 연결 전 폴백용이므로, Sanity에 데이터가 있으면 무시됩니다. Slug는 URL이 되므로 소문자 + 하이픈으로 구성하세요.

**Q. 이미지를 직접 교체하고 싶어요.**
A. Sanity Studio에서 해당 Work 문서 열기 → Thumbnail 필드 클릭 → 새 이미지 업로드. 업로드 후 Publish 버튼을 눌러야 반영됩니다.

**Q. 카드 순서를 바꾸고 싶어요.**
A. `Display Order` 필드 숫자를 변경 후 Publish. 낮은 숫자가 먼저 표시됩니다.

**Q. Selected Works 캐러셀에 모든 Work가 다 나오나요?**
A. 홈: 전체, 싱글 페이지: 현재 페이지 제외 최대 10개가 나옵니다.
