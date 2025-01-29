# Vector Search
## E-Commerce API (product search) with Vector Search using Azure Cosmos DB & Nest.js
This project demonstrates building an e-commerce API using Nest.js integrated with Azure Cosmos DB's vector search capabilities. It showcases how to implement semantic product search using vector similarity.

## Vector Search Features
- **Product Search**: Utilize vector similarity to find products based on semantic meaning
- **Vector Distance Queries**: Implement queries using VectorDistance() system function
- **Vector Indexing**: Leverage Azure Cosmos DB's vector indexing policies for efficient searches

## Vector Search Implementation

### Container Vector Policies
Required configuration includes:
- Path: Property containing the vector
- Datatype: Vector property type (default: Float32)
- Dimensions: Vector length (default: 1536)
- Distance Functions: cosine, dot product, or euclidean

### Setup Requirements
1. Enable vector search in Azure Cosmos DB
2. Configure vector indexing policies
3. Implement vector embeddings using Azure OpenAI or Hugging Face

## Project Setup

```bash
$ pnpm install
```

## dotenv Configuration

Create a `.env` file in the root directory and add the following configuration:

```bash
# Azure Cosmos DB Configuration
# API PORT
PORT=8000
# COSMOS DB
AZURE_COSMOS_DB_ENDPOINT=<Azure Cosmos DB Endpoint>
AZURE_COSMOS_DB_KEY=<Azure Cosmos DB Key>
AZURE_COSMOS_DB_NAME=vector-search-db

# AZURE OPENAI
AZURE_OPENAI_API_KEY=<Azure OpenAI API Key>
AZURE_OPENAI_TEXT_EMBEDDING_MODEL_ENDPOINT=<Azure OpenAI Text Embedding Model Endpoint>
```

## Running the Application

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Testing

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
