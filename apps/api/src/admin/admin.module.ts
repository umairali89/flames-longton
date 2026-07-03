import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { CheckoutModule } from '../checkout/checkout.module';

@Module({
  imports: [AuthModule, CheckoutModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
