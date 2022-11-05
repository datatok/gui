import { NoSuchBucket } from '@aws-sdk/client-s3';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  formatMessage({ statusCode, reason, trace, path }) {
    return {
      statusCode,
      timestamp: new Date().toISOString(),
      reason,
      trace,
      path,
    };
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    let responseBody;

    console.error(exception);

    if (exception instanceof NoSuchBucket) {
      responseBody = this.formatMessage({
        statusCode: 500,
        reason: `bucket not found`,
        trace: exception instanceof Error ? exception.stack : '',
        path,
      });
    } else {
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      responseBody = this.formatMessage({
        statusCode: httpStatus,
        reason: exception instanceof Error ? exception.message : '',
        trace: exception instanceof Error ? exception.stack : '',
        path,
      });
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
