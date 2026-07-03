import { Card } from '../card';
import { cn } from '../lib/cn';

interface OrderSummaryLine {
  label: string;
  value: string;
  emphasis?: boolean;
}

interface OrderSummaryProps {
  lines: OrderSummaryLine[];
  footer?: string;
  className?: string;
}

export function OrderSummary({ lines, footer, className }: OrderSummaryProps) {
  return (
    <Card className={cn('sticky top-24', className)}>
      <h2 className="font-heading text-lg font-bold">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        {lines.map((line) => (
          <div
            key={line.label}
            className={cn(
              'flex justify-between gap-4',
              line.emphasis && 'border-t border-border pt-3 text-base font-bold',
            )}
          >
            <dt className={line.emphasis ? 'text-foreground' : 'text-muted-foreground'}>
              {line.label}
            </dt>
            <dd className={line.emphasis ? 'text-primary' : ''}>{line.value}</dd>
          </div>
        ))}
      </dl>
      {footer ? <p className="mt-3 text-xs text-muted-foreground">{footer}</p> : null}
    </Card>
  );
}
