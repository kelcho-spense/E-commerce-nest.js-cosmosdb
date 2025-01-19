import { ErrorResponse } from '@azure/cosmos';

export const handleCosmosError = (error: any): never => {
  // Let the exception filter handle Cosmos errors
  if (error instanceof ErrorResponse) {
    throw error;
  }

  // Re-throw unknown errors
  throw error;
};
