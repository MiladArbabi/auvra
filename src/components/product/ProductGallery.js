// src/components/product/ProductGallery.js
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, title, featuredImage }) {
  const [selectedImage, setSelectedImage] = useState(featuredImage);
  const thumbnailImages = [featuredImage, ...images.filter(img => img.url !== featuredImage.url)];

  return (
    <div>
    <div className="aspect-square w-full">
      {selectedImage?.url ? (
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || title}
          width={selectedImage.width || 800}
          height={selectedImage.height || 800}
          className="h-full w-full rounded-xl object-cover"
          priority
        />
      ) : (
        <div className="aspect-square w-full rounded-xl bg-secondary/20" />
      )}
    </div>

    {/* Thumbnails */}
      <ul className="mt-4 flex flex-wrap gap-4">
        {thumbnailImages.map((image) => (
          <li key={image.url} className="h-20 w-20">
            <button
              onClick={() => setSelectedImage(image)}
              className={`h-full w-full rounded-lg transition hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                selectedImage.url === image.url ? 'ring-2 ring-primary' : 'ring-1 ring-secondary'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || `Thumbnail for ${title}`}
                width={80}
                height={80}
                className="h-full w-full rounded-md object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
  </div>
  );
}