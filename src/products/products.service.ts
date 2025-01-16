import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/azure-database';
import type { Container } from '@azure/cosmos';
import { Product } from './entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productContainer: Container,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const item = {
      ...createProductDto,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { resource } =
      await this.productContainer.items.create<Product>(item);
    return resource;
  }

  async findAll(): Promise<Product[]> {
    const querySpec = { query: 'SELECT * FROM c' };
    const { resources } = await this.productContainer.items
      .query<Product>(querySpec)
      .fetchAll();
    return resources;
  }

  async findOne(id: string): Promise<Product> {
    const { resource } = await this.productContainer.item(id, id).read();
    return resource;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    let { resource: existingProduct } = await this.productContainer
      .item(id, id)
      .read<Product>();

    existingProduct = {
      ...existingProduct,
      ...updateProductDto,
      updatedAt: new Date(),
    };

    const { resource: updatedProduct } = await this.productContainer
      .item(id, id)
      .replace<Product>(existingProduct);

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    await this.productContainer.item(id, id).delete<Product>();
  }
}
