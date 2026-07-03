import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CheckoutModule } from '../checkout/checkout.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, CheckoutModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
