import { Injectable } from '@nestjs/common';
import { Product } from './products/entities/product.entity';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './database/database.service';
import { generateTextVector } from './utils/embedding';
import { faker } from '@faker-js/faker';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async generateFakeProducts(productNumber: number = 20): Promise<string> {
    const products: Product[] = [];

    for (let i = 0; i < productNumber; i++) {
      const product: Product = {
        id: uuidv4(),
        name: faker.commerce.productName(),
        brand: faker.company.name(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        category: faker.commerce.department(),
        price: parseFloat(faker.commerce.price()),
        currency: 'USD',
        stock: faker.number.int({ min: 0, max: 1000 }),
        description: faker.commerce.productDescription(),
        features: faker.lorem.paragraphs(2),
        rating: faker.number.int({ min: 1, max: 5 }),
        reviewsCount: faker.number.int({ min: 0, max: 5000 }),
        tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
          faker.commerce.productAdjective(),
        ),
        imageUrl: faker.image.url(),
        manufacturer: faker.company.name(),
        model: faker.string.alphanumeric(6).toUpperCase(),
        releaseDate: faker.date.past().toISOString(),
        warranty: `${faker.number.int({ min: 1, max: 5 })} years`,
        color: faker.color.human(),
        material: faker.commerce.productMaterial(),
        origin: faker.location.country(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Generate vectors for vector search
      product.descriptionVector = await generateTextVector(product.description);
      product.featuresVector = await generateTextVector(product.features);
      product.tagsVector = await generateTextVector(product.tags.join(' '));
      product.reviewsCountVector = await generateTextVector(
        product.reviewsCount.toString(),
      );

      products.push(product);
    }

    // Insert products into Cosmos DB
    const container = this.databaseService.getContainer();
    await Promise.all(
      products.map((product) => container.items.create(product)),
    );

    return `Successfully generated and inserted ${products.length} products`;
  }
}
