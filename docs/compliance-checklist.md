# UK Compliance Checklist — Phase 1

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **FSA 14 allergens on every product** | Done | `packages/shared/src/allergens.ts`; stored on products; shown on product page, cart, checkout, confirmation |
| **Allergen acknowledgment at checkout** | Done | Required checkbox; `allergenAcknowledgedAt` on `orders` table |
| **Natasha's Law — pre-order disclosure** | Done | Allergen banner before add-to-cart and at checkout |
| **Nutritional info (calories)** | Done | Optional `calories` on products; displayed when present |
| **DMCC pricing transparency** | Done | `POST /checkout/quote` returns itemised fees before payment; cart shows fee note |
| **No hidden fees** | Done | Delivery fee from `delivery_zones`; shown in quote breakdown |
| **Food Hygiene Rating display** | Done | Footer widget on customer site (rating 3, Mar 2025 inspection) |
| **PECR cookie consent** | Done | `CookieBanner` in `@flames/ui` — essential vs accept all |
| **UK GDPR marketing opt-in** | Partial | Schema has `marketingEmailOptIn` / `marketingSmsOptIn` (default false); registration UI Phase 3 |
| **PCI-DSS** | Done | Stripe Elements — no card data on our servers |
| **Privacy policy page** | Stub | Footer link to `/privacy` (content to add before production) |
| **Fake reviews** | N/A | Reviews deferred to Phase 4 |

## Code locations

- Allergen enums: `packages/shared/src/allergens.ts`
- Checkout acknowledgment: `apps/web/src/app/checkout/checkout-form.tsx`
- Order allergen storage: `packages/database/prisma/schema.prisma` → `Order.allergenAcknowledgedAt`
- Cookie banner: `packages/ui/src/compliance/cookie-banner.tsx`
- Hygiene widget: `apps/web/src/components/hygiene-widget.tsx`
- Price formatting: `packages/shared/src/constants.ts` → `formatPricePence`
