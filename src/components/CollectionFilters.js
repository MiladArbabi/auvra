'use client';

import {Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();

  const q    = sp.get('q')    || '';
  const min  = sp.get('min')  || '';
  const max  = sp.get('max')  || '';
  const sort = sp.get('sort') || 'relevance';

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const query = new URLSearchParams();
    for (const [k, v] of data.entries()) {
      if (String(v).trim()) query.set(k, String(v).trim());
    }
    router.push(`?${query.toString()}`);
  }

  function reset() {
    router.push('?');
  }

  return (
    <form onSubmit={onSubmit} className="my-6 flex flex-wrap gap-3 items-end">
      <label className="flex flex-col text-sm">
        <span>Search</span>
        <input name="q" defaultValue={q} className="border rounded-lg px-3 py-2" />
      </label>

      <label className="flex flex-col text-sm">
        <span>Min</span>
        <input name="min" type="number" defaultValue={min} className="border rounded-lg px-3 py-2 w-28" />
      </label>

      <label className="flex flex-col text-sm">
        <span>Max</span>
        <input name="max" type="number" defaultValue={max} className="border rounded-lg px-3 py-2 w-28" />
      </label>

      <label className="flex flex-col text-sm">
        <span>Sort</span>
        <select name="sort" defaultValue={sort} className="border rounded-lg px-3 py-2">
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="created-desc">Newest</option>
          <option value="best-selling">Best selling</option>
        </select>
      </label>

      <button className="px-4 py-2 rounded-xl bg-black text-white">Apply</button>
      <button type="button" onClick={reset} className="px-4 py-2 rounded-xl border">Reset</button>
    </form>
  );
}

export default function CollectionFilters() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
