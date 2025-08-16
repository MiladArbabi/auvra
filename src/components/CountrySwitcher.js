'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

const OPTIONS = [
  ['SE','Sweden'], ['DK','Denmark'], ['FI','Finland'], ['NO','Norway'],
  ['DE','Germany'], ['NL','Netherlands'], ['FR','France'],
  ['GB','United Kingdom'], ['US','United States']
];

export default function CountrySwitcher({current = 'SE'}) {
  const router = useRouter();
  const [val, setVal] = useState(current);

  useEffect(() => {
    // try read from cookie if not passed
    if (!current) {
      const m = document.cookie.match(/(?:^|;\s*)shopifyCountry=([A-Z]{2})/);
      if (m) setVal(m[1]);
    }
  }, [current]);

  function onChange(e) {
    const v = e.target.value;
    setVal(v);
    document.cookie = `shopifyCountry=${v}; Path=/; Max-Age=${60*60*24*365}`;
    router.refresh();
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span>Market</span>
      <select value={val} onChange={onChange} className="border rounded-lg px-2 py-1">
        {OPTIONS.map(([code, name]) => (
          <option key={code} value={code}>{name} ({code})</option>
        ))}
      </select>
    </label>
  );
}
