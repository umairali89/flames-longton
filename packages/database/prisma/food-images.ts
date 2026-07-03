/** Local food photos served from apps/web/public/images/menu — swap for S3/CDN in production. */
const category = (slug: string) => `/images/menu/categories/${slug}.jpg`;
const product = (slug: string) => `/images/menu/${slug}.jpg`;

export const categoryImageUrls: Record<string, string> = {
  pizza: category('pizza'),
  burgers: category('burgers'),
  kebabs: category('kebabs'),
  tandoori: category('tandoori'),
  curries: category('curries'),
  'fried-chicken': category('fried-chicken'),
  sides: category('sides'),
  milkshakes: category('milkshakes'),
};

export const productImageUrls: Record<string, string> = {
  margherita: product('margherita'),
  'pepperoni-passion': product('pepperoni-passion'),
  'chicken-tikka-pizza': product('chicken-tikka-pizza'),
  'veggie-supreme': product('veggie-supreme'),
  'meat-feast': product('meat-feast'),

  'classic-beef-burger': product('classic-beef-burger'),
  'chicken-burger': product('chicken-burger'),
  'double-cheese-burger': product('double-cheese-burger'),
  'veggie-burger': product('veggie-burger'),
  'flames-special-burger': product('flames-special-burger'),

  'chicken-doner-kebab': product('chicken-doner-kebab'),
  'mixed-doner-kebab': product('mixed-doner-kebab'),
  'chicken-shish-kebab': product('chicken-shish-kebab'),
  'lamb-shish-kebab': product('lamb-shish-kebab'),
  'doner-wrap': product('doner-wrap'),

  'chicken-tikka': product('chicken-tikka'),
  'lamb-tikka': product('lamb-tikka'),
  'tandoori-mixed-grill': product('tandoori-mixed-grill'),
  'tandoori-chicken-wings': product('tandoori-chicken-wings'),
  'paneer-tikka': product('paneer-tikka'),

  'chicken-tikka-masala': product('chicken-tikka-masala'),
  'lamb-rogan-josh': product('lamb-rogan-josh'),
  'chicken-balti': product('chicken-balti'),
  'vegetable-korma': product('vegetable-korma'),
  'prawn-bhuna': product('prawn-bhuna'),

  'fried-chicken-2': product('fried-chicken-2'),
  'fried-chicken-4': product('fried-chicken-4'),
  'chicken-strips': product('chicken-strips'),
  'spicy-wings': product('spicy-wings'),
  'chicken-bucket': product('chicken-bucket'),

  chips: product('chips'),
  'cheesy-chips': product('cheesy-chips'),
  'garlic-bread': product('garlic-bread'),
  'onion-rings': product('onion-rings'),
  coleslaw: product('coleslaw'),

  'vanilla-milkshake': product('vanilla-milkshake'),
  'chocolate-milkshake': product('chocolate-milkshake'),
  'strawberry-milkshake': product('strawberry-milkshake'),
  'oreo-milkshake': product('oreo-milkshake'),
  'banana-milkshake': product('banana-milkshake'),
};

export const heroFoodImages = [
  '/images/menu/hero/pizza.jpg',
  '/images/menu/hero/burger.jpg',
  '/images/menu/hero/curry.jpg',
];

export function getProductImageUrl(slug: string, categorySlug?: string): string | undefined {
  return productImageUrls[slug] ?? (categorySlug ? categoryImageUrls[categorySlug] : undefined);
}
