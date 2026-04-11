/**
 * 기존 5-module 체계 → 3-module 체계 마이그레이션
 *
 * 변환 매핑:
 *   mediaModule      → mediaBlock (layout: 1col)
 *   fullBleedModule  → mediaBlock (layout: 1col, fullBleed: true)
 *   bgImageModule    → mediaBlock (layout: 1col, fullBleed: true)
 *   twoColImageModule→ mediaBlock (layout: 2col)
 *   textModule       → textBlock
 *
 * 실행: node migrate-modules.mjs
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// .env.local 수동 파싱 (dotenv 없이)
const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}
Object.assign(process.env, env);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function migrateModule(mod) {
  switch (mod._type) {
    case 'mediaModule':
      return {
        _type: 'mediaBlock',
        _key: mod._key,
        layout: '1col',
        fullBleed: false,
        image1: mod.image || undefined,
        video: mod.mediaType === 'video' ? mod.video : undefined,
        spacing: mod.removeBottomMargin ? 'none' : 'default',
      };

    case 'fullBleedModule':
      return {
        _type: 'mediaBlock',
        _key: mod._key,
        layout: '1col',
        fullBleed: true,
        image1: mod.image || undefined,
        spacing: mod.removeBottomMargin ? 'none' : 'default',
      };

    case 'bgImageModule':
      return {
        _type: 'mediaBlock',
        _key: mod._key,
        layout: '1col',
        fullBleed: true,
        image1: mod.image || undefined,
        video: mod.mediaType === 'video' ? mod.video : undefined,
        spacing: mod.removeBottomMargin ? 'none' : 'default',
      };

    case 'twoColImageModule':
      return {
        _type: 'mediaBlock',
        _key: mod._key,
        layout: '2col',
        fullBleed: false,
        image1: mod.leftImage || undefined,
        image2: mod.rightImage || undefined,
        spacing: mod.removeBottomMargin ? 'none' : 'default',
      };

    case 'textModule':
      return {
        _type: 'textBlock',
        _key: mod._key,
        heading: mod.heading,
        body: mod.body,
        columnWidth: mod.columnWidth || 7,
        offsetCols: 0,
        centered: false,
        paddingTop: 'default',
      };

    default:
      // 이미 새 타입이거나 알 수 없는 타입 → 그대로 유지
      return mod;
  }
}

// undefined 값 제거 (Sanity는 undefined 필드를 허용하지 않음)
function cleanUndefined(obj) {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) cleaned[key] = value;
  }
  return cleaned;
}

async function main() {
  const docs = await client.fetch(
    `*[_type == "work" && defined(modules)] { _id, title, modules }`
  );

  console.log(`Found ${docs.length} work documents with modules\n`);

  let migratedCount = 0;

  for (const doc of docs) {
    const oldTypes = ['mediaModule', 'fullBleedModule', 'bgImageModule', 'twoColImageModule', 'textModule'];
    const hasOldModules = doc.modules?.some((m) => oldTypes.includes(m._type));

    if (!hasOldModules) {
      console.log(`⏭  ${doc.title} — no old modules, skip`);
      continue;
    }

    const newModules = doc.modules.map((m) => cleanUndefined(migrateModule(m)));

    console.log(`🔄 ${doc.title}`);
    doc.modules.forEach((m, i) => {
      const nm = newModules[i];
      if (m._type !== nm._type) {
        console.log(`   [${i}] ${m._type} → ${nm._type} (${nm.layout || ''}${nm.fullBleed ? ' full-bleed' : ''})`);
      }
    });

    await client.patch(doc._id).set({ modules: newModules }).commit();
    migratedCount++;
    console.log(`   ✅ done\n`);
  }

  console.log(`\n🎉 Migration complete: ${migratedCount}/${docs.length} documents updated.`);
}

main().catch(console.error);
