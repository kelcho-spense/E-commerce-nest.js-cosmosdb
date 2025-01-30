import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CosmosClient,
  Database,
  Container,
  PartitionKeyDefinitionVersion,
  PartitionKeyKind,
  CosmosDbDiagnosticLevel,
} from '@azure/cosmos';

import { productVectorEmbeddingPolicy } from './vectorEmbeddingPolicies';
import { productIndexingPolicy } from './indexingPolicies';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly client: CosmosClient;
  private database: Database;
  private container: Container;

  constructor(private configService: ConfigService) {
    this.client = new CosmosClient({
      endpoint: this.configService.get<string>('AZURE_COSMOS_DB_ENDPOINT'),
      key: this.configService.get<string>('AZURE_COSMOS_DB_KEY'),
      diagnosticLevel:
        this.configService.get<string>('NODE_ENV') != 'production'
          ? CosmosDbDiagnosticLevel.debug
          : CosmosDbDiagnosticLevel.info,
    });
  }

  async onModuleInit() {
    await this.initDatabase();
  }

  private async initDatabase() {
    // Create database if it doesn't exist
    const dbName = this.configService.get<string>('AZURE_COSMOS_DB_NAME');
    const { database } = await this.client.databases.createIfNotExists({
      id: dbName,
    });
    this.database = database;
    // Create containers if it doesn't exist
    const { container } = await this.database.containers.createIfNotExists({
      id: 'products',
      partitionKey: {
        paths: ['/id'],
        version: PartitionKeyDefinitionVersion.V2,
        kind: PartitionKeyKind.Hash,
      },
      // Use DiskANN index type since it's best for large datasets (>50k vectors)
      // Keep vectors excluded from regular indexing paths for better performance
      // Use Cosine similarity for text-based vectors and Euclidean for numerical vectors
      //  as it works best for semantic similarity
      // Maintain 1536 dimensions since you're likely using OpenAI's embeddings
      vectorEmbeddingPolicy: productVectorEmbeddingPolicy, // Use DiskANN index type since it's best for large datasets (>50k vectors)
      indexingPolicy: productIndexingPolicy, // Keep vectors excluded from regular indexing paths for better performance
    });
    this.container = container;
  }

  getContainer(): Container {
    if (!this.container) {
      throw new Error('Database container not initialized');
    }
    return this.container;
  }
}
