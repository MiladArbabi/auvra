'use client';
import {useEffect, useState} from 'react';
import {readConsent, writeConsent} from '@/lib/consent';

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(!readConsent()); }, []);
  if (!show) return null;

  const acceptAll = () => { writeConsent({analytics:true, marketing:true}); setShow(false); console.info('[consent] accepted all'); };
  const rejectAll = () => { writeConsent({analytics:false, marketing:false}); setShow(false); console.info('[consent] rejected all'); };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t shadow-sm">
      <div className="mx-auto max-w-5xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm flex-1">
          We use cookies to analyze traffic and measure ads. You can change your choice anytime.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={rejectAll} className="px-3 py-2 rounded-lg border">Reject</button>
          <button onClick={acceptAll} className="px-3 py-2 rounded-lg bg-black text-white">Accept all</button>
        </div>
      </div>
    </div>
  );
}
