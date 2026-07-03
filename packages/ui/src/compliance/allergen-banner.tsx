import { ALLERGEN_LABELS, type FsaAllergen } from '@flames/shared';
import { Badge } from '../badge';
import { Card } from '../card';

interface AllergenBannerProps {
  allergens: string[];
  title?: string;
}

export function AllergenBanner({ allergens, title = 'Allergen information' }: AllergenBannerProps) {
  if (!allergens.length) {
    return (
      <Card className="border-success/30 bg-success/5">
        <p className="text-sm text-success">No major allergens listed for this item.</p>
      </Card>
    );
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Contains or may contain the following allergens (FSA 14):
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {allergens.map((a) => (
          <Badge key={a} variant="warning">
            {ALLERGEN_LABELS[a as FsaAllergen] || a}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
