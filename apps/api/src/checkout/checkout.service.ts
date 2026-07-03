import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { DeliveryZoneService } from './delivery-zone.service';
import { formatPricePence } from '@flames/shared';
import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '@flames/database';

@Injectable()
export class CheckoutService {
  private stripe: Stripe | null = null;

  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private deliveryZone: DeliveryZoneService,
    private config: ConfigService,
  ) {
    this.initStripe();
  }

  private initStripe() {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = key ? new Stripe(key) : null;
  }

  async quote(
    orderType: 'delivery' | 'collection',
    items: { productId: string; quantity: number; modifierIds?: string[] }[],
    postcode?: string,
  ) {
    const cart = await this.cartService.resolveCart(
      items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        modifierIds: i.modifierIds || [],
      })),
    );

    let deliveryFeePence = 0;
    let estimatedMinutes = 20;
    let minOrderPence = 0;
    let zoneName: string | null = null;

    if (orderType === 'delivery') {
      if (!postcode) throw new BadRequestException('Postcode required for delivery');
      const zone = await this.deliveryZone.findZone(postcode);
      deliveryFeePence = zone.deliveryFeePence;
      estimatedMinutes = zone.estimatedMinutes;
      minOrderPence = zone.minOrderPence;
      zoneName = zone.name;

      if (cart.subtotalPence < minOrderPence) {
        throw new BadRequestException(
          `Minimum order for ${zone.name} is ${formatPricePence(minOrderPence)}`,
        );
      }
    }

    const serviceChargePence = 0;
    const discountPence = 0;
    const totalPence = cart.subtotalPence + deliveryFeePence + serviceChargePence - discountPence;

    return {
      subtotalPence: cart.subtotalPence,
      deliveryFeePence,
      serviceChargePence,
      discountPence,
      totalPence,
      displaySubtotal: formatPricePence(cart.subtotalPence),
      displayDeliveryFee: formatPricePence(deliveryFeePence),
      displayTotal: formatPricePence(totalPence),
      estimatedMinutes,
      zoneName,
      minOrderPence,
      items: cart.items,
    };
  }

  async createOrder(
    data: {
      orderType: 'delivery' | 'collection';
      paymentMethod: 'card' | 'cash';
      guestEmail?: string;
      allergenAcknowledged: boolean;
      deliveryAddress?: { line1: string; line2?: string; city: string; postcode: string };
      items: { productId: string; quantity: number; modifierIds?: string[] }[];
    },
    userId?: string,
    guestSessionId?: string,
  ) {
    if (!data.allergenAcknowledged) {
      throw new BadRequestException('You must acknowledge allergen information before ordering');
    }

    const quote = await this.quote(
      data.orderType,
      data.items,
      data.deliveryAddress?.postcode,
    );

    if (data.orderType === 'delivery' && !data.deliveryAddress) {
      throw new BadRequestException('Delivery address required');
    }

    const orderNumber = `FL${Date.now().toString(36).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        guestEmail: data.guestEmail,
        guestSessionId,
        type: data.orderType === 'delivery' ? OrderType.delivery : OrderType.collection,
        status: OrderStatus.received,
        subtotalPence: quote.subtotalPence,
        deliveryFeePence: quote.deliveryFeePence,
        serviceChargePence: quote.serviceChargePence,
        discountPence: quote.discountPence,
        totalPence: quote.totalPence,
        paymentMethod: data.paymentMethod === 'card' ? PaymentMethod.card : PaymentMethod.cash,
        paymentStatus:
          data.paymentMethod === 'cash' ? PaymentStatus.pending : PaymentStatus.pending,
        deliveryAddress: data.deliveryAddress || undefined,
        allergenAcknowledgedAt: new Date(),
        items: {
          create: quote.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            unitPricePence: item.unitPricePence,
            modifiers: item.modifiers,
            allergens: item.allergens,
          })),
        },
      },
      include: { items: true },
    });

    await this.cartService.clearCart(userId, guestSessionId);

    let clientSecret: string | null = null;
    if (data.paymentMethod === 'card') {
      if (!this.stripe) {
        throw new BadRequestException(
          'Card payments are not configured. Add STRIPE_SECRET_KEY to .env and restart the API.',
        );
      }
      const intent = await this.stripe.paymentIntents.create({
        amount: order.totalPence,
        currency: 'gbp',
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
        automatic_payment_methods: { enabled: true },
      });
      await this.prisma.order.update({
        where: { id: order.id },
        data: { stripePaymentIntentId: intent.id },
      });
      clientSecret = intent.client_secret;
    }

    console.log(`[ORDER] New order ${order.orderNumber} — ${formatPricePence(order.totalPence)}`);

    return {
      order: this.formatOrder(order),
      clientSecret,
    };
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new BadRequestException('Stripe not configured');
    }

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;
      if (orderId) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: PaymentStatus.paid },
        });
      }
    }

    return { received: true };
  }

  formatOrder(order: {
    id: string;
    orderNumber: string;
    type: OrderType;
    status: OrderStatus;
    subtotalPence: number;
    deliveryFeePence: number;
    totalPence: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    deliveryAddress: unknown;
    allergenAcknowledgedAt: Date | null;
    createdAt: Date;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPricePence: number;
      modifiers: unknown;
      allergens: unknown;
    }>;
  }) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      type: order.type,
      status: order.status,
      subtotalPence: order.subtotalPence,
      deliveryFeePence: order.deliveryFeePence,
      totalPence: order.totalPence,
      displayTotal: formatPricePence(order.totalPence),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryAddress: order.deliveryAddress,
      allergenAcknowledgedAt: order.allergenAcknowledgedAt,
      createdAt: order.createdAt,
      items: order.items.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unitPricePence: i.unitPricePence,
        displayPrice: formatPricePence(i.unitPricePence * i.quantity),
        modifiers: i.modifiers,
        allergens: i.allergens,
      })),
    };
  }
}
