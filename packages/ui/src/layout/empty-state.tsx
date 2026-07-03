import { Button } from '../button';
import { ButtonLink } from '../button-link';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <span className="mb-4 text-5xl opacity-60" aria-hidden>
        🍽️
      </span>
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      {description ? <p className="mt-2 max-w-sm text-muted-foreground">{description}</p> : null}
      {actionLabel && actionHref ? (
        <ButtonLink href={actionHref} size="lg" className="mt-6">
          {actionLabel}
        </ButtonLink>
      ) : null}
      {actionLabel && onAction ? (
        <Button size="lg" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
