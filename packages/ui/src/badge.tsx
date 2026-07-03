import { cn } from './lib/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'outline' | 'dietary';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/15 text-primary border border-primary/30',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  outline: 'border border-border text-muted-foreground',
  dietary: 'bg-accent/15 text-accent border border-accent/25',
};

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
