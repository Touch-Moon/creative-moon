/**
 * Sanity Work Seed Script
 * ─────────────────────────────────────────────────────────────
 * plastic.design 의 Work 데이터를 기반으로 Sanity에 Work 문서를 생성합니다.
 *
 * 실행 방법:
 *   1. .env.local 에 SANITY_API_TOKEN 추가 (write 권한 필요)
 *      → sanity.io/manage > 프로젝트 > API > Tokens > Add API token (Editor)
 *   2. node scripts/seed-works.mjs
 *
 * 주의:
 *   - 이미 같은 slug의 문서가 있으면 덮어쓰지 않습니다 (dry-run 후 확인)
 *   - 이미지는 plastic.design URL에서 직접 다운로드해 Sanity asset으로 업로드됩니다
 * ─────────────────────────────────────────────────────────────
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── env 로드 (dotenv 없이 직접 파싱) ─────────────────────────
function loadEnv() {
  try {
    const env = readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
    for (const line of env.split('\n')) {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
    }
  } catch {}
}
loadEnv();

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9z8k2qza';
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production';
const API_TOKEN  = process.env.SANITY_API_TOKEN;

if (!API_TOKEN) {
  console.error('\n❌ SANITY_API_TOKEN 이 없습니다.');
  console.error('   sanity.io/manage → 프로젝트 → API → Tokens → Editor 권한으로 생성 후');
  console.error('   .env.local 에 SANITY_API_TOKEN=your_token 추가 후 재실행하세요.\n');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2024-01-01',
  token:      API_TOKEN,
  useCdn:     false,
});

// ── 이미지 업로드 헬퍼 ───────────────────────────────────────
async function uploadImageFromUrl(imageUrl, filename) {
  console.log(`  📸 이미지 업로드: ${filename}`);
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    const ext = imageUrl.split('.').pop().split('?')[0].toLowerCase();
    const mimeMap = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml' };
    const contentType = mimeMap[ext] || 'image/jpeg';
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename,
      contentType,
    });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (err) {
    console.warn(`  ⚠️  이미지 업로드 실패 (${filename}): ${err.message}`);
    return null;
  }
}

// ── Work 데이터 ───────────────────────────────────────────────
// cardSize: 목록 썸네일 suffix 기준
//   _p (portrait) → tall   (세로형 0.8:1)
//   _l (landscape) → wide  (가로형 1.5:1)
//   _s (square) → compact  (정사각형 1:1)
//   특별히 크게 강조할 항목 → large (1.27:1)
const WORKS = [
  {
    order: 1,
    slug: 'hyundai',
    title: 'Hyundai annual convention.',
    year: '2025',
    subtitle: 'Designing the visual concept and digital experience for the brand\'s annual convention.',
    listDescription: 'Designing the visual concept and digital experience for the brand\'s annual convention.',
    services: ['Strategic Design', 'Research', 'Branding', 'Consultancy'],
    overview: 'Every year, Hyundai Spain brings its team together for a convention that goes far beyond a simple gathering. It\'s a space to align strategies, reinforce company culture, and most importantly, inspire. The challenge wasn\'t just to create an attractive visual identity or develop a functional digital platform—we needed to craft an experience that connected attendees to the purpose of the event before, during, and after.',
    externalUrl: 'https://convencion-hyundai.plastic.design/',
    cardSize: 'large',
    listThumbnailUrl: 'https://plastic.design/uploads/works/hyundai/hyundai_p.webp',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/hyundai/hyundai_p.webp',
    heroUrl: 'https://plastic.design/uploads/hyundai/hyundai-header.webp',
  },
  {
    order: 2,
    slug: 'hitachi-digital-brand-ecosystem',
    title: 'Hitachi digital brand ecosystem.',
    year: '2024',
    subtitle: 'Digital brand system for the industrial giant.',
    listDescription: 'Digital brand system for the industrial giant.',
    services: ['Strategic Design', 'Branding', 'Product Design', 'Consultancy'],
    overview: 'We joined the rebranding project to design the company\'s digital branding system. A cross-cutting and flexible system was designed, whose fundamentals and rules were adapted to other company brands. The Digital Brand Foundations and the digital brand architecture were defined at the beginning of the project.',
    externalUrl: '',
    cardSize: 'compact',
    listThumbnailUrl: 'https://plastic.design/uploads/works/hitachi-brand/hitachi-brand_s.svg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/hitachi-brand/hitachi-brand_s.svg',
    heroUrl: 'https://plastic.design/uploads/hitachi-brand/hitachi-brand_header.jpg',
  },
  {
    order: 3,
    slug: 'lobelia',
    title: 'Lobelia Website.',
    year: '2023',
    subtitle: 'Rethinking the climate change data company website.',
    listDescription: 'Rethinking the climate change data company website.',
    services: ['Strategic Design', 'Product Design', 'Branding', 'Consultancy'],
    overview: 'At Plastic, we instantly click with companies that advocate and work towards the continuity and improvement of society and the planet. Our social commitment and willingness to support the industries that work to preserve the future of our planet made us jump on board and design a website for Lobelia that highlighted the company\'s value and uniqueness.',
    externalUrl: 'https://www.lobelia.earth/',
    cardSize: 'wide',
    listThumbnailUrl: 'https://plastic.design/uploads/works/lobelia/lobelia_l.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/lobelia/lobelia_l.jpg',
    heroUrl: 'https://plastic.design/uploads/lobelia/lobelia01_1441_1x-blur.jpg',
  },
  {
    order: 4,
    slug: 'iberia-cards',
    title: 'Iberia Cards.',
    year: '2023',
    subtitle: 'Enhancing the Iberia Cards app user experience.',
    listDescription: 'Enhancing the Iberia Cards app user experience.',
    services: ['Strategic Design', 'Branding', 'Consultancy', 'Design System'],
    overview: 'Iberia Cards is the issuer of credit cards linked to Iberia\'s loyalty program, Iberia Plus. They offer a comprehensive range of credit cards to cater to the needs of all customer segments, including families, small and medium-sized businesses, large corporations, and private institutions.',
    externalUrl: '',
    cardSize: 'compact',
    listThumbnailUrl: 'https://plastic.design/uploads/works/iberia-cards/iberia-cards_s.webp',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/iberia-cards/iberia-cards_s.webp',
    heroUrl: 'https://plastic.design/uploads/iberia-cards/iberia-cards-header.webp',
  },
  {
    order: 5,
    slug: 'digital-twin-ocean',
    title: 'Digital Twin Ocean.',
    year: '2023',
    subtitle: 'Shaping bridges between scientific community and social institutions.',
    listDescription: 'Shaping bridges between scientific community and social institutions.',
    services: ['Strategic Design', 'Branding', 'Consultancy', 'Experience Design'],
    overview: 'From the very outset, the project commissioned by Lobelia and Mercator Ocean captivated us. We embarked on a fascinating challenge: bringing to life a web platform that would communicate an incredibly innovative project—the creation of a Digital Twin of the Ocean.',
    externalUrl: '',
    cardSize: 'tall',
    listThumbnailUrl: 'https://plastic.design/uploads/works/digital-twin-ocean/digital-twin-ocean_p.webp',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/digital-twin-ocean/digital-twin-ocean_p.webp',
    heroUrl: 'https://plastic.design/uploads/digital-twin-ocean/digital-twin-ocean-header.webp',
  },
  {
    order: 6,
    slug: 'bbva',
    title: 'BBVA.',
    year: '2016',
    subtitle: 'Helping the bank in its digital transformation process.',
    listDescription: 'Helping the bank in its digital transformation process.',
    services: ['Strategic Design', 'Product Design', 'Branding', 'Consultancy'],
    overview: 'As part of the digital transformation project, different products were developed for the bank, including the cross-cutting definition and evolution of the brand\'s digital ecosystem.',
    externalUrl: '',
    cardSize: 'wide',
    listThumbnailUrl: 'https://plastic.design/uploads/works/bbva/bbva_l.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/bbva/bbva_l.jpg',
    heroUrl: 'https://plastic.design/uploads/bbva/bbva_header.jpg',
  },
  {
    order: 7,
    slug: 'strabe',
    title: 'Sträbe.',
    year: '2022',
    subtitle: 'Connecting professionals in retail industry.',
    listDescription: 'Connecting professionals in retail industry.',
    services: ['Strategic Design', 'Product Design', 'Branding', 'Consultancy'],
    overview: 'Sträbe is a platform aimed at professionals in the retail industry. Through Sträbe you can find and get in touch with other professionals, draw inspiration for different projects and build a community of specialists from which to nurture, develop synergies and expand your network of contacts.',
    externalUrl: '',
    cardSize: 'tall',
    listThumbnailUrl: 'https://plastic.design/uploads/works/strabe/strabe_p.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/strabe/strabe_p.jpg',
    heroUrl: 'https://plastic.design/uploads/works/strabe/strabe_p.jpg',
  },
  {
    order: 8,
    slug: 'tech-innovation-effective-healthcare',
    title: 'Healthcare projects story.',
    year: '2022',
    subtitle: 'Tech innovation for effective healthcare.',
    listDescription: 'Tech innovation for effective healthcare.',
    services: ['Strategic Design', 'Product Design', 'Technology'],
    overview: 'A series of healthcare technology projects focused on improving patient outcomes and operational efficiency through thoughtful digital product design and strategic innovation.',
    externalUrl: '',
    cardSize: 'compact',
    listThumbnailUrl: 'https://plastic.design/uploads/works/tech-innovation-effective-healthcare/tech-innovation-effective-healthcare_s.webp',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/tech-innovation-effective-healthcare/tech-innovation-effective-healthcare_s.webp',
    heroUrl: 'https://plastic.design/uploads/works/tech-innovation-effective-healthcare/tech-innovation-effective-healthcare_s.webp',
  },
  {
    order: 9,
    slug: 'hitachi-global-website',
    title: 'Hitachi Cooling & Heating.',
    year: '2018',
    subtitle: 'Global website for local markets.',
    listDescription: 'Global website for local markets.',
    services: ['Strategic Design', 'Product Design', 'Branding', 'Consultancy'],
    overview: 'We\'ve been working closely with Hitachi - Johnson Controls Air Conditioning on a major rebrand and digital transformation project. We designed and rolled out their new global website—a complete toolkit for countries to adapt, publish and manage their own unique but on-brand Hitachi website.',
    externalUrl: 'https://hitachiglobalweb.plastic.design/',
    cardSize: 'wide',
    listThumbnailUrl: 'https://plastic.design/uploads/works/hitachi-web/hitachi-web_l.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/hitachi-web/hitachi-web_l.jpg',
    heroUrl: 'https://plastic.design/uploads/hitachi-website/hitachi-website_header.jpg',
  },
  {
    order: 10,
    slug: 'massimo-dutti',
    title: 'Massimo Dutti.',
    year: '2019',
    subtitle: 'Redesigning the purchase experience.',
    listDescription: 'Redesigning the purchase experience.',
    services: ['Strategic Design', 'Product Design', 'Branding', 'Consultancy'],
    overview: 'The project aims to optimize the purchasing funnel and create a shopping experience that is in line with brand positioning: Excellence, detail and dedication to service. We established the phases and processes to ensure the achievement of the main objectives through data measurement and analysis.',
    externalUrl: '',
    cardSize: 'compact',
    listThumbnailUrl: 'https://plastic.design/uploads/works/massimo-dutti/massimo_dutti_s.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/massimo-dutti/massimo_dutti_s.jpg',
    heroUrl: 'https://plastic.design/uploads/massimo-dutti/massimo-dutti_header.jpg',
  },
  {
    order: 11,
    slug: 'bsm',
    title: 'Barcelona School of Management.',
    year: '2021',
    subtitle: 'Strategic design for the company\'s digital transformation.',
    listDescription: 'Strategic design for the company\'s digital transformation.',
    services: ['Strategic Design', 'Product Design', 'Branding', 'Consultancy'],
    overview: 'UPF-BSM is the management school at Pompeu Fabra University. In the midst of a process of digital transformation, the project\'s primary need was to adapt its new branding to the digital environment, aligning the School\'s level of excellence with its digital positioning, primarily reflected in its corporate website.',
    externalUrl: '',
    cardSize: 'tall',
    listThumbnailUrl: 'https://plastic.design/uploads/works/bsm/bsm_p.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/bsm/bsm_p.jpg',
    heroUrl: 'https://plastic.design/uploads/bsm/bsm_header.jpg',
  },
  {
    order: 12,
    slug: 'nimble-payments',
    title: 'BBVA - Nimble Payments.',
    year: '2020',
    subtitle: 'Innovative digital solutions for small business success.',
    listDescription: 'Innovative digital solutions for small business success.',
    services: ['Digital Product', 'Strategic Design', 'Research', 'Branding'],
    overview: 'Nimble Payments is a modern digital tool created by BBVA to help small and medium-sized online businesses. It\'s a one-stop-shop that combines payment, management, and funding solutions, making it easy for merchants to use. Our team worked on the service and product design of the platform.',
    externalUrl: '',
    cardSize: 'wide',
    listThumbnailUrl: 'https://plastic.design/uploads/works/nimble/nimble-payments_l.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/nimble/nimble-payments_l.jpg',
    heroUrl: 'https://plastic.design/uploads/nimble/nimble-payments-header.jpg',
  },
  {
    order: 13,
    slug: 'desigual-digital-lookbook',
    title: 'Desigual Lookbook.',
    year: '2019',
    subtitle: 'Desigual\'s iPad app for multi-brand retailers.',
    listDescription: 'Desigual\'s iPad app for multi-brand retailers.',
    services: ['UX Research', 'UX/UI Design', 'Interaction Design', 'Prototyping'],
    overview: 'B2B iPad application aimed at presenting new Desigual collections to its multi brand retail clients. The platform is manageable through a customized CMS and has different functional objectives: presenting new collections while giving access to product details, categories and order and purchases processing.',
    externalUrl: '',
    cardSize: 'tall',
    listThumbnailUrl: 'https://plastic.design/uploads/works/desigual-look-book/desigual-look-book_p.webp',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/desigual-look-book/desigual-look-book_p.webp',
    heroUrl: 'https://plastic.design/uploads/desigual-look-book/desigual-look-book-header.webp',
  },
  {
    order: 14,
    slug: 'iota',
    title: 'IOTA Foundation.',
    year: '2018',
    subtitle: 'Branding and corporate website redesign.',
    listDescription: 'Branding and corporate website redesign.',
    services: ['Strategy', 'UX Research', 'UX/UI Design', 'Tone of Voice'],
    overview: 'IOTA is a blockless distributed ledger which overcomes the limitations of blockchain technology. We were asked to design a concept website for potential users and investors, to help them understand the proposition and differentiate IOTA from its competitors in the emerging blockchain and cryptocurrency world.',
    externalUrl: '',
    cardSize: 'compact',
    listThumbnailUrl: 'https://plastic.design/uploads/works/iota/iota_s.svg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/iota/iota_s.svg',
    heroUrl: 'https://plastic.design/uploads/iota/iota_header.svg',
  },
  {
    order: 15,
    slug: 'marangoni',
    title: 'Marangoni.',
    year: '2019',
    subtitle: 'A divergent digital magazine for the prestigious international fashion school.',
    listDescription: 'A divergent digital magazine for the prestigious international fashion school.',
    services: ['Digital Product', 'Strategic Design', 'Branding', 'Content Strategy'],
    overview: 'Tablet App to strengthen the client\'s positioning as a leader and influencer in the sector of Fashion & Design. The concept revolves around the creation of a digital magazine that provides a space for artistic expression and inspiration, targeting influencers, fashionistas, followers of art and design, and aspirational young designers.',
    externalUrl: '',
    cardSize: 'wide',
    listThumbnailUrl: 'https://plastic.design/uploads/works/marangoni/marangoni_l.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/marangoni/marangoni_l.jpg',
    heroUrl: 'https://plastic.design/uploads/marangoni/marangoni_header.jpg',
  },
  {
    order: 16,
    slug: 'a-fashion-ecommerce',
    title: 'Arvind.',
    year: '2017',
    subtitle: 'A Fashion Omnichannel strategy and design.',
    listDescription: 'A Fashion Omnichannel strategy and design.',
    services: ['Digital Product', 'Strategic Design', 'Branding', 'Content Strategy'],
    overview: 'The client is a leading company in the retail business, regarded as a reference in the fields of fashion and lifestyle in India. The corporate goal was to raise online presence. Despite the initial request for an e-commerce, our proposal encompassed a full omnichannel strategy to achieve the goal.',
    externalUrl: '',
    cardSize: 'compact',
    listThumbnailUrl: 'https://plastic.design/uploads/works/arvind/arvind_s.jpg',
    selectedThumbnailUrl: 'https://plastic.design/uploads/works/arvind/arvind_s.jpg',
    heroUrl: 'https://plastic.design/uploads/arvind/arvind_header.jpg',
  },
];

// ── 메인 실행 ─────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Sanity Work Seed 시작`);
  console.log(`   Project: ${PROJECT_ID} / Dataset: ${DATASET}\n`);

  // 기존 work 문서 확인
  const existing = await client.fetch(`*[_type == "work"].slug.current`);
  console.log(`📋 기존 Work 문서: ${existing.length}개\n`);

  let created = 0;
  let skipped = 0;

  for (const work of WORKS) {
    if (existing.includes(work.slug)) {
      console.log(`⏭️  스킵 (이미 존재): ${work.slug}`);
      skipped++;
      continue;
    }

    console.log(`\n📝 생성 중: [${work.order}] ${work.title}`);

    // 이미지 업로드
    const thumbnail        = await uploadImageFromUrl(work.listThumbnailUrl,     `${work.slug}-thumbnail`);
    const selectedThumbnail = await uploadImageFromUrl(work.selectedThumbnailUrl, `${work.slug}-selected`);
    const heroMedia        = await uploadImageFromUrl(work.heroUrl,              `${work.slug}-hero`);

    // Sanity 문서 생성
    const doc = {
      _type: 'work',
      title: work.title,
      slug: { _type: 'slug', current: work.slug },
      year: work.year,
      subtitle: work.subtitle,
      overview: work.overview,
      listDescription: work.listDescription,
      services: work.services,
      order: work.order,
      cardSize: work.cardSize,
      ...(work.externalUrl && { externalUrl: work.externalUrl }),
      ...(thumbnail && { thumbnail }),
      ...(selectedThumbnail && { selectedThumbnail }),
      ...(heroMedia && {
        heroMedia: {
          _type: 'object',
          type: 'image',
          image: heroMedia,
        },
      }),
    };

    try {
      const result = await client.create(doc);
      console.log(`  ✅ 생성 완료: ${result._id}`);
      created++;
    } catch (err) {
      console.error(`  ❌ 생성 실패: ${err.message}`);
    }
  }

  console.log(`\n────────────────────────────────────`);
  console.log(`✅ 완료: ${created}개 생성, ${skipped}개 스킵`);
  console.log(`   Sanity Studio에서 확인: http://localhost:3333\n`);
}

main().catch(console.error);
