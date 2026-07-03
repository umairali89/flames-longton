import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@ApiTags('cart')
@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  private getSession(
    req: { user?: { sub: string } },
    guestSession?: string,
  ) {
    return {
      userId: req.user?.sub,
      guestSessionId: guestSession,
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-Guest-Session', required: false })
  getCart(
    @Request() req: { user?: { sub: string } },
    @Headers('x-guest-session') guestSession?: string,
  ) {
    const { userId, guestSessionId } = this.getSession(req, guestSession);
    if (!userId && !guestSessionId) {
      return { items: [], subtotalPence: 0, displaySubtotal: '£0.00' };
    }
    return this.cartService.getCart(userId, guestSessionId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-Guest-Session', required: false })
  addItem(
    @Request() req: { user?: { sub: string } },
    @Headers('x-guest-session') guestSession: string | undefined,
    @Body() dto: AddToCartDto,
  ) {
    const { userId, guestSessionId } = this.getSession(req, guestSession);
    if (!userId && !guestSessionId) {
      throw new Error('Guest session or auth required');
    }
    return this.cartService.addItem(
      { ...dto, modifierIds: dto.modifierIds ?? [] },
      userId,
      guestSessionId,
    );
  }

  @Patch()
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-Guest-Session', required: false })
  updateItem(
    @Request() req: { user?: { sub: string } },
    @Headers('x-guest-session') guestSession: string | undefined,
    @Body() dto: UpdateCartItemDto,
  ) {
    const { userId, guestSessionId } = this.getSession(req, guestSession);
    return this.cartService.updateItem(
      dto.productId,
      dto.modifierIds ?? [],
      dto.quantity,
      userId,
      guestSessionId,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-Guest-Session', required: false })
  clearCart(
    @Request() req: { user?: { sub: string } },
    @Headers('x-guest-session') guestSession?: string,
  ) {
    const { userId, guestSessionId } = this.getSession(req, guestSession);
    return this.cartService.clearCart(userId, guestSessionId);
  }
}
