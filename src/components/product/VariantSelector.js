// src/components/product/VariantSelector.js
'use client';

import { useMemo } from 'react';

export default function VariantSelector({ options, variants, availableVariants, selectedVariant, onVariantChange }) {
  // Memoize the derived options map to prevent re-calculation on every render
  const optionsMap = useMemo(() => {
    const map = new Map();
    for (const option of options) {
      map.set(option.name, {
        ...option,
        // Find the currently selected value for this option type (e.g., "Size")
        selectedValue: selectedVariant?.selectedOptions.find(o => o.name === option.name)?.value,
      });
    }
    return map;
  }, [options, selectedVariant]);

  // Create a set of all option values that are actually available for purchase.
  // E.g., {'Small', 'Red', 'Large', 'Blue'}
  const availableValues = useMemo(() => {
    const values = new Set();
    for (const variant of availableVariants) {
      for (const option of variant.selectedOptions) {
        values.add(option.value);
      }
    }
    return values;
  }, [availableVariants]);

  // When a user clicks an option (e.g., "Large"), find the first variant that matches
  const handleOptionClick = (optionName, optionValue) => {
    const newVariant = variants.find(variant =>
      variant.selectedOptions.some(o => o.name === optionName && o.value === optionValue)
    );
    if (newVariant) {
      onVariantChange(newVariant);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {Array.from(optionsMap.values()).map(option => (
        <div key={option.name}>
          <h3 className="text-sm font-medium text-foreground/80">{option.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map(value => {
              const isActive = option.selectedValue === value;
              const isAvailable = availableValues.has(value);

              return (
                <button
                  key={value}
                  onClick={() => handleOptionClick(option.name, value)}
                  disabled={!isAvailable}
                  className={`rounded-full border px-4 py-1.5 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActive
                      ? 'border-primary bg-primary text-background'
                      : 'border-secondary bg-transparent hover:bg-secondary/50',
                      !isAvailable && 'line-through' // Add a line-through for unavailable options
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}