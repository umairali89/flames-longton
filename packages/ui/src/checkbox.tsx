'use client';

import { cn } from './lib/cn';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const inputId = id || `checkbox-${Math.random().toString(36).slice(2)}`;
  return (
    <label
      htmlFor={inputId}
      className={cn('flex cursor-pointer gap-3 rounded-lg border border-border bg-surface p-4', className)}
    >
      <input
        id={inputId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
        {...props}
      />
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
