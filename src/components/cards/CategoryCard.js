// src/components/cards/CategoryCard.js
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function CategoryCard({ collection }) {
  const locale = useLocale();
  const { title, handle, image } = collection;

  return (
    <Link
      href={`/${locale}/collections/${handle}`}
      className="group flex flex-col overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-secondary/20">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            className="rounded-t-lg object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      
      {/* Title Container */}
      <div className="border-t auvra-border bg-background p-4">
        <h3 className="text-center font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h3>
      </div>
    </Link>
  );
}