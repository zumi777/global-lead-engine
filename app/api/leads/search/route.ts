import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { query } = await req.json();
  if (!query || typeof query !== 'string') return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  const key = process.env.HUNTER_API_KEY;
  if (!key) return NextResponse.json({ error: 'Live provider is not connected yet. Add HUNTER_API_KEY to the deployment environment.' }, { status: 503 });

  const url = new URL('https://api.hunter.io/v2/discover');
  url.searchParams.set('query', query.trim());
  url.searchParams.set('api_key', key);
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const payload = await response.json();
    if (!response.ok) return NextResponse.json({ error: payload?.errors?.[0]?.details || 'Provider search failed' }, { status: response.status });
    const raw = payload?.data?.companies || payload?.data?.results || [];
    const leads = raw.slice(0, 25).map((c: any) => ({
      name: c.name || c.organization || c.domain || 'Company',
      domain: c.domain || c.website || '',
      description: c.description || c.industry || '',
      location: [c.city, c.country].filter(Boolean).join(', '),
      source: 'Hunter Discover'
    })).filter((c: any) => c.domain);
    return NextResponse.json({ leads, provider: 'hunter', live: true });
  } catch {
    return NextResponse.json({ error: 'Could not reach live data provider' }, { status: 502 });
  }
}
