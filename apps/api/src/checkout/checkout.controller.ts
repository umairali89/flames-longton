import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { CheckoutQuoteDto, CreateOrderDto } from './dto';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post('quote')
  quote(@Body() dto: CheckoutQuoteDto) {
    return this.checkoutService.quote(dto.orderType, dto.items, dto.postcode);
  }

  @Post('orders')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-Guest-Session', required: false })
  createOrder(
    @Request() req: { user?: { sub: string } },
    @Headers('x-guest-session') guestSession: string | undefined,
    @Body() dto: CreateOrderDto,
  ) {
    return this.checkoutService.createOrder(
      {
        orderType: dto.orderType,
        paymentMethod: dto.paymentMethod,
        guestEmail: dto.guestEmail,
        allergenAcknowledged: dto.allergenAcknowledged,
        deliveryAddress: dto.deliveryAddress,
        items: dto.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          modifierIds: i.modifierIds,
        })),
      },
      req.user?.sub,
      guestSession,
    );
  }
}

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private checkoutService: CheckoutService) {}

  @Post('stripe')
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) throw new Error('Raw body required');
    return this.checkoutService.handleStripeWebhook(rawBody, signature);
  }
}
