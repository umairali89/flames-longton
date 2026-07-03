import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CART_TTL, getCartKey } from '../common/cart-key';
import { formatPricePence } from '@flames/shared';

export interface CartItem {
  productId: string;
  quantity: number;
  modifierIds: string[];
}

export interface ResolvedCartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPricePence: number;
  lineTotalPence: number;
  displayPrice: string;
  allergens: string[];
  modifiers: { id: string; name: string; pricePence: number }[];
}

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getCart(userId?: string, guestSessionId?: string) {
    const key = getCartKey(userId, guestSessionId);
    const raw = await this.redis.get(key);
    const items: CartItem[] = raw ? JSON.parse(raw) : [];
    return this.resolveCart(items);
  }

  async addItem(
    item: CartItem,
    userId?: string,
    guestSessionId?: string,
  ) {
    const key = getCartKey(userId, guestSessionId);
    const raw = await this.redis.get(key);
    const items: CartItem[] = raw ? JSON.parse(raw) : [];

    const existing = items.find(
      (i) =>
        i.productId === item.productId &&
        JSON.stringify(i.modifierIds.sort()) === JSON.stringify(item.modifierIds.sort()),
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }

    await this.redis.set(key, JSON.stringify(items), CART_TTL);
    return this.resolveCart(items);
  }

  async updateItem(
    productId: string,
    modifierIds: string[],
    quantity: number,
    userId?: string,
    guestSessionId?: string,
  ) {
    const key = getCartKey(userId, guestSessionId);
    const raw = await this.redis.get(key);
    let items: CartItem[] = raw ? JSON.parse(raw) : [];

    if (quantity <= 0) {
      items = items.filter(
        (i) =>
          !(
            i.productId === productId &&
            JSON.stringify(i.modifierIds.sort()) === JSON.stringify(modifierIds.sort())
          ),
      );
    } else {
      const item = items.find(
        (i) =>
          i.productId === productId &&
          JSON.stringify(i.modifierIds.sort()) === JSON.stringify(modifierIds.sort()),
      );
      if (!item) throw new NotFoundException('Cart item not found');
      item.quantity = quantity;
    }

    await this.redis.set(key, JSON.stringify(items), CART_TTL);
    return this.resolveCart(items);
  }

  async clearCart(userId?: string, guestSessionId?: string) {
    const key = getCartKey(userId, guestSessionId);
    await this.redis.del(key);
    return { items: [], subtotalPence: 0, displaySubtotal: formatPricePence(0) };
  }

  async resolveCart(items: CartItem[]) {
    const resolved: ResolvedCartItem[] = [];
    let subtotalPence = 0;

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          modifierGroups: { include: { modifiers: true } },
        },
      });
      if (!product || !product.isAvailable) {
        throw new BadRequestException(`Product ${item.productId} is unavailable`);
      }

      const allModifiers = product.modifierGroups.flatMap((g) => g.modifiers);
      const selectedMods = allModifiers.filter((m) => item.modifierIds.includes(m.id));
      const modifierTotal = selectedMods.reduce((sum, m) => sum + m.pricePence, 0);
      const unitPricePence = product.pricePence + modifierTotal;
      const lineTotalPence = unitPricePence * item.quantity;
      subtotalPence += lineTotalPence;

      resolved.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPricePence,
        lineTotalPence,
        displayPrice: formatPricePence(lineTotalPence),
        allergens: product.allergens as string[],
        modifiers: selectedMods.map((m) => ({
          id: m.id,
          name: m.name,
          pricePence: m.pricePence,
        })),
      });
    }

    return {
      items: resolved,
      subtotalPence,
      displaySubtotal: formatPricePence(subtotalPence),
    };
  }

  async getRawItems(userId?: string, guestSessionId?: string): Promise<CartItem[]> {
    const key = getCartKey(userId, guestSessionId);
    const raw = await this.redis.get(key);
    return raw ? JSON.parse(raw) : [];
  }
}
