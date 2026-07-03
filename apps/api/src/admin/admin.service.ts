import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@flames/database';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutService } from '../checkout/checkout.service';
import { formatProduct } from '../common/format-product';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private checkoutService: CheckoutService,
  ) {}

  async getOrders(status?: OrderStatus) {
    const orders = await this.prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { items: true, user: { select: { email: true, phone: true } } },
      take: 50,
    });
    return orders.map((o) => ({
      ...this.checkoutService.formatOrder(o),
      customerEmail: o.guestEmail || o.user?.email,
      customerPhone: o.user?.phone,
    }));
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return this.checkoutService.formatOrder(updated);
  }

  async getProducts() {
    const products = await this.prisma.product.findMany({
      orderBy: [{ category: { displayOrder: 'asc' } }, { sortOrder: 'asc' }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        modifierGroups: { include: { modifiers: true } },
      },
    });
    return products.map(formatProduct);
  }

  async toggleProductAvailability(id: string, isAvailable: boolean) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { isAvailable },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        modifierGroups: { include: { modifiers: true } },
      },
    });
    return formatProduct(product);
  }
}
