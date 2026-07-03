import Link from 'next/link';
import { Badge } from '../badge';
import { cn } from '../lib/cn';

export interface FilterChip {
  id: string;
  label: string;
  href: string;
  active?: boolean;
}

interface FilterChipsProps {
  label?: string;
  chips: FilterChip[];
  className?: string;
}

export function FilterChips({ label, chips, className }: FilterChipsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {label ? <span className="mr-1 text-sm font-medium text-muted-foreground">{label}</span> : null}
      {chips.map((chip) => (
        <Link key={chip.id} href={chip.href} className="no-underline">
          <Badge
            variant={chip.active ? 'primary' : 'outline'}
            className="cursor-pointer px-3 py-1.5 text-sm transition-transform hover:scale-[1.02]"
          >
            {chip.label}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
