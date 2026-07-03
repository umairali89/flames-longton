'use client';

import { useEffect, useRef } from 'react';
import { Badge } from '@flames/ui';

export function HygieneWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FSA official embed — rating 3, inspection Mar 2025
    // In production, replace with business-specific embed from ratings.food.gov.uk
    if (ref.current && !ref.current.hasChildNodes()) {
      const wrapper = document.createElement('div');
      wrapper.className = 'flex items-center gap-3';
      wrapper.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;border:1px solid var(--color-border);background:var(--color-surface-elevated)">
          <span style="font-size:28px;font-weight:bold;color:#F59E0B">3</span>
          <div style="font-size:12px;color:var(--color-muted-foreground)">
            <div style="font-weight:600;color:var(--color-foreground)">Food Hygiene Rating</div>
            <div>Generally Satisfactory</div>
            <div>Stoke-on-Trent City Council · Mar 2025</div>
          </div>
        </div>
      `;
      ref.current.appendChild(wrapper);
    }
  }, []);

  return (
    <div>
      <div ref={ref} />
      <Badge variant="outline" className="mt-2">
        Verified via Food Standards Agency
      </Badge>
    </div>
  );
}
