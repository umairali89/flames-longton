import { Card, CardTitle, CardDescription } from '../card';

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  features: Feature[];
}

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <div className="text-center">
      <h2 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-balance">{subtitle}</p>
      ) : null}
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="text-left">
            {feature.icon ? (
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-xl" aria-hidden>
                {feature.icon}
              </span>
            ) : null}
            <CardTitle className="text-base">{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
