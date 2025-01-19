import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '@azure/cosmos';

@Catch(ErrorResponse)
export class CosmosExceptionFilter implements ExceptionFilter {
  catch(exception: ErrorResponse, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    if (exception.code === 404) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
    } else if (exception.code === 409) {
      status = HttpStatus.CONFLICT;
      message = 'Resource already exists';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
