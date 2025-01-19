import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  // searchProductsByDescription  url= http://localhost:3000/products/search/description?description='white'?top=10
  @Get('search/description')
  searchProductsByDescriptionVector(
    @Query('description') description: string,
    @Query('top', ParseIntPipe) top: number = 10,
  ) {
    return this.productsService.searchProductsByDescriptionVector(
      description,
      top,
    );
  }

  // searchProductsByFeatures url= http://localhost:3000/products/search/features?features='white'?top=10
  @Get('search/features')
  searchProductsByFeaturesVector(
    @Query('features') features: string,
    @Query('top', ParseIntPipe) top: number = 10,
  ) {
    return this.productsService.searchProductsByFeaturesVector(features, top);
  }

  //searchProductsByFeatures url= http://localhost:3000/products/search/tags?tags='white'?top=10
  @Get('search/tags')
  searchProductsByTagsVector(
    @Query('tags') tags: string,
    @Query('top', ParseIntPipe) top: number = 10,
  ) {
    return this.productsService.searchProductsByTagsVector(tags, top);
  }

  //searchProductsByReviewsCount url= http://localhost:3000/products/search/review-counts?reviewsCount=10?top=10
  @Get('search/review-counts')
  searchProductsByReviewsCountVector(
    @Query('reviewsCount') reviewsCount: number,
    @Query('top', ParseIntPipe) top: number = 10,
  ) {
    return this.productsService.searchProductsByReviewsCountVector(
      reviewsCount,
      top,
    );
  }
}
