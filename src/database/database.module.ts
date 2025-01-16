import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    AzureCosmosDbModule.forRoot({
      dbName: process.env.AZURE_COSMOS_DB_NAME,
      endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
      key: process.env.AZURE_COSMOS_DB_KEY,
      retryAttempts: 3,
    }),
    AzureCosmosDbModule.forFeature(Product, {
      
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
