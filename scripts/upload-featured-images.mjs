import crypto from "node:crypto";
import path from "node:path";
import {getCliClient} from "sanity/cli";

// CLI 로그인/토큰을 그대로 사용
const client = getCliClient({apiVersion: "2025-01-01"});

const CONCURRENCY = 2; // 너무 높이면 rate limit/실패 가능
const SLEEP_MS = 250;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function safeFilename(url) {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname) || "image";
    return base.split("?")[0] || "image";
  } catch {
    return "image";
  }
}

async function downloadAsBuffer(url) {
  const res = await fetch(url, {redirect: "follow"});
  if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function uploadAndPatch(doc) {
  const { _id, featuredMediaUrl } = doc;
  if (!featuredMediaUrl) return { _id, status: "skip(no url)" };

  // 대표이미지 이미 있으면 스킵
  if (doc.mainImage?.asset?._ref) return { _id, status: "skip(has mainImage)" };

  // 중복 업로드 방지: URL 해시를 label로 남김
  const urlHash = crypto.createHash("sha1").update(featuredMediaUrl).digest("hex").slice(0, 12);
  const filename = safeFilename(featuredMediaUrl);

  const buf = await downloadAsBuffer(featuredMediaUrl);

  // 업로드
  const asset = await client.assets.upload("image", buf, {
    filename,
    label: `wp-featured:${urlHash}`,
    source: {name: "wordpress", url: featuredMediaUrl},
  });

  // 문서에 mainImage 연결
  await client
    .patch(_id)
    .set({
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
      // 원본 URL은 유지(원하면 나중에 지워도 됨)
      featuredMediaUrl,
    })
    .commit({autoGenerateArrayKeys: true});

  return { _id, status: "ok", assetId: asset._id };
}

async function run() {
  // project 문서 중 featuredMediaUrl이 있는 것만 대상
  const docs = await client.fetch(`
    *[_type=="project" && featuredMediaUrl != null && featuredMediaUrl != ""]{
      _id,
      featuredMediaUrl,
      mainImage
    }
  `);

  console.log(`Found ${docs.length} project docs with featuredMediaUrl`);

  let i = 0;
  const queue = [];

  async function worker(doc) {
    try {
      const result = await uploadAndPatch(doc);
      console.log(result);
    } catch (e) {
      console.error({ _id: doc._id, status: "error", message: e.message });
    } finally {
      await sleep(SLEEP_MS);
    }
  }

  for (const doc of docs) {
    const p = worker(doc);
    queue.push(p);
    i++;

    // concurrency 제한
    if (queue.length >= CONCURRENCY) {
      await Promise.race(queue).catch(() => {});
      // 완료된 promise 제거
      for (let k = queue.length - 1; k >= 0; k--) {
        if (queue[k].settled) queue.splice(k, 1);
      }
    }
  }

  // 남은 작업 대기
  await Promise.allSettled(queue);
  console.log("Done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
