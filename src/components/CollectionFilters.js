'use client';

import {useRouter, useSearchParams, usePathname} from 'next/navigation';
import {useState, useEffect} from 'react';

export default function CollectionFilters() {
  const router = useRouter();
  const search = useSearchParams();
  const pathname = usePathname();

  const [q, setQ] = useState(search.get('q') || '');
  const [min, setMin] = useState(search.get('min') || '');
  const [max, setMax] = useState(search.get('max') || '');
  const [sort, setSort] = useState(search.get('sort') || 'relevance');

  useEffect(() => {
    setQ(search.get('q') || '');
    setMin(search.get('min') || '');
    setMax(search.get('max') || '');
    setSort(search.get('sort') || 'relevance');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.toString()]);

  function apply(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (min) params.set('min', min);
    if (max) params.set('max', max);
    if (sort && sort !== 'relevance') params.set('sort', sort);
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);
  }

  function reset() {
    router.push(pathname);
  }

  return (
    <form onSubmit={apply} className="flex flex-wrap gap-3 items-end mb-6">
      <div>
        <label className="block text-sm">Search</label>
        <input className="border rounded-lg px-3 py-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="niacinamide" />
      </div>
      <div>
        <label className="block text-sm">Min €</label>
        <input className="border rounded-lg px-3 py-2 w-28" value={min} onChange={e=>setMin(e.target.value)} inputMode="decimal" />
      </div>
      <div>
        <label className="block text-sm">Max €</label>
        <input className="border rounded-lg px-3 py-2 w-28" value={max} onChange={e=>setMax(e.target.value)} inputMode="decimal" />
      </div>
      <div>
        <label className="block text-sm">Sort</label>
        <select className="border rounded-lg px-3 py-2" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="created-desc">Newest</option>
          <option value="best-selling">Best selling</option>
        </select>
      </div>
      <button className="px-4 py-2 rounded-xl bg-black text-white">Apply</button>
      <button type="button" onClick={reset} className="px-4 py-2 rounded-xl border">Reset</button>
    </form>
  );
}
