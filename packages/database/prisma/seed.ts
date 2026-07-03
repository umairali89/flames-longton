import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { categoryImageUrls, productImageUrls } from './food-images';

const prisma = new PrismaClient();

const categories = [
  { name: 'Pizza', slug: 'pizza', description: 'Stone-baked pizzas with fresh toppings', displayOrder: 1 },
  { name: 'Burgers', slug: 'burgers', description: 'Juicy flame-grilled burgers', displayOrder: 2 },
  { name: 'Kebabs', slug: 'kebabs', description: 'Traditional kebabs and wraps', displayOrder: 3 },
  { name: 'Tandoori', slug: 'tandoori', description: 'Clay oven tandoori specials', displayOrder: 4 },
  { name: 'Curries', slug: 'curries', description: 'Authentic curries with rice or naan', displayOrder: 5 },
  { name: 'Fried Chicken', slug: 'fried-chicken', description: 'Crispy fried chicken pieces', displayOrder: 6 },
  { name: 'Sides', slug: 'sides', description: 'Chips, garlic bread and more', displayOrder: 7 },
  { name: 'Milkshakes', slug: 'milkshakes', description: 'Thick and creamy milkshakes', displayOrder: 8 },
];

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  pricePence: number;
  allergens: string[];
  dietaryTags: string[];
  calories?: number;
  modifiers?: { group: string; options: { name: string; pricePence: number; isDefault?: boolean }[] }[];
};

