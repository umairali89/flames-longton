import { cn } from '../lib/cn';

const STEPS = ['Details', 'Review', 'Payment'] as const;

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Checkout progress">
      {STEPS.map((label, index) => {
        const stepNum = index + 1;
        const active = currentStep === stepNum;
        const complete = currentStep > stepNum;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  complete && 'bg-primary text-primary-foreground',
                  active && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  !active && !complete && 'bg-muted text-muted-foreground',
                )}
                aria-current={active ? 'step' : undefined}
              >
                {complete ? '✓' : stepNum}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:block',
                  active || complete ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={cn(
                  'mb-5 hidden h-0.5 flex-1 sm:block',
                  complete ? 'bg-primary' : 'bg-muted',
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
