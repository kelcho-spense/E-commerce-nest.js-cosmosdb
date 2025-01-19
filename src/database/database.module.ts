import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
})
export class DatabaseModule {}
