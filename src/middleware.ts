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
  const url = req.nextUrl
  const host = req.headers.get('host')?.toLowerCase() || ''
  const pathname = url.pathname + (url.search ?? '')

  // www.auvra.shop → apex
  if (host === 'www.auvra.shop') {
    return NextResponse.redirect(new URL(pathname, 'https://auvra.shop'), 308)
  }

  // *.se → auvra.shop/sv/*
  if (host === 'auvra.se' || host === 'www.auvra.se') {
    const destPath = pathname.startsWith('/sv') ? pathname : `/sv${pathname}`
    return NextResponse.redirect(new URL(destPath, 'https://auvra.shop'), 308)
  }

  // *.online / *.info → auvra.shop/*
  if (
    host === 'auvra.online' || host === 'www.auvra.online' ||
    host === 'auvra.info'   || host === 'www.auvra.info'
  ) {
    return NextResponse.redirect(new URL(pathname, 'https://auvra.shop'), 308)
  }

  // (rest of your middleware continues…)
  const res = NextResponse.next()

  // Debug header so we can see middleware hits via curl -I
  if (process.env.NODE_ENV !== 'production') res.headers.set('x-mw', 'hit');

  // vuid cookie (client-readable so your client hook can use it if desired)
  let vuid = req.cookies.get(VUID)?.value;
  if (!vuid) {
    vuid = randomHex(16);
    res.cookies.set(VUID, vuid, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      secure: process.env.NODE_ENV === 'production'
    });
  }

  // assign experiments once
  for (const e of ACTIVE_EXPERIMENTS) {
    const cname = `exp_${e.key}`;
    let v = req.cookies.get(cname)?.value as 'A'|'B'|undefined;

    // DEV-ONLY variant override: ?exp_plp_filters=A|B
    if (process.env.NODE_ENV !== 'production') {
      const url = new URL(req.url);
      const qv = url.searchParams.get(cname);
      if (qv === 'A' || qv === 'B') {
        v = qv;
        res.cookies.set(cname, v, {
          path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30,
        });
        continue; // skip hashing; overridden
      }
    }

    if (!v) {
      v = await assignVariant(vuid!, e.key, e.split);
      res.cookies.set(cname, v, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        secure: process.env.NODE_ENV === 'production'
      });
    }
  }

  return res;
}

// keep the matcher broad while testing
export const config = {
  matcher: ['/((?!_next/|.*\\.(?:png|jpg|jpeg|svg|ico|txt|js|css)$).*)'],
};