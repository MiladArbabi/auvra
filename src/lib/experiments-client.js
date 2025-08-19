// src/lib/experiments-client.js
'use client';

import { useEffect, useState } from 'react';

export function readVariant(key) {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)exp_${key}=([^;]+)`));
  return m ? m[1] : 'A';
}

export function useVariant(key) {
  const [v, setV] = useState('A');
  useEffect(() => { setV(readVariant(key)); }, [key]);
  return v;
}