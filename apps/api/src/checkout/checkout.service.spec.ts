import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckoutService } from './checkout.service';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { DeliveryZoneService } from './delivery-zone.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  const mockPrisma = {};
  const mockCart = {
    resolveCart: jest.fn().mockResolvedValue({
      items: [{ productId: 'p1', name: 'Test', quantity: 1, unitPricePence: 500, lineTotalPence: 500, displayPrice: '£5.00', allergens: [], modifiers: [] }],
      subtotalPence: 500,
      displaySubtotal: '£5.00',
    }),
  };
  const mockZone = {
    findZone: jest.fn().mockResolvedValue({
      deliveryFeePence: 199,
      minOrderPence: 0,
      estimatedMinutes: 30,
      name: 'Longton',
    }),
  };

  const mockConfig = {
    get: jest.fn((key: string) => (key === 'STRIPE_SECRET_KEY' ? '' : undefined)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CartService, useValue: mockCart },
        { provide: DeliveryZoneService, useValue: mockZone },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get(CheckoutService);
  });

  it('quotes collection with no delivery fee', async () => {
    const quote = await service.quote('collection', [{ productId: 'p1', quantity: 1 }]);
    expect(quote.deliveryFeePence).toBe(0);
    expect(quote.totalPence).toBe(500);
  });

  it('quotes delivery with zone fee', async () => {
    const quote = await service.quote('delivery', [{ productId: 'p1', quantity: 1 }], 'ST3 5LQ');
    expect(quote.deliveryFeePence).toBe(199);
    expect(quote.totalPence).toBe(699);
  });

  it('rejects order without allergen acknowledgment', async () => {
    await expect(
      service.createOrder({
        orderType: 'collection',
        paymentMethod: 'cash',
        allergenAcknowledged: false as unknown as true,
        items: [{ productId: 'p1', quantity: 1 }],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
