import {client} from "@/sanity/client";

const TEST_QUERY = `*[_type == "post"][0..2]{_id, title}`;

import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* 이후 섹션들 추가 */}
    </main>
  );
}