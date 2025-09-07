// src/components/ui/Accordion.js
'use client';

import { useState } from 'react';

// The wrapper component that holds all the items
export function Accordion({ items }) {
  return (
    <div className="w-full divide-y rounded-xl border auvra-border auvra-divide">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}

// The individual accordion item component
export function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-semibold"
      >
        <span>{title}</span>
        {/* Simple SVG arrow that rotates on open/close */}
        <svg
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {/* prose class is great for styling blocks of HTML from Shopify */}
          <div className="prose prose-lg p-4 pt-0 text-foreground/80">{children}</div>
        </div>
      </div>
    </div>
  );
}