const productsByCategory: Record<string, ProductSeed[]> = {
  pizza: [
    { name: 'Margherita', slug: 'margherita', description: 'Tomato, mozzarella, oregano', pricePence: 799, allergens: ['gluten', 'milk'], dietaryTags: ['vegetarian'], calories: 850,
      modifiers: [{ group: 'Size', options: [{ name: '9"', pricePence: 0, isDefault: true }, { name: '12"', pricePence: 300 }] }] },
    { name: 'Pepperoni Passion', slug: 'pepperoni-passion', description: 'Double pepperoni, mozzarella', pricePence: 999, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 1100 },
    { name: 'Chicken Tikka Pizza', slug: 'chicken-tikka-pizza', description: 'Tikka chicken, peppers, onion', pricePence: 1099, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 1050 },
    { name: 'Veggie Supreme', slug: 'veggie-supreme', description: 'Mushrooms, peppers, sweetcorn, onion', pricePence: 949, allergens: ['gluten', 'milk'], dietaryTags: ['vegetarian'], calories: 900 },
    { name: 'Meat Feast', slug: 'meat-feast', description: 'Pepperoni, ham, beef, chicken', pricePence: 1199, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 1250 },
  ],
  burgers: [
    { name: 'Classic Beef Burger', slug: 'classic-beef-burger', description: '6oz beef patty, lettuce, tomato', pricePence: 699, allergens: ['gluten', 'eggs', 'milk'], dietaryTags: ['halal'], calories: 650 },
    { name: 'Chicken Burger', slug: 'chicken-burger', description: 'Crispy chicken fillet, mayo', pricePence: 649, allergens: ['gluten', 'eggs'], dietaryTags: ['halal'], calories: 580 },
    { name: 'Double Cheese Burger', slug: 'double-cheese-burger', description: 'Two patties, double cheese', pricePence: 899, allergens: ['gluten', 'milk', 'eggs'], dietaryTags: ['halal'], calories: 820 },
    { name: 'Veggie Burger', slug: 'veggie-burger', description: 'Plant-based patty, salad', pricePence: 599, allergens: ['gluten', 'soya'], dietaryTags: ['vegetarian', 'vegan'], calories: 420 },
    { name: 'Flames Special Burger', slug: 'flames-special-burger', description: 'Beef, hash brown, cheese, BBQ sauce', pricePence: 949, allergens: ['gluten', 'milk', 'eggs'], dietaryTags: ['halal'], calories: 950 },
  ],
  kebabs: [
    { name: 'Chicken Doner Kebab', slug: 'chicken-doner-kebab', description: 'Served with salad and sauce', pricePence: 749, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 720 },
    { name: 'Mixed Doner Kebab', slug: 'mixed-doner-kebab', description: 'Chicken and lamb doner', pricePence: 849, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 800 },
    { name: 'Chicken Shish Kebab', slug: 'chicken-shish-kebab', description: 'Marinated chicken cubes', pricePence: 899, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 680 },
    { name: 'Lamb Shish Kebab', slug: 'lamb-shish-kebab', description: 'Tender lamb cubes', pricePence: 999, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 750 },
    { name: 'Doner Wrap', slug: 'doner-wrap', description: 'Doner meat in tortilla wrap', pricePence: 699, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 620 },
  ],
  tandoori: [
    { name: 'Chicken Tikka', slug: 'chicken-tikka', description: 'Marinated chicken breast', pricePence: 899, allergens: ['milk'], dietaryTags: ['halal'], calories: 450 },
    { name: 'Lamb Tikka', slug: 'lamb-tikka', description: 'Tender lamb pieces', pricePence: 999, allergens: ['milk'], dietaryTags: ['halal'], calories: 520 },
    { name: 'Tandoori Mixed Grill', slug: 'tandoori-mixed-grill', description: 'Selection of tandoori meats', pricePence: 1299, allergens: ['milk'], dietaryTags: ['halal'], calories: 900 },
    { name: 'Tandoori Chicken Wings', slug: 'tandoori-chicken-wings', description: 'Spicy tandoori wings (6 pcs)', pricePence: 599, allergens: ['milk'], dietaryTags: ['halal'], calories: 480 },
    { name: 'Paneer Tikka', slug: 'paneer-tikka', description: 'Grilled cottage cheese', pricePence: 799, allergens: ['milk'], dietaryTags: ['vegetarian'], calories: 380 },
  ],
  curries: [
    { name: 'Chicken Tikka Masala', slug: 'chicken-tikka-masala', description: 'Creamy tomato curry', pricePence: 899, allergens: ['milk', 'nuts'], dietaryTags: ['halal'], calories: 650 },
    { name: 'Lamb Rogan Josh', slug: 'lamb-rogan-josh', description: 'Aromatic lamb curry', pricePence: 999, allergens: ['milk'], dietaryTags: ['halal'], calories: 700 },
    { name: 'Chicken Balti', slug: 'chicken-balti', description: 'Medium spiced balti', pricePence: 849, allergens: [], dietaryTags: ['halal'], calories: 580 },
    { name: 'Vegetable Korma', slug: 'vegetable-korma', description: 'Mild creamy vegetable curry', pricePence: 749, allergens: ['milk', 'nuts'], dietaryTags: ['vegetarian'], calories: 520 },
    { name: 'Prawn Bhuna', slug: 'prawn-bhuna', description: 'Thick prawn curry', pricePence: 1099, allergens: ['crustaceans'], dietaryTags: [], calories: 480 },
  ],
  'fried-chicken': [
    { name: 'Fried Chicken (2 pcs)', slug: 'fried-chicken-2', description: 'Crispy southern fried', pricePence: 399, allergens: ['gluten', 'eggs'], dietaryTags: ['halal'], calories: 380 },
    { name: 'Fried Chicken (4 pcs)', slug: 'fried-chicken-4', description: 'Crispy southern fried', pricePence: 699, allergens: ['gluten', 'eggs'], dietaryTags: ['halal'], calories: 760 },
    { name: 'Chicken Strips (5 pcs)', slug: 'chicken-strips', description: 'Tender chicken strips', pricePence: 549, allergens: ['gluten', 'eggs'], dietaryTags: ['halal'], calories: 420 },
    { name: 'Spicy Wings (6 pcs)', slug: 'spicy-wings', description: 'Hot buffalo wings', pricePence: 599, allergens: ['gluten', 'milk'], dietaryTags: ['halal'], calories: 500 },
    { name: 'Chicken Bucket (8 pcs)', slug: 'chicken-bucket', description: 'Family bucket with dips', pricePence: 1299, allergens: ['gluten', 'eggs', 'milk'], dietaryTags: ['halal'], calories: 1520 },
  ],
  sides: [
    { name: 'Chips', slug: 'chips', description: 'Classic skinny chips', pricePence: 249, allergens: [], dietaryTags: ['vegan'], calories: 320 },
    { name: 'Cheesy Chips', slug: 'cheesy-chips', description: 'Chips topped with cheese', pricePence: 349, allergens: ['milk'], dietaryTags: ['vegetarian'], calories: 450 },
    { name: 'Garlic Bread (4 pcs)', slug: 'garlic-bread', description: 'Toasted garlic bread', pricePence: 299, allergens: ['gluten', 'milk'], dietaryTags: ['vegetarian'], calories: 280 },
    { name: 'Onion Rings (10 pcs)', slug: 'onion-rings', description: 'Crispy battered rings', pricePence: 299, allergens: ['gluten', 'eggs'], dietaryTags: ['vegetarian'], calories: 350 },
    { name: 'Coleslaw', slug: 'coleslaw', description: 'Creamy coleslaw pot', pricePence: 199, allergens: ['eggs', 'mustard'], dietaryTags: ['vegetarian'], calories: 150 },
  ],
  milkshakes: [
    { name: 'Vanilla Milkshake', slug: 'vanilla-milkshake', description: 'Classic vanilla', pricePence: 349, allergens: ['milk'], dietaryTags: ['vegetarian'], calories: 420 },
    { name: 'Chocolate Milkshake', slug: 'chocolate-milkshake', description: 'Rich chocolate', pricePence: 349, allergens: ['milk'], dietaryTags: ['vegetarian'], calories: 480 },
    { name: 'Strawberry Milkshake', slug: 'strawberry-milkshake', description: 'Fresh strawberry', pricePence: 349, allergens: ['milk'], dietaryTags: ['vegetarian'], calories: 440 },
    { name: 'Oreo Milkshake', slug: 'oreo-milkshake', description: 'Blended Oreo cookies', pricePence: 399, allergens: ['gluten', 'milk', 'soya'], dietaryTags: ['vegetarian'], calories: 550 },
    { name: 'Banana Milkshake', slug: 'banana-milkshake', description: 'Creamy banana', pricePence: 349, allergens: ['milk'], dietaryTags: ['vegetarian'], calories: 400 },
  ],
};

