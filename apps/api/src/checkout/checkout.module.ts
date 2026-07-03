import { Module } from '@nestjs/common';
import { CheckoutController, WebhooksController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { DeliveryZoneService } from './delivery-zone.service';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CartModule, AuthModule],
  controllers: [CheckoutController, WebhooksController],
  providers: [CheckoutService, DeliveryZoneService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
