import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from '../database/database.service';
import { Product } from './entities/product.entity';
import { v4 as uuidv4 } from 'uuid';
import { generateTextVector } from '../utils/embedding';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const container = this.databaseService.getContainer();

    // Generate vectors concurrently
    const vectorPromises = {
      descriptionVector: createProductDto.description
        ? generateTextVector(createProductDto.description)
        : null,
      tagsVector: createProductDto.tags
        ? generateTextVector(createProductDto.tags.join(' '))
        : null,
      featuresVector: createProductDto.features
        ? generateTextVector(createProductDto.features)
        : null,
      reviewsCountVector: createProductDto.reviewsCount
        ? generateTextVector(createProductDto.reviewsCount.toString())
        : null,
    };

    // Wait for all vectors to be generated
    const vectors = await Promise.all(Object.values(vectorPromises));
    console.log(vectors);

    const product: Product = {
      id: uuidv4(),
      ...createProductDto,
      ...Object.fromEntries(
        Object.entries(vectorPromises)
          .filter(([, promise]) => promise !== null)
          .map(([key], index) => [key, vectors[index]]),
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { resource } = await container.items.create(product);
    return resource;
  }

  // Get all products
  async findAll(): Promise<Product[]> {
    const container = this.databaseService.getContainer();
    const query =
      'SELECT c.id, c.name, c.brand, c.sku, c.category, c.price, c.currency, c.stock, c.description, c.features, c.rating, c.reviewsCount, c.tags, c.imageUrl, c.manufacturer, c.model, c.releaseDate, c.warranty, c.color, c.material, c.origin, c.createdAt, c.updatedAt  FROM c';
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

  // searchProductsByDescriptionVector
  async searchProductsByDescriptionVector(params: {
    description: string;
    top?: number;
  }): Promise<Product[]> {
    const { description, top = 10 } = params;
    const descriptionVector = await generateTextVector(description);

    const container = this.databaseService.getContainer();
    if (descriptionVector === null) {
      throw new Error('Failed to generate description vector');
    }
    const querySpec = {
      query: `
        SELECT TOP @top
          c.id,
          c.name,
          c.brand,
          c.sku,
          c.category,
          c.price,
          c.currency,
          c.stock,
          c.description,
          c.features,
          c.rating,
          c.reviewsCount,
          c.tags,
          c.imageUrl,
          c.manufacturer,
          c.model,
          c.releaseDate,
          c.warranty,
          c.color,
          c.material,
          c.origin,
          c.createdAt,
          c.updatedAt,
          VectorDistance( c.descriptionVector, @descriptionVector) AS SimilarityScore
        FROM c
        ORDER BY VectorDistance(c.descriptionVector, @descriptionVector)`,
      parameters: [
        { name: '@descriptionVector', value: descriptionVector },
        { name: '@top', value: top },
      ],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  // searchProductsByFeaturesVector
  async searchProductsByFeaturesVector(params: {
    features: string;
    top: number;
  }): Promise<Product[]> {
    const { features, top = 10 } = params;

    const featuresVector = await generateTextVector(features);
    const container = this.databaseService.getContainer();
    const querySpec = {
      query: `
      SELECT TOP @top
        c.id,
        c.name,
        c.brand,
        c.sku,
        c.category,
        c.price,
        c.currency,
        c.stock,
        c.description,
        c.features,
        c.rating,
        c.reviewsCount,
        c.tags,
        c.imageUrl,
        c.manufacturer,
        c.model,
        c.releaseDate,
        c.warranty,
        c.color,
        c.material,
        c.origin,
        c.createdAt,
        c.updatedAt,
      VectorDistance( c.featuresVector, @featuresVector ) AS SimilarityScore  
      FROM c 
      ORDER BY VectorDistance(c.featuresVector, @featuresVector)`,
      parameters: [
        { name: '@featuresVector', value: featuresVector },
        { name: '@top', value: top },
      ],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  // searchProductsByTagsVector
  async searchProductsByTagsVector(params: {
    tags: string;
    top: number;
  }): Promise<Product[]> {
    const { tags, top = 10 } = params;
    const tagsVector = await generateTextVector(tags);
    const container = this.databaseService.getContainer();
    const querySpec = {
      query: `
      SELECT TOP @top
        c.id,
        c.name,
        c.brand,
        c.sku,
        c.category,
        c.price,
        c.currency,
        c.stock,
        c.description,
        c.features,
        c.rating,
        c.reviewsCount,
        c.tags,
        c.imageUrl,
        c.manufacturer,
        c.model,
        c.releaseDate,
        c.warranty,
        c.color,
        c.material,
        c.origin,
        c.createdAt,
        c.updatedAt,
      VectorDistance( c.tagsVector, @tagsVector ) AS SimilarityScore  
      FROM c 
      ORDER BY VectorDistance(c.tagsVector, @tagsVector)`,
      parameters: [
        { name: '@tagsVector', value: tagsVector },
        { name: '@top', value: top },
      ],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  // searchProductsByReviewsCountVector
  async searchProductsByReviewsCountVector(params: {
    reviewsCount: number;
    top: number;
  }): Promise<Product[]> {
    const { reviewsCount, top = 10 } = params;
    const reviewsCountVector = await generateTextVector(reviewsCount);
    const container = this.databaseService.getContainer();
    const querySpec = {
      query: `
      SELECT TOP @top
        c.id,
        c.name,
        c.brand,
        c.sku,
        c.category,
        c.price,
        c.currency,
        c.stock,
        c.description,
        c.features,
        c.rating,
        c.reviewsCount, 
        c.tags,
        c.imageUrl,
        c.manufacturer,
        c.model,
        c.releaseDate,
        c.warranty,
        c.color,
        c.material,
        c.origin,
        c.createdAt,
        c.updatedAt,
      VectorDistance( c.reviewsCountVector, @reviewsCountVector ) AS SimilarityScore  
      FROM c
      ORDER BY VectorDistance(c.reviewsCountVector, @reviewsCountVector)`,
      parameters: [
        { name: '@reviewsCountVector', value: reviewsCountVector },
        { name: '@top', value: top },
      ],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }
}