const deliveryZones = [
  { name: 'Longton', postcodePrefixes: ['ST3 1', 'ST3 2', 'ST3 4', 'ST3 5'], deliveryFeePence: 199, minOrderPence: 1000, estimatedMinutes: 30 },
  { name: 'Normacot', postcodePrefixes: ['ST3 3', 'ST3 7'], deliveryFeePence: 249, minOrderPence: 1200, estimatedMinutes: 35 },
  { name: 'Blurton', postcodePrefixes: ['ST3 3'], deliveryFeePence: 249, minOrderPence: 1200, estimatedMinutes: 35 },
  { name: 'Meir', postcodePrefixes: ['ST3 5', 'ST3 6', 'ST3 7'], deliveryFeePence: 299, minOrderPence: 1500, estimatedMinutes: 40 },
  { name: 'Fenton', postcodePrefixes: ['ST4 2', 'ST4 3', 'ST4 4'], deliveryFeePence: 349, minOrderPence: 1500, estimatedMinutes: 45 },
  { name: 'Dresden', postcodePrefixes: ['ST3 4'], deliveryFeePence: 249, minOrderPence: 1200, estimatedMinutes: 35 },
];

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@flameslongton.local' },
    update: {},
    create: {
      email: 'admin@flameslongton.local',
      passwordHash,
      role: UserRole.admin,
      phone: '01782200000',
    },
  });

  for (const zone of deliveryZones) {
    const existing = await prisma.deliveryZone.findFirst({ where: { name: zone.name } });
    if (!existing) {
      await prisma.deliveryZone.create({
        data: {
          name: zone.name,
          postcodePrefixes: zone.postcodePrefixes,
          deliveryFeePence: zone.deliveryFeePence,
          minOrderPence: zone.minOrderPence,
          estimatedMinutes: zone.estimatedMinutes,
        },
      });
    }
  }

  for (const cat of categories) {
    const categoryImageUrl = categoryImageUrls[cat.slug];
    const category = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
        imageUrl: categoryImageUrl,
      },
      create: { ...cat, imageUrl: categoryImageUrl },
    });

    const products = productsByCategory[cat.slug] || [];
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          description: p.description,
          pricePence: p.pricePence,
          allergens: p.allergens,
          dietaryTags: p.dietaryTags,
          calories: p.calories,
          sortOrder: i,
          imageUrl: productImageUrls[p.slug],
        },
        create: {
          categoryId: category.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          pricePence: p.pricePence,
          allergens: p.allergens,
          dietaryTags: p.dietaryTags,
          calories: p.calories,
          sortOrder: i,
          imageUrl: productImageUrls[p.slug],
        },
      });

      if (p.modifiers) {
        for (let gi = 0; gi < p.modifiers.length; gi++) {
          const mg = p.modifiers[gi];
          const existingGroup = await prisma.modifierGroup.findFirst({
            where: { productId: product.id, name: mg.group },
          });
          const group =
            existingGroup ||
            (await prisma.modifierGroup.create({
              data: {
                productId: product.id,
                name: mg.group,
                minSelect: 1,
                maxSelect: 1,
                required: true,
                sortOrder: gi,
              },
            }));

          for (let mi = 0; mi < mg.options.length; mi++) {
            const opt = mg.options[mi];
            const existingMod = await prisma.productModifier.findFirst({
              where: { groupId: group.id, name: opt.name },
            });
            if (!existingMod) {
              await prisma.productModifier.create({
                data: {
                  groupId: group.id,
                  name: opt.name,
                  pricePence: opt.pricePence,
                  isDefault: opt.isDefault ?? false,
                  sortOrder: mi,
                },
              });
            }
          }
        }
      }
    }
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
