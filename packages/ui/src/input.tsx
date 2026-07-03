import { cn } from './lib/cn';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-lg border border-border bg-surface-elevated px-4 py-2',
        'text-sm text-foreground placeholder:text-muted-foreground',
        'transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-lg border border-border bg-surface-elevated px-4 py-3',
        'text-sm text-foreground placeholder:text-muted-foreground',
        'transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
        className,
      )}
      {...props}
    />
  );
}
