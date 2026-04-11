/**
 * JsonLd — 구조화 데이터 (JSON-LD) 주입 컴포넌트
 * 사용: <JsonLd data={schemaObject} />
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
