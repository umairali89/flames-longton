import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutService } from '../checkout/checkout.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private checkoutService: CheckoutService,
  ) {}

  async getOrder(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (userId && order.userId && order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }
    return this.checkoutService.formatOrder(order);
  }

  async getOrdersForUser(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      take: 20,
    });
    return orders.map((o) => this.checkoutService.formatOrder(o));
  }
}
