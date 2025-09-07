// src/components/product/RelatedProducts.js
import ProductCard from '@/components/product/ProductCard';

export default function RelatedProducts({ products, locale }) {
  // Don't render the section if there are no recommended products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight">You Might Also Like</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.handle} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}