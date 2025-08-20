// src/app/api/ga/purchase/route.js
import { NextResponse } from 'next/server';

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID; // e.g. G-XXXX
const GA4_API_SECRET = process.env.GA4_API_SECRET;                // from GA4 Admin

function ok(data = {}) {
  return new NextResponse(JSON.stringify({ ok: true, ...data }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      // allow cross-origin from Shopify checkout
      'access-control-allow-origin': '*',
    },
  });
}

function fail(status, msg) {
  return new NextResponse(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

export async function POST(req) {
  if (!MEASUREMENT_ID || !GA4_API_SECRET) {
    return fail(500, 'GA4 env missing');
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid JSON');
  }

  const {
    currency,
    value,
    transaction_id,
    items = [],
    non_personalized_ads = true, // safer default until we bridge consent at checkout
  } = body || {};

  if (!currency || typeof value !== 'number' || !transaction_id) {
    return fail(400, 'Missing currency/value/transaction_id');
  }

  // MP requires a client_id — we’ll synthesize a stable-ish random if none provided
  const client_id = body.client_id || `${Date.now()}.${Math.floor(Math.random()*1e9)}`;

  const payload = {
    client_id,
    non_personalized_ads,
    events: [{
      name: 'purchase',
      params: {
        currency,
        value,
        transaction_id,
        items,
      },
    }],
  };

  const res = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      // keepalive can help if browser navigates away immediately
      keepalive: true,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return fail(502, `GA4 ${res.status}: ${text.slice(0,200)}`);
  }
  return ok();
}