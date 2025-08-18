'use client';

import {useEffect, useState} from 'react';
import {useConsent} from './ConsentContext';

export default function ConsentBanner() {
  const {consent, save, ready} = useConsent();
  const [show, setShow] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [customize, setCustomize] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // show only when undecided
    if (consent == null) setShow(true);
  }, [ready, consent]);

  if (!show) return null;

function acceptAll(e) {
    try {
      e?.preventDefault();
      save({ analytics: true, marketing: true, ts: Date.now() });
      console.info('[consent] acceptAll -> saved, reloading');
      location.reload();
    } catch (err) {
      console.error('[consent] acceptAll error', err);
    }
  }
  function rejectAll(e) {
    try {
      e?.preventDefault();
      save({ analytics: false, marketing: false, ts: Date.now() });
      console.info('[consent] rejectAll -> saved, reloading');
      location.reload();
    } catch (err) {
      console.error('[consent] rejectAll error', err);
    }
  }
  function savePrefs(e) {
    try {
      e?.preventDefault();
      save({ analytics, marketing, ts: Date.now() });
      console.info('[consent] savePrefs -> saved, reloading');
      location.reload();
    } catch (err) {
      console.error('[consent] savePrefs error', err);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 border-t p-4">
      <div className="mx-auto max-w-4xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-neutral-700">
          We use cookies for analytics and marketing. Choose what’s OK.
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {customize && (
            <div className="flex items-center gap-3 text-sm mr-2">
              <label className="inline-flex items-center gap-1">
                <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />
                Analytics
              </label>
              <label className="inline-flex items-center gap-1">
                <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
                Marketing
              </label>
            </div>
          )}
          <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => setCustomize(v => !v)}>
            {customize ? 'Hide options' : 'Customize'}
          </button>
          <button type="button" className="px-3 py-2 rounded-lg border" onClick={rejectAll}>Reject all</button>
          <button type="button" className="px-3 py-2 rounded-lg bg-black text-white" onClick={acceptAll}>Accept all</button>
          {customize && (
            <button type="button" className="px-3 py-2 rounded-lg bg-black text-white" onClick={savePrefs}>Save preferences</button>
          )}
        </div>
      </div>
    </div>
  );
}
