import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CosmosClient, Database, Container } from '@azure/cosmos';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly client: CosmosClient;
  private database: Database;
  private container: Container;

  constructor(private configService: ConfigService) {
    this.client = new CosmosClient({
      endpoint: this.configService.get<string>('AZURE_COSMOS_DB_ENDPOINT'),
      key: this.configService.get<string>('AZURE_COSMOS_DB_KEY'),
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
      partitionKey: '/id',
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
