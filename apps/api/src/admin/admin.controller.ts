import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderStatus } from '@flames/database';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRolesGuard } from '../auth/roles.guard';
import { IsBoolean, IsEnum } from 'class-validator';

class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}

class ToggleAvailabilityDto {
  @IsBoolean()
  isAvailable!: boolean;
}

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminRolesGuard())
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('orders')
  getOrders(@Query('status') status?: OrderStatus) {
    return this.adminService.getOrders(status);
  }

  @Patch('orders/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.adminService.updateOrderStatus(id, dto.status);
  }

  @Get('products')
  getProducts() {
    return this.adminService.getProducts();
  }

  @Patch('products/:id/availability')
  toggleAvailability(@Param('id') id: string, @Body() dto: ToggleAvailabilityDto) {
    return this.adminService.toggleProductAvailability(id, dto.isAvailable);
  }
}
