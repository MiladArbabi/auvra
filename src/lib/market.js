// src/lib/market.js
import {cookies} from 'next/headers';

// --- server-only helper (await cookies())
export async function getCountry(fallback = 'SE') {
  const jar = await cookies();
  const v = jar.get('shopifyCountry')?.value;
  return (v || fallback).toUpperCase();
}