// src/components/CollectionFilters.js
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

function Inner({ availableFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newSearchParams = new URLSearchParams();

    for (const [key, value] of data.entries()) {
      if (String(value).trim()) {
        newSearchParams.set(key, String(value).trim());
      }
    }
    // We use router.replace to avoid adding to the browser's history stack
    router.replace(`?${newSearchParams.toString()}`);
  }

  function reset() {
    router.replace('?');
  }

  return (
    <form onSubmit={onSubmit} className="my-6 space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* --- Sort Dropdown --- */}
        <label className="flex flex-col text-sm font-medium">
          <span>Sort by</span>
          <select name="sort" defaultValue={searchParams.get('sort') || 'relevance'} className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="created-desc">Newest</option>
          </select>
        </label>
        {/* You can add manual filters like search or price range here if needed */}
      </div>

      {/* --- Dynamic Faceted Filters --- */}
      <div className="space-y-4">
        {availableFilters.map((filter) => {
          if (filter.type !== 'LIST') return null; // Only handle list-type filters for now

          return (
            <div key={filter.id}>
              <h3 className="font-semibold">{filter.label}</h3>
              <ul className="mt-2 space-y-1">
                {filter.values.map((value) => (
                  <li key={value.id} className="flex items-center">
                    <input
                      type="checkbox"
                      name={filter.id}
                      id={value.id}
                      value={value.input.toString().split(':')[1].replace(/"/g, '') === 'true' ? 'true' : undefined}
                      defaultChecked={searchParams.has(filter.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={value.id} className="ml-3 text-sm">
                      {value.label} ({value.count})
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary">Apply</Button>
        <Button type="button" onClick={reset} variant="secondary">Reset</Button>
      </div>
    </form>
  );
}

export default function CollectionFilters({ availableFilters }) {
  return (
    // Suspense boundary is crucial for components that use useSearchParams
    <Suspense fallback={<div className="h-24" />}>
      <Inner availableFilters={availableFilters} />
    </Suspense>
  );
}