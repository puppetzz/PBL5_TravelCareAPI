import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('categories')
@ApiTags('Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }
}
