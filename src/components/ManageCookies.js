// src/components/ManageCookies.js
'use client';
import {useEffect, useState} from 'react';
import {readConsent, writeConsent} from '@/lib/consent';

export default function ManageCookies() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const c = readConsent();
    setAnalytics(!!c?.analytics);
    setMarketing(!!c?.marketing);
  }, [open]);

  const save = () => {
    writeConsent({analytics, marketing});
    setOpen(false);
    console.info('[consent] saved', {analytics, marketing});
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="underline text-sm">Manage cookies</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-5 w-[90vw] max-w-md shadow">
            <h3 className="text-lg font-medium mb-3">Cookie preferences</h3>
            <label className="flex items-center gap-2 py-2">
              <input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)} />
              <span>Analytics</span>
            </label>
            <label className="flex items-center gap-2 py-2">
              <input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)} />
              <span>Marketing</span>
            </label>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg border">Cancel</button>
              <button onClick={save} className="px-3 py-2 rounded-lg bg-black text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
