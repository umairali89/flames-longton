import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  getMyOrders(@Request() req: { user?: { sub: string } }) {
    if (!req.user?.sub) return [];
    return this.ordersService.getOrdersForUser(req.user.sub);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  getOrder(
    @Param('id') id: string,
    @Request() req: { user?: { sub: string } },
  ) {
    return this.ordersService.getOrder(id, req.user?.sub);
  }
}
