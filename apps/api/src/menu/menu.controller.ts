import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller()
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get('categories')
  getCategories() {
    return this.menuService.getCategories();
  }

  @Get('products')
  getProducts(
    @Query('category') category?: string,
    @Query('dietary') dietary?: string,
    @Query('q') search?: string,
  ) {
    return this.menuService.getProducts({ category, dietary, search });
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.menuService.getProductBySlug(slug);
  }
}
