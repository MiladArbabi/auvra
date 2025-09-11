// src/components/cards/InfoCard.js
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function InfoCard({
  headline,
  text,
  backgroundColor = 'bg-subtle', // Default to our subtle off-white
  backgroundImage, // Optional: { url, alt }
  cta, // Optional: { href, text }
  size = 'medium',
  borderRadius = 'rounded-xl',
}) {

    // Define styles for different sizes
  const sizeStyles = {
    medium: {
      height: 'aspect-[4/3]',
      headline: 'text-3xl',
    },
    hero: {
      height: 'h-[50vh]', // Set height to 75% of the viewport height
      headline: 'text-4xl md:text-6xl',
    },
  };

  const currentStyle = sizeStyles[size] || sizeStyles.medium;

  return (
    <div className={`relative flex w-full items-end overflow-hidden ${borderRadius} p-8 md:p-12 ${backgroundColor} ${currentStyle.height}`}>      
    {/* Background Image (renders if provided) */}
      {backgroundImage && (
        <Image
          src={backgroundImage.url}
          alt={backgroundImage.alt}
          fill
          className="object-cover"
        />
      )}
      
      {/* Optional overlay for better text readability on images */}
      {backgroundImage && <div className="absolute inset-0 bg-black/40" />}

      {/* Content */}
      <div className="relative z-10 w-full text-background">
        <h2 className={`${currentStyle.headline} font-extrabold capitalize tracking-wider`}>
          {headline}
        </h2>
        {text && <p className="mt-2 max-w-sm">{text}</p>}
        {cta && (
          <Button
            href={cta.href}
            variant="primary"
            className="mt-6"
          >
            {cta.text}
          </Button>
        )}
      </div>
    </div>
  );
}