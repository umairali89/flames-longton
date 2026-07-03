import { BadRequestException, Injectable } from '@nestjs/common';
import type { DeliveryZone } from '@flames/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryZoneService {
  constructor(private prisma: PrismaService) {}

  normalizePostcode(postcode: string): string {
    return postcode.toUpperCase().replace(/\s+/g, ' ').trim();
  }

  getOutwardCode(postcode: string): string {
    const normalized = this.normalizePostcode(postcode);
    const parts = normalized.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].charAt(0)}`;
    }
    return normalized.slice(0, 4);
  }

  async findZone(postcode: string): Promise<DeliveryZone> {
    const outward = this.getOutwardCode(postcode);
    const zones = await this.prisma.deliveryZone.findMany({ where: { isActive: true } });

    for (const zone of zones) {
      const prefixes = zone.postcodePrefixes as string[];
      if (prefixes.some((p) => outward.startsWith(p.toUpperCase()))) {
        return zone;
      }
    }

    throw new BadRequestException(
      `Sorry, we do not currently deliver to ${postcode}. Please try collection instead.`,
    );
  }
}
