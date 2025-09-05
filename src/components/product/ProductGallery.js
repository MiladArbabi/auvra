// src/components/product/ProductGallery.js
import Image from 'next/image';

export default function ProductGallery({ title, featuredImage }) {
  return (
    <div>
      {featuredImage?.url ? (
        <Image
          src={featuredImage.url}
          alt={featuredImage.altText || title}
          width={featuredImage.width || 800}
          height={featuredImage.height || 800}
          className="w-full rounded-xl"
        />
      ) : (
        <div className="aspect-square w-full rounded-xl bg-secondary/20" />
      )}
    </div>
  );
}