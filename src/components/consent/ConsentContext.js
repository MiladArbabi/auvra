'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {
  readConsent as readConsentCookie,
  writeConsent as writeConsentCookie,
  CONSENT_COOKIE
} from '@/lib/consent';

const ConsentContext = createContext({
  consent: null,     // { analytics: bool, marketing: bool } | null (undecided)
  save: () => {},
  ready: false,
  open: false,
  setOpen: () => {}
});

export function ConsentProvider({children}) {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setConsent(readConsentCookie());
    setReady(true);
  }, []);

  useEffect(() => {
  if (process.env.NODE_ENV !== 'production') {
    window.__consent = {
      read: readConsentCookie,
      write: (obj) => writeConsentCookie({ ...obj, ts: Date.now() }),
      clear: () => { document.cookie = 'consent_prefs=; Max-Age=0; Path=/'; }
    };
    console.info('[consent] dev helpers on window.__consent');
  }
}, []);

  function save(next) {
    setConsent(next);
    writeConsentCookie(next);
  }

  return (
    <ConsentContext.Provider value={{consent, save, ready, open, setOpen}}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() { return useContext(ConsentContext); }
