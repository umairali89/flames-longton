import { cn } from '../lib/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'accent';
  id?: string;
}

const variants = {
  default: '',
  muted: 'border-t border-border bg-surface',
  accent: 'border-t border-border bg-gradient-to-b from-primary/5 to-transparent',
};

export function Section({ children, className, variant = 'default', id }: SectionProps) {
  return (
    <section id={id} className={cn(variants[variant], className)}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">{children}</div>
    </section>
  );
}
