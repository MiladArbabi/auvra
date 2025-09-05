// src/components/ui/Button.js
import Link from 'next/link';

// Using clsx utility for conditional classes is a good practice,
// but for now, we'll keep it simple.
// You might consider `npm install clsx` later.

export default function Button({
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary text-background hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-foreground hover:bg-secondary/90 focus:ring-secondary',
    accent: 'bg-accent text-background hover:bg-accent/90 focus:ring-accent',
    ghost: 'bg-transparent text-foreground hover:bg-secondary/50',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}