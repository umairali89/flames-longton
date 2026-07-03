import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
  Equals,
} from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  @Max(99)
  quantity!: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  modifierIds?: string[];
}

class DeliveryAddressDto {
  @IsString()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city!: string;

  @IsString()
  postcode!: string;
}

export class CheckoutQuoteDto {
  @IsEnum(['delivery', 'collection'])
  orderType!: 'delivery' | 'collection';

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];
}

export class CreateOrderDto {
  @IsEnum(['delivery', 'collection'])
  orderType!: 'delivery' | 'collection';

  @IsEnum(['card', 'cash'])
  paymentMethod!: 'card' | 'cash';

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @Equals(true, { message: 'Allergen acknowledgment is required' })
  allergenAcknowledged!: true;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress?: DeliveryAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];
}
