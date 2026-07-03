import { IsArray, IsInt, IsUUID, Max, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
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

export class UpdateCartItemDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(0)
  @Max(99)
  quantity!: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  modifierIds?: string[];
}
