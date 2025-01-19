import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from '../database/database.service';
import { Product } from './entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const container = this.databaseService.getContainer();
    const product: Product = {
      ...createProductDto,
      id: uuidv4(), // Generate unique ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { resource } = await container.items.create(product);
    return resource;
  }

  // Get all products
  async findAll(): Promise<Product[]> {
    const container = this.databaseService.getContainer();
    const query = 'SELECT * FROM c';
    const { resources } = await container.items.query(query).fetchAll();
    return resources;
  }

  // Get single product by ID
  async findOne(id: string): Promise<Product> {
    const container = this.databaseService.getContainer();
    const { resource } = await container.item(id, id).read();
    if (!resource) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return resource;
  }

  // Update a product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const container = this.databaseService.getContainer();

    const existingProduct = await this.findOne(id);

    const updatedProduct: Product = {
      ...existingProduct,
      ...updateProductDto,
      updatedAt: new Date(),
    };

    const { resource } = await container.item(id, id).replace(updatedProduct);
    return resource;
  }

  // Delete a product
  async remove(id: string): Promise<void> {
    const container = this.databaseService.getContainer();

    const resource = await this.findOne(id);

    if (resource) {
      await container.item(id, id).delete();
    }
  }
}
