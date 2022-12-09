import { Controller, Get, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { getAppURL } from '../config/configuration';

@ApiTags('status')
@Controller('api/status')
export class StatusController {
  @Get()
  index(): any {
    return 'ok';
  }

  @Get('/request')
  request(@Req() req: RawBodyRequest<Request>): any {
    return {
      publicURL: getAppURL(),
      protocol: req.protocol,
      headers: req.headers,
      baseUrl: req.baseUrl,
      originalUrl: req.originalUrl,
      signedCookies: req.signedCookies,
    };
  }
}
