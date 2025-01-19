import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
