/**
 * sanity-import.json의 featuredMediaUrl 이미지를 로컬(public/images/portfolio)에 저장하고,
 * 각 문서에 localImage 경로(/images/portfolio/...)를 기록합니다.
 *
 * 실행:
 *   node scripts/download-images.mjs
 */

import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import crypto from "node:crypto";

const INPUT = path.resolve("scripts/out/sanity-import.json");
const OUT_DIR = path.resolve("public/images/portfolio");

fs.mkdirSync(OUT_DIR, { recursive: true });

function safeName(url) {
  const ext = (path.extname(url).split("?")[0] || "").toLowerCase() || ".jpg";
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 12);
  return `${hash}${ext}`;
}

async function download(url, filePath) {
  const res = await axios.get(url, {
    responseType: "stream",
    timeout: 30000,
    validateStatus: () => true,
  });

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`HTTP ${res.status}`);
  }

  await new Promise((resolve, reject) => {
    const w = fs.createWriteStream(filePath);
    res.data.pipe(w);
    w.on("finish", resolve);
    w.on("error", reject);
  });
}

async function run() {
  if (!fs.existsSync(INPUT)) {
    console.error(`❌ Input file not found: ${INPUT}`);
    console.error("먼저 migrate를 실행해서 scripts/out/sanity-import.json을 생성하세요.");
    process.exit(1);
  }

  const docs = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  const targets = docs.filter((d) => typeof d.featuredMediaUrl === "string" && d.featuredMediaUrl);

  console.log(`Found ${targets.length} docs with featuredMediaUrl`);

  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of targets) {
    const url = doc.featuredMediaUrl;
    const filename = safeName(url);
    const outPath = path.join(OUT_DIR, filename);

    if (fs.existsSync(outPath)) {
      doc.localImage = `/images/portfolio/${filename}`;
      skipped++;
      continue;
    }

    try {
      await download(url, outPath);
      doc.localImage = `/images/portfolio/${filename}`;
      done++;
      process.stdout.write(".");
    } catch (e) {
      failed++;
      console.error(`\n❌ Failed: ${url} (${e.message})`);
    }
  }

  fs.writeFileSync(INPUT, JSON.stringify(docs, null, 2), "utf8");

  console.log(`\n✅ Done. downloaded=${done}, skipped=${skipped}, failed=${failed}`);
  console.log(`Saved images to: ${OUT_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
