import { CosmosDateTime, CosmosPartitionKey,CosmosUniqueKey,InjectModel } from '@nestjs/azure-database';
import { PartitionKeyDefinitionVersion, PartitionKeyKind } from '@azure/cosmos';

@CosmosPartitionKey('sku')
@CosmosUniqueKey('sku')
@InjectModel('products')

export class Product {

    id?: string;
    name: string;
    brand: string;
    sku: string;
    category: string;
    price: number;
    currency: string;
    stock: number;
    description: string;
    features: string;
    rating: number;
    reviewsCount: number;
    tags: string[];
    imageUrl: string;
    manufacturer: string;
    model: string;
    releaseDate: string;
    warranty: string;
    dimensions?: {
        weight: string;
        width: string;
        height: string;
        depth: string;
    };
    color: string;
    material: string;
    origin: string;
    descriptionVector?: number[];
    imageVector?: number[];
    tagsVector?: number[];
    featuresVector?: number[];
    dimensionsVector?: number[];
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt: Date;
}
