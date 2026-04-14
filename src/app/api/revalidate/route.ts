/**
 * On-demand ISR revalidation
 * Immediately purges the Work/Story page cache via Sanity webhook or manual call.
 *
 * POST /api/revalidate
 * Body: { secret: "...", paths: ["/work", "/"] }
 *
 * Or: GET /api/revalidate?secret=...&path=/work
 */
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const SECRET = process.env.REVALIDATE_SECRET ?? 'dev-revalidate';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const path   = req.nextUrl.searchParams.get('path') ?? '/work';

  if (secret !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, ts: Date.now() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (body.secret !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const paths: string[] = body.paths ?? ['/work', '/'];
  paths.forEach((p) => revalidatePath(p));

  return NextResponse.json({ revalidated: true, paths, ts: Date.now() });
}
