/**
 * WP → Sanity Import 파일 생성 스크립트 (posts/pages)
 * - WP REST API로 글/페이지를 가져와서
 * - Sanity dataset import 가능한 JSON 파일로 저장
 *
 * 실행:
 *   node scripts/migrate.js
 */

import axios from "axios";
import fs from "fs";
import path from "path";

async function getFeaturedMediaUrlFromWpItem(wpItem) {
  // 1) 가장 빠른 케이스: _embedded에 source_url이 있는 경우
  const embeddedUrl =
    wpItem?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    wpItem?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url;

  if (embeddedUrl) return embeddedUrl;

  // 2) _links에 featuredmedia href가 있으면 media endpoint를 한 번 더 호출
  const mediaHref = wpItem?._links?.["wp:featuredmedia"]?.[0]?.href;
  if (!mediaHref) return null;

  try {
    const res = await fetch(mediaHref);
    if (!res.ok) return null;
    const media = await res.json();
    return (
      media?.source_url ||
      media?.media_details?.sizes?.full?.source_url ||
      null
    );
  } catch {
    return null;
  }
}


// ✅ 1) 본인 워드프레스 도메인으로 수정
const WP_BASE = "https://creative-moon.com";

// ✅ 2) 가져올 대상: posts / pages
const ENDPOINTS = [
  { type: "project", endpoint: "/wp-json/wp/v2/portfolio" },
];

// ✅ 3) 출력 파일명
const OUT_DIR = path.resolve(process.cwd(), "scripts", "out");
const OUT_FILE = path.join(OUT_DIR, "sanity-import.ndjson");

// WP는 per_page 최대 100
const PER_PAGE = 100;

async function fetchAll(endpointUrl) {
  let page = 1;
  const all = [];

  while (true) {
    const joiner = endpointUrl.includes("?") ? "&" : "?";
    const url = `${endpointUrl}${joiner}per_page=${PER_PAGE}&page=${page}`;

    const res = await axios.get(url, { validateStatus: () => true });

    if (res.status === 400 || res.status === 404) break;
    if (res.status !== 200) throw new Error(`WP fetch failed: ${res.status} ${url}`);

    all.push(...res.data);

    const totalPages = Number(res.headers["x-wp-totalpages"] || 0);
    if (totalPages && page >= totalPages) break;
    if (!totalPages && res.data.length < PER_PAGE) break;

    page += 1;
  }

  return all;
}


function decodeHtmlEntities(str = "") {
  // WP는 title.rendered 등에 HTML entity가 섞일 수 있음 → 최소 디코딩
  return str
    .replaceAll("&#8217;", "’")
    .replaceAll("&#8216;", "‘")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#8220;", "“")
    .replaceAll("&#8221;", "”")
    .replaceAll("&#8211;", "–")
    .replaceAll("&#8212;", "—")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#8230;", "…");
}

async function wpToSanityDoc(wpItem, sanityType) {
  const title = decodeHtmlEntities(wpItem?.title?.rendered || "");
  const slug = wpItem?.slug || "";
  const publishedAt = wpItem?.date_gmt ? new Date(wpItem.date_gmt).toISOString() : null;

  // WP content는 HTML 문자열. (일단은 그대로 저장 → 나중에 Portable Text로 변환 가능)
  const bodyHtml = wpItem?.content?.rendered || "";

  // excerpt도 HTML 문자열
  const excerptHtml = wpItem?.excerpt?.rendered || "";

  // feature image URL (있으면)
  const featuredMediaUrl = await getFeaturedMediaUrlFromWpItem(wpItem);

  // Sanity import 문서 형태
  return {
    _id: `wp-${sanityType}-${wpItem.id}`, // ← 맨 위에

    _type: sanityType, // "project"
    title,
    slug: { current: slug },
    publishedAt,
    bodyHtml,
    excerptHtml,
    featuredMediaUrl,

    // 원본 WP 정보 보관 (추적용)
    wp: {
      id: wpItem?.id,
      link: wpItem?.link || null,
      status: wpItem?.status || null,
    },
  };
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sanityDocs = [];

  for (const item of ENDPOINTS) {
    const endpointUrl = `${WP_BASE}${item.endpoint}?_embed=1`;
    console.log(`Fetching: ${endpointUrl}`);

    const wpItems = await fetchAll(endpointUrl);
    console.log(` → ${item.type}: ${wpItems.length} items`);

    for (const wpItem of wpItems) {
      const doc = await wpToSanityDoc(wpItem, item.type);
      sanityDocs.push(doc);
    }
  }

  const ndjson = sanityDocs.map((d) => JSON.stringify(d)).join("\n");
  fs.writeFileSync(OUT_FILE, ndjson, "utf8");
  console.log(`\n✅ Done. Import file created: ${OUT_FILE}`);
  console.log(`Next: sanity dataset import ${OUT_FILE} production`);
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

