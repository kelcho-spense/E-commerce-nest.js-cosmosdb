import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse, RestError } from '@azure/cosmos';
import { CosmosErrorCode } from './cosmosErrorCode';

@Catch(ErrorResponse, RestError)
export class CosmosExceptionFilter implements ExceptionFilter {
  catch(exception: ErrorResponse | RestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    if (exception instanceof ErrorResponse) {
      switch (exception.code) {
        case CosmosErrorCode.NOT_FOUND:
          status = HttpStatus.NOT_FOUND;
          message = 'Resource not found';
          break;
        case CosmosErrorCode.CONFLICT:
          status = HttpStatus.CONFLICT;
          message = 'Resource already exists';
          break;
        case CosmosErrorCode.UNAUTHORIZED:
          status = HttpStatus.UNAUTHORIZED;
          message = 'Unauthorized access';
          break;
        case CosmosErrorCode.FORBIDDEN:
          status = HttpStatus.FORBIDDEN;
          message = 'Access forbidden';
          break;
        case CosmosErrorCode.TIMEOUT:
          status = HttpStatus.REQUEST_TIMEOUT;
          message = 'Operation timed out';
          break;
        case CosmosErrorCode.TOO_MANY_REQUESTS:
          status = HttpStatus.TOO_MANY_REQUESTS;
          message = 'Rate limit exceeded';
          break;
      }
    }

    if (exception instanceof RestError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database service is unavailable';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        code: exception instanceof ErrorResponse ? exception.code : 503,
        name: exception.name,
        details: exception.message,
      },
    });
  }
}
