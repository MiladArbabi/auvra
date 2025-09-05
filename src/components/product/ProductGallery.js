// src/components/product/ProductGallery.js
import Image from 'next/image';

export default function ProductGallery({ title, featuredImage }) {
  return (
    <div className="aspect-square w-full">
      {featuredImage?.url ? (
        <Image
          src={featuredImage.url}
          alt={featuredImage.altText || title}
          width={featuredImage.width || 800}
          height={featuredImage.height || 800}
          className="h-full w-full rounded-xl object-cover"
        />
      ) : (
        <div className="aspect-square w-full rounded-xl bg-secondary/20" />
      )}
    </div>
  );
}