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

  // This effect will run on the client and cycle through the messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    // Clean up the interval when the component is removed
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-foreground text-background text-center text-sm font-medium py-0.5">
      {/* We use the index as a key to trigger the fade animation on change */}
      <p
        key={currentIndex}
        className="animate-fade-in" // We'll define this animation in theme.css
      >
        {messages[currentIndex]}
      </p>
    </div>
  );
}