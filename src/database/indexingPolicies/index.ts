import { IndexingPolicy, VectorIndexType } from '@azure/cosmos';
// Define the indexing policy for the products container
export const productIndexingPolicy: IndexingPolicy = {
  // Define the paths to be included in the index
  includedPaths: [
    {
      path: '/*',
    },
  ],
  // Keep vectors excluded from regular indexing paths for better performance and to ensure optimized performance for insertion.
  excludedPaths: [
    { path: '/descriptionVector/*' },
    { path: '/tagsVector/*' },
    { path: '/featuresVector/*' },
    { path: '/reviewsCountVector/*' },
  ],
  // Define the vector indexes for the vectors
  vectorIndexes: [
    { path: '/descriptionVector', type: VectorIndexType.DiskANN }, // Keep DiskANN for primary vector
    { path: '/tagsVector', type: VectorIndexType.QuantizedFlat }, // Use QuantizedFlat for secondary vectors
    { path: '/featuresVector', type: VectorIndexType.QuantizedFlat },
    { path: '/reviewsCountVector', type: VectorIndexType.QuantizedFlat },
  ],
};
