'use client';

import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Card } from '../card';

const CONSENT_KEY = 'flames-cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = (essentialOnly: boolean) => {
    localStorage.setItem(CONSENT_KEY, essentialOnly ? 'essential' : 'all');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-16 z-[100] p-4 animate-slide-up md:bottom-0"
      role="dialog"
      aria-label="Cookie consent"
    >
      <Card className="mx-auto max-w-2xl border-primary/20 bg-surface-elevated/95 backdrop-blur-xl">
        <p className="font-heading text-base font-bold">We use cookies</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Essential cookies are required for ordering. Analytics cookies help us improve your
          experience — you can opt in or accept essential only (UK PECR compliant).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => accept(false)}>
            Accept all
          </Button>
          <Button variant="outline" size="sm" onClick={() => accept(true)}>
            Essential only
          </Button>
        </div>
      </Card>
    </div>
  );
}
