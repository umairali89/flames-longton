import Link from 'next/link';
import { buttonStyles, type ButtonSize, type ButtonVariant } from './button';
import { cn } from './lib/cn';

interface ButtonLinkProps extends Omit<React.ComponentProps<typeof Link>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Styled Next.js link — use instead of wrapping `<Button>` in `<Link>`. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
