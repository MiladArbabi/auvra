'use client';

import {createContext, useContext, useEffect, useState} from 'react';

const ConsentContext = createContext({
  consent: null,     // { analytics: bool, marketing: bool } | null (undecided)
  save: () => {},
  ready: false,
  open: false,
  setOpen: () => {}
});

function readConsent() {
  try {
    const m = document.cookie.match(/(?:^|;\\s*)consent=([^;]+)/);
    if (!m) return null;
    return JSON.parse(decodeURIComponent(m[1]));
  } catch { return null; }
}

function writeConsent(obj) {
  document.cookie = `consent=${encodeURIComponent(JSON.stringify(obj))}; Path=/; Max-Age=${60*60*24*180}`;
}

export function ConsentProvider({children}) {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  function save(next) {
    setConsent(next);
    writeConsent(next);
  }

  return (
    <ConsentContext.Provider value={{consent, save, ready, open, setOpen}}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() { return useContext(ConsentContext); }
