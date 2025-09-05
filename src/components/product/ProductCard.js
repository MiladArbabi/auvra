// src/components/product/ProductCard.js
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ProductCard({ product, locale }) {
  // Destructure the product properties for easier access
  const { title, featuredImage, priceRange, handle, externalUrl } = product;

  // Construct the URL for the product page
  const productPageUrl = `/${locale}/product/${handle}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-secondary/50 bg-background shadow-sm transition-shadow hover:shadow-md">
      <Link href={externalUrl || productPageUrl} target={externalUrl ? '_blank' : '_self'}>
        <div className="aspect-h-1 aspect-w-1 bg-secondary/20">
          {featuredImage && (
            <Image
              src={featuredImage.url}
              alt={featuredImage.altText || title}
              width={400}
              height={400}
              className="object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-foreground">
          <Link href={externalUrl || productPageUrl} target={externalUrl ? '_blank' : '_self'}>
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </Link>
        </h3>
        <div className="flex flex-1 flex-col items-start justify-end pt-4">
          <p className="text-sm text-foreground/80">
            {priceRange.minVariantPrice.amount} {priceRange.minVariantPrice.currencyCode}
          </p>
          <Button
            href={externalUrl || productPageUrl}
            target={externalUrl ? '_blank' : '_self'}
            variant={externalUrl ? 'secondary' : 'primary'}
            className="mt-2 w-full"
            aria-label={`View details for ${title}`}
          >
            {externalUrl ? 'View on Partner Site' : 'View Details'}
          </Button>
        </div>
      </div>
    </article>
  );
}