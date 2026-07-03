import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MenuModule } from '../menu/menu.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MenuModule, AuthModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
