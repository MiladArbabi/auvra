// src/components/layout/AnnouncementBar.js
'use client';

import { useState, useEffect } from 'react';

// Define the messages to be displayed
const messages = [
  'Free shipping for orders above 500 kr',
  'Discover our new summer collection',
  'Sign up and get 10% off your first order',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // This effect will run on the client and cycle through the messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    // Clean up the interval when the component is removed
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-foreground text-background text-center text-sm font-medium p-2">
      {/* We use the index as a key to trigger the fade animation on change */}
      <p
        key={currentIndex}
        className="animate-fade-in" // We'll define this animation in theme.css
      >
        {messages[currentIndex]}
      </p>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 right-4 -translate-y-1/2"
        aria-label="Dismiss announcement"
      >
        {/* Simple SVG for the 'X' icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}