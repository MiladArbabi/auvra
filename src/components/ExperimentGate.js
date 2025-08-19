// src/components/ExperimentGate.js
'use client';
import { useEffect } from 'react';
import { useVariant } from '@/lib/experiments-client';
import { experimentExposure } from '@/lib/track';

export default function ExperimentGate({ expKey, expId, A, B }) {
  const v = useVariant(expKey);

  useEffect(() => {
    const k = `exposed:${expId}:${v}`;
    if (!sessionStorage.getItem(k)) {
      experimentExposure({ id: expId, variant: v });
      sessionStorage.setItem(k, '1');
    }
  }, [expId, v]);

  return v === 'B' ? B : A;
}