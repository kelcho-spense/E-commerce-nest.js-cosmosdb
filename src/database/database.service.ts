import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CosmosClient, Database, Container } from '@azure/cosmos';
import { handleCosmosError } from './cosmos-error.handler';

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
    try {
      await this.initDatabase();
    } catch (error) {
      handleCosmosError(error);
    }
  }

  private async initDatabase() {
    try {
      const dbName = this.configService.get<string>('AZURE_COSMOS_DB_NAME');
      const { database } = await this.client.databases.createIfNotExists({
        id: dbName,
      });
      this.database = database;

      const { container } = await this.database.containers.createIfNotExists({
        id: 'products',
        partitionKey: '/id',
      });
      this.container = container;
    } catch (error) {
      handleCosmosError(error);
    }
  }

  getContainer(): Container {
    if (!this.container) {
      throw new Error('Database container not initialized');
    }
    return this.container;
  }
}
