import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { formatProduct } from '../common/format-product';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    const categories = await this.prisma.menuCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      productCount: c._count.products,
    }));
  }

  async getProducts(filters?: { category?: string; dietary?: string; search?: string }) {
    const where: Record<string, unknown> = { isAvailable: true };

    if (filters?.category) {
      where.category = { slug: filters.category };
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: [{ category: { displayOrder: 'asc' } }, { sortOrder: 'asc' }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        modifierGroups: {
          orderBy: { sortOrder: 'asc' },
          include: { modifiers: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    });

    let filtered = products;
    if (filters?.dietary) {
      filtered = products.filter((p) => {
        const tags = p.dietaryTags as string[];
        return tags.includes(filters.dietary!);
      });
    }

    return filtered.map(formatProduct);
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        modifierGroups: {
          orderBy: { sortOrder: 'asc' },
          include: { modifiers: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return formatProduct(product);
  }
}
