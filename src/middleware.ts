// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VUID = 'vuid';
type Exp = { key: string; id: string; split: { A: number; B: number } };

export const ACTIVE_EXPERIMENTS: Exp[] = [
  { key: 'plp_filters', id: 'EXP-PLP-FILTERS', split: { A: 50, B: 50 } }
];

// Edge-safe random hex (no Node 'crypto' import)
function randomHex(bytes = 16) {
  const arr = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Edge-safe SHA-1 → percent
async function hashToPercent(input: string) {
  const data = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest('SHA-1', data);
  const view = new DataView(digest);
  const n = view.getUint16(0, false); // first 2 bytes (big-endian)
  return (n / 65535) * 100;
}

async function assignVariant(vuid: string, key: string, split: Exp['split']): Promise<'A'|'B'> {
  const p = await hashToPercent(`${vuid}:${key}`);
  return p < split.A ? 'A' : 'B';
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Debug header so we can see middleware hits via curl -I
  res.headers.set('x-mw', 'hit');

  // vuid cookie (client-readable so your client hook can use it if desired)
  let vuid = req.cookies.get(VUID)?.value;
  if (!vuid) {
    vuid = randomHex(16);
    res.cookies.set(VUID, vuid, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  // assign experiments once
  for (const e of ACTIVE_EXPERIMENTS) {
    const cname = `exp_${e.key}`;
    let v = req.cookies.get(cname)?.value as 'A'|'B'|undefined;
    if (!v) {
      v = await assignVariant(vuid!, e.key, e.split);
      res.cookies.set(cname, v, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  return res;
}

// keep the matcher broad while testing
export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:png|jpg|svg|ico|txt|js|css)|robots\\.txt|sitemap\\.xml|api).*)',
  ],
};